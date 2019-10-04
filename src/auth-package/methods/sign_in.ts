import Auth from '@aws-amplify/auth'
import { StatusEnum, AuthErrorsEnum } from '../models/enums'
import { updateStatus, updateError, updateUser, updateUserName } from '../components/use_authentication'

export const signIn = async ({
  username,
  password
}) => {
  updateUserName(username)
  try {
    const user = await Auth.signIn(username, password)
    updateUser(user)
    if (user.challengeName === 'SMS_MFA' ||
      user.challengeName === 'SOFTWARE_TOKEN_MFA' ||
      user.challengeName === 'NEW_PASSWORD_REQUIRED') {
      updateStatus(user.challengeName)
    } else if (user.challengeName === 'MFA_SETUP') {
      // Not implemented yet
    } else {
      updateStatus(StatusEnum.SIGNED_IN)
    }
  } catch (err) {
    console.log(err)
    updateError(AuthErrorsEnum[err.code])
    if (err.code === 'UserNotConfirmedException') {
      updateStatus(StatusEnum.CONFIRMATION_REQUIRED)
    } else if (err.code === 'PasswordResetRequiredException') {
      updateStatus(StatusEnum.RESET_PASSWORD_REQUIRED)
    } else {
      console.error("In SignIn: ", err);
    }
  }

}