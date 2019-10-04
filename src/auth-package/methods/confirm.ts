import Auth from '@aws-amplify/auth'
import { StatusEnum, AuthErrorsEnum } from '../models/enums'
import { updateStatus, updateError } from '../components/use_authentication'

export const confirm = async ({
  username,
  code
}) => {
  try {
    await Auth.confirmSignUp(username, code)
    updateStatus(StatusEnum.SIGNED_OUT)
    updateError("")
  } catch (error) {
    updateError(AuthErrorsEnum.ConfirmationFailed)
    updateStatus(StatusEnum.CONFIRMATION_REQUIRED)
    throw Error(error)
  }
}