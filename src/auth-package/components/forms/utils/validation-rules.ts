export const validationRules = {
  minValue: (ruleValue, value) => value < ruleValue ? `Values must be ${ruleValue} or greater.` : "",
  maxValue: (ruleValue, value) => value > ruleValue ? `Value must be ${ruleValue} or smaller.` : "",
  required: (ruleValue, value) => value !== "" ? "" : "Required!",
  minLength: (ruleValue, value) => value.length >= ruleValue ? "" : `Minimum of ${ruleValue} characters required!`,
  maxLength: (ruleValue, value) => value.length <= ruleValue ? "" : `Maximum of ${ruleValue} characters exceeded!`,
}