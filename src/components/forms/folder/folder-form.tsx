import React from 'react'
import { createForm, Form, StyleTypeEnum } from '@piloteers/react-form'

const form = createForm({
  name: "Folder Form",
  submitLabel: "Submit",
  formFields: {
    label: {
      label: "Folder Name",
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
    <div className="folder-form">
      <Form
        styleType={StyleTypeEnum.MATERIAL_OUTLINED}
        {...form} />
    </div>
  )
}