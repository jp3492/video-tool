import React, { useState } from "react";
import "./project-form.scss";
import ReactPlayer from "react-player";

import { Folders } from "../../folders/folders";
import { InputField } from "../../inputs/input/input";

const FormName = "projectForm";

export default props => {
  const [folder, setFolder] = useState(props.selectedFolder);
  const [label, setLabel] = useState(props.label);
  const [description, setDescription] = useState(props.description);

  const [links, setLinks]: [any, any] = useState(
    props.initialValues ? props.initialValues.links : []
  );

  const { folders, selectedFolderId, action, initialValues } = props;

  const handleSubmit = () =>
    action({
      links,
      description,
      label,
      folder
    });

  const handleLinkAdded = url =>
    ReactPlayer.canPlay(url)
      ? links.every(l => l.url !== url) &&
        setLinks([...links, { url, label: "" }])
      : alert("Url doesnt contain supported video");

  const changeLinkLabel = (url, label) =>
    setLinks(links.map(l => (l.url === url ? { ...l, label } : l)));

  const removeLink = url => setLinks(links.filter(l => l.url !== url));

  return (
    <div className="project-form">
      <Folders
        initialSelectedFolder={selectedFolderId}
        onChange={folder => setFolder(folder)}
        folders={folders}
      />
      <InputField
        label="Title"
        type="text"
        placeholder="Add title"
        onChange={({ target: { value } }) => setLabel(value)}
        value={label}
      />
      <InputField
        label="Description"
        type="text"
        placeholder="Add description"
        onChange={({ target: { value } }) => setDescription(value)}
        value={description}
      />
      <InputField
        label="Video links"
        className="video-url-drop"
        type="text"
        placeholder="Paste or drop urls..."
        onChange={({ target: { value } }) => handleLinkAdded(value)}
        value={""}
      />
      <ul className="project-form__links">
        {links.map((l, i) => (
          <li key={i}>
            <input
              placeholder="Add video name!"
              type="text"
              value={l.label}
              onChange={({ target: { value } }) =>
                changeLinkLabel(l.url, value)
              }
            />
            <label>{l.url}</label>
            <i onClick={() => removeLink(l.url)} className="material-icons">
              clear
            </i>
          </li>
        ))}
      </ul>
      <a onClick={handleSubmit} className="button">
        Submit
      </a>
    </div>
  );
};
