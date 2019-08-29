import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import './style/variables.css'
import './style/global.scss'

import { setApis, configure, IdentityAttributesEnum, UserAttributesEnum, InterfaceViewEnum } from '@piloteers/react-authentication'

import { apis, COGNITO } from './config'

configure({
  cognito: {
    ...COGNITO,
    Analytics: {
      disabled: true
    }
  },
  interface: {
    identifyWith: IdentityAttributesEnum.email,
    requiredAttributes: [UserAttributesEnum.email],
    disableViews: [InterfaceViewEnum.SIGN_UP, InterfaceViewEnum.FORGOT_PASSWORD],
    language: "de-DE"
  }
});

setApis(apis)

ReactDOM.render(<App />, document.getElementById('root'))
