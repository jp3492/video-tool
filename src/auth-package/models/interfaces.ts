import { ViewEnum } from './enums'

interface iCognito {
  'aws_project_region': string,
  'aws_appsync_region': string,
  'aws_appsync_authenticationType': string,
  'aws_cognito_region': string,
  'aws_user_pools_id': string,
  'aws_user_pools_web_client_id': string,
  Analytics: any
}

export enum IdentityAttributes {
  email = "email",
  username = "username",
  phone_number = "phone_number"
}

export enum UserAttributes {
  email = "email",
  phone_number = "phone_number",
  birthdate = "birthdate",
  address = "address",
  gender = "gender",
  name = "name",
  given_name = "given_name",
  middle_name = "middle_name"
}

export interface iInterface {
  identifyWith?: IdentityAttributes,
  requiredAttributes?: UserAttributes[],
  disableViews: ViewEnum[],
  language?: string
}

export interface iConfiguration {
  cognito: iCognito,
  interface?: iInterface
}