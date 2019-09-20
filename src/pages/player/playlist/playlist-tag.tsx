import React, { useCallback } from 'react'

import { quantumState } from '@piloteers/react-state'
import { PLAYER_STATES } from '../states'

import { useTime } from '../useTime'

export const Tag = ({
  _id,
  text,
  start,
  end,
  url,
  handleSelectTag,
  selected,
  selectTag,
  videoName
}: {
  _id: string,
  text: string,
  start: number,
  end: number,
  url: string,
  handleSelectTag: Function,
  selected: boolean,
  selectTag: Function,
  videoName: string
}) => {
  const [editingTag, setEditingTag] = quantumState({ id: PLAYER_STATES.EDITING_TAG })
  const [tagContent, setTagContent] = quantumState({ id: PLAYER_STATES.TAG_CONTENT, returnValue: false })
  const { state: active } = useTime({ url, start, end })

  const handleEditTag = useCallback(() => {
    if (editingTag !== _id) {
      setTagContent({ start, end, text, _id })
      setEditingTag(_id)
    } else {
      setTagContent({ start: null, end: null, text: "", _id: null })
      setEditingTag(null)
    }
  }, [_id, editingTag, start, end, text, _id])

  return (
    <li
      data-tag-active={active}
      onClick={() => handleSelectTag(url, start)}>
      <div>
        <span>
          {`${start} - ${end}`}
        </span>
        <label>
          {videoName || "noName"}
        </label>
        <i
          onClick={e => {
            e.stopPropagation()
            selectTag(_id)
          }}
          className="material-icons">
          {
            selected ?
              "check_box" :
              "check_box_outline_blank"
          }
        </i>
      </div>
      <div>
        <p>
          {text}
        </p>
        <i
          onClick={handleEditTag}
          className="material-icons">
          {
            editingTag === _id ?
              "clear" :
              "edit"
          }
        </i>
      </div>
    </li>
  )
}