import React, { useState, useCallback, useMemo, useEffect } from 'react'
import './input.scss'
import { PLAYER_STATES, INPUT_STATES, TIME_SELECTED_STATES } from '../states'
import { quantumState } from '@piloteers/react-state'

export const Input = () => {
  const [inputState, setInputState] = quantumState({ id: PLAYER_STATES.INPUT_STATE, initialValue: INPUT_STATES.IDLE })
  const [tagContent, setTagContent] = quantumState({ id: PLAYER_STATES.TAG_CONTENT, initialValue: "" })
  const [tagStartTime, setTagStartTime] = quantumState({ id: PLAYER_STATES.TAG_START_TIME, initialValue: null })
  const [tagEndTime, setTagEndTime] = quantumState({ id: PLAYER_STATES.TAG_END_TIME, initialValue: null })
  const [timeSelectedState, setTimeSelectedState] = quantumState({ id: PLAYER_STATES.TAG_TIME_SELECTED, initialValue: TIME_SELECTED_STATES.NONE })

  const handleInputStateChange = useCallback(() => setInputState(
    inputState === INPUT_STATES.IDLE ?
      INPUT_STATES.START :
      inputState === INPUT_STATES.START ?
        INPUT_STATES.END :
        INPUT_STATES.IDLE
  ), [inputState])

  const iconType = useMemo(() =>
    inputState === INPUT_STATES.IDLE ?
      "create" :
      inputState === INPUT_STATES.START ?
        "stop" :
        "done"
    , [inputState])

  useEffect(() => {
    if (inputState === INPUT_STATES.IDLE) {
      setTagContent("")
      setTimeSelectedState(TIME_SELECTED_STATES.NONE)
    }
    return setTagContent("")
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
        onClick={handleInputStateChange}
        className="material-icons">
        {iconType}
      </i>
      <textarea
        onChange={({ target: { value } }) => setTagContent(value)}
        value={tagContent} />
      <span
        onClick={() => handleTimeSelect(true)}
        data-time-selected={timeSelectedState === TIME_SELECTED_STATES.START}>
        {tagStartTime}
      </span>
      <span
        onClick={() => handleTimeSelect(false)}
        data-time-selected={timeSelectedState === TIME_SELECTED_STATES.END}>
        {tagEndTime}
      </span>
    </div>
  )
}