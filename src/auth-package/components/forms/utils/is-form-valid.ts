export const isFormValid = (errors: any) => {
  return Object.keys(errors).reduce((res: boolean, e: any) => {
    if (!res) {
      return res
    }
    if (typeof errors[e] === 'string') {
      if (errors[e] === "") {
        return true
      } else {
        return false
      }
    } else {
      return isFormValid(errors[e])
    }
  }, true)
}