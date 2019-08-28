import React, { useMemo } from 'react'
import './controls.scss'

import { PLAYER_STATES, INPUT_STATES, TIME_SELECTED_STATES } from '../states'
import { quantumState } from '@piloteers/react-state'

export const Controls = () => {
  const [playing, setPlaying] = quantumState({ id: PLAYER_STATES.PLAYING, initialValue: false })

  const playingIcon = useMemo(() =>
    playing ?
      "pause" :
      "play_arrow"
    , [])

  return (
    <div className="player-controls">
      <ul>
        <li
          onClick={() => setPlaying(!playing)}>
          <i className="material-icons">
            {playingIcon}
          </i>
        </li>
        <li>
          <i className="material-icons">
            fast_rewind
          </i>
        </li>
        <li>
          <i className="material-icons">
            fast_forward
          </i>
        </li>
        <li>
          <i className="material-icons">
            add
          </i>
        </li>
        <li>
          <i className="material-icons">
            remove
          </i>
        </li>
        <li>
          <i className="material-icons">
            skip_previous
          </i>
        </li>
        <li>
          <i className="material-icons">
            skip_next
          </i>
        </li>
        <li>
          <i className="material-icons">
            keyboard_arrow_down
          </i>
        </li>
        <li>
          <i className="material-icons">
            keyboard_arrow_up
          </i>
        </li>
        <li>
          <i className="material-icons">
            volume_up
          </i>
        </li>
      </ul>
    </div>
  )
}