export const setValueByPath = (obj, path, value) => {
  let schema = obj
  const pList = path.split('.')
  const len = pList.length
  for (let i = 0; i < len - 1; i++) {
    let elem = pList[i]
    if (!schema[elem]) schema[elem] = {}
    schema = schema[elem]
  }
  schema[pList[len - 1]] = value
  return { ...obj }
}