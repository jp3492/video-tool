import React, { useMemo, useEffect } from 'react'
import './app.scss'
import { Router } from '@reach/router'

import Modal from './components/modal/modal'
import { Header } from './components/header/header'

import { Management, Player, Users } from './pages'

import { initializeStores, quantumReducer } from '@piloteers/react-state'
import { useAuthentication, AuthStatusEnum, signOut } from '@piloteers/react-authentication'
import { stores } from './state/stores'

import { REDUCERS } from './state/stores'
import { requests } from './state/requests'

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
  const { status, AuthInterface } = useAuthentication()
  const { actions: { ACTION: FOLDER_ACTION } } = quantumReducer({ id: REDUCERS.FOLDERS, connect: false })
  const { actions: { ACTION: PROJECT_ACTION } } = quantumReducer({ id: REDUCERS.PROJECTS, connect: false })

  useMemo(() => {
    if (status === AuthStatusEnum.SIGNED_IN) {
      FOLDER_ACTION(requests.folders.get)
      PROJECT_ACTION(requests.projects.get)
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
        </div>
      </div>
    )
}

export default App
