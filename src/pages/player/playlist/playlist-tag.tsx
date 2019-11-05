import React, { useCallback, useState, useMemo, useEffect } from 'react';

import { quantumState } from '@piloteers/react-state';
import { PLAYER_STATES } from '../states';

import { useTime } from '../useTime';
import {
  postComment,
  patchComment,
  deleteComment
} from '../../../state/actions';

interface Comment {
  author: string;
  text: string;
  _id: string;
  name: string;
  updatedAt: string;
}

export const Tag = ({
  _id,
  text,
  start,
  end,
  url,
  comments,
  handleSelectTag,
  selected,
  selectTag,
  videoName
}: {
  _id: string;
  text: string;
  start: number;
  end: number;
  url: string;
  comments: Comment[];
  handleSelectTag: Function;
  selected: boolean;
  selectTag: Function;
  videoName: string;
}) => {
  const [editingTag, setEditingTag] = quantumState({
    id: PLAYER_STATES.EDITING_TAG
  });
  const [tagContent, setTagContent] = quantumState({
    id: PLAYER_STATES.TAG_CONTENT,
    returnValue: false
  });
  const { state: active } = useTime({ url, start, end });
  const [commentOpen, setCommentOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [postingComment, setPostingComment] = useState(false);

  useEffect(() => {
    if (commentOpen) {
      // @ts-ignore
      document.getElementById('comment-input').focus();
    }
  }, [commentOpen]);

  const handleEditTag = useCallback(() => {
    if (editingTag !== _id) {
      setTagContent({ start, end, text, _id });
      setEditingTag(_id);
    } else {
      setTagContent({ start: null, end: null, text: '', _id: null });
      setEditingTag(null);
    }
  }, [editingTag, _id, setTagContent, start, end, text, setEditingTag]);

  const handleCommentClick = useCallback(
    e => {
      e.stopPropagation();
      if (commentOpen) {
        setComment('');
      }
      setCommentOpen(!commentOpen);
    },
    [commentOpen]
  );

  const handleSendComment = useCallback(() => {
    setPostingComment(true);
    postComment(_id, comment).then(() => {
      setComment('');
      setPostingComment(false);
    });
  }, [_id, comment]);

  return (
    <li
      className="player-playlist__list__tag"
      data-tag-active={active}
      onDoubleClick={handleEditTag}
      onClick={() => handleSelectTag(url, start)}
    >
      <div>
        <span>{`${start} - ${end}`}</span>
        <label>{videoName || 'noName'}</label>
        <i
          onClick={e => {
            e.stopPropagation();
            selectTag(_id);
          }}
          className="material-icons"
        >
          {selected ? 'check_box' : 'check_box_outline_blank'}
        </i>
      </div>
      <div>
        <p>{text}</p>
        <i onClick={handleCommentClick} className="material-icons">
          {commentOpen ? 'clear' : 'comment'}
        </i>
      </div>
      {commentOpen && (
        <div
          onDoubleClick={e => {
            e.stopPropagation();
          }}
          onClick={e => {
            e.stopPropagation();
          }}
          className="player-playlist__list__tag-comments"
        >
          <input
            id="comment-input"
            disabled={postingComment}
            placeholder="Comment..."
            type="text"
            value={comment}
            onChange={({ target: { value } }) => setComment(value)}
          />
          <i
            onClick={postingComment ? undefined : handleSendComment}
            className="material-icons"
          >
            {!postingComment ? 'send' : 'more_horiz'}
          </i>
          <ul>
            {comments.length === 0 ? (
              <li>No comments yet.</li>
            ) : (
              comments.map((c, i) => <Comment key={i} {...c} tagId={_id} />)
            )}
          </ul>
        </div>
      )}
    </li>
  );
};

const Comment = ({
  author,
  text,
  tagId,
  _id,
  name,
  updatedAt
}: {
  _id: string;
  author: string;
  text: string;
  tagId: string;
  name: string;
  updatedAt: string;
}) => {
  const [me] = quantumState({ id: 'ME' });
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [comment, setComment] = useState(text);
  const [loading, setLoading] = useState(false);

  const handlePatchComment = useCallback(() => {
    setLoading(true);
    patchComment(tagId, _id, comment).then(() => {
      setEditing(false);
      setLoading(false);
    });
  }, [comment, tagId, _id]);

  const handleDeletingComment = useCallback(() => {
    setLoading(true);
    deleteComment(tagId, _id).then(() => {
      setDeleting(false);
      setLoading(false);
      setOptionsOpen(false);
    });
  }, [_id, tagId]);

  const time = useMemo(() => {
    const date = new Date(updatedAt);
    return `${date.getDate()}.${date.getMonth() +
      1}.${date.getFullYear()} - ${date.getHours()}:${
      String(date.getMinutes()).length === 1
        ? '0' + date.getMinutes()
        : date.getMinutes()
    }`;
  }, [updatedAt]);

  return (
    <li>
      <label>{`${name} - ${time}`}</label>
      {!editing ? (
        <p>{text}</p>
      ) : (
        <div className="comment-edit">
          <input
            type="text"
            value={comment}
            onChange={({ target: { value } }) => setComment(value)}
          />
          {loading ? (
            <i className="material-icons">more_horiz</i>
          ) : (
            <>
              <i className="material-icons">clear</i>
              <i onClick={handlePatchComment} className="material-icons">
                done
              </i>
            </>
          )}
        </div>
      )}
      {author === me._id && !editing && (
        <div className="comment-options">
          <i
            onClick={() => setOptionsOpen(!optionsOpen)}
            className="material-icons"
          >
            more_vert
          </i>
          {optionsOpen && (
            <ul>
              <li
                onClick={() => {
                  setOptionsOpen(false);
                  setEditing(true);
                }}
              >
                <i className="material-icons">edit</i>
                <label>Edit</label>
              </li>
              <li onClick={() => setDeleting(true)}>
                {deleting ? (
                  loading ? (
                    <i className="material-icons">more_horiz</i>
                  ) : (
                    <>
                      <i
                        onClick={handleDeletingComment}
                        className="material-icons"
                      >
                        done
                      </i>
                      <i
                        onClick={() => setDeleting(false)}
                        className="material-icons"
                      >
                        clear
                      </i>
                    </>
                  )
                ) : (
                  <>
                    <i className="material-icons">clear</i>
                    <label>Delete</label>
                  </>
                )}
              </li>
            </ul>
          )}
        </div>
      )}
    </li>
  );
};
