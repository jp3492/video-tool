import {
  validationRules,
  getValueByPath,
  setValueByPath,
  addIdsToObject
} from '.'

const validateRule = (rule, ruleValue, value) => {
  if (validationRules.hasOwnProperty(rule)) {
    return validationRules[rule](ruleValue, value)
  }
  console.log("validation rule doesnt exist")
  return ""
}

export const validateField = (field, value) => {
  const validations = Object.keys(field.validation || {}) // set validation rules
  // check if field has validation rules
  // console.log(field.id, validations);
  if (validations.length !== 0) {
    // reduce over all validatio rules and concat all error messages
    return validations.reduce((message, v) => {
      // get error from rule validation
      const error = validateRule(v, field.validation[v], value)
      // concat error messages if not ""
      if (error !== "") {
        return `${message} ${error}`
      }
      // otherwise return existing error
      return message
    }, "")
  } else {
    return ""
  }
}

export const validateForm = (formFields, values, prevErrors) => {
  // reduce over all formFields
  return Object.keys(formFields).reduce((res, f) => {
    const field = formFields[f] // set field object
    const fieldValue = getValueByPath(values, field.id)
    // unless field is type group, it validates the field
    if (field.type !== "group") {
      const validations = Object.keys(field.validation || {}) // set validation rules
      // check if field has validation rules
      if (validations.length !== 0) {
        // reduce over all validatio rules and concat all error messages
        const errors = validations.reduce((message, v) => {
          // get error from rule validation
          const error = validateRule(v, field.validation[v], fieldValue)
          // concat error messages if not ""
          if (error !== "") {
            return `${message} ${error}`
          }
          // otherwise return existing error
          return message
        }, "")
        // update value in errors object
        return setValueByPath(res, field.id, errors)
      }
      // dont update any error when not rules present
      return res
    } else {
      // return the same process for nested form group

      return {
        ...res,
        [f]: validateForm(addIdsToObject(field, "").formFields, values[f], res[f])
      }
    }
  }, prevErrors)
}