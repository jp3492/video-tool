import { request } from '../auth-package'
import { mergeArrayByKey } from '../utils'

export enum REQUEST_TYPES {
  GET = "GET",                          // get list and merge with state
  GET_MANY = "GET_MANY",                  // get list and replace state
  GET_SINGLE = "GET_SINGLE",            // get item and merge with state
  POST = "POST",                        // post item and merge with state
  POST_ALL = "POST_ALL",                // post list and replace state     
  POST_MULTIPLE = "POST_MULTIPLE",      // post list and merge with state
  PATCH = "PATCH",                      // patch item and update state
  PATCH_MULTIPLE = "PATCH_MULTIPLE",    // patch list and update state
  DELETE = "DELETE",                    // delete item and update state
  DELETE_MULTIPLE = "DELETE_MULTIPLE",  // delete list and update state

  ERROR = "ERROR",                      // save error message to state
  // CUSTOM ACTIONS
  ADD_TAG_TO_PROJECT = "ADD_TAG_TO_PROJECT"
}

interface Params {
  [key: string]: any
}

interface RequestOptions {
  method: REQUEST_TYPES,
  api: string,
  url: string,
  params?: Params,
  body?: any,
  trackId?: string,
  resetPagination?: boolean
}

interface Action {
  type: REQUEST_TYPES,
  data: any
}

const getRestMethod = method => method.includes("_") ? method.split("_")[0].toLowerCase() : method.toLowerCase()

let paginationStatus: any = {}

export const ACTION = (requestOptions: RequestOptions) => async dispatch => {
  let {
    method,
    resetPagination = false,
    ...requestProps
  } = requestOptions

  const restMethod = getRestMethod(method)

  const requestId = requestProps.api + method + requestProps.url

  try {
    if (paginationStatus.hasOwnProperty(requestId) && !resetPagination) {
      requestProps = {
        ...requestProps,
        params: {
          ...requestProps.params,
          lastEvaluatedId: paginationStatus(requestId)
        }
      }
    }
    const response: any = await request({
      method: restMethod,
      ...requestProps
    })
    if (response.data.hasOwnProperty("lastEvaluatedId")) {
      paginationStatus = {
        ...paginationStatus,
        [requestId]: response.data.lastEvaluatedId
      }
    }
    dispatch({
      type: REQUEST_TYPES[method.toUpperCase()],
      data: response.data
    })
    return response.data
  } catch (error) {
    dispatch({
      type: REQUEST_TYPES.ERROR,
      data: error
    })
    console.error(error)
    return error
  }
}

interface InitialState {
  data: any,
  error: Error
}

export const INITIAL_STATE: InitialState = {
  data: {},
  error: {
    name: "",
    message: ""
  }
}

export const REDUCER = (state: InitialState, action: Action, options: any) => {
  switch (action.type) {
    case REQUEST_TYPES.ERROR:
      return {
        ...state,
        error: action.data
      }
    default:
      return {
        data: action.data,
        error: {
          name: "",
          message: ""
        }
      }
  }
}

export const INITIAL_STATE_LIST: InitialState = {
  data: [],
  error: {
    name: "",
    message: ""
  }
}

const itemMethods = [REQUEST_TYPES.GET_SINGLE, REQUEST_TYPES.PATCH, REQUEST_TYPES.POST, REQUEST_TYPES.DELETE]

export const REDUCER_LIST = (state: InitialState, action: Action, options: any) => {

  const {
    type,
    data
  } = action

  const resourceIdName = options && options.resourceIdName ? options.resourceIdName : 'resourceId'

  const newData = itemMethods.includes(REQUEST_TYPES[type]) ? data : data.items

  const newDataState = (() => {
    switch (type) {
      case REQUEST_TYPES.GET:
        return mergeArrayByKey(resourceIdName, state.data, newData)
      case REQUEST_TYPES.GET_MANY:
        return mergeArrayByKey(resourceIdName, state.data, newData)
      case REQUEST_TYPES.GET_SINGLE:
        return mergeArrayByKey(resourceIdName, state.data, [newData])
      case REQUEST_TYPES.POST:
        return [...state.data, newData]
      case REQUEST_TYPES.POST_ALL:
        return newData
      case REQUEST_TYPES.POST_MULTIPLE:
        return [...state.data, ...newData]
      case REQUEST_TYPES.PATCH:
        return state.data.map(item => item[resourceIdName] === newData[resourceIdName] ? newData : item)
      case REQUEST_TYPES.PATCH_MULTIPLE:
        return mergeArrayByKey(resourceIdName, state.data, newData)
      case REQUEST_TYPES.DELETE:
        return state.data.filter(item => item[resourceIdName] !== newData[resourceIdName])
      case REQUEST_TYPES.DELETE_MULTIPLE:
        return state.data.filter(item => !newData.includes(item[resourceIdName]))
      default:
        return state.data
    }
  })()

  if (options.debug) {
    console.log("Old State:", state.data)
    console.log("Action:", action)
    console.log("New State:", newDataState)
  }

  console.log(newDataState);


  switch (action.type) {
    case REQUEST_TYPES.ADD_TAG_TO_PROJECT:
      return {
        ...state,
        data: state.data.map(project => project._id === action.data.projectId ? { ...project, tags: [...project.tags, action.data.tagId] } : project)
      }
    // Custom Actions above
    case REQUEST_TYPES.ERROR:
      return {
        ...state,
        error: action.data
      }
    default:
      return {
        data: newDataState,
        error: {
          name: "",
          message: ""
        }
      }
  }
}
