import React, { useState } from 'react'
import './playlist.scss'

import { PLAYER_STATES } from '../states'
import { quantumState } from '@piloteers/react-state'

export const Playlist = () => {
  const [playlistOpen, setPlaylistOpen] = quantumState({ id: PLAYER_STATES.PLAYLIST_OPEN })
  console.log(playlistOpen);

  const [search, setSearch] = useState("")
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
          Array(20).fill(null).map(i => (<Item />))
        }
      </ul>
    </div>
  )
}

const Item = () => {

  return (
    <li>
      <div>
        <label>
          Video 1
            </label>
        <span>
          12.04s - 23.23s
            </span>
        <i className="material-icons">
          check_box_outline_blank
            </i>
      </div>
      <div>
        <p>
          Hier kommt der kommentar zu dieser bestimmten stelle hin den man später isoliert finden und kopieren kann...
            </p>
        <i className="material-icons">
          more_vert
            </i>
      </div>
    </li>
  )
}