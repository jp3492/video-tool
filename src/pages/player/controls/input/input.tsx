import React, { useState, useCallback, useMemo, useEffect } from 'react'
import './input.scss'
import { PLAYER_STATES, INPUT_STATES, TIME_SELECTED_STATES, KEY_ACTIONS } from '../../states'
import { quantumState, quantumReducer } from '@piloteers/react-state'
import { REDUCERS } from '../../../../state/stores'
import { requests as allRequests } from '../../../../state/requests'

const requests = allRequests.tags

export const Input = () => {
  const { actions: { ACTION } } = quantumReducer({ id: REDUCERS.TAGS })
  const [projectId] = quantumState({ id: PLAYER_STATES.PROJECT_ID })
  const [selectedTag] = quantumState({ id: PLAYER_STATES.TAB_SELECTED })
  const [inputState, setInputState] = quantumState({ id: PLAYER_STATES.INPUT_STATE, initialValue: INPUT_STATES.IDLE })
  const [tagContent, setTagContent] = quantumState({ id: PLAYER_STATES.TAG_CONTENT, initialValue: { text: "", start: null, end: null } })
  const [timeSelectedState, setTimeSelectedState] = quantumState({ id: PLAYER_STATES.TAG_TIME_SELECTED, initialValue: TIME_SELECTED_STATES.NONE })
  const [keyAction, setKeyAction] = quantumState({ id: PLAYER_STATES.KEY_ACTION })
  const [time, setTime] = quantumState({ id: PLAYER_STATES.CURRENT_TIME })

  const postTag = () => ACTION({
    ...requests.post,
    url: requests.post.url + projectId,
    body: {
      ...tagContent,
      url: selectedTag
    }
  })

  const handleInputStateChange = useCallback((next) => {
    if (inputState === INPUT_STATES.IDLE) {
      setTagContent({ ...tagContent, start: time })
    } else if (inputState === INPUT_STATES.START) {
      setTagContent({ ...tagContent, end: time })
    } else if (inputState === INPUT_STATES.END) {
      postTag()
    }
    setInputState(
      inputState === INPUT_STATES.IDLE ?
        INPUT_STATES.START :
        inputState === INPUT_STATES.START ?
          next ? INPUT_STATES.END : INPUT_STATES.IDLE :
          next ? INPUT_STATES.IDLE : INPUT_STATES.START
    )
  }, [inputState, tagContent, time])

  useEffect(() => {
    if (keyAction.action === KEY_ACTIONS.TAG_STATE_NEXT) {
      handleInputStateChange(true)
    } else if (keyAction.action === KEY_ACTIONS.TAG_STATE_PREV) {
      handleInputStateChange(false)
    }
  }, [keyAction])

  const iconType = useMemo(() =>
    inputState === INPUT_STATES.IDLE ?
      "create" :
      inputState === INPUT_STATES.START ?
        "last_page" :
        "done"
    , [inputState])

  useEffect(() => {
    if (inputState === INPUT_STATES.IDLE) {
      setTagContent("")
      setTimeSelectedState(TIME_SELECTED_STATES.NONE)
    } else {
      const inputField = document.getElementById("inputField")
      if (inputField !== null) {
        inputField.focus()
      }
    }
  }, [inputState])

  const handleTimeSelect = (isStart: boolean) =>
    (isStart && timeSelectedState === TIME_SELECTED_STATES.START) ||
      (!isStart && timeSelectedState === TIME_SELECTED_STATES.END) ?
      setTimeSelectedState(TIME_SELECTED_STATES.NONE) :
      setTimeSelectedState(
        isStart ?
          TIME_SELECTED_STATES.START :
          TIME_SELECTED_STATES.END
      )


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
        <textarea
          id="inputField"
          onChange={({ target: { value } }) => setTagContent({ ...tagContent, text: value })}
          value={tagContent.text} />
        <span
          onClick={() => handleTimeSelect(true)}
          data-time-selected={timeSelectedState === TIME_SELECTED_STATES.START || inputState === INPUT_STATES.START}>
          {
            tagContent.start
          }
        </span>
        <span
          onClick={() => handleTimeSelect(false)}
          data-time-selected={timeSelectedState === TIME_SELECTED_STATES.END || inputState === INPUT_STATES.END}>
          {
            tagContent.end
          }
        </span>
      </div>
    </div>
  )
}