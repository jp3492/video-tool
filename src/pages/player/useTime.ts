import { useState, useEffect, useCallback } from 'react'

let tagSubscriptions: any[] = []
let timeSubscriptions: any[] = []
let time: number
let activeTab: string

const evaluateSubscriptions = () => {
  for (let i = 0; i < tagSubscriptions.length; i++) {
    const { start, end, url, setter, active } = tagSubscriptions[i]
    if (activeTab === url && start <= time && end >= time) {
      setter(true)
      tagSubscriptions[i] = { start, end, url, setter, active: true }
    } else if (active) {
      setter(false)
      tagSubscriptions[i] = { start, end, url, setter, active: false }
    }
  }
}

export const setActiveTab = url => {
  activeTab = url
  evaluateSubscriptions()
}

const setTime = passedTime => {
  time = Number(passedTime)
  timeSubscriptions.forEach(s => s(time))
  evaluateSubscriptions()
}

export const useTime = ({
  url,
  start,
  end,
  returnValue
}: {
  url?: string,
  start?: number,
  end?: number,
  returnValue?: boolean
}) => {
  const [state, setState] = useState(false)

  useEffect(() => {
    if (!url && !start && !end && returnValue !== false) {
      timeSubscriptions = [...timeSubscriptions, setState]
    } else if (returnValue !== false) {
      tagSubscriptions = [...tagSubscriptions, { url, start, end, setter: setState, active: false }]
    }
    return () => {
      if (!url && !start && !end) {
        timeSubscriptions = timeSubscriptions.filter(s => s !== setState)
      } else {
        tagSubscriptions = tagSubscriptions.filter(t => t.start !== start && t.end !== end && t.url !== url && t.setter !== setState)
      }
    }
  }, [])

  const handleSetTime = useCallback((t) => setTime(t), [])

  return {
    state,
    setTime: handleSetTime
  }
}