import React from 'react'
import './tabs.scss'

interface Tab {
  label?: string,
  icon?: string
}

interface iTabs {
  tabs: Tab[],
  selectedTab: string,
  selectTab: Function
}

export const Tabs = ({
  tabs,
  selectedTab,
  selectTab
}: iTabs) => {

  return (
    <ul className="tabs">
      {
        tabs.map(({
          label,
          icon
        }: Tab) => (
            <li
              onClick={() => selectTab(label)}
              data-tab-selected={label === selectedTab}>
              <i className="material-icons">
                {icon}
              </i>
              <label>
                {label}
              </label>
            </li>
          ))
      }
    </ul>
  )
}