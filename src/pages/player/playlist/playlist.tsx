import React, { useState, useMemo } from 'react'
import './playlist.scss'

import { PLAYER_STATES } from '../states'
import { quantumState, quantumReducer } from '@piloteers/react-state'
import { REDUCERS } from '../../../state/stores'

export const Playlist = () => {
  const { state: { data: tags }, actions: { ACTION } } = quantumReducer({ id: REDUCERS.TAGS })
  const [playlistOpen, setPlaylistOpen] = quantumState({ id: PLAYER_STATES.PLAYLIST_OPEN })
  const [players] = quantumState({ id: PLAYER_STATES.VIDEO_PLAYERS })
  const [selectedTab, setSelectedTab] = quantumState({ id: PLAYER_STATES.TAB_SELECTED, returnValue: false })
  const [playing, setPlaying] = quantumState({ id: PLAYER_STATES.PLAYING })

  const [search, setSearch] = useState("")

  const handleSelectTag = (url, start) => {
    const activePlayer = players[url]
    setSelectedTab(url)
    activePlayer.seekTo(start, 'seconds')
    if (!playing) {
      setPlaying(true)
    }
  }

  return (
    <div
      data-playlist-open={playlistOpen}
      className="player-playlist">
      <div className="player-playlist__header">
        <input placeholder="Search.." value={search} onChange={({ target: { value } }) => setSearch(value)} />
        <i className="material-icons">
          filter_list
        </i>
      </div>
      <ul className="player-playlist__list">
        {
          tags.map((i, ind) => <Item key={ind} {...i} handleSelectTag={handleSelectTag} />)
        }
      </ul>
    </div>
  )
}

const Item = ({
  text,
  start,
  end,
  url,
  handleSelectTag
}: {
  text: string,
  start: number,
  end: number,
  url: string,
  handleSelectTag: Function
}) => {

  return (
    <li onClick={() => handleSelectTag(url, start)}>
      <div>
        <label>
          Video 1
            </label>
        <span>
          {`${start} - ${end}`}
        </span>
        <i className="material-icons">
          check_box_outline_blank
            </i>
      </div>
      <div>
        <p>
          {text}
        </p>
        <i className="material-icons">
          more_vert
            </i>
      </div>
    </li>
  )
}