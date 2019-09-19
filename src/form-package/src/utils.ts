import { validateField } from './validation'

const getDefaultValue = field => {
  if (field.hasOwnProperty("defaultValue")) {
    return field.defaultValue
  } else {
    switch (field.type) {
      case "list": return []
      case "select": return ""
      case "input": return field.inputType === "number" ? 0 : ""
      case "file": return null
      case "checkbox": return false
      case "multiple-select": return []
      case "range": return 0
      default: return ""
    }
  }
}

const getInitialValue = (path, initialValues = {}) => {
  const steps = path.split(".")
  if (typeof initialValues[steps[0]] === 'object' && !(initialValues[steps[0]] instanceof Array)) {
    return getInitialValue(steps.slice(1, steps.length), initialValues[steps[0]])
  } else {
    return initialValues[steps[0]]
  }
}

export const flatFields = (formId, fields, initialValues, prev = {}, prefix = "") =>
  Object.keys(fields).reduce((res, field) => {
    const thisField = fields[field]
    const id = prefix + `${prefix !== "" ? "." : ""}` + field
    if (thisField.type !== "group") {
      const value = getInitialValue(id, initialValues) || getDefaultValue(thisField)
      if (thisField.type !== "list") {

        return {
          ...res,
          [id]: {
            ...thisField,
            value,
            error: validateField(thisField.validation, value),
            formId,
            touched: false,
            id
          }
        }
      } else {
        return {
          ...res,
          [id]: {
            ...thisField,
            value,
            error: validateField(thisField.validation, value),
            formId,
            touched: false,
            id
          }
        }
        // const {
        //   fields: listFields,
        //   ...listProps
        // } = thisField
        // const prePrev = {
        //   ...res,
        //   [id]: {
        //     ...listProps,
        //     value,
        //     error: validateField(thisField.validation, value),
        //     formId,
        //     id

        //   }

        // }
        // return flatFields(formId + id, thisField.fields, initialValues, prePrev, prefix + `${prefix !== "" ? "." : ""}` + field)
      }
    } else {
      const prePrev = {
        ...res,
        [id]: {
          type: "group",
          id
        }
      }
      return flatFields(formId, thisField.fields, initialValues, prePrev, prefix + `${prefix !== "" ? "." : ""}` + field)
    }
  }, prev)