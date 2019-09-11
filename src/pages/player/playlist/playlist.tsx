import React, { useState, useMemo, useCallback } from 'react'
import './playlist.scss'

import { PLAYER_STATES } from '../states'
import { quantumState, quantumReducer } from '@piloteers/react-state'
import { REDUCERS } from '../../../state/stores'
import { MODAL, MODAL_TYPES } from '../../../components/modal/modal'

import { requests as allRequests } from '../../../state/requests'

const requests = allRequests.projects

export const Playlist = ({ projectId }: any) => {
  const { state: { data: tags }, actions: { ACTION } } = quantumReducer({ id: REDUCERS.TAGS })
  const { state: { data: projects }, actions: { ACTION: PROJECT_ACTION } } = quantumReducer({ id: REDUCERS.PROJECTS })
  const [projectIds] = quantumState({ id: PLAYER_STATES.PROJECT_ID })

  const [playlistOpen, setPlaylistOpen] = quantumState({ id: PLAYER_STATES.PLAYLIST_OPEN })
  const [players] = quantumState({ id: PLAYER_STATES.VIDEO_PLAYERS })
  const [selectedTab, setSelectedTab] = quantumState({ id: PLAYER_STATES.TAB_SELECTED, returnValue: false })
  const [selectedTagIds, setSelectedTagIds] = quantumState({ id: PLAYER_STATES.TAGS_SELECTED, initialValue: [] })
  const [playing, setPlaying] = quantumState({ id: PLAYER_STATES.PLAYING })

  const [search, setSearch] = useState("")

  const handleSelectTag = (url, start) => {
    const activePlayer = players[url]
    setSelectedTab(url)
    activePlayer.seekTo(start, 'seconds')
    if (!playing) {
      setPlaying(true)
    }
  }

  const handleSelectTags = _id => {
    if (selectedTagIds.includes(_id)) {
      setSelectedTagIds(selectedTagIds.filter(t => t !== _id))
    } else {
      setSelectedTagIds([...selectedTagIds, _id])
    }
  }

  const filteredTags = useMemo(() => {
    const activeProjects = projects.filter(p => projectIds.includes(p._id))
    const projectTags = activeProjects.reduce((res, p) => ([...res, ...p.tags]), [])
    return tags.filter(t => projectTags.includes(t._id))
  }, [tags, projects])

  const selectedTags = useMemo(() => tags.filter(t => selectedTagIds.includes(t._id)), [selectedTagIds])

  const tagsToSave = selectedTagIds.length === 0 ?
    filteredTags :
    selectedTags

  const postProject = (values) => {
    ACTION({
      ...requests.post, body: {
        ...values,
        tags: tagsToSave
      }
    }).then(res => console.log(res))
  }

  return (
    <div
      data-playlist-open={playlistOpen}
      className="player-playlist">
      <div className="player-playlist__header">
        <input placeholder="Search.." value={search} onChange={({ target: { value } }) => setSearch(value)} />
        <i className="material-icons">
          filter_list
        </i>
      </div>
      <ul className="player-playlist__list">
        {
          filteredTags.map((t, ind) => (
            <Item
              key={ind}
              {...t}
              selected={selectedTags.includes(t._id)}
              selectTag={handleSelectTags}
              handleSelectTag={handleSelectTag} />
          ))
        }
      </ul>
      <PlaylistControls
        postProject={postProject}
        projects={projects}
        projectIds={projectIds}
        selectedTags={selectedTags} />
    </div>
  )
}

const PlaylistControls = ({
  selectedTags,
  postProject,
  projects,
  projectIds
}) => {
  const { state: { data: folders } } = quantumReducer({ id: REDUCERS.FOLDERS })
  const [_, openModal] = quantumState({ id: MODAL, returnValue: false })

  const selectedProjects = useMemo(() => projects.filter(p => projectIds.includes(p._id)), [projects, projectIds])

  const links = useMemo(() => selectedProjects.length !== 0 ? selectedProjects.reduce((res, p) => {
    return [...res, ...p.links.filter(l => res.every(r => r.url !== l.url))]
  }, []) : [], [selectedProjects])

  const handleSaveAs = useCallback(() => openModal({
    title: "New Project",
    name: MODAL_TYPES.PROJECT_FORM,
    props: {
      folders,
      selectedFolderId: undefined,
      action: postProject,
      initialValues: {
        links
      }
    }
  }), [folders, postProject, links])


  return (
    <div className="player-playlist__controls">
      {
        selectedTags.length !== 0 ?
          <>
            <div>
              <i className="material-icons">
                delete
              </i>
              <label>
                Delete
              </label>
            </div>
            <div onClick={handleSaveAs}>
              <i className="material-icons">
                note_add
              </i>
              <label>
                Save as
              </label>
            </div>
            <div>
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

const Item = ({
  _id,
  text,
  start,
  end,
  url,
  handleSelectTag,
  selected,
  selectTag
}: {
  _id: string,
  text: string,
  start: number,
  end: number,
  url: string,
  handleSelectTag: Function,
  selected: boolean,
  selectTag: Function
}) => {

  return (
    <li onClick={() => handleSelectTag(url, start)}>
      <div>
        <label>
          Video 1
        </label>
        <span>
          {`${start} - ${end}`}
        </span>
        <i
          onClick={e => {
            e.stopPropagation()
            selectTag(_id)
          }}
          className="material-icons">
          {
            selected ?
              "check_box" :
              "check_box_outline_blank"
          }
        </i>
      </div>
      <div>
        <p>
          {text}
        </p>
        <i className="material-icons">
          more_vert
        </i>
      </div>
    </li>
  )
}