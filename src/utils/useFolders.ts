import { useState, useMemo, useCallback } from 'react'
import { quantumState } from '@piloteers/react-state'

interface UseFolders {
  folders: any[],
  resourceIdName: string
}

const getChildFolders = (folders, folder) => folders.filter(f => f.folder === folder)

const reduceFolders = (folders, folder, resourceIdName) =>
  getChildFolders(folders, folder).reduce((
    res,
    folder
  ) => ({
    ...res,
    [folder[resourceIdName]]: {
      ...folder,
      childFolders: reduceFolders(folders, folder[resourceIdName], resourceIdName)
    }
  })
    , {})

export const useFolders = ({
  folders,
  resourceIdName
}: UseFolders) => {
  const [selectedFolder, setSelectedFolder] = quantumState({ id: "SELECTED_FOLDER", initialValue: undefined })
  const [openedFolders, setOpenedFolders]: [any, any] = useState([])

  const nestedFolders = useMemo(() =>
    reduceFolders(folders, undefined, resourceIdName)
    , [folders])

  const selectFolder = useCallback(_id =>
    selectedFolder === _id ?
      setSelectedFolder(undefined) :
      setSelectedFolder(_id)
    , [selectedFolder])

  const openFolder = useCallback(_id =>
    setOpenedFolders(
      openedFolders.includes(_id) ?
        openedFolders.filter(f => f !== _id) :
        [...openedFolders, _id])
    , [openedFolders])

  return {
    nestedFolders,
    selectFolder,
    selectedFolder,
    openFolder,
    openedFolders
  }
}