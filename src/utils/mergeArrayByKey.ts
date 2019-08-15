export const mergeArrayByKey = (mergeKey, oldState, passedState) => {
  let newItems = passedState

  const newState = oldState.map(item => {
    const updatedItem = passedState.find(({ [mergeKey]: resourceId }) => resourceId === item[mergeKey])
    if (updatedItem) {
      newItems = newItems.filter(({ [mergeKey]: resourceId }) => resourceId !== updatedItem[mergeKey])
      return updatedItem
    }
    return item
  })

  return [
    ...newState,
    ...newItems
  ]
}