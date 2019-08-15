import React, { memo, lazy, Suspense, useState } from 'react'
import './modal.scss'
import { quantumState } from "@piloteers/react-state";

const folderForm = lazy(() => import('../forms/folder/folder-form'));
const projectForm = lazy(() => import('../forms/project/project-form'));

const CONTENT = {
  FOLDER_FORM: folderForm,
  PROJECT_FORM: projectForm
};

export const MODAL_TYPES = {
  FOLDER_FORM: "FOLDER_FORM",
  PROJECT_FORM: "PROJECT_FORM"
};

export const MODAL = "MODAL";

export const INITIAL_VALUE = {
  name: null,
  props: {},
  title: "No Title passed",
  type: '',
  onClose: null
};

export default memo(() => {
  const [modal, setModal] = quantumState({ id: MODAL, initialValue: INITIAL_VALUE });
  const [mouseDown, setMouseDown] = useState(false);

  const { name = null, props = {}, title = null, onClose = null, type = '' } = modal;

  if (name === null || !name) {
    document.body.style.overflow = "auto"
    return null
  }

  const closeModal = () => {
    if (onClose !== null) {
      onClose()
    }
    setModal(INITIAL_VALUE)
  };

  const renderComponent = (name: string) => {
    const SelectedComponent = CONTENT[name];
    return <SelectedComponent onClick={e => e.stopPropagation()} {...props} closeModal={closeModal} />
  };

  const handelMouseDown = e => setMouseDown(e.target === e.currentTarget);
  const handleMouseUp = () => mouseDown && closeModal();

  document.body.style.overflow = "hidden";

  return (
    <>
      <div
        onMouseDown={handelMouseDown}
        onMouseUp={handleMouseUp}
        className={`modal modal--${type} `}>
        <div
          onClick={e => e.stopPropagation()}
          className="modal-content">
          <div
            onClick={e => e.stopPropagation()}
            data-underline={title !== null}
            className="modal-content__header">
            {
              title !== null &&
              <h3>
                {title}
              </h3>
            }
          </div>

          <Suspense fallback={<div>Loading</div>}>
            {
              <div className="modal-content__body">
                {
                  renderComponent(name)
                }
              </div>
            }
          </Suspense>
        </div>
      </div>
      <div className="modal-backdrop">
      </div>
    </>
  )
})
