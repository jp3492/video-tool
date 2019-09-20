import React, { useCallback, useState, useMemo, useEffect } from 'react'
import './management.scss'

import { getRequestStatus } from '@piloteers/react-authentication'
import { quantumState, quantumReducer } from '@piloteers/react-state'
import { REDUCERS } from '../../state/stores'

import { Link } from '@reach/router'

import { MODAL, MODAL_TYPES } from '../../components/modal/modal'
import { Folders } from '../../components/folders/folders'
import { Tabs } from '../../components/tabs/tabs'

import { requests } from '../../state/requests'

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

  useEffect(() => {
    FOLDER_ACTION(folderRequests.get)
    PROJECT_ACTION(projectRequests.get)
  }, [])

  const postFolder = body => FOLDER_ACTION({ ...folderRequests.post, body }).then(() => openModal({}))
  const postProject = body => PROJECT_ACTION({ ...projectRequests.post, body }).then(() => openModal({}))

  const patchFolder = (_id, body) => FOLDER_ACTION({ ...folderRequests.patch, url: folderRequests.patch.url + _id, body }).then(() => openModal({}))
  const patchProject = (_id, body) => PROJECT_ACTION({ ...projectRequests.patch, url: projectRequests.patch.url + _id, body }).then(() => openModal({}))

  const deleteFolder = _id => FOLDER_ACTION({ ...folderRequests.delete, url: folderRequests.patch.url + _id }).then(() => openModal({}))
  const deleteProject = _id => FOLDER_ACTION({ ...projectRequests.delete, url: projectRequests.patch.url + _id }).then(() => openModal({}))

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
      action: initialValues ? (body, _id) => patchProject(_id, { ...initialValues, ...body }) : postProject,
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

  const handleDragEnter = dragEvent => {

  }

  const selectedFolder = useMemo(() => folders.find(f => f._id === selectedFolderId), [selectedFolderId, folders])

  const selectProject = useCallback(_id => setSelectedProjectId(_id), [])
  const selectedProject = useMemo(() => projects.find(p => p._id === selectedProjectId) || {}, [selectedProjectId, projects])
  const filteredProjects = useMemo(() => projects.filter(p => p.folder === selectedFolderId), [selectedFolderId, projects])

  const getClipBoard = e => {
    e.preventDefault()
    console.log(e.dataTransfer.getData("text"))
  }

  return (
    <div
      onDragOver={getClipBoard}
      onDrop={getClipBoard}
      className="management">
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
          <ul className="management__content__content">
            {
              filteredProjects.map(p => (
                <Project
                  {...p}
                  inSelection={selectedProjectIds.includes(p._id)}
                  addToSelection={handleAddProjectId}
                  selected={p._id === selectedProjectId}
                  selectProject={selectProject} />
              ))
            }
          </ul>
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
                <Link to={`/player?ids=${JSON.stringify(selectedProjectIds)}`}>
                  <i className="material-icons">
                    play_arrow
                  </i>
                  <label>
                    Open in Player
                  </label>
                </Link>
              </>
            }
          </div>
          <ul className="management__content__selection">
            {
              selectedProjectIds.map(id => {
                const thisProject = projects.find(p => p._id === id)
                return (
                  <Project
                    {...thisProject}
                    inSelection={selectedProjectIds.includes(thisProject._id)}
                    addToSelection={handleAddProjectId}
                    selected={thisProject._id === selectedProjectId}
                    selectProject={selectProject} />
                )
              })
            }
          </ul>
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
  addToSelection
}) => {

  return (
    <li
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