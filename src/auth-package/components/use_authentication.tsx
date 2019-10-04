import React, { useState, useEffect } from 'react'

import { AuthForm } from './auth_form'
import { StatusEnum } from '../models/enums'
import { refreshSession } from '../methods'

export let user: any = localStorage.getItem("piloteers-user") || {}
export let username: string = ""
export let auth_status: StatusEnum = StatusEnum[localStorage.getItem("piloteers-authStatus") || StatusEnum.SIGNED_OUT]

let configure_status: boolean = false
let auth_subscriptions: any[] = []
let auth_error: string = ""

export const updateUserName = name => {
  username = name
}
export const updateConfigureStatus = status => {
  configure_status = status
}
export const updateUser = userObj => {
  user = userObj.attributes.sub
  localStorage.setItem("piloteers-user", userObj.attributes.sub)
}
export const updateError = error => {
  auth_error = error
  return auth_subscriptions.forEach(s => s({ auth: auth_status, error }))
}
export const updateStatus = auth => {
  auth_status = auth
  localStorage.setItem("piloteers-authStatus", auth)
  return auth_subscriptions.forEach(s => s({ auth, error: auth_error }))
}

export const useAuthentication = () => {
  const [status, setStatus] = useState({
    auth: auth_status,
    error: auth_error
  })

  useEffect(() => {
    if (!auth_subscriptions.includes(setStatus)) {
      auth_subscriptions = [
        ...auth_subscriptions,
        setStatus
      ]
    }
    refreshSession()
    return () => {
      auth_subscriptions = auth_subscriptions.filter(s => s !== setStatus)
    }
  }, [])

  const AuthInterface = () => (
    <AuthForm
      status={status} />
  )

  if (!configure_status) {
    console.error("Authentication has not been configured.")
    return {
      status: "NOT_CONFIGURED",
      AuthInterface: () => null
    }
  }

  return {
    user,
    status: status.auth,
    AuthInterface
  }
}