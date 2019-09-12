import React, { useMemo } from 'react'
import './controls.scss'

import { PLAYER_STATES, INPUT_STATES, TIME_SELECTED_STATES } from '../states'
import { quantumState } from '@piloteers/react-state'
import { Tabs } from './tabs/tabs'
import { Input } from './input/input'
import { PlayerConfig } from './config/config'
import { Link } from '@reach/router'

export const Controls = ({
  links
}: {
  links: any[]
}) => {
  const [playlistOpen, setPlaylistOpen] = quantumState({ id: PLAYER_STATES.PLAYLIST_OPEN, initialValue: true })

  return (
    <div className="player-controls">
      <Link to="/">
        <i className="material-icons">
          home
        </i>
      </Link>
      <Tabs links={links} />
      <PlayerConfig />
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
  )
}