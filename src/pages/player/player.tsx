import React, { useEffect, useMemo } from 'react'
import './player.scss'

import { Input } from './input/input'
import { Controls } from './controls/controls'
import { Playlist } from './playlist/playlist'
import { Tabs } from './tabs/tabs'
import { Video } from './video/video'

import { PLAYER_STATES } from './states'
import { quantumState, quantumReducer } from '@piloteers/react-state'
import { REDUCERS } from '../../state/stores'
import { requests as allRequests } from '../../state/requests'

const requests = allRequests.projects

export const Player = (props: any) => {
  const { state: { data: projects }, actions: { ACTION } } = quantumReducer({ id: REDUCERS.PROJECTS })
  const [playlistOpen, setPlaylistOpen] = quantumState({ id: PLAYER_STATES.PLAYLIST_OPEN, initialValue: true })

  const projectId = useMemo(() => new URLSearchParams(window.location.search).get("_id"), [window.location.search])

  const selectedProject = useMemo(() => projects.find(p => p._id === projectId), [projects, projectId])

  useEffect(() => {
    if (!selectedProject) {
      ACTION({
        ...requests.getSingle,
        url: requests.getSingle.url + projectId
      })
    }
  }, [projectId])

  return (
    <div className="player">
      {
        selectedProject ?
          <>
            <div className="player__video">
              <Video links={selectedProject.links} />
              <Tabs links={selectedProject.links} />
              <Controls />
              <Input />
              <i
                onClick={() => setPlaylistOpen(!playlistOpen)}
                id="playlistToggle"
                className="material-icons">
                {
                  !playlistOpen ?
                    "keyboard_arrow_right" :
                    "keyboard_arrow_left"
                }
              </i>
            </div>
            <Playlist />
          </> :
          <div className="player__loading">
            Loading...
          </div>
      }

    </div>
  )
}