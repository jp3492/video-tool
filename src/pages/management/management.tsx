import React, { useCallback, useState, useMemo, useEffect } from 'react'
import './management.scss'

import { getRequestStatus } from '../../auth-package'
import { quantumState, quantumReducer } from '@piloteers/react-state'
import { REDUCERS } from '../../state/stores'

import { Link } from '@reach/router'

import { MODAL, MODAL_TYPES } from '../../components/modal/modal'
import { Folders } from '../../components/folders/folders'
import { Tabs } from '../../components/tabs/tabs'

import { requests } from '../../state/requests'
import ReactPlayer from 'react-player'

const {
  folders: folderRequests,
  projects: projectRequests
} = requests

const tabs = [
  {
    label: "Details",
    icon: ""
  },
  {
    label: "Access",
    icon: ""
  }
]

export const Management = (props: any) => {
  const { state: { data: folders }, actions: { ACTION: FOLDER_ACTION } } = quantumReducer({ id: REDUCERS.FOLDERS })
  const { state: { data: projects }, actions: { ACTION: PROJECT_ACTION } } = quantumReducer({ id: REDUCERS.PROJECTS })

  const { statuses, isLoading } = getRequestStatus({ requests: {} })

  const [_, openModal] = quantumState({ id: MODAL, returnValue: false })
  const [sideBarOpen, openSideBar] = useState(false)
  const [search, setSearch] = useState("")

  const [selectedProjectId, setSelectedProjectId] = useState()
  const [selectedProjectIds, setSelectedProjectIds]: [any, any] = useState([])

  const [selectedFolderId, setSelectedFolderId] = useState()
  const [editingFolder, setEditingFolder] = useState()

  const postFolder = body => FOLDER_ACTION({ ...folderRequests.post, body }).then(() => openModal({}))
  const postProject = body => PROJECT_ACTION({ ...projectRequests.post, body }).then(() => openModal({}))

  const patchFolder = (_id, body) => FOLDER_ACTION({ ...folderRequests.patch, url: folderRequests.patch.url + _id, body }).then(() => openModal({}))
  const patchProject = (_id, body) => PROJECT_ACTION({ ...projectRequests.patch, url: projectRequests.patch.url + _id, body }).then(() => openModal({}))

  // const deleteFolder = _id => FOLDER_ACTION({ ...folderRequests.delete, url: folderRequests.patch.url + _id }).then(() => openModal({}))
  // const deleteProject = _id => FOLDER_ACTION({ ...projectRequests.delete, url: projectRequests.patch.url + _id }).then(() => openModal({}))

  const folderModal = useCallback((initialValues?: any) => openModal({
    title: initialValues ? "Edit Folder" : "New Folder",
    name: MODAL_TYPES.FOLDER_FORM,
    props: {
      folders,
      selectedFolderId,
      action: initialValues ? patchFolder : postFolder,
      initialValues
    }
  }), [folders, selectedFolderId])

  const projectModal = useCallback((initialValues?: any) => openModal({
    title: initialValues ? "Edit Project" : "New Project",
    name: MODAL_TYPES.PROJECT_FORM,
    props: {
      folders,
      selectedFolderId,
      action: initialValues && initialValues.hasOwnProperty("_id") ? (body, _id) => patchProject(_id, { ...initialValues, ...body }) : postProject,
      initialValues
    }
  }), [folders, selectedFolderId])

  const handleEditingFolder = folder => {
    if (editingFolder === folder) {
      setEditingFolder(undefined)
    } else {
      setEditingFolder(folder)
    }
  }

  const handleAddProjectId = _id => {
    if (selectedProjectIds.includes(_id)) {
      setSelectedProjectIds(selectedProjectIds.filter(p => p !== _id))
    } else {
      setSelectedProjectIds([...selectedProjectIds, _id])
    }
  }

  const selectedFolder = useMemo(() => folders.find(f => f._id === selectedFolderId), [selectedFolderId, folders])

  const selectProject = useCallback(_id => setSelectedProjectId(_id), [])
  const selectedProject = useMemo(() => projects.find(p => p._id === selectedProjectId) || {}, [selectedProjectId, projects])
  const filteredProjects = useMemo(() => projects.filter(p => p.folder === selectedFolderId), [selectedFolderId, projects])

  const handleUrlDrop = useCallback((e, target) => {
    e.stopPropagation()
    e.preventDefault()
    switch (e.type) {
      case "dragover":
      case "dragenter":
        e.returnValue = false;
        break;
      case "drop":
        const link = e.dataTransfer.getData("URL")
        if (ReactPlayer.canPlay(link)) {
          if (target.type === "project") {
            const thisProject = projects.find(p => p._id === target.id)
            if (thisProject.links.every(l => l.url !== link)) {
              const label = prompt("Please assign a label for inserted link")
              patchProject(target.id, { ...thisProject, links: [...thisProject.links, { url: link, label }] })
            } else {
              const thisLink = thisProject.links.find(l => l.url === link)
              alert(`Link already exists: ${thisLink.label}`)
            }
          } else {
            projectModal({ links: [{ url: link }] })
          }
        } else {
          alert("Provided link doesnt contain a compatible video source")
        }
        // setShowDropCover(false)
        e.returnValue = false;
        break
    }
  }, [projects, projectModal])

  return (
    <div className="management">
      <div
        data-sidebar-open={sideBarOpen}
        className="management__sidebar">
        <i
          onClick={() => openSideBar(!sideBarOpen)}
          className="material-icons">
          chevron_right
        </i>
        <a
          onClick={e => folderModal()}
          className="button">
          <i
            className="material-icons">
            add
          </i>
          <label>
            New Folder
          </label>
        </a>
        <Folders
          onChange={folder => setSelectedFolderId(folder)}
          setEditingFolder={handleEditingFolder}
          editingFolder={editingFolder}
          folders={folders} />
      </div>
      <div className="management__content">
        <div className="management__content__files">
          <div className="management__content__files-header">
            <input
              type="text"
              value={search}
              onChange={({ target: { value } }) => setSearch(value)} />
            <a
              onClick={() => projectModal()}
              className="button">
              <i
                className="material-icons">
                add
              </i>
              <label>
                New Project
              </label>
            </a>
          </div>
          <ul
            onDragEnter={e => handleUrlDrop(e, { type: "folder", id: selectedFolderId })}
            onDragOver={e => handleUrlDrop(e, { type: "folder", id: selectedFolderId })}
            onDrop={e => handleUrlDrop(e, { type: "folder", id: selectedFolderId })}
            className="management__content__content">
            {
              filteredProjects.map((p, i) => (
                <Project
                  key={i}
                  {...p}
                  onDragEnter={e => handleUrlDrop(e, { type: "project", id: p._id })}
                  onDragOver={e => handleUrlDrop(e, { type: "project", id: p._id })}
                  onDrop={e => handleUrlDrop(e, { type: "project", id: p._id })}
                  inSelection={selectedProjectIds.includes(p._id)}
                  addToSelection={handleAddProjectId}
                  selected={p._id === selectedProjectId}
                  selectProject={selectProject} />
              ))
            }
          </ul>
          <div>

            <div className="management__content__selection-header">
              <h4>
                {`${selectedProjectIds.length} Selected Project${selectedProjectIds.length === 1 ? "" : "s"}`}
              </h4>
              {
                selectedProjectIds.length !== 0 &&
                <>
                  <i
                    onClick={() => setSelectedProjectIds([])}
                    className="material-icons">
                    clear
                  </i>
                  <div>
                    <i className="material-icons">
                      save
                    </i>
                    <label>
                      Save as
                    </label>
                  </div>
                  <Link to={`/player?ids=${JSON.stringify(selectedProjectIds)}`}>
                    <i className="material-icons">
                      play_arrow
                    </i>
                    <label>
                      Open in Player
                    </label>
                  </Link>
                  <div>
                    <i className="material-icons">
                      delete
                    </i>
                    <label>
                      Delete All
                    </label>
                  </div>
                </>
              }
            </div>
            <ul
              data-no-items={selectedProjectIds.length === 0}
              className="management__content__selection">
              {
                selectedProjectIds.map(id => {
                  const thisProject = projects.find(p => p._id === id)
                  return (
                    <Project
                      {...thisProject}
                      onDragEnter={e => handleUrlDrop(e, { type: "project", id: thisProject._id })}
                      onDragOver={e => handleUrlDrop(e, { type: "project", id: thisProject._id })}
                      onDrop={e => handleUrlDrop(e, { type: "project", id: thisProject._id })}
                      inSelection={selectedProjectIds.includes(thisProject._id)}
                      addToSelection={handleAddProjectId}
                      selected={thisProject._id === selectedProjectId}
                      selectProject={selectProject} />
                  )
                })
              }
            </ul>
          </div>
        </div>
        {
          !!editingFolder ?
            <Information
              handleEdit={() => folderModal(selectedFolder)}
              closeInfo={() => setEditingFolder(undefined)}
              {...selectedFolder} /> :
            selectedProjectId &&
            <Information
              handleEdit={() => projectModal(selectedProject)}
              closeInfo={() => setSelectedProjectId(undefined)}
              {...selectedProject} />
        }
      </div>
    </div>
  )
}

