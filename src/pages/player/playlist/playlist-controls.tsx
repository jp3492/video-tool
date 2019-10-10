import React, { useState, useCallback, useMemo } from 'react'

import { MODAL, MODAL_TYPES } from '../../../components/modal/modal'
import { quantumState, quantumReducer } from '@piloteers/react-state'
import { REDUCERS } from '../../../state/stores'
import { projectModal, addTagsToProjectsModal, patchProject, removeTagsFromProject } from '../../../state/actions'

export const PlaylistControls = ({
  selectedTags,
  projectIds,
  projects
}) => {
  const [deleting, setDeleting] = useState(false)
  const selectedProjects = useMemo(() => projects.filter(p => projectIds.includes(p._id)), [projects, projectIds])

  const links = useMemo(() => selectedProjects.length !== 0 ? selectedProjects.reduce((res, p) => {
    return [...res, ...p.links.filter(l => res.every(r => r.url !== l.url))]
  }, []) : [], [selectedProjects])

  const selectedTagLinks = useMemo(() =>
    selectedTags.length === 0 ?
      links :
      selectedTags.reduce((res, { url }) =>
        res.every(l => l.url !== url) ?
          [...res, { url, label: links.find(l => l.url === url).label }] :
          res
        , []), [selectedTags, links])

  const handleAddTo = useCallback(() => {
    addTagsToProjectsModal(selectedTagLinks, selectedTags.map(({ _id }) => _id))
  }, [selectedTagLinks])

  const handleSaveAs = useCallback(() => {
    projectModal({
      tags: selectedTags,
      links: selectedTagLinks
    })
  }, [selectedTags, selectedTagLinks])

  const handleDelete = useCallback(confirmed => {
    if (!deleting) {
      setDeleting(true)
    } else {
      if (confirmed) {
        removeTagsFromProject(selectedTags)
      }
      setDeleting(false)
    }
  }, [deleting, selectedTags])

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
          JSON.parse(projectIds).length > 1 ?
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