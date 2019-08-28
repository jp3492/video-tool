import React from 'react'
import { Router } from '@reach/router'

import Modal from './components/modal/modal'
import { Header } from './components/header/header'

import { Management, Player } from './pages'

import { initializeStores } from '@piloteers/react-state'
import { stores } from './state/stores'


initializeStores(stores)

const navItems = [
  {
    label: "Manage",
    to: "/",
    icon: "apps"
  },
  {
    label: "Profile",
    to: "/profile",
    icon: "person"
  }
]

const components = [
  {
    label: "Stars",
    icon: "grade",
    contentComponent: () => <div>All my stars!!</div>
  }
]

const headerProps = {
  logo: "https://placeholder.com/wp-content/uploads/2018/10/placeholder.com-logo1.png",
  navItems: navItems,
  components: components
}

const App: React.FC = () => {
  return (
    <div className="app">
      <Modal />
      <Router>
        <Header exact path="/" {...headerProps} />
      </Router>
      <div className="app__content">
        <Router>
          <Management exact path="/" />
          <Player exact path="/player" />
        </Router>
      </div>
    </div>
  )
}

export default App
