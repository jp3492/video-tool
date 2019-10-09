import { useState, useMemo } from 'react';

import axios, { AxiosInstance } from 'axios'
import i18next from 'i18next'

import { refreshSession, signOut } from '../methods'
import { RequestStatusEnum } from '../models/enums'

let requestSubscriptions: any = {}

const updateRequestStatus = (
  id,
  status
): void => {
  requestSubscriptions = {
    ...requestSubscriptions,
    [id]: {
      ...requestSubscriptions[id],
      status
    }
  }
  if (requestSubscriptions[id].subscriptions) {
    requestSubscriptions[id].subscriptions.forEach(s => s(status))
  }
}

interface iRequest {
  trackId: string,
  api: string,
  method: string,
  url: string
}

interface iRequests {
  [key: string]: iRequest
}

export const GetRequestStatus = ({
  requests = {},
  preventRender = false
}: {
  requests?: iRequests,
  preventRender?: boolean
}) => {
  const [state, setState] = useState(Object.keys(requests).map(k => requests[k].trackId).reduce((res, id) => ({ ...res, [id]: RequestStatusEnum.IDEL }), {}))
  const [trackedIds, setTrackedIds] = useState(Object.keys(requests).map(k => requests[k].trackId))

  useMemo(() => {
    const addSetState = preventRender ? [] : [setState]

    Object.keys(requests).map(k => requests[k].trackId).forEach(id => {
      if (!requestSubscriptions.hasOwnProperty(id)) {
        requestSubscriptions = {
          ...requestSubscriptions,
          [id]: {
            status: RequestStatusEnum.IDEL,
            subscriptions: addSetState
          }
        }
      } else {
        requestSubscriptions = {
          ...requestSubscriptions,
          [id]: {
            status: RequestStatusEnum.IDEL,
            subscriptions: [...requestSubscriptions[id].subscriptions, ...addSetState]
          }
        }
      }
    })
    refreshSession()
    return () => {
      trackedIds.map(i => {
        requestSubscriptions = {
          ...requestSubscriptions,
          [i]: {
            status: RequestStatusEnum.IDEL,
            subscriptions: requestSubscriptions[i].subscriptions.filter(s => s !== setState)
          }
        }
      })
    }
  }, [])

  const trackStatus = id => {
    const addSetState = preventRender ? [] : [setState]

    if (!trackedIds.includes(id) && !preventRender) {
      setTrackedIds([...trackedIds, id])
    }
    if (!requestSubscriptions.hasOwnProperty(id)) {
      requestSubscriptions = {
        ...requestSubscriptions,
        [id]: {
          status: RequestStatusEnum.IDEL,
          subscriptions: addSetState
        }
      }
    } else if (!requestSubscriptions[id].subscriptions.includes(setState) && !preventRender) {
      requestSubscriptions = {
        ...requestSubscriptions,
        [id]: {
          status: RequestStatusEnum.IDEL,
          subscriptions: [...requestSubscriptions[id].subscriptions, setState]
        }
      }
    }
  }

  return {
    isLoading: id => requestSubscriptions[id] ? requestSubscriptions[id].status === RequestStatusEnum.LOADING : false,
    statuses: trackedIds.reduce((res, id) => ({
      ...res,
      [id]: requestSubscriptions[id] ? requestSubscriptions[id].status : RequestStatusEnum.IDEL
    }), {}),
    trackStatus
  }
}

interface iApi {
  URL: string,
  SECURE: boolean
}

interface iApis {
  [key: string]: iApi
}

interface myApis {
  [key: string]: AxiosInstance
}

let APIS: myApis = {}

export const setApis = (apis: iApis) => {
  APIS = Object.keys(apis).reduce((res, api) => {
    const headers = apis.SECURE ?
      {
        common: {
          'Accept-Language': i18next.language
        },
        authorization: ''
      } :
      {
        common: {
          'Accept-Language': i18next.language
        }
      }
    return {
      ...res,
      [api]: axios.create({
        baseURL: apis[api].URL,
        timeout: 20000,
        headers
      })
    }
  }, {})

  Object.keys(APIS).forEach(key => {
    if (apis[key].SECURE) {
      APIS[key].interceptors.request.use(async req => {
        try {
          const session = await refreshSession()
          if (session) {
            req.headers.authorization = session["accessToken"].jwtToken
            req.headers.identity = session["idToken"].payload.sub
          }
          return req
        } catch (error) {
          await signOut()
          throw Error(error)
        }
      })
    }
  })
}
interface iParam {
  [key: string]: any
}

interface iReq {
  api: string,
  url: string,
  method: any,
  trackId?: string,
  body?: any,
  params?: iParam
}

export const request = async (req: iReq) => {
  const {
    api,
    url,
    method,
    trackId,
    body = {},
    params = {}
  } = req

  updateRequestStatus(trackId, RequestStatusEnum.LOADING)

  try {
    try {

      const data = await APIS[api]({
        url,
        method,
        data: body,
        params
      })
      console.log(trackId);

      updateRequestStatus(trackId, RequestStatusEnum.SUCCESS)
      return data
    } catch (error) {
      console.error(error)
    }

  } catch (error) {
    updateRequestStatus(trackId, RequestStatusEnum.FAILED)
    throw Error(error)
  }
}