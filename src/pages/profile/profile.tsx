import React, { useState, useCallback } from 'react';
import './profile.scss';
import { Folders } from '../../components/folders/folders';
import useForm from '../../form-package';
import { getQuantumValue, quantumState } from '@piloteers/react-state';
import { patchUser } from '../../state/actions';

const folders = [
  {
    _id: 'info',
    folder: null,
    label: 'Personal Information'
  },
  {
    _id: 'security',
    folder: null,
    label: 'Security'
  },
  {
    _id: 'subscription',
    folder: null,
    label: 'Subscription'
  }
];

export const Profile = (props: any) => {
  const [me] = quantumState({ id: 'ME' });
  const [selectedFolder, setSelectedFolder] = useState();
  return (
    <div className="profile">
      <div className="profile__sidebar">
        <Folders
          onChange={folder => setSelectedFolder(folder)}
          folders={folders}
        />
      </div>
      {selectedFolder === 'info' ? (
        <PersonalInformation {...me} />
      ) : selectedFolder === 'security' ? (
        <Security />
      ) : (
        <Subscription />
      )}
    </div>
  );
};

const infoForm = {
  name: 'personalInformation',
  fields: {
    firstName: {
      type: 'input',
      inputType: 'text',
      label: 'First Name',
      placeholder: '...'
    },
    lastName: {
      type: 'input',
      inputType: 'text',
      label: 'Last Name',
      placeholder: '...'
    }
  }
};

const PersonalInformation = ({ information: { firstName, lastName } }) => {
  const [loading, setLoading] = useState(false);
  const { Form, getValues } = useForm({
    ...infoForm,
    initialValues: {
      firstName,
      lastName
    }
  });

  const handleSubmit = useCallback(() => {
    setLoading(true);
    patchUser(getValues()).then(() => setLoading(false));
  }, [getValues]);

  return (
    <div className="profile__info">
      <Form />
      <a
        data-button-disabled={loading}
        onClick={handleSubmit}
        className="button"
      >
        <i className="material-icons">save</i>
        <label>{loading ? 'Saving...' : 'Save'}</label>
      </a>
    </div>
  );
};

const Security = () => {
  return <div className="profile_security"></div>;
};

const Subscription = () => {
  return <div className="profile_subscription"></div>;
};
