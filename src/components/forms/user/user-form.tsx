import React from 'react'

import { createForm, Form, StyleTypeEnum, submitForm } from '@piloteers/react-form'

const FormName = "userForm"

const form = createForm({
  name: FormName,
  submitLabel: "",
  formFields: {
    firstName: {
      label: "First Name",
      type: "input",
      inputType: "text"
    },
    lastName: {
      label: "Last Name",
      type: "input",
      inputType: "text"
    },
    email: {
      label: "Email",
      type: "input",
      inputType: "email"
    }
  }
})

export default props => {
  const {
    folders,
    selectedFolder,
    action,
    initialValues
  } = props

  return (
    <div>
      <Form
        styleType={StyleTypeEnum.MATERIAL_OUTLINED}
        onSubmit={action}
        initialValues={initialValues || {}}
        {...form} />
      <a
        onClick={() => submitForm(FormName)}
        className="button">
        Submit
      </a>
    </div>
  )
}