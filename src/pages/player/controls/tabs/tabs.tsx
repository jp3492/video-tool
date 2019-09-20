import React, { useEffect } from 'react'
import './tabs.scss'

import { quantumState } from '@piloteers/react-state'
import { PLAYER_STATES, KEY_ACTIONS } from '../../states'
import { TAB_LOADING_STATUS } from '../../types'

import { Link } from '../../types'
import { setActiveTab } from '../../useTime'

export const Tabs = ({
  links
}: {
  links: Link[]
}) => {
  const [tabsEnabledStatus, setTabsEnabledStatus] = quantumState({ id: PLAYER_STATES.TABS_ENABLED_STATUS, initialValue: links.reduce((res, t) => ({ ...res, [t.url]: true }), {}) })
  const [linksLoadingStatus, setLinksLoadingStatus] = quantumState({ id: PLAYER_STATES.TABS_LOADING_STATUS })
  const [selectedTab, setSelectedTab] = quantumState({ id: PLAYER_STATES.TAB_SELECTED })
  const [keyAction, setKeyAction] = quantumState({ id: PLAYER_STATES.KEY_ACTION })

  useEffect(() => {
    if (keyAction.action === KEY_ACTIONS.VIDEO_PREV || keyAction.action === KEY_ACTIONS.VIDEO_NEXT) {
      const currentIndex = links.findIndex(l => l.url === selectedTab)
      const nextIndex =
        keyAction.action === KEY_ACTIONS.VIDEO_PREV ?
          currentIndex === 0 ?
            links.length - 1 :
            currentIndex - 1 :
          currentIndex === links.length - 1 ?
            0 :
            currentIndex + 1
      setSelectedTab(links[nextIndex].url)
    }
  }, [keyAction])

  const handleSelectTab = url => {
    setActiveTab(url)
    setSelectedTab(url)
  }

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
                  onClick={() => handleSelectTab(url)}>
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