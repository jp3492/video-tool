import Auth from '@aws-amplify/auth'
import { StatusEnum } from '../models/enums'
import { updateStatus, updateUser, user } from '../components/use_authentication'

export const completePassword = async ({
  new_password,
  requiredAttributes = {}
}) => {
  try {
    const newUser = await Auth.completeNewPassword(user, new_password, requiredAttributes)
    updateUser(newUser)
    updateStatus(StatusEnum.SIGNED_IN)
  } catch (error) {
    console.error(error)
    updateStatus(StatusEnum.NEW_PASSWORD_REQUIRED)
  }
}