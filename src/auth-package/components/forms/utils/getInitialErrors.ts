import { validateField } from "."

export const getInitialErrors = (form) => {
  return Object.keys(form.formFields).reduce((res, f) => {
    const field = form.formFields[f]
    if (field.type === "group") {
      return {
        ...res,
        [f]: getInitialErrors(field)
      }
    } else {
      return {
        ...res,
        [f]: validateField(field, field.initialValue || "")
      }
    }
  }, {})
}