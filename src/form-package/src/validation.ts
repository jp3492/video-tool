const defaultValidationRules = {
  minValue: (ruleValue, value) => value < ruleValue ? `Values must be ${ruleValue} or greater.` : "",
  maxValue: (ruleValue, value) => value > ruleValue ? `Value must be ${ruleValue} or smaller.` : "",
  required: (ruleValue, value) => value !== "" ? "" : "Required!",
  minLength: (ruleValue, value) => value.length >= ruleValue ? "" : `Minimum of ${ruleValue} characters required!`,
  maxLength: (ruleValue, value) => value.length <= ruleValue ? "" : `Maximum of ${ruleValue} characters exceeded!`
}

interface iRule {
  (ruleValue: any, value: any): string
}

export let validationRules: { [key: string]: iRule } = {
  ...defaultValidationRules
}

export const setCustomValidationRules = (rules: { [key: string]: iRule }) => {
  validationRules = {
    ...validationRules,
    ...rules
  }
}

export const validateField = (validation, initialValue) => {
  if (!validation) {
    return ""
  } else {
    return Object.keys(validation).reduce((error, rule) => {
      const newError = error + (error === "" ? "" : `, `) + validationRules[rule](validation[rule], initialValue)
      return newError
    }, "")
  }
}

export const isFormValid = form => {
  const {
    setValid,
    ...allFields
  } = form
  const isValid = Object.keys(allFields).every(field => !allFields[field].error || allFields[field].error === "")
  return isValid
}