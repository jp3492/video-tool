import React, { useState } from 'react'
import './video.scss'

import { Link } from '../types'
import { quantumState } from '@piloteers/react-state'
import { PLAYER_STATES } from '../states'
import { TAB_LOADING_STATUS } from '../types'
import ReactPlayer from 'react-player';

export const Video = ({
  links
}: {
  links: Link[]
}) => {
  const [linksLoadingStatus, setLinksLoadingStatus] = quantumState({ id: PLAYER_STATES.TABS_LOADING_STATUS, initialValue: links.reduce((res, l) => ({ ...res, [l.url]: TAB_LOADING_STATUS.LOADING }), {}) })
  const [selectedTab] = quantumState({ id: PLAYER_STATES.TAB_SELECTED, initialValue: links[0].url || "" })

  const updateLinkStatus = (url, status) => setLinksLoadingStatus({ ...linksLoadingStatus, [url]: status })

  return (
    <div className="player-video">
      {
        links.map(l => (
          <Player
            {...l}
            updateLinkStatus={updateLinkStatus}
            selected={selectedTab === l.url} />
        ))
      }
    </div>
  )
}

const Player = ({
  url,
  label,
  updateLinkStatus,
  selected
}: {
  url: string,
  label: string,
  updateLinkStatus: Function,
  selected: boolean
}) => {

  return (
    <ReactPlayer
      url={url}
      onReady={() => updateLinkStatus(url, TAB_LOADING_STATUS.READY)} />
  )
}