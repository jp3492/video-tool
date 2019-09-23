import React, { useEffect, useMemo, useState } from 'react'
import './player.scss'

import ReactPlayer from 'react-player'

import { Controls } from './controls/controls'
import { Playlist } from './playlist/playlist'
import { Video } from './video/video'

import { PLAYER_STATES, KEY_ACTIONS } from './states'
import { quantumState, quantumReducer } from '@piloteers/react-state'
import { REDUCERS } from '../../state/stores'
import { requests as allRequests } from '../../state/requests'

const tagRequests = allRequests.tags
const projectRequests = allRequests.projects

const playerConfig = {
  [KEY_ACTIONS.PLAY]: {
    ctrl: true,
    shift: false,
    key: 32
  },
  [KEY_ACTIONS.VIDEO_PREV]: {
    ctrl: true,
    shift: true,
    key: 37
  },
  [KEY_ACTIONS.VIDEO_NEXT]: {
    ctrl: true,
    shift: true,
    key: 39
  },
  [KEY_ACTIONS.REWIND]: {
    ctrl: true,
    shift: false,
    key: 37
  },
  [KEY_ACTIONS.FAST_FORWARD]: {
    ctrl: true,
    shift: false,
    key: 39
  },
  [KEY_ACTIONS.PLAYLIST_NEXT]: {
    ctrl: false,
    shift: false,
    key: 40
  },
  [KEY_ACTIONS.PLAYLIST_PREV]: {
    ctrl: false,
    shift: false,
    key: 38
  },
  [KEY_ACTIONS.TAG_STATE_NEXT]: {
    ctrl: true,
    shift: false,
    key: 13
  },
  [KEY_ACTIONS.TAG_STATE_PREV]: {
    ctrl: true,
    shift: false,
    key: 8
  }
}

export const Player = (props: any) => {
  const { state: { data: projects }, actions: { ACTION } } = quantumReducer({ id: REDUCERS.PROJECTS })
  const { actions: { ACTION: TAG_ACTION } } = quantumReducer({ id: REDUCERS.TAGS, connect: false })
  const [playerConfiguration] = quantumState({ id: PLAYER_STATES.PLAYER_CONFIGURATION, initialValue: playerConfig })
  const [keyAction, setKeyAction] = quantumState({ id: PLAYER_STATES.KEY_ACTION, initialValue: { count: 0, action: "" } })
  const [projectIds, setProjectIds] = quantumState({ id: PLAYER_STATES.PROJECT_ID, initialValue: new URLSearchParams(window.location.search).get("ids") })

  const [showDropCover, setShowDropCover] = useState(false)

  useEffect(() => {
    setProjectIds(new URLSearchParams(window.location.search).get("ids"))
  }, [])

  const patchProject = (values) => ACTION({
    ...projectRequests.patch,
    url: projectRequests.patch.url + values._id,
    body: values
  }).then(res => console.log(res))

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

  const handleKeyPress = ({
    which,
    ctrlKey,
    shiftKey
  }, up) => {

    const action = Object.keys(playerConfiguration).find(a => playerConfiguration[a].ctrl === ctrlKey && playerConfiguration[a].key === which && playerConfiguration[a].shift === shiftKey)
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

  const handleUrlDrop = (e, fromCover = false) => {
    console.log(e.type);
    e.stopPropagation()
    e.preventDefault()
    switch (e.type) {
      case "dragover":
      case "dragenter":
        e.returnValue = false;
        if (!showDropCover) {
          setShowDropCover(true)
        }
        break;
      case "drop":
        const link = e.dataTransfer.getData("URL")
        if (ReactPlayer.canPlay(link)) {

        } else {
          alert("Provided link doesnt contain a compatible video source")
        }
        // setShowDropCover(false)
        e.returnValue = false;
        break
      case "dragleave":
        e.returnValue = false;
      // setShowDropCover(false)
    }
  }

  return (
    <div
      onDragEnter={handleUrlDrop}
      // onDragOver={handleUrlDrop}
      // onDrop={handleUrlDrop}
      className="player" id="player">
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
      {
        showDropCover &&
        <div
          onDragEnter={handleUrlDrop}
          onDragOver={handleUrlDrop}
          onDragLeave={handleUrlDrop}
          onDrop={handleUrlDrop}
          className="player__drop-cover"></div>
      }
    </div>
  )
}