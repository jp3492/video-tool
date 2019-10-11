import React, { useMemo } from 'react'
import './app.scss'
import { Router } from '@reach/router'

import Modal from './components/modal/modal'
import { Header } from './components/header/header'

import { Management, Player, Users } from './pages'

import { initializeStores } from '@piloteers/react-state'
import { useAuthentication, AuthStatusEnum, signOut } from './auth-package'
import { stores } from './state/stores'
import { PreviewPlayer } from './components/preview-player/preview-player'

import { getUser, getProjects, getFolders, getRequests } from './state/actions'
import { Requests } from './pages/requests/requests'

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
  },
  {
    label: "Notifications",
    to: "/requests",
    icon: "notifications"
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

  useMemo(() => status === AuthStatusEnum.SIGNED_IN &&
    getUser(user).then(user => {
      if (user.status === "CONFIRMED") {
        getFolders()
        getProjects()
        getRequests()
      } else {
        alert("Your account has not been confirmed.")
      }
    })
    , [status])


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
          <Header exact path="/requests" {...headerProps} components={components} />
        </Router>
        <div className="app__content">
          <Router>
            <Management exact path="/" />
            <Users exact path="/users" />
            <Requests exact path="/requests" />
            <Player exact path="/player" />
          </Router>
          <PreviewPlayer />
        </div>
      </div>
    )
}

export default App
