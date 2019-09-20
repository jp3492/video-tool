import React, { useState, useCallback, useMemo } from 'react'

import { MODAL, MODAL_TYPES } from '../../../components/modal/modal'
import { quantumState, quantumReducer } from '@piloteers/react-state'
import { REDUCERS } from '../../../state/stores'

export const PlaylistControls = ({
  selectedTags,
  postProject,
  patchProject,
  projects,
  projectIds,
  addTagsToProject
}) => {
  const { state: { data: folders } } = quantumReducer({ id: REDUCERS.FOLDERS })
  const [_, openModal] = quantumState({ id: MODAL, returnValue: false })
  const [deleting, setDeleting] = useState(false)

  const selectedProjects = useMemo(() => projects.filter(p => projectIds.includes(p._id)), [projects, projectIds])

  const links = useMemo(() => selectedProjects.length !== 0 ? selectedProjects.reduce((res, p) => {
    return [...res, ...p.links.filter(l => res.every(r => r.url !== l.url))]
  }, []) : [], [selectedProjects])

  const selectedTagLinks = useMemo(() => selectedTags.reduce((res, { url }) => res.every(l => l.url !== url) ? [...res, { url, label: links.find(l => l.url === url).label }] : res, []), [selectedTags, links])

  const handleSaveAs = useCallback(() => openModal({
    title: "New Project",
    name: MODAL_TYPES.PROJECT_FORM,
    props: {
      folders,
      selectedFolderId: undefined,
      action: postProject,
      initialValues: {
        links: selectedTagLinks
      }
    }
  }), [folders, postProject, selectedTagLinks])

  const handleAddTo = useCallback(() => openModal({
    title: "New Project",
    name: MODAL_TYPES.ATT_TO_PROJECT_FORM,
    props: {
      folders,
      projects,
      selectedFolderId: undefined,
      action: addTagsToProject,
      initialValues: {
        links: selectedTagLinks
      }
    }
  }), [folders, postProject, selectedTagLinks])

  const handleDelete = useCallback(confirmed => {
    if (!deleting) {
      setDeleting(true)
    } else {
      if (confirmed) {
        const thisProject = projects.find(({ _id }) => _id === projectIds[0])
        patchProject({
          ...thisProject,
          tags: thisProject.tags.filter(tag => !selectedTags.map(({ _id }) => _id).includes(tag))
        })
      }
      setDeleting(false)
    }
  }, [deleting])

  return (
    <div className="player-playlist__controls">
      {
        selectedTags.length !== 0 ?
          <>
            <div onClick={handleDelete}>
              {
                deleting ?
                  <>
                    <i
                      onClick={() => handleDelete(true)}
                      className="material-icons">
                      clear
                    </i>
                    <i
                      onClick={() => handleDelete(false)}
                      className="material-icons">
                      done
                    </i>
                  </> :
                  <>
                    <i className="material-icons">
                      delete
                    </i>
                    <label>
                      Delete
                    </label>
                  </>
              }
            </div>
            <div onClick={handleSaveAs}>
              <i className="material-icons">
                note_add
              </i>
              <label>
                Save as
              </label>
            </div>
            <div onClick={handleAddTo}>
              <i className="material-icons">
                playlist_add
              </i>
              <label>
                Add to
              </label>
            </div>
          </> :
          projectIds.length > 1 ?
            <div onClick={handleSaveAs}>
              <i className="material-icons">
                note_add
              </i>
              <label>
                Save as
              </label>
            </div> :
            null
      }
    </div >
  )
}