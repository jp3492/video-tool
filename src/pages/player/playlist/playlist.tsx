import React, { useState, useMemo, useCallback } from 'react'
import './playlist.scss'

import { PLAYER_STATES } from '../states'
import { quantumState, quantumReducer } from '@piloteers/react-state'
import { REDUCERS } from '../../../state/stores'

import { requests as allRequests } from '../../../state/requests'

import { PlaylistControls } from './playlist-controls'
import { Tag } from './playlist-tag'

const requests = allRequests.projects

export const Playlist = (props: any) => {
  const { state: { data: tags } } = quantumReducer({ id: REDUCERS.TAGS })
  const { state: { data: projects }, actions: { ACTION: PROJECT_ACTION } } = quantumReducer({ id: REDUCERS.PROJECTS })

  const [projectIds] = quantumState({ id: PLAYER_STATES.PROJECT_ID })
  const [playlistOpen] = quantumState({ id: PLAYER_STATES.PLAYLIST_OPEN })
  const [players] = quantumState({ id: PLAYER_STATES.VIDEO_PLAYERS })
  const [selectedTab, setSelectedTab] = quantumState({ id: PLAYER_STATES.TAB_SELECTED, returnValue: false })
  const [selectedTagIds, setSelectedTagIds] = quantumState({ id: PLAYER_STATES.TAGS_SELECTED, initialValue: [] })
  const [playing, setPlaying] = quantumState({ id: PLAYER_STATES.PLAYING })
  const [tabsEnabledStatus] = quantumState({ id: PLAYER_STATES.TABS_ENABLED_STATUS })
  const [settings, setSettings] = quantumState({ id: PLAYER_STATES.PLAYLIST_SETTINGS, initialValue: { loop: false, selectionOnly: false, tagForTag: false, stopAfterTag: false } })
  const [openSubHeader, setOpenSubHeader] = useState("")
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

  const handleSelectTags = _id => selectedTagIds.includes(_id) ? setSelectedTagIds(selectedTagIds.filter(t => t !== _id)) : setSelectedTagIds([...selectedTagIds, _id])

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
    return ranking.reduce((res, r) => {
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

  const tagsToSave = selectedTagIds.length === 0 ? filteredTags : selectedTags

  const postProject = (values) => PROJECT_ACTION({
    ...requests.post, body: {
      ...values,
      tags: tagsToSave
    }
  }).then(res => console.log(res))

  const patchProject = (values) => PROJECT_ACTION({
    ...requests.patch,
    url: requests.patch.url + values._id,
    body: values
  }).then(res => console.log(res))

  const addTagsToProject = projectIds => projectIds.forEach(id => {
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

  const handleChangeSubheader = useCallback(type => setOpenSubHeader(openSubHeader === type ? "" : type), [openSubHeader])
  const handleSetSettings = useCallback(type => setSettings({ ...settings, [type]: !settings[type] }), [settings])

  const activeProjects = useMemo(() => projects.filter(({ _id }) => JSON.parse(projectIds).includes(_id)), [projectIds, projects])
  const linkNames = useMemo(() => activeProjects.reduce((res, p) => p.links.reduce((re, l) => ({ ...re, [l.url]: l.label }), res), {}), [activeProjects])

  return (
    <div
      data-playlist-open={playlistOpen}
      className="player-playlist">
      <div className="player-playlist__header">
        <input placeholder="Search.." value={search} onChange={({ target: { value } }) => setSearch(value)} />
        <i
          onClick={() => handleChangeSubheader("filter")}
          data-icon-active={openSubHeader === "filter"}
          className="material-icons">
          filter_list
        </i>
        <i
          onClick={() => handleChangeSubheader("settings")}
          data-icon-active={openSubHeader === "settings"}
          className="material-icons">
          settings_applications
        </i>
        {
          openSubHeader === "filter" ?
            <Filter
              filter={filter}
              handleSetFilter={handleSetFilter} /> :
            <Settings
              settings={settings}
              handleSetSettings={handleSetSettings} />
        }
      </div>
      <ul className="player-playlist__list">
        {
          sortedTags.map((t, ind) => (
            <Tag
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

const Settings = ({
  settings,
  handleSetSettings
}) => {

  return (
    <div className="player-playlist__header-settings">
      <i
        data-icons-active={settings.loop}
        className="material-icons">
        repeat
      </i>
      <i
        data-icons-active={settings.tagForTag}
        className="material-icons">
        playlist_play
      </i>
      <i
        data-icons-active={settings.selectionOnly}
        className="material-icons">
        check_box
      </i>
      <i
        data-icons-active={settings.stopAfterTag}
        className="material-icons">
        last_page
      </i>
    </div>
  )
}

const Filter = ({
  handleSetFilter,
  filter
}) => {

  return (
    <div className="player-playlist__header-filter">
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
  )
}