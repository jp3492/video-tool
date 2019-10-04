import React, { useState, useMemo, memo, useCallback, useEffect } from 'react'

import './header.scss'

import { Link } from '@reach/router'

import { SearchBar } from './searchbar'

interface iMenuItem {
  label: string,
  to: string,
  icon?: string
}

interface iComponent {
  label?: string,
  icon?: string,
  headerComponent?: any,
  contentComponent?: any
}

interface iHeader {
  logo?: string,
  navItems?: iMenuItem[],
  components?: iComponent[],
  [key: string]: any
}

export const Header = ({
  logo,
  navItems,
  components
}: iHeader) => {
  const [open, setOpen] = useState(false)
  const [selectedTab, selectTab] = useState(navItems && navItems.length !== 0 ? "nav" : components && components.length !== 0 ? components[0].label : "")

  const mobileTabs = useMemo(() => {
    const nav = navItems && navItems.length !== 0 ? [
      {
        label: "nav",
        icon: "list"
      }
    ] : []
    const menu = components && components.length !== 0 ? components : []
    return [...nav, ...menu].map(i => ({ ...i, selectTab, selected: selectedTab === i.label }))
  }, [navItems, components, selectedTab])

  const DropComponentContent = useMemo(() => {
    const contentComponent = components && components.find(c => c.label === selectedTab)
    if (contentComponent) {
      return contentComponent.contentComponent
    }
    return () => null
  }, [selectedTab])

  return (
    <header id="header">
      <img
        src={logo}
        height="50px"
        width="auto" />
      <SearchBar />
      <i
        data-menu-icon-open={open}
        onClick={() => setOpen(!open)}
        className="material-icons">
        {open ? "close" : "menu"}
      </i>
      <div
        className="header__navigation"
        data-mobile-menu-open={open}
        data-mobile-nav-selected={selectedTab === "nav"}>
        <ul className="header__drop-header">
          {
            mobileTabs.map(MobileTab)
          }
        </ul>
        <nav className="header__nav">
          <ul>
            {
              navItems &&
              navItems.map(MenuItem)
            }
          </ul>
        </nav>
        <menu className="header__menu">
          <ul>
            {
              components &&
              components.map(Component)
            }
          </ul>
        </menu>
        <div className="header__drop-component-content">
          <DropComponentContent />
        </div>
      </div>
    </header>
  )
}

const MobileTab = ({
  label,
  icon,
  selected,
  selectTab
}: {
  label?: string,
  icon?: string,
  selected: boolean,
  selectTab: Function
}) => (
    <li
      key={String(label) + icon}
      data-mobile-tab-selected={selected}
      onClick={() => selectTab(label)}>
      <i className="material-icons">
        {icon}
      </i>
    </li>
  )

const Component = ({
  label,
  icon,
  headerComponent
}: iComponent) => {
  const HeaderComponent = headerComponent

  return (
    <li key={String(label) + icon}>
      {
        !!headerComponent ?
          <HeaderComponent /> :
          <>
            <i className="material-icons">
              {icon}
            </i>
            <label>
              {label}
            </label>
          </>
      }
    </li>
  )
}
const MenuItem = ({
  label,
  to,
  icon
}: iMenuItem) => (
    <li key={label}>
      <Link to={to}>
        <i className="material-icons">
          {icon}
        </i>
        {/* <label>
          {label}
        </label> */}
      </Link>
    </li>
  )