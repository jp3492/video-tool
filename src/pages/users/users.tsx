import React, { useCallback, useState, useMemo, useEffect } from 'react';
import './users.scss';

import { signUp } from '../../auth-package';
import { quantumState, quantumReducer } from '@piloteers/react-state';
import { REDUCERS } from '../../state/stores';
import { getUsers } from '../../state/actions';
import { MODAL, MODAL_TYPES } from '../../components/modal/modal';

import { requests as allRequests } from '../../state/requests';
import { Tabs } from '../../components/tabs/tabs';
import { Folders } from '../../components/folders/folders';

const requests = allRequests.users;

export const Users = (props: any) => {
  const {
    state: { data: folders }
  } = quantumReducer({ id: REDUCERS.FOLDERS });
  const {
    state: { data: users },
    actions: { ACTION }
  } = quantumReducer({ id: REDUCERS.USERS });
  const [_, openModal] = quantumState({ id: MODAL, returnValue: false });
  const [sideBarOpen, openSideBar] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState();
  const [editingFolder, setEditingFolder] = useState();

  const [selectedUserId, setSelectedUserId] = useState();
  const [search, setSearch] = useState('');

  useEffect(() => {
    // getUsers()
  }, []);

  const postUser = async body => {
    const tempPassword =
      'P' +
      Math.random()
        .toString(36)
        .substring(2, 10) +
      Math.random()
        .toString(36)
        .substring(2, 2);
    await signUp({
      username: body.email,
      password: tempPassword
    });
    ACTION({ ...requests.post, body }).then(() => openModal({}));
  };
  const patchUser = useCallback(
    body => {
      ACTION({
        ...requests.patch,
        url: requests.patch.url + body._id,
        body
      }).then(() => openModal({}));
    },
    [ACTION, openModal]
  );

  // const deleteUser = _id => ACTION({ ...requests.delete, url: requests.delete.url + _id })

  const userModal = useCallback(
    (initialValues?: any) =>
      openModal({
        title: initialValues ? 'Edit User' : 'New User',
        name: MODAL_TYPES.USER_FORM,
        props: {
          selectedUserId,
          action: initialValues ? patchUser : postUser,
          initialValues: initialValues
            ? {
                email: initialValues.email,
                firstName: initialValues.information.firstName,
                lastName: initialValues.information.lastName
              }
            : {}
        }
      }),
    [openModal, selectedUserId, patchUser, postUser]
  );

  const handleEditingFolder = folder => {
    if (editingFolder === folder) {
      setEditingFolder(undefined);
    } else {
      setEditingFolder(folder);
    }
  };

  const selectedUser = useMemo(
    () => users.find(u => u._id === selectedUserId),
    [users, selectedUserId]
  );

  return (
    <div className="users">
      <div data-sidebar-open={sideBarOpen} className="users__sidebar">
        <i onClick={() => openSideBar(!sideBarOpen)} className="material-icons">
          chevron_right
        </i>
        <a onClick={e => userModal()} className="button">
          <i className="material-icons">add</i>
          <label>New Folder</label>
        </a>
        <Folders
          onChange={folder => setSelectedFolderId(folder)}
          setEditingFolder={handleEditingFolder}
          editingFolder={editingFolder}
          folders={folders}
        />
      </div>
      <div className="users__content">
        <div className="users__content-header">
          <input
            type="text"
            value={search}
            onChange={({ target: { value } }) => setSearch(value)}
          />
          <a onClick={() => userModal()} className="button">
            <i className="material-icons">add</i>
            <label>New User</label>
          </a>
        </div>
        <ul>
          <li>
            <label>Name</label>
            <label>Email</label>
            <label>Status</label>
            <label>Permissions</label>
            <label>Connections</label>
            <label>Access</label>
          </li>
          {users.map(u => (
            <User
              {...u}
              selected={u._id === selectedUserId}
              selectUser={() => setSelectedUserId(u._id)}
            />
          ))}
        </ul>
      </div>
      {!!selectedUserId && (
        <UserInformation
          handleEdit={() => userModal(selectedUser)}
          closeInfo={() => setSelectedUserId(undefined)}
          patchUser={patchUser}
          {...selectedUser}
        />
      )}
    </div>
  );
};

const User = ({
  _id,
  email,
  status,
  information,
  access,
  permissions,
  connections,
  selected,
  selectUser
}: {
  _id: string;
  email: string;
  status: string;
  information: any;
  access: any[];
  permissions: string[];
  connections: any[];
  selected: boolean;
  selectUser: any;
}) => {
  return (
    <li data-user-selected={selected} onClick={selectUser}>
      <span>{`${information.firstName} ${information.lastName}`}</span>
      <span>{email}</span>
      <span>{status}</span>
      <span>{permissions.length}</span>
      <span>{connections.length}</span>
      <span>{access.length}</span>
    </li>
  );
};

const tabs = [
  {
    label: 'Details',
    icon: 'person'
  },
  {
    label: 'Permissions',
    icon: 'lock_open'
  },
  {
    label: 'Connections',
    icon: 'people'
  },
  {
    label: 'Access',
    icon: 'folder_shared'
  }
];

const UserInformation = ({
  closeInfo,
  handleEdit,
  patchUser,
  ...user
}: {
  email: string;
  status: string;
  connections: any[];
  access: any[];
  permissions: string[];
  information: any;
  closeInfo: Function;
  handleEdit: any;
  patchUser: Function;
}) => {
  const [selectedTab, selectTab] = useState('Details');

  const confirmUser = useCallback(() => {
    patchUser({
      ...user,
      status: 'CONFIRMED'
    });
  }, [patchUser, user]);

  const { information, email } = user;

  return (
    <div className="users__content-information">
      <div className="users__content-information-header">
        <h4>
          {!!information.firstName || !!information.lastName
            ? `${information.firstName} ${information.lastName}`
            : email}
        </h4>
        <a onClick={() => closeInfo()} className="button">
          <i className="material-icons">clear</i>
        </a>
        <Tabs tabs={tabs} selectTab={selectTab} selectedTab={selectedTab} />
      </div>
      {selectedTab === 'Details' ? (
        <Details status={user.status} confirmUser={confirmUser} />
      ) : selectedTab === 'Permissions' ? (
        <Permissions />
      ) : selectedTab === 'Connections' ? (
        <Connections />
      ) : (
        <Access />
      )}
      <ul className="users__content-information-footer">
        <li>
          <label className="button">Edit</label>
        </li>
        <li>
          <label className="button">Publish</label>
        </li>
        <li>
          <label className="button">Delete</label>
        </li>
      </ul>
    </div>
  );
};

const Details = ({ confirmUser, status }) => {
  return (
    <div className="users__content-information-details">
      {status !== 'CONFIRMED' && <a onClick={confirmUser}>Confirm</a>}
    </div>
  );
};

const Permissions = () => {
  return (
    <div className="users__content-information-permissions">Permissions</div>
  );
};

const Connections = () => {
  return (
    <div className="users__content-information-connections">Connections</div>
  );
};

const Access = () => {
  return <div className="users__content-information-access">Access</div>;
};
