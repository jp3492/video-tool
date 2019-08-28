import React, { useState } from 'react'
import './folder-form.scss'

import { createForm, Form, StyleTypeEnum, submitForm } from '@piloteers/react-form'

import { Folders } from '../../folders/folders'

const FormName = "folderForm"

const form = createForm({
  name: FormName,
  submitLabel: "Submit",
  formFields: {
    label: {
      label: "Folder Name",
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
  const [folder, setFolder] = useState(props.selectedFolderId)

  const {
    folders,
    selectedFolderId,
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
    <div className="folder-form">
      <Folders
        initialSelectedFolder={selectedFolderId}
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