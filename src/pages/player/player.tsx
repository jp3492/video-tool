import React, { useEffect } from 'react'
import './player.scss'

import { Input } from './input/input'
import { Controls } from './controls/controls'
import { Playlist } from './playlist/playlist'
import { Tabs } from './tabs/tabs'
import { Video } from './video/video'

import { PLAYER_STATES } from './states'
import { quantumState } from '@piloteers/react-state'

export const Player = (props: any) => {
  const [playlistOpen, setPlaylistOpen] = quantumState({ id: PLAYER_STATES.PLAYLIST_OPEN, initialValue: true })

  useEffect(() => {
    // Load project initially, check if in Reducer otherwise GET from server

  }, [])

  return (
    <div className="player">
      <div className="player__video">
        <Video />
        <Tabs />
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
    </div>
  )
}