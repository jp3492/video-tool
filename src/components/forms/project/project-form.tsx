import React from 'react'
import { createForm, Form, StyleTypeEnum } from '@piloteers/react-form'

const form = createForm({
  name: "Project Form",
  submitLabel: "Submit",
  formFields: {
    label: {
      label: "Project Name",
      type: "input",
      inputType: "text",
      validation: {
        required: true
      }
    }
  }
})

export default () => {

  return (
    <div className="project-form">
      <Form
        styleType={StyleTypeEnum.MATERIAL_OUTLINED}
        {...form} />
    </div>
  )
}