import Amplify from '@aws-amplify/core'

import { iConfiguration } from '../models/interfaces'
import { updateConfigureStatus } from '../components/use_authentication'
import { configureInterface } from '../components/auth_form'

export const configure = async (configuration: iConfiguration) => {
  try {
    if (configuration.interface) {
      configureInterface(configuration.interface)
    }
    Amplify.configure(configuration.cognito)
    updateConfigureStatus(true)
  } catch (error) {
    throw Error(error)
  }
}