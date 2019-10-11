import React, { useEffect, memo } from 'react'
import './folders.scss'

import { useFolders } from '../../utils'

export const Folders = memo(({
  folders,
  onChange,
  initialSelectedFolder,
  setEditingFolder,
  editingFolder
}: {
  folders: any[],
  onChange: Function,
  initialSelectedFolder?: string
  setEditingFolder?: Function,
  editingFolder?: string | undefined
}) => {
  const {
    nestedFolders,
    selectFolder,
    selectedFolder,
    openFolder,
    openedFolders
  } = useFolders({
    folders,
    resourceIdName: "_id",
    initialSelectedFolder
  })

  useEffect(() => {
    onChange(selectedFolder)
  }, [selectedFolder])

  return (
    <div className="folders">
      {
        Object.keys(nestedFolders).map((folder: any, i) => (
          <Folder
            {...nestedFolders[folder]}
            editDisabled={!setEditingFolder}
            setEditingFolder={setEditingFolder}
            editingFolder={editingFolder}
            key={i}
            selectFolder={selectFolder}
            selectedFolder={selectedFolder}
            openFolder={openFolder}
            openedFolders={openedFolders} />
        ))
      }
    </div>
  )
})

const Folder = ({
  _id,
  label,
  childFolders,
  selectFolder,
  selectedFolder,
  openFolder,
  openedFolders,
  setEditingFolder,
  editingFolder,
  editDisabled
}) => (
    <div
      className="folders_folder"
      onClick={e => {
        e.stopPropagation()
        selectFolder(_id)
      }}
      data-folder-selected={selectedFolder === _id}
      data-folder-open={openedFolders.includes(_id)} >
      <i
        onClick={e => {
          if (Object.keys(childFolders).length !== 0) {
            e.stopPropagation()
            openFolder(_id)
          }
        }}
        className="material-icons">
        {
          Object.keys(childFolders).length !== 0 && "expand_more"
        }
      </i>
      <label>
        {label}
      </label>
      <i
        onClick={e => {
          if (editDisabled) {
            return
          }
          if (selectedFolder === _id) {
            e.stopPropagation()
          }
          setEditingFolder(_id)
        }}
        className="material-icons">
        {
          editDisabled ? "" :
            editingFolder === _id ?
              "edit" :
              "more_vert"
        }
      </i>
      {
        openedFolders.includes(_id) &&
        <div className="folders">
          {
            Object.keys(childFolders).map((folder: any, i) => (
              <Folder
                {...childFolders[folder]}
                setEditingFolder={setEditingFolder}
                key={i}
                data-folder-selected={selectedFolder === folder}
                data-folder-open={openedFolders.includes(folder)}
                selectFolder={selectFolder}
                selectedFolder={selectedFolder}
                openFolder={openFolder}
                openedFolders={openedFolders} />
            ))
          }
        </div>
      }
    </div>
  )
