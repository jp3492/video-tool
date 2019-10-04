export enum RequestStatusEnum {
  LOADING = "LOADING",
  FAILED = "FAILED",
  SUCCESS = "SUCCESS",
  IDEL = "IDLE"
}

export enum StatusEnum {
  SIGNED_OUT = "SIGNED_OUT",
  SIGNED_IN = "SIGNED_IN",
  SMS_MFA = "SMS_MFA",
  SOFTWARE_TOKEN_MFA = "SOFTWARE_TOKEN_MFA",
  NEW_PASSWORD_REQUIRED = "NEW_PASSWORD_REQUIRED",
  CONFIRMATION_REQUIRED = "CONFIRMATION_REQUIRED",
  RESET_PASSWORD_REQUIRED = "RESET_PASSWORD_REQUIRED",
  PASSWORD_RESETTED = "PASSWORD_RESETTED"
}

export enum ViewEnum {
  IDLE = "IDLE",
  SIGN_IN = "SIGN_IN",
  SIGN_UP = "SIGN_UP",
  MFA = "MFA",
  COMPLETE_PASSWORD = "COMPLETE_PASSWORD",
  FORGOT_PASSWORD = "FORGOT_PASSWORD",
  FORGOT_PASSWORD_SUBMIT = "FORGOT_PASSWORD_SUBMIT",
  CHANGE_PASSWORD = "CHANGE_PASSWORD",
  CONFIRM = "CONFIRM"
}

export enum AuthErrorsEnum {
  UserNotConfirmedException = "Account has not been confirmed, please complete the registration process.",
  PasswordResetRequiredException = "Please reset your password.",
  NotAuthorizedException = "The password you have provided is incorrect.",
  UserNotFoundException = "There is no account existing for the given username/email.",
  RegistrationFailed = "Registration has failed. Please sign up again.",
  ConfirmationFailed = "Confirmation has failed. Please enter a correct code or request a new one."
}