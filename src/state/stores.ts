// import { LIST_REDUCER,INITIAL_STATE_LIST, LIST_ACTION} from "./createReducer";

import {
  ACTION,
  REDUCER,
  INITIAL_STATE,
  REDUCER_LIST,
  INITIAL_STATE_LIST
} from './reducer';

export const REDUCERS = {
  FOLDERS: 'FOLDERS',
  PROJECTS: 'PROJECTS',
  USERS: 'USERS',
  TAGS: 'TAGS',
  SEARCH: 'SEARCH',
  REQUESTS: 'REQUESTS'
};

export const stores = [
  {
    id: REDUCERS.REQUESTS,
    reducer: REDUCER_LIST,
    initialState: INITIAL_STATE_LIST,
    actions: { ACTION },
    options: {
      resourceIdName: "_id"
    }
  },
  {
    id: REDUCERS.SEARCH,
    reducer: REDUCER,
    initialState: INITIAL_STATE,
    actions: { ACTION },
    options: {
      resourceIdName: "_id"
    }
  },
  {
    id: REDUCERS.FOLDERS,
    reducer: REDUCER_LIST,
    initialState: INITIAL_STATE_LIST,
    actions: { ACTION },
    options: {
      resourceIdName: "_id"
    }
  },
  {
    id: REDUCERS.PROJECTS,
    reducer: REDUCER_LIST,
    initialState: INITIAL_STATE_LIST,
    actions: { ACTION },
    options: {
      resourceIdName: "_id"
    }
  },
  {
    id: REDUCERS.TAGS,
    reducer: REDUCER_LIST,
    initialState: INITIAL_STATE_LIST,
    actions: { ACTION },
    options: {
      resourceIdName: "_id"
    }
  },
  {
    id: REDUCERS.USERS,
    reducer: REDUCER_LIST,
    initialState: INITIAL_STATE_LIST,
    actions: { ACTION },
    options: {
      resourceIdName: "_id",
      debug: true
    }
  },
];
