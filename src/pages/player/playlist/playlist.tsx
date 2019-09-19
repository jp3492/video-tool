import React, { useState, useMemo, useCallback } from 'react'
import './playlist.scss'

import { PLAYER_STATES } from '../states'
import { quantumState, quantumReducer } from '@piloteers/react-state'
import { REDUCERS } from '../../../state/stores'
import { MODAL, MODAL_TYPES } from '../../../components/modal/modal'

import { requests as allRequests } from '../../../state/requests'

const requests = allRequests.projects

export const Playlist = (props: any) => {
  const { state: { data: tags }, actions: { ACTION } } = quantumReducer({ id: REDUCERS.TAGS })
  const { state: { data: projects }, actions: { ACTION: PROJECT_ACTION } } = quantumReducer({ id: REDUCERS.PROJECTS })
  const [projectIds] = quantumState({ id: PLAYER_STATES.PROJECT_ID })
  const [_, openModal] = quantumState({ id: MODAL, returnValue: false })
  const [playlistOpen, setPlaylistOpen] = quantumState({ id: PLAYER_STATES.PLAYLIST_OPEN })
  const [players] = quantumState({ id: PLAYER_STATES.VIDEO_PLAYERS })
  const [selectedTab, setSelectedTab] = quantumState({ id: PLAYER_STATES.TAB_SELECTED, returnValue: false })
  const [selectedTagIds, setSelectedTagIds] = quantumState({ id: PLAYER_STATES.TAGS_SELECTED, initialValue: [] })
  const [playing, setPlaying] = quantumState({ id: PLAYER_STATES.PLAYING })
  const [tabsEnabledStatus, setTabsEnabledStatus] = quantumState({ id: PLAYER_STATES.TABS_ENABLED_STATUS })

  const [filterOpen, setFilterOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [filter, setFilter]: [any, any] = useState({
    time: {
      active: false,
      asc: false,
      rank: 0
    },
    video: {
      active: false,
      asc: false,
      rank: 0
    },
    selected: {
      active: false,
      asc: false
    }
  })

  const handleSetFilter = useCallback(type => {
    const otherType = Object.keys(filter).filter(k => k !== type && k !== "selected")[0]
    setFilter({
      ...filter,
      [otherType]: {
        ...filter[otherType],
        rank: 0
      },
      [type]: {
        active: !filter[type].active ? true : !filter[type].asc,
        asc: filter[type].active ? !filter[type].asc : false,
        rank: 1
      }
    })
  }, [filter])

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
    return tags.filter(t => projectTags.includes(t._id) && tabsEnabledStatus[t.url] && t.text.toLowerCase().includes(search))
  }, [tags, projects, projectIds, tabsEnabledStatus, search])

  const sortedTags = useMemo(() => {
    const ranking = [
      Object.keys(filter).find(f => filter[f].active && filter[f].rank === 0 && f !== "selected"),
      Object.keys(filter).find(f => filter[f].active && filter[f].rank === 1 && f !== "selected"),
      filter.selected.active ? "selected" : undefined
    ].filter(r => !!r)
    console.log(ranking);

    return ranking.reduce((res, r) => {
      console.log(res);

      if (r === "selected") {
        return res.sort((a, b) => filter.selected.asc ? selectedTagIds.includes(a._id) - selectedTagIds.includes(b._id) : selectedTagIds.includes(b._id) - selectedTagIds.includes(a._id))
      } else if (r === "time") {
        return res.sort((a, b) => filter.time.asc ? a.start - b.start : b.start - a.start)
      } else {
        return res.sort((a, b) => a.text.toLowerCase() < b.text.toLowerCase() ? filter.video.asc ? -1 : 1 : filter.video.asc ? 1 : -1)
      }
    }, filteredTags)
  }, [filteredTags, filter, selectedTagIds])

  const selectedTags = useMemo(() => tags.filter(t => selectedTagIds.includes(t._id)), [selectedTagIds, tags])

  const tagsToSave = selectedTagIds.length === 0 ?
    filteredTags :
    selectedTags

  const postProject = (values) => {
    PROJECT_ACTION({
      ...requests.post, body: {
        ...values,
        tags: tagsToSave
      }
    }).then(res => console.log(res))
  }

  const patchProject = (values) => PROJECT_ACTION({
    ...requests.patch,
    url: requests.patch.url + values._id,
    body: values
  }).then(res => console.log(res))

  const addTagsToProject = projectIds => {
    projectIds.forEach(id => {
      const project = projects.find(p => p._id === id)
      const updatedProject = {
        ...project,
        tags: [
          ...project.tags,
          ...selectedTags
        ]
      }
      patchProject(updatedProject)
    })
  }

  const activeProjects = useMemo(() => projects.filter(({ _id }) => JSON.parse(projectIds).includes(_id)), [projectIds, projects])
  const linkNames = useMemo(() => activeProjects.reduce((res, p) => p.links.reduce((re, l) => ({ ...re, [l.url]: l.label }), res), {}), [activeProjects])

  return (
    <div
      data-playlist-open={playlistOpen}
      className="player-playlist">
      <div className="player-playlist__header">
        <input placeholder="Search.." value={search} onChange={({ target: { value } }) => setSearch(value)} />
        <i
          onClick={() => setFilterOpen(!filterOpen)}
          data-filter-open={filterOpen}
          className="material-icons">
          {
            filterOpen ?
              "clear" :
              "filter_list"
          }
        </i>
        <div>
          <div onClick={() => handleSetFilter("time")}>
            <label>
              Time
            </label>
            <i className="material-icons">
              {
                !filter.time.active ?
                  "unfold_more" :
                  filter.time.asc ?
                    "expand_more" :
                    "expand_less"
              }
            </i>
          </div>
          <div onClick={() => handleSetFilter("video")}>
            <label>
              Video
            </label>
            <i className="material-icons">
              {
                !filter.video.active ?
                  "unfold_more" :
                  filter.video.asc ?
                    "expand_more" :
                    "expand_less"
              }
            </i>
          </div>
          <i
            onClick={() => handleSetFilter("selected")}
            className="material-icons">
            {
              !filter.selected.active ?
                "indeterminate_check_box" :
                filter.selected.asc ?
                  "check_box_outline_blank" :
                  "check_box"
            }
          </i>
        </div>
      </div>
      <ul className="player-playlist__list">
        {
          sortedTags.map((t, ind) => (
            <Item
              key={ind}
              {...t}
              videoName={linkNames[t.url]}
              selected={selectedTagIds.includes(t._id)}
              selectTag={handleSelectTags}
              handleSelectTag={handleSelectTag} />
          ))
        }
      </ul>
      <PlaylistControls
        postProject={postProject}
        patchProject={patchProject}
        projects={projects}
        projectIds={JSON.parse(projectIds)}
        selectedTags={selectedTags}
        addTagsToProject={addTagsToProject} />
    </div>
  )
}

