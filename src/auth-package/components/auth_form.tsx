import React, { useState, memo } from 'react'
import './style.css'

import { Form } from './forms/form'
import { addIdsToObject } from './forms/utils'
import { getTranslation } from '../services/translation'

import { ViewEnum, StatusEnum } from '../models/enums'
import { iInterface, IdentityAttributes } from '../models/interfaces'
import { signIn, signUp, completePassword, forgotPassword, forgotPasswordSubmit, changePassword, confirm } from '../methods'

import { username } from './use_authentication'

let interfaceConfig: iInterface = {
  identifyWith: IdentityAttributes.email,
  requiredAttributes: [],
  disableViews: [],
  language: "en-US"
}

export const configureInterface = (config: iInterface) => {
  interfaceConfig = config
  setFieldsByStatus()
}

const config = ({
  name,
  description,
  mfaType = null
}) => addIdsToObject({
  name,
  description,
  submitLabel: getTranslation("submit", interfaceConfig.language, "label"),
  formFields: {
    email: {
      label: getTranslation("email", interfaceConfig.language, "label"),
      placeholder: getTranslation("email", interfaceConfig.language, "placeholder"),
      type: "input",
      inputType: "email",
      validation: {
        required: true
      },
      hidden: true
    },
    username: {
      label: getTranslation("username", interfaceConfig.language, "label"),
      placeholder: getTranslation("username", interfaceConfig.language, "placeholder"),
      type: "input",
      inputType: "text",
      validation: {
        required: true
      },
      hidden: true
    },
    phone_number: {
      label: getTranslation("phone_number", interfaceConfig.language, "label"),
      placeholder: getTranslation("phone_number", interfaceConfig.language, "placeholder"),
      type: "input",
      inputType: "number",
      hidden: true
    },
    password: {
      label: getTranslation("password", interfaceConfig.language, "label"),
      placeholder: getTranslation("password", interfaceConfig.language, "placeholder"),
      type: "input",
      inputType: "password",
      validation: {
        required: true
      },
      hidden: true
    },
    mfaType: {
      type: "input",
      inputType: "text",
      defaultValue: mfaType,
      hidden: true
    },
    mfaCode: {
      label: "MFA-Code",
      type: "input",
      inputType: "text",
      validation: {
        required: true
      },
      hidden: true
    },
    new_password: {
      label: getTranslation("new_password", interfaceConfig.language, "label"),
      placeholder: getTranslation("new_password", interfaceConfig.language, "placeholder"),
      type: "input",
      inputType: "password",
      validation: {
        required: true
      },
      hidden: true
    },
    code: {
      label: "Code",
      type: "input",
      inputType: "text",
      validation: {
        required: true
      },
      hidden: true
    }
  }
})

let fieldsByStatus = {}

const setFieldsByStatus = () => {
  fieldsByStatus = {
    [ViewEnum.SIGN_UP]: [
      interfaceConfig.identifyWith,
      ...interfaceConfig.requiredAttributes,
      "password"
    ],
    [ViewEnum.SIGN_IN]: [
      interfaceConfig.identifyWith,
      "password"
    ],
    [ViewEnum.FORGOT_PASSWORD]: [
      interfaceConfig.identifyWith
    ],
    [ViewEnum.COMPLETE_PASSWORD]: [
      "new_password"
    ],
    [ViewEnum.MFA]: [
      "mfaCode"
    ],
    [ViewEnum.CONFIRM]: [
      "code"
    ],
    [ViewEnum.FORGOT_PASSWORD_SUBMIT]: [
      "code",
      "new_password"
    ]
  }
}

const statusToView = {
  [StatusEnum.SIGNED_OUT]: ViewEnum.SIGN_IN,
  [StatusEnum.SMS_MFA]: ViewEnum.MFA,
  [StatusEnum.SOFTWARE_TOKEN_MFA]: ViewEnum.MFA,
  [StatusEnum.NEW_PASSWORD_REQUIRED]: ViewEnum.COMPLETE_PASSWORD,
  [StatusEnum.CONFIRMATION_REQUIRED]: ViewEnum.CONFIRM,
  [StatusEnum.PASSWORD_RESETTED]: ViewEnum.FORGOT_PASSWORD_SUBMIT,
  [StatusEnum.SIGNED_IN]: ViewEnum.IDLE
}

const actionByView = {
  SIGN_IN: signIn,
  SIGN_UP: signUp,
  MFA: val => console.log(val),
  COMPLETE_PASSWORD: completePassword,
  FORGOT_PASSWORD: forgotPassword,
  CHANGE_PASSWORD: changePassword,
  CONFIRM: values => confirm({ ...values, username }),
  FORGOT_PASSWORD_SUBMIT: values => forgotPasswordSubmit({ ...values, username })
}

const linksByView = view => {
  let links
  switch (view) {
    case ViewEnum.SIGN_IN: links = [ViewEnum.SIGN_UP, ViewEnum.FORGOT_PASSWORD]
      break;
    case ViewEnum.SIGN_UP: links = [ViewEnum.SIGN_IN]
      break;
    case ViewEnum.CHANGE_PASSWORD: links = []
      break;
    default: links = [ViewEnum.SIGN_IN]
      break;
  }
  return links.filter(l => !interfaceConfig.disableViews.includes(l))
}

const trimValues = (fields, values) =>
  Object.keys(values).reduce((res, v) =>
    fields.includes(v) ? { ...res, [v]: values[v] } : res, {})

const ensureUsername = values => {
  if (interfaceConfig.identifyWith === IdentityAttributes.email) {
    const {
      email,
      ...removedEmail
    } = values
    return {
      ...removedEmail,
      username: values.email
    }
  }
}

export const AuthForm = memo((props: any) => {
  const [view, setView] = useState(statusToView[props.status.auth])
  const [loading, setLoading] = useState(false)

  if (view === ViewEnum.IDLE) {
    return null
  }

  const formProps = config({
    name: getTranslation(view, interfaceConfig.language, 'header'),
    description: ""
  })

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      await actionByView[view](ensureUsername(trimValues(fieldsByStatus[view], values)))
    } catch (error) {
      setLoading(false)
      console.error(error)
    }
  }

  return (
    <div className="ptf__authentication__form">
      {/* maybe a different header */}
      <Form
        onSubmit={handleSubmit}
        visibleFields={fieldsByStatus[view]}
        loading={loading}
        {...formProps} />
      <ul>
        {
          linksByView(view).map((l, i) => (
            <li
              onClick={() => setView(l)}
              key={i}>
              {getTranslation(l, interfaceConfig.language, 'link')}
            </li>
          ))
        }
      </ul>
      <label>
        {props.status.error}
      </label>
    </div>
  )
})