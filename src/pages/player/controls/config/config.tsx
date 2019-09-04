import React, { useState, useEffect, useCallback } from 'react'
import './config.scss'

import { quantumState } from '@piloteers/react-state'
import { PLAYER_STATES, KEY_ACTIONS } from '../../states'

export const PlayerConfig = () => {
  const [popupOpen, setPopupOpen] = quantumState({ id: PLAYER_STATES.PLAYER_CONFIGURATION_OPEN, initialValue: false })
  const [playerConfiguration, setPlayerConfiguration] = quantumState({ id: PLAYER_STATES.PLAYER_CONFIGURATION })
  const [selectedAction, setSelectedAction] = useState("")

  const handleKeyDown = (action, key, ctrl) => {
    const usedAction = Object.keys(playerConfiguration).find(action => playerConfiguration[action].key === key && playerConfiguration[action].ctrl === ctrl)
    if (!usedAction) {
      setPlayerConfiguration({ ...playerConfiguration, [action]: { key, ctrl } })
    } else {
      const confirmed = prompt(`Action: ${usedAction}`)
    }

  }

  return (
    <div className="player-config">
      <i
        onClick={() => setPopupOpen(!popupOpen)}
        className="material-icons">
        apps
      </i>
      <div data-player-config-open={popupOpen} className="player-config__popup">
        <ul>
          <li data-action-selected={selectedAction === KEY_ACTIONS.PLAY}>
            <i className="material-icons">
              play_arrow
            </i>
            <input
              onKeyDown={e => handleKeyDown(KEY_ACTIONS.PLAY, e.which || e.keyCode, e.ctrlKey)}
              onBlur={() => selectedAction === KEY_ACTIONS.PLAY && setSelectedAction("")}
              onFocus={() => setSelectedAction(KEY_ACTIONS.PLAY)} />
          </li>
          <li data-action-selected={selectedAction === KEY_ACTIONS.VIDEO_PREV}>
            <i className="material-icons">
              keyboard_arrow_left
            </i>
            <input
              onKeyDown={e => handleKeyDown(KEY_ACTIONS.VIDEO_PREV, e.which || e.keyCode, e.ctrlKey)}
              onBlur={() => selectedAction === KEY_ACTIONS.VIDEO_PREV && setSelectedAction("")}
              onFocus={() => setSelectedAction(KEY_ACTIONS.VIDEO_PREV)} />
          </li>
        </ul>
      </div>
    </div>
  )
}