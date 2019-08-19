// import { LIST_REDUCER,INITIAL_STATE_LIST, LIST_ACTION} from "./createReducer";

import {
  ACTION,
  REDUCER_LIST,
  INITIAL_STATE_LIST
} from './reducer';

export const REDUCERS = {
  FOLDERS: 'FOLDERS',
  PROJECTS: 'PROJECTS'
};

export const stores = [
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
];
