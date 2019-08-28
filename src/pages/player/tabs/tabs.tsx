import React from 'react'
import './tabs.scss'

const tabs = [
  "https://www.youtube.com/watch?v=misuBLLSQXE",
  "https://www.youtube.com/watch?v=A2JCoIGyGxc",
  "https://www.youtube.com/watch?v=pfoDwRaDNjQ",
  "https://www.youtube.com/watch?v=DSsg17QrYP4"
]

export const Tabs = () => {

  return (
    <div className="player-tabs">
      <ul>
        {
          tabs.map((t, i) => (
            <li>
              {`Video ${i}`}
            </li>
          ))
        }
      </ul>
    </div>
  )
}