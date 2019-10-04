import Auth from '@aws-amplify/auth'
import { StatusEnum, AuthErrorsEnum } from '../models/enums'
import { updateStatus, updateError, updateUserName } from '../components/use_authentication'
import { request } from '../../auth-package'

export const signUp = async ({
  username,
  password,
  // attributes: {
  //   email,
  //   phone_number
  // }
}) => {
  try {
    const user = await Auth.signUp({
      username,
      password
    })
    await request({
      api: "CONTENT",
      url: "/user",
      method: "POST",
      body: {
        email: username,
        cognitoId: user.userSub
      }
    })
    updateUserName(username)
    updateStatus(StatusEnum.CONFIRMATION_REQUIRED)
  } catch (error) {
    updateError(AuthErrorsEnum.RegistrationFailed)
    updateStatus(StatusEnum.SIGNED_OUT)
  }
}
