export const getInitialTouches = (form) => {
  return Object.keys(form.formFields).reduce((res, f) => {
    const field = form.formFields[f]
    if (field.type === "group") {
      return {
        ...res,
        [f]: getInitialTouches(field)
      }
    } else {
      return {
        ...res,
        [f]: false
      }
    }
  }, {})
}