const Information = ({
  label,
  closeInfo,
  handleEdit,
  _id
}: {
  label?: string,
  closeInfo: Function,
  handleEdit: any,
  _id: string
}) => {
  const [selectedTab, selectTab] = useState("Details")

  return (
    <div className="management__content__information">
      <div className="management__content__information-header">
        <h4>
          {label}
        </h4>
        <a
          onClick={() => closeInfo()}
          className="button">
          <i className="material-icons">
            clear
          </i>
        </a>
        <Tabs
          tabs={tabs}
          selectTab={selectTab}
          selectedTab={selectedTab} />
      </div>
      {
        selectedTab === "Details" ?
          <Details /> :
          <Access />
      }
      <ul className="management__content__information-footer">
        <li onClick={handleEdit}>
          <label className="button">
            Edit
          </label>
        </li>
        <li>
          <Link to={`/player?ids=${JSON.stringify([_id])}`}>
            <label className="button">
              Open
          </label>
          </Link>
        </li>
        <li>
          <label className="button">
            Delete
          </label>
        </li>
      </ul>
    </div>
  )
}

const Details = () => {
  return (
    <div>
      Details
    </div>
  )
}

const Access = () => {
  return (
    <div>
      Access
    </div>
  )
}

export const Project = ({
  label,
  _id,
  selected,
  selectProject,
  inSelection,
  addToSelection,
  updatedAt,
  createdAt,
  ...drageEvents
}) => {

  return (
    <li
      {...drageEvents}
      data-file-selected={selected}
      onClick={() => selectProject(_id)}>
      <i
        onClick={e => {
          e.stopPropagation()
          addToSelection(_id)
        }}
        className="material-icons">
        {
          inSelection ?
            "check_box" :
            "check_box_outline_blank"
        }
      </i>
      <label>
        {label}
      </label>
    </li>
  )
}