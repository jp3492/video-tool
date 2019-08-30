import React from 'react'
import './tabs.scss'

import { PLAYER_STATES } from '../states'
import { quantumState } from '@piloteers/react-state'
import { TAB_LOADING_STATUS } from '../types'

import { Link } from '../types'

export const Tabs = ({
  links
}: {
  links: Link[]
}) => {
  const [tabsEnabledStatus, setTabsEnabledStatus] = quantumState({ id: PLAYER_STATES.TABS_ENABLED_STATUS, initialValue: links.reduce((res, t) => ({ ...res, [t.url]: true }), {}) })
  const [linksLoadingStatus, setLinksLoadingStatus] = quantumState({ id: PLAYER_STATES.TABS_LOADING_STATUS })
  const [selectedTab, setSelectedTab] = quantumState({ id: PLAYER_STATES.TAB_SELECTED })

  return (
    <div className="player-tabs">
      <ul>
        {
          links.map(({
            url,
            label,
            status
          }, i) => (
              <li
                data-tab-selected={selectedTab === url}
                key={i}>
                <i
                  onClick={() => setTabsEnabledStatus({ ...tabsEnabledStatus, [url]: !tabsEnabledStatus[url] })}
                  className="material-icons">
                  {
                    tabsEnabledStatus[url] ?
                      "radio_button_checked" :
                      "radio_button_unchecked"
                  }
                </i>
                <label
                  onClick={() => setSelectedTab(url)}>
                  {
                    linksLoadingStatus[url] === TAB_LOADING_STATUS.LOADING ?
                      "Loading.." :
                      label !== "" ? label :
                        `Video ${i}`
                  }
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