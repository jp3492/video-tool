import Auth from '@aws-amplify/auth'
import { StatusEnum, AuthErrorsEnum } from '../models/enums'
import { updateStatus, updateUserName } from '../components/use_authentication'

export const resendConfirmationCode = async ({
  username
}) => {
  try {
    await Auth.resendSignUp(username)
    updateUserName(username)
    updateStatus(StatusEnum.CONFIRMATION_REQUIRED)
  } catch (error) {
    updateStatus(StatusEnum.CONFIRMATION_REQUIRED)
  }
}