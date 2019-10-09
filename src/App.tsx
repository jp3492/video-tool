import React, { useMemo, useEffect } from 'react'
import './app.scss'
import { Router } from '@reach/router'

import Modal from './components/modal/modal'
import { Header } from './components/header/header'

import { Management, Player, Users } from './pages'

import { initializeStores, quantumReducer, quantumState } from '@piloteers/react-state'
import { useAuthentication, AuthStatusEnum, signOut } from './auth-package'
import { stores } from './state/stores'

import { REDUCERS } from './state/stores'
import { requests } from './state/requests'
import { PreviewPlayer } from './components/preview-player/preview-player'

initializeStores(stores)

const navItems = [
  {
    label: "My Place",
    to: "/",
    icon: "apps"
  },
  {
    label: "Manage Users",
    to: "/users",
    icon: "people"
  }
]

const components = [
  {
    headerComponent: () => <div onClick={() => signOut()}>Logout</div>
  }
]

const headerProps = {
  logo: "https://placeholder.com/wp-content/uploads/2018/10/placeholder.com-logo1.png",
  navItems: navItems
}

const App: React.FC = () => {
  const { user, status, AuthInterface } = useAuthentication()
  const { actions: { ACTION: USER_ACTION } } = quantumReducer({ id: REDUCERS.USERS, connect: false })
  const { actions: { ACTION: FOLDER_ACTION } } = quantumReducer({ id: REDUCERS.FOLDERS, connect: false })
  const { actions: { ACTION: PROJECT_ACTION } } = quantumReducer({ id: REDUCERS.PROJECTS, connect: false })
  const { actions: { ACTION: REQUEST_ACTION } } = quantumReducer({ id: REDUCERS.REQUESTS, connect: false })
  const [me, setMe] = quantumState({ id: "ME", initialValue: {}, returnValue: false })
  useMemo(() => {
    if (status === AuthStatusEnum.SIGNED_IN) {
      USER_ACTION({ ...requests.users.getSingle, url: requests.users.getSingle.url + user }).then(user => {
        setMe(user)
        if (user.status === "CONFIRMED") {
          FOLDER_ACTION(requests.folders.get)
          PROJECT_ACTION(requests.projects.get)
          REQUEST_ACTION(requests.requests.get)
        } else {
          alert("Your account has not been confirmed.")
        }
      })
    }
  }, [status])


  return status !== AuthStatusEnum.SIGNED_IN ?
    <div className="auth_wrapper">
      <AuthInterface />
    </div> :
    (
      <div className="app">
        <Modal />
        <Router>
          <Header exact path="/" {...headerProps} components={components} />
          <Header exact path="/users" {...headerProps} components={components} />
        </Router>
        <div className="app__content">
          <Router>
            <Management exact path="/" />
            <Users exact path="/users" />
            <Player exact path="/player" />
          </Router>
          <PreviewPlayer />
        </div>
      </div>
    )
}

export default App
