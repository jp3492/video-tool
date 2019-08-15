import { useState, useMemo, useCallback } from 'react'

interface UseFolders {
  folders: any[],
  resourceIdName: string
}

const getChildFolders = (folders, parent) => folders.filter(f => f.parent === parent)

const reduceFolders = (folders, parent, resourceIdName) =>
  getChildFolders(folders, parent).reduce((
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
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [openedFolders, setOpenedFolders]: [any, any] = useState([])

  const nestedFolders = useMemo(() =>
    reduceFolders(folders, null, resourceIdName)
    , [])

  const selectFolder = useCallback(resourceId =>
    setSelectedFolder(resourceId)
    , [])

  const openFolder = useCallback(resourceId =>
    setOpenedFolders(
      openedFolders.includes(resourceId) ?
        openedFolders.filter(f => f !== resourceId) :
        [...openedFolders, resourceId])
    , [openedFolders])

  return {
    nestedFolders,
    selectFolder,
    selectedFolder,
    openFolder,
    openedFolders
  }
}