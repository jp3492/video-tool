import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import './style/variables.css'
import './style/global.scss'

import { setApis, configure } from '@piloteers/react-authentication'

ReactDOM.render(<App />, document.getElementById('root'))
