import React from 'react'
import './tabs.scss'

import { PLAYER_STATES } from '../states'
import { quantumState } from '@piloteers/react-state'

const tabs = [
  "https://www.youtube.com/watch?v=misuBLLSQXE",
  "https://www.youtube.com/watch?v=A2JCoIGyGxc",
  "https://www.youtube.com/watch?v=pfoDwRaDNjQ",
  "https://www.youtube.com/watch?v=DSsg17QrYP4"
]

export const Tabs = () => {
  const [tabsEnabledStatus, setTabsEnabledStatus] = quantumState({ id: PLAYER_STATES.TABS_ENABLED_STATUS, initialValue: tabs.reduce((res, t) => ({ ...res, [t]: true }), {}) })

  return (
    <div className="player-tabs">
      <ul>
        {
          tabs.map((t, i) => (
            <li>
              <i
                onClick={() => setTabsEnabledStatus({ ...tabsEnabledStatus, [t]: !tabsEnabledStatus[t] })}
                className="material-icons">
                {
                  tabsEnabledStatus[t] ?
                    "radio_button_checked" :
                    "radio_button_unchecked"
                }
              </i>
              <label>
                {`Video ${i}`}
              </label>
              <i className="material-icons">
                more_vert
              </i>
            </li>
          ))
        }
      </ul>
    </div>
  )
}