import Auth from '@aws-amplify/auth'
import { StatusEnum, AuthErrorsEnum } from '../models/enums'
import { updateStatus, updateError } from '../components/use_authentication'

export const forgotPasswordSubmit = async ({
  username,
  code,
  new_password
}) => {
  try {
    const data = await Auth.forgotPasswordSubmit(username, code, new_password)
    console.log(data)
    updateStatus(StatusEnum.SIGNED_IN)
  } catch (error) {
    console.error(error)
  }
}