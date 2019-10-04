import Auth from '@aws-amplify/auth'
import { updateStatus, auth_status } from '../components/use_authentication'
import { StatusEnum } from '../models/enums'
import { signOut } from './sign_out'

export const refreshSession = async () => {
  try {
    const data = await Auth.currentSession()
    if (auth_status !== StatusEnum.SIGNED_IN) {
      updateStatus(StatusEnum.SIGNED_IN)
    }
    return data
  } catch (error) {
    console.error(`Error while refreshing session: ${error}`)
    await signOut()
  }
}