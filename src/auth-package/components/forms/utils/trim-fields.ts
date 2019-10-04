export const trimFields = (
  form,
  hiddenFields,
  visibleFields
) => {
  const reduceFormLevel = fields => Object.keys(fields).reduce((res, f) => {
    if (hiddenFields.includes(fields[f].id) || (fields[f].hidden && !visibleFields.includes(fields[f].id))) {
      return res
    } else if (fields[f].hasOwnProperty("formFields")) {
      return {
        ...res,
        [f]: {
          ...fields[f],
          formFields: reduceFormLevel(fields[f].formFields)
        }
      }
    } else {
      return {
        ...res,
        [f]: fields[f]
      }
    }
  }, {})
  return {
    ...form,
    formFields: reduceFormLevel(form.formFields)
  }
}