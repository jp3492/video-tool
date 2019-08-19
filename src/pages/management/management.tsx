import React, { useCallback, useState, useMemo, useEffect } from 'react'
import './management.scss'

import { getRequestStatus } from '@piloteers/react-authentication'
import { quantumState, quantumReducer } from '@piloteers/react-state'
import { REDUCERS } from '../../state/stores'

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

  const { statuses, isLoading } = getRequestStatus({
    ...folderRequests,
    ...projectRequests
  })

  const [_, openModal] = quantumState({ id: MODAL, returnValue: false })
  const [sideBarOpen, openSideBar] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [selectedFolderId, setSelectedFolderId] = useState(null)

  useEffect(() => {
    FOLDER_ACTION(projectRequests.get)
    PROJECT_ACTION(folderRequests.get)
  }, [])

  const postFolder = body => FOLDER_ACTION({
    ...folderRequests.post,
    body
  }).then(() => openModal({}))

  const postProject = body => PROJECT_ACTION({
    ...projectRequests.post,
    body
  }).then(() => openModal({}))

  const folderModal = useCallback(initialValues => openModal({
    title: initialValues ? "Edit Folder" : "New Folder",
    name: MODAL_TYPES.FOLDER_FORM,
    props: {
      folders,
      selectedFolderId,
      action: postFolder,
      initialValues
    }
  }), [folders, selectedFolderId])

  const projectModal = useCallback(initialValues => openModal({
    title: initialValues ? "Edit Project" : "New Project",
    name: MODAL_TYPES.PROJECT_FORM,
    props: {
      folders,
      selectedFolderId,
      action: postProject,
      initialValues
    }
  }), [folders, selectedFolderId])

  const selectedFolder = useMemo(() => folders.find(f => f.resourceId === selectedFolderId), [selectedFolderId, folders])

  const selectProject = useCallback(resourceId => setSelectedProjectId(resourceId), [])

  const selectedProject = useMemo(() => projects.find(p => p.resourceId === selectedProjectId) || {}, [selectedProjectId, projects])

  const filteredProjects = useMemo(() => projects.filter(p => p.folder === selectedFolderId), [selectedFolderId, projects])

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
          onClick={folderModal}
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
              onClick={projectModal}
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
                  selected={p.resourceId === selectedProjectId}
                  selectProject={selectProject} />
              ))
            }
          </ul>
        </div>
        {
          selectedProjectId !== null &&
          <Information
            closeInfo={() => setSelectedProjectId(null)}
            {...selectedProject} />
        }
      </div>
    </div>
  )
}

interface iInformation {
  label?: string,
  closeInfo: Function
}

const Information = ({
  label,
  closeInfo
}: iInformation) => {
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
        <li>
          <label className="button">
            Publish
          </label>
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


const Project = ({
  label,
  resourceId,
  selected,
  selectProject
}) => {

  return (
    <li
      data-file-selected={selected}
      onClick={() => selectProject(resourceId)}>
      <label>
        {label}
      </label>
    </li>
  )
}