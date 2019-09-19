import React, { useEffect, useMemo } from 'react'
import './player.scss'

import { Input } from './controls/input/input'
import { Controls } from './controls/controls'
import { Playlist } from './playlist/playlist'
import { Tabs } from './controls/tabs/tabs'
import { Video } from './video/video'

import { PLAYER_STATES, KEY_ACTIONS } from './states'
import { quantumState, quantumReducer } from '@piloteers/react-state'
import { REDUCERS } from '../../state/stores'
import { requests as allRequests } from '../../state/requests'

const projectRequests = allRequests.projects
const tagRequests = allRequests.tags

const playerConfig = {
  [KEY_ACTIONS.PLAY]: {
    ctrl: true,
    key: 32
  },
  [KEY_ACTIONS.VIDEO_PREV]: {
    ctrl: true,
    key: 37
  },
  [KEY_ACTIONS.VIDEO_NEXT]: {
    ctrl: true,
    key: 39
  },
  [KEY_ACTIONS.REWIND]: {
    ctrl: false,
    key: 37
  },
  [KEY_ACTIONS.FAST_FORWARD]: {
    ctrl: false,
    key: 39
  },
  [KEY_ACTIONS.PLAYLIST_NEXT]: {
    ctrl: false,
    key: 40
  },
  [KEY_ACTIONS.PLAYLIST_PREV]: {
    ctrl: false,
    key: 38
  },
  [KEY_ACTIONS.TAG_STATE_NEXT]: {
    ctrl: true,
    key: 13
  },
  [KEY_ACTIONS.TAG_STATE_PREV]: {
    ctrl: true,
    key: 8
  }
}

export const Player = (props: any) => {
  const { state: { data: projects }, actions: { ACTION: PROJECT_ACTION } } = quantumReducer({ id: REDUCERS.PROJECTS })
  const { actions: { ACTION: TAG_ACTION } } = quantumReducer({ id: REDUCERS.TAGS, connect: false })
  const [playerConfiguration, setPlayerConfiguration] = quantumState({ id: PLAYER_STATES.PLAYER_CONFIGURATION, initialValue: playerConfig })
  const [keyAction, setKeyAction] = quantumState({ id: PLAYER_STATES.KEY_ACTION, initialValue: { count: 0, action: "" } })
  const [projectIds, setProjectIds] = quantumState({ id: PLAYER_STATES.PROJECT_ID, initialValue: new URLSearchParams(window.location.search).get("ids") })

  useEffect(() => {
    setProjectIds(new URLSearchParams(window.location.search).get("ids"))
  }, [])

  const selectedProjects = useMemo(() => projects.filter(p => projectIds.includes(p._id)), [projects, projectIds])

  const links = useMemo(() => selectedProjects.length !== 0 ? selectedProjects.reduce((res, p) => {
    return [...res, ...p.links.filter(l => res.every(r => r.url !== l.url))]
  }, []) : [], [selectedProjects])

  useEffect(() => {
    if (selectedProjects) {
      TAG_ACTION({
        ...tagRequests.get,
        url: tagRequests.get.url + projectIds
      })
    }
  }, [selectedProjects])

  // useEffect(() => {
  //   if (selectedProjects.length !== projectIds.length) {
  //     PROJECT_ACTION({
  //       ...projectRequests.getMany,
  //       url: projectRequests.getMany.url + projectIds
  //     })
  //   }
  // }, [projectIds])

  const handleKeyPress = ({
    which,
    ctrlKey
  }, up) => {
    const action = Object.keys(playerConfiguration).find(a => playerConfiguration[a].ctrl === ctrlKey && playerConfiguration[a].key === which)
    if (action === KEY_ACTIONS.TAG_STATE_NEXT) {
      if (up) {
        setKeyAction({ count: keyAction.count + 1, action })
      }
    } else if (!up) {
      setKeyAction({ count: keyAction.count + 1, action })
    }
  }

  useEffect(() => {
    document.addEventListener("keyup", e => handleKeyPress(e, true))
    document.addEventListener("keydown", e => handleKeyPress(e, false))
    return () => {
      document.removeEventListener("keyup", e => handleKeyPress(e, true))
      document.removeEventListener("keydown", e => handleKeyPress(e, false))
    }
  }, [document])

  const getClipBoard = e => {
    e.preventDefault()
    console.log(e)
  }

  return (
    <div
      onDragEnter={getClipBoard} className="player" id="player">
      {
        selectedProjects.length !== 0 ?
          <>
            <Video links={links} />
            <Controls links={links} />
            <Playlist />
          </> :
          <div className="player__loading">
            Loading...
          </div>
      }

    </div>
  )
}