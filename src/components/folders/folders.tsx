import React, { useEffect } from 'react'
import './folders.scss'

import { useFolders } from '../../utils'

interface Folder {
  resourceId: string,
  label: string,
  parent: string | null
}

export const Folders = ({
  folders,
  onChange,
  initialSelectedFolder
}: {
  folders: Folder[],
  onChange: Function,
  initialSelectedFolder?: string
}) => {
  const {
    nestedFolders,
    selectFolder,
    selectedFolder,
    openFolder,
    openedFolders
  } = useFolders({
    folders,
    resourceIdName: "resourceId"
  })

  useEffect(() => {
    selectFolder(initialSelectedFolder)
  }, [initialSelectedFolder])

  useEffect(() => {
    onChange(selectedFolder)
  }, [selectedFolder])

  return (
    <div className="folders">
      {
        Object.keys(nestedFolders).map((folder: any, i) => (
          <Folder
            {...nestedFolders[folder]}
            key={i}
            selectFolder={selectFolder}
            selectedFolder={selectedFolder}
            openFolder={openFolder}
            openedFolders={openedFolders} />
        ))
      }
    </div>
  )
}

const Folder = ({
  resourceId,
  label,
  childFolders,
  selectFolder,
  selectedFolder,
  openFolder,
  openedFolders
}) => (
    <div
      className="folders_folder"
      onClick={e => {
        e.stopPropagation()
        selectFolder(resourceId)
      }}
      data-folder-selected={selectedFolder === resourceId}
      data-folder-open={openedFolders.includes(resourceId)} >
      <i
        onClick={e => {
          if (Object.keys(childFolders).length !== 0) {
            e.stopPropagation()
            openFolder(resourceId)
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
      <i className="material-icons">
        more_vert
      </i>
      {
        openedFolders.includes(resourceId) &&
        <div className="folders">
          {
            Object.keys(childFolders).map((folder: any, i) => (
              <Folder
                {...childFolders[folder]}
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
