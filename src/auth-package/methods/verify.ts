import Auth from '@aws-amplify/auth'

export const verifyAttribute = async (attr) => {
  try {
    return await Auth.verifyCurrentUserAttribute(attr)
  } catch (error) {
    throw Error(error)
  }
}

export const verifyAttributeSubmit = async (
  attr,
  code
) => {
  try {
    return await Auth.verifyCurrentUserAttributeSubmit(attr, code)
  } catch (error) {
    throw Error(error)
  }
}