import Auth from '@aws-amplify/auth'
import { StatusEnum, AuthErrorsEnum } from '../models/enums'
import { updateStatus, updateError, updateUserName } from '../components/use_authentication'
import { postUser } from '../../state/actions'

export const signUp = async ({
  username,
  password
}) => {
  try {
    const user = await Auth.signUp({
      username,
      password
    })
    await postUser(username, user.userSub)
    updateUserName(username)
    updateStatus(StatusEnum.CONFIRMATION_REQUIRED)
  } catch (error) {
    updateError(AuthErrorsEnum.RegistrationFailed)
    updateStatus(StatusEnum.SIGNED_OUT)
  }
}
