import React, { useEffect } from 'react'
import './player.scss'

import { Input } from './input/input'
import { Controls } from './controls/controls'
import { Playlist } from './playlist/playlist'
import { Tabs } from './tabs/tabs'
import { Video } from './video/video'

export const Player = (props: any) => {

  return (
    <div className="player">
      <div>

        <Video />
        <Tabs />
        <Controls />
        <Input />
      </div>
      <Playlist />
    </div>
  )
}