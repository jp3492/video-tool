import React, { useState } from 'react'
import './project-form.scss'

import { createForm, Form, StyleTypeEnum, submitForm } from '@piloteers/react-form'

import { Folders } from '../../folders/folders'

const FormName = "projectForm"

const form = createForm({
  name: FormName,
  submitLabel: "Submit",
  formFields: {
    label: {
      label: "Project Name",
      type: "input",
      inputType: "text",
      validation: {
        required: true
      }
    },
    description: {
      label: "Description",
      type: "input",
      inputType: "text"
    },
    tags: {
      label: "Tags",
      type: "array",
      inputType: "text"
    }
  }
})

export default props => {
  const [folder, setFolder] = useState(props.selectedFolder)
  const {
    folders,
    selectedFolder,
    action,
    initialValues
  } = props

  const handleSubmit = values => {
    action({
      ...values,
      folder
    })
  }

  return (
    <div className="project-form">
      <Folders
        initialSelectedFolder={selectedFolder}
        onChange={folder => setFolder(folder)}
        folders={folders} />
      <Form
        styleType={StyleTypeEnum.MATERIAL_OUTLINED}
        onSubmit={handleSubmit}
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