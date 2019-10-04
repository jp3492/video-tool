export const addIdsToObject = (form, givenPath = "") => {
  return Object.keys(form.formFields).reduce((res, f) => {
    const field = form.formFields[f]
    const path = `${givenPath}${givenPath !== "" ? "." : ""}${f}`

    if (field.type === "list") {
      return {
        ...res,
        formFields: {
          ...res.formFields,
          [f]: {
            ...addIdsToObject(field, path),
            id: path,
            inGrid: form.hasOwnProperty("grid")
          }
        }
      }
    } else if (field.type !== "group") {
      let addSetValues = res.formFields[f].setValues ?
        {
          setValues: res.formFields[f].setValues.map(v => {
            const targetPath = v.targetField.split(".")
            return {
              ...v,
              targetField: targetPath.slice(targetPath.indexOf(path.split('.')[0]), targetPath.length).join(".")
            }
          })
        } :
        {}
      return {
        ...res,
        formFields: {
          ...res.formFields,
          [f]: {
            ...res.formFields[f],
            id: path,
            inGrid: form.hasOwnProperty("grid"),
            ...addSetValues
          }
        }
      }
    } else {
      return {
        ...res,
        formFields: {
          ...res.formFields,
          [f]: {
            ...addIdsToObject(field, path),
            id: path,
            inGrid: form.hasOwnProperty("grid")
          }
        }

      }
    }
  }, givenPath === "" ? { ...form, id: "" } : form)
}