import React, { useState, useMemo } from 'react'
import './add-to-project-form.scss'

import { Folders } from '../../folders/folders'
import { Project } from '../../../pages/management/management'

export default ({
  folders,
  projects,
  action
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState()
  const [selectedProjectIds, setSelectedProjectIds]: [any, any] = useState([])

  const filteredProjects = useMemo(() => projects.filter(p => p.folder === selectedFolderId), [selectedFolderId])

  const handleAddProjectId = _id => {
    if (selectedProjectIds.includes(_id)) {
      setSelectedProjectIds(selectedProjectIds.filter(p => p !== _id))
    } else {
      setSelectedProjectIds([...selectedProjectIds, _id])
    }
  }

  return (
    <div className="add-to-project-form">
      <Folders
        initialSelectedFolder={""}
        onChange={folder => setSelectedFolderId(folder)}
        folders={folders}
        setEditingFolder={() => { }}
        editingFolder={""} />
      <ul>
        {
          filteredProjects.length === 0 &&
          <li>
            <b>No Projects in Folder</b>
          </li>
        }
        {
          filteredProjects.map((p: any) => (
            <Project
              {...p}
              inSelection={selectedProjectIds.includes(p._id)}
              addToSelection={handleAddProjectId}
              selected={false}
              selectProject={() => { }} />
          ))
        }
      </ul>
      <ul>
        <li>
          <b>
            {`${selectedProjectIds.length} Selected Project${selectedProjectIds.length === 1 ? "" : "s"}:`}
          </b>
        </li>
        {
          selectedProjectIds.map((i: any) => {
            const p = projects.find(p => p._id === i)
            return (
              <Project
                {...p}
                inSelection={selectedProjectIds.includes(p._id)}
                addToSelection={handleAddProjectId}
                selected={false}
                selectProject={() => { }} />
            )
          })
        }
      </ul>
      <a
        onClick={() => action}
        className="button">
        Submit
      </a>
    </div>
  )
}