import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import './style/variables.css'
import './style/global.scss'

import { setApis, configure } from '@piloteers/react-authentication'

import { apis } from './config'

configure({
  cognito: {
    aws_project_region: 'eu-central-1',
    aws_appsync_region: 'eu-central-1',
    aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
    aws_cognito_region: 'eu-central-1',
    aws_user_pools_id: 'eu-central-1_ogNKhjKez',
    aws_user_pools_web_client_id: 'sln319u6dbh2amp919s5rq2ba',
    Analytics: {
      disabled: true
    }
  }
});

setApis(apis)

ReactDOM.render(<App />, document.getElementById('root'))
