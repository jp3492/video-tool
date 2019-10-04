import React, { useState, useCallback, useMemo, useEffect } from 'react'
import './input.scss'
import { PLAYER_STATES, INPUT_STATES, TIME_SELECTED_STATES, KEY_ACTIONS } from '../../states'
import { quantumState, quantumReducer } from '@piloteers/react-state'
import { REDUCERS } from '../../../../state/stores'
import { requests as allRequests } from '../../../../state/requests'
import { REQUEST_TYPES } from '../../../../state/reducer'
import { useTime } from '../../useTime'

const requests = allRequests.tags

export const Input = () => {
  const { actions: { ACTION } } = quantumReducer({ id: REDUCERS.TAGS, connect: false })
  const { dispatch } = quantumReducer({ id: REDUCERS.PROJECTS, connect: false })

  const [projectIds] = quantumState({ id: PLAYER_STATES.PROJECT_ID, initialValue: new URLSearchParams(window.location.search).get("ids") })
  const [selectedTab] = quantumState({ id: PLAYER_STATES.TAB_SELECTED })
  const [inputState, setInputState] = quantumState({ id: PLAYER_STATES.INPUT_STATE, initialValue: INPUT_STATES.IDLE })
  const [tagContent, setTagContent] = quantumState({ id: PLAYER_STATES.TAG_CONTENT, initialValue: { text: "", start: null, end: null, _id: null } })
  const [timeSelectedState, setTimeSelectedState] = quantumState({ id: PLAYER_STATES.TAG_TIME_SELECTED, initialValue: TIME_SELECTED_STATES.NONE })
  const [keyAction, setKeyAction] = quantumState({ id: PLAYER_STATES.KEY_ACTION })
  const [editingTag, setEditingTag] = quantumState({ id: PLAYER_STATES.EDITING_TAG, initialValue: null })
  // console.log(inputState);

  const { state: time } = useTime({})

  useEffect(() => () => { setKeyAction({ count: 0, action: "" }) }, [])

  const postTag = () => ACTION({
    ...requests.post,
    url: requests.post.url + JSON.parse(projectIds)[0],
    body: {
      start: tagContent.start,
      end: tagContent.end,
      text: tagContent.text,
      url: selectedTab
    }
  }).then(newTag => {
    dispatch({
      type: REQUEST_TYPES.ADD_TAG_TO_PROJECT,
      data: {
        projectId: JSON.parse(projectIds)[0],
        tagId: newTag._id
      }
    })
  })

  const patchTag = tag => ACTION({
    ...requests.patch,
    url: requests.patch.url + tag._id,
    body: {
      start: tag.start,
      end: tag.end,
      text: tag.text,
      url: selectedTab
    }
  }).then(() => setEditingTag(null))

  const handleInputStateChange = useCallback((next) => {
    if (timeSelectedState === TIME_SELECTED_STATES.START && inputState === INPUT_STATES.START) {
      if (next) {
        setTimeSelectedState(TIME_SELECTED_STATES.END)
      } else {
        setTimeSelectedState(TIME_SELECTED_STATES.NONE)
      }
    } else if (timeSelectedState === TIME_SELECTED_STATES.END && inputState === INPUT_STATES.START) {
      if (next) {
        setTimeSelectedState(TIME_SELECTED_STATES.NONE)
      } else {
        setTimeSelectedState(TIME_SELECTED_STATES.START)
      }
    }
    if (JSON.parse(projectIds).length > 1) {
      if (inputState === INPUT_STATES.IDLE) {
        setInputState(INPUT_STATES.START)
      } else {
        setInputState(INPUT_STATES.IDLE)
      }
    } else {
      if (inputState === INPUT_STATES.IDLE) {
        setTagContent({ ...tagContent, start: time })
      } else if (inputState === INPUT_STATES.START) {
        if (timeSelectedState === TIME_SELECTED_STATES.START) {
          setTagContent({ ...tagContent, start: time })
        } else {
          if (time < tagContent.start) {
            return alert("Ending time cant be before starting time!")
          } else {
            setTagContent({ ...tagContent, end: time })
          }
        }
      } else if (inputState === INPUT_STATES.END) {
        let content
        if (timeSelectedState === TIME_SELECTED_STATES.END) {
          if (time < tagContent.start) {
            return alert("Ending time cant be before starting time!")
          } else {
            setTagContent({ ...tagContent, end: time })
            content = { ...tagContent, end: time }
          }
        } else {
          content = tagContent
        }
        if (next) {
          if (!!tagContent._id) {
            patchTag(content)
          } else {
            postTag()
          }
        }
      }
      setInputState(
        inputState === INPUT_STATES.IDLE ?
          INPUT_STATES.START :
          inputState === INPUT_STATES.START ?
            next ? INPUT_STATES.END : INPUT_STATES.IDLE :
            next ? INPUT_STATES.IDLE : INPUT_STATES.START
      )
    }

  }, [inputState, tagContent, time, projectIds])

  useEffect(() => {
    if (keyAction.action === KEY_ACTIONS.TAG_STATE_NEXT) {
      handleInputStateChange(true)
    } else if (keyAction.action === KEY_ACTIONS.TAG_STATE_PREV) {
      handleInputStateChange(false)
    }
  }, [keyAction])

  useEffect(() => {
    if (inputState === INPUT_STATES.IDLE) {
      setTagContent({ text: "", start: null, end: null, _id: null })
      setTimeSelectedState(TIME_SELECTED_STATES.NONE)
      setEditingTag(null)
    } else {
      const inputField = document.getElementById("inputField")
      if (inputField !== null) {
        inputField.focus()
      }
    }
  }, [inputState])

  useEffect(() => {
    console.log("Editing Tag:", editingTag);

    if (!!editingTag) {
      setInputState(INPUT_STATES.END)
    } else if (inputState !== INPUT_STATES.IDLE) {
      setInputState(INPUT_STATES.IDLE)
    }
  }, [editingTag])

  const handleTimeSelect = (isStart: boolean) => {
    if ((isStart && timeSelectedState === TIME_SELECTED_STATES.START) ||
      (!isStart && timeSelectedState === TIME_SELECTED_STATES.END)) {
      setTimeSelectedState(TIME_SELECTED_STATES.NONE)
    } else {
      if (isStart) {
        setInputState(INPUT_STATES.START)
        setTimeSelectedState(TIME_SELECTED_STATES.START)
      } else {
        setInputState(INPUT_STATES.END)
        setTimeSelectedState(TIME_SELECTED_STATES.END)
      }
    }
  }

  const iconType = useMemo(() =>
    inputState === INPUT_STATES.IDLE ?
      "create" :
      inputState === INPUT_STATES.START ?
        "last_page" :
        "done"
    , [inputState])

  return (
    <div
      data-input-state={inputState}
      className="player-input">
      <i
        onClick={() => handleInputStateChange(true)}
        className="material-icons">
        {iconType}
      </i>
      <div className="player-input__popup">
        {
          JSON.parse(projectIds).length === 1 ?
            <>
              <textarea
                id="inputField"
                onChange={({ target: { value } }) => setTagContent({ ...tagContent, text: value })}
                value={tagContent.text} />
              <span
                onClick={() => handleTimeSelect(true)}
                data-time-selected={timeSelectedState === TIME_SELECTED_STATES.START || inputState === INPUT_STATES.START}>
                {
                  timeSelectedState === TIME_SELECTED_STATES.START ?
                    time :
                    tagContent.start
                }
              </span>
              <span
                onClick={() => handleTimeSelect(false)}
                data-time-selected={timeSelectedState === TIME_SELECTED_STATES.END || inputState === INPUT_STATES.END}>
                {
                  timeSelectedState === TIME_SELECTED_STATES.END ?
                    time :
                    tagContent.end
                }
              </span>
            </> :
            <label>
              Please save selection as new project in order to make tags.
          </label>
        }
      </div>
    </div>
  )
}