export const getValueByPath = (obj, pathStr) => {
  try {
    var path = pathStr.split(".")
  } catch (error) {
    console.log({
      obj,
      pathStr
    })
    throw Error(error)
  }
  var current = obj
  for (var i = 0; i < path.length; i++) {
    try {
      current = current[path[i]] || ""
    } catch (error) {
      console.log({ obj, pathStr })
      throw Error(error)
    }
  }

  return current || ""
}