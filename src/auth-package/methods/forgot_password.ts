import Auth from '@aws-amplify/auth'
import { StatusEnum } from '../models/enums'
import { updateStatus, updateUserName, updateError } from '../components/use_authentication'

export const forgotPassword = async ({
  username
}) => {
  updateUserName(username)
  try {
    const data = await Auth.forgotPassword(username)
    console.log(data)
    updateStatus(StatusEnum.PASSWORD_RESETTED)
  } catch (error) {
    console.error(error)
    updateError(error.message)
  }
}