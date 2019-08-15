import React, { useCallback, useState } from 'react'
import './management.scss'

import { quantumState } from '@piloteers/react-state'

import { MODAL, MODAL_TYPES } from '../../components/modal/modal'
import { Folders } from '../../components/folders/folders'

const folders = [
  {
    resourceId: '0',
    label: 'Zero',
    parent: null
  },
  {
    resourceId: '1',
    label: 'One',
    parent: null
  },
  {
    resourceId: '2',
    label: 'Two',
    parent: '0'
  },
  {
    resourceId: '3',
    label: 'Three',
    parent: null
  },
  {
    resourceId: '4',
    label: 'Four',
    parent: '3'
  }
]
const projects = [
  {
    label: "Zero",
    folder: "0"
  },
  {
    label: "One",
    folder: "1"
  },
  {
    label: "Two",
    folder: "1"
  },
  {
    label: "Three",
    folder: "1"
  },
  {
    label: "Four",
    folder: "1"
  },
  {
    label: "Five",
    folder: "2"
  },
  {
    label: "Six",
    folder: "3"
  },
  {
    label: "Seven",
    folder: "3"
  }
]

export const Management = (props: any) => {
  const [_, openModal] = quantumState({ id: MODAL, returnValue: false })
  const [sideBarOpen, openSideBar] = useState(false)
  const [search, setSearch] = useState("")

  const folderModal = useCallback(() => openModal({
    name: MODAL_TYPES.FOLDER_FORM
  }), [])
  const projectModal = useCallback(() => openModal({
    name: MODAL_TYPES.PROJECT_FORM
  }), [])

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
          folders={folders} />
      </div>
      <div className="management__content">
        <div className="management__content__header">
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
      </div>
    </div>
  )
}