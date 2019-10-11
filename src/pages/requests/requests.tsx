import React, { useMemo, useState } from 'react'
import './requests.scss'

import { quantumState, quantumReducer } from '@piloteers/react-state'
import { REDUCERS } from '../../state/stores'
import { Folders } from '../../components/folders/folders'

const folders = [
  {
    _id: 'user',
    folder: null,
    label: 'Connections'
  },
  {
    _id: 'project',
    folder: null,
    label: 'Project Access'
  },
  {
    _id: 'folder',
    folder: null,
    label: 'Folder Access'
  }
]

export const Requests = (props: any) => {
  const { state: { data: requests } } = quantumReducer({ id: REDUCERS.REQUESTS })
  const [selectedFolder, setSelectedFolder] = useState()

  const connectionRequests = useMemo(() => requests.filter(r => r.type === "user"), [requests])
  const projectRequests = useMemo(() => requests.filter(r => r.type === "project"), [requests])
  const folderRequests = useMemo(() => requests.filter(r => r.type === "folder"), [requests])

  return (
    <div className="requests">
      <div className="requests__sidebar">
        <Folders
          onChange={folder => setSelectedFolder(folder)}
          folders={folders} />
      </div>
      <div className="requests__content">
        {
          !selectedFolder ?
            <>
              <ConnectionRequests requests={connectionRequests} />
              <ProjectRequests requests={projectRequests} />
              <FolderRequests requests={folderRequests} />
            </> :
            selectedFolder === "user" ?
              <ConnectionRequests requests={connectionRequests} /> :
              selectedFolder === "project" ?
                <ProjectRequests requests={projectRequests} /> :
                <FolderRequests requests={folderRequests} />
        }
      </div>
    </div>
  )
}

const Request = ({
  _id,
  accept,
  reject,
  status,
  userEmail,
  fromMe
}) => (
    <li
      key={_id}
      className="requests__content-request">
      <label>
        {
          fromMe ?
            `Sent to ${userEmail}` :
            `Received from ${userEmail}`
        }
      </label>
      <label>
        {status}
      </label>
      <div>
        <i
          onClick={() => accept(_id)}
          className="material-icons">
          done
      </i>
        <i
          onClick={() => reject(_id)}
          className="material-icons">
          clear
      </i>
      </div>
    </li>
  )

const ConnectionRequests = ({
  requests
}) => {

  return (
    <div>
      <h4>
        Connection Requests
      </h4>
      <ul>
        {
          requests.map(Request)
        }
      </ul>
    </div>
  )
}

const ProjectRequests = ({
  requests
}) => {

  return (
    <div>
      <h4>
        Project Requests
      </h4>
      <ul>
        {
          requests.map(Request)
        }
      </ul>
    </div>
  )
}

const FolderRequests = ({
  requests
}) => {

  return (
    <div>
      <h4>
        Folder Requests
      </h4>
      <ul>
        {
          requests.map(Request)
        }
      </ul>
    </div>
  )
}