const PlaylistControls = ({
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

const Item = ({
  _id,
  text,
  start,
  end,
  url,
  handleSelectTag,
  selected,
  selectTag,
  videoName
}: {
  _id: string,
  text: string,
  start: number,
  end: number,
  url: string,
  handleSelectTag: Function,
  selected: boolean,
  selectTag: Function,
  videoName: string
}) => {
  const [editingTag, setEditingTag] = quantumState({ id: PLAYER_STATES.EDITING_TAG })
  const [tagContent, setTagContent] = quantumState({ id: PLAYER_STATES.TAG_CONTENT, returnValue: false })

  const handleEditTag = useCallback(() => {
    if (editingTag !== _id) {
      setTagContent({ start, end, text, _id })
      setEditingTag(_id)
    } else {
      setTagContent({ start: null, end: null, text: "", _id: null })
      setEditingTag(null)
    }
  }, [_id, editingTag, start, end, text, _id])

  return (
    <li onClick={() => handleSelectTag(url, start)}>
      <div>
        <span>
          {`${start} - ${end}`}
        </span>
        <label>
          {videoName || "noName"}
        </label>
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
        <i
          onClick={handleEditTag}
          className="material-icons">
          {
            editingTag === _id ?
              "clear" :
              "edit"
          }
        </i>
      </div>
    </li>
  )
}