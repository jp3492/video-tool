import { getValueByPath } from './get-value-by-path'

const getFieldInitialValue = field => {

  if (field.hasOwnProperty("initialValue") && field.initialValue !== "") {
    return field.initialValue
  }
  if (field.hasOwnProperty("defaultValue")) {
    return field.defaultValue
  }
  if (field.type === "list" || field.type === "array" || (field.type === "file" && field.multiple)) {
    return []
  }
  return ""
}

let initialValues = {}

export const getInitialValues = (form) => {

  if (form.hasOwnProperty("initialValues")) {
    initialValues = form.initialValues
  }
  return Object.keys(form.formFields).reduce((res, f) => {
    const field = form.formFields[f]

    if (field.type === "group") {
      return {
        ...res,
        [f]: getInitialValues(field)
      }
    } else {
      // console.log(parentPath, field.id)
      // console.log(trimId(parentPath, field.id))
      return {
        ...res,
        // 
        [f]: getFieldInitialValue({
          ...field,
          initialValue: getValueByPath(initialValues, field.id)
        })
      }
    }
  }, {})
}