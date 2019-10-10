import React, { memo, useRef, useState, useEffect } from 'react'
import './preview-player.scss'

import { quantumState } from '@piloteers/react-state'
import ReactPlayer from 'react-player'

export const PreviewPlayer = memo(() => {
  const [tag, setTag] = quantumState({ id: "PREVIEW", initialValue: {} })
  const [playing, setPlaying] = useState(true)
  const player: any = useRef(null)

  useEffect(() => {
    setPlaying(true)
  }, [tag])

  if (Object.keys(tag).length === 0) {
    return null
  }

  const {
    url,
    text,
    start,
    end,
    videoName
  } = tag


  return (
    <div className="preview-player">
      <div>
        <label>
          {`${videoName} > ${text}`}
        </label>
        <i
          onClick={() => {
            player.current.seekTo(start)
            setPlaying(true)
          }}
          className="material-icons">
          replay
        </i>
        <i className="material-icons">
          remove
        </i>
        <i
          onClick={() => setTag({})}
          className="material-icons">
          close
        </i>
      </div>
      <ReactPlayer
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        url={url}
        playing={playing}
        progressInterval={100}
        controls={true}
        onProgress={e => {
          if (e.playedSeconds.toFixed(2) >= end) {
            setPlaying(false)
          }
        }}
        onReady={() => {
          player.current.seekTo(start)
        }}
        ref={p => { player.current = p }} />
    </div>
  )
})