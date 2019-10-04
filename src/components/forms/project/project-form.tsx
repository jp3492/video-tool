import React, { useState } from 'react'
import './project-form.scss'
import ReactPlayer from 'react-player'
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
    }
  }
})

export default props => {
  const [folder, setFolder] = useState(props.selectedFolder)
  const [links, setLinks]: [any, any] = useState(props.initialValues ? props.initialValues.links : [])

  const {
    folders,
    selectedFolderId,
    action,
    initialValues
  } = props
  console.log(props);

  const handleSubmit = values => action({ ...values, folder, links }, initialValues ? initialValues._id : undefined)

  const handleLinkAdded = url =>
    ReactPlayer.canPlay(url) ?
      links.every(l => l.url !== url) &&
      setLinks([...links, { url, label: "" }]) :
      alert("Url doesnt contain supported video")

  const changeLinkLabel = (url, label) => setLinks(links.map(l => l.url === url ? { ...l, label } : l))

  const removeLink = url => setLinks(links.filter(l => l.url !== url))

  return (
    <div className="project-form">
      <Folders
        initialSelectedFolder={selectedFolderId}
        onChange={folder => setFolder(folder)}
        folders={folders} />
      <Form
        styleType={StyleTypeEnum.MATERIAL_OUTLINED}
        onSubmit={handleSubmit}
        initialValues={initialValues || {}}
        {...form} />
      <input type="text" placeholder="Paste Video Link" onChange={({ target: { value } }) => handleLinkAdded(value)} value="" />
      <ul className="project-form__links">
        {
          links.map((l, i) => (
            <li key={i}>
              <input placeholder="Video Name" type="text" value={l.label} onChange={({ target: { value } }) => changeLinkLabel(l.url, value)} />
              <label>
                {l.url}
              </label>
              <i
                onClick={() => removeLink(l.url)}
                className="material-icons">
                clear
              </i>
            </li>
          ))
        }
      </ul>
      <a
        onClick={() => submitForm(FormName)}
        className="button">
        Submit
      </a>
    </div>
  )
}