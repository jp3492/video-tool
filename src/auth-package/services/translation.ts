export const getTranslation = (key, language, type) => translations[key][language][type]

const translations = {
  COMPLETE_PASSWORD: {
    'en-US': {
      header: 'Set password',
      link: 'Set password here'
    },
    'de-DE': {
      header: 'Passwort setzen',
      link: 'Hier passwort setzen'
    }
  },
  CONFIRM: {
    'en-US': {
      header: 'Confirm registration',
      link: 'Confirm registration here'
    },
    'de-DE': {
      header: 'Registrierung bestätigen',
      link: 'Hier Registrierung bestätigen'
    }
  },
  submit: {
    'en-US': {
      label: "Submit"
    },
    'de-DE': {
      label: "Absenden"
    }
  },
  SIGN_UP: {
    'en-US': {
      header: 'Register',
      link: 'Sign up here!'
    },
    'de-DE': {
      header: 'Registrieren',
      link: 'Hier registrieren'
    }
  },
  FORGOT_PASSWORD: {
    'en-US': {
      header: 'Reset password',
      link: 'Forgot password?'
    },
    'de-DE': {
      header: 'Passwort zurücksetzen',
      link: 'Passwort vergessen?'
    }
  },
  SIGN_IN: {
    'en-US': {
      header: 'Sign in',
      link: 'Sign in here'
    },
    'de-DE': {
      header: 'Anmelden',
      link: 'Hier anmelden'
    }
  },
  FORGOT_PASSWORD_SUBMIT: {
    'en-US': {
      header: 'Set new password',
      link: 'Set new password here'
    },
    'de-DE': {
      header: 'Passwort neu setzen',
      link: 'Hier neues passwort setzen'
    }
  },
  email: {
    'en-US': {
      label: 'Email',
      placeholder: 'Enter email'
    },
    'de-DE': {
      label: 'Email',
      placeholder: 'Email eingeben'
    }
  },
  username: {
    'en-US': {
      label: 'Username',
      placeholder: 'Your username'
    },
    'de-DE': {
      label: 'Benutzername',
      placeholder: 'Dein Benutzername'
    }
  },
  phone_number: {
    'en-US': {
      label: 'Phone Nnumber',
      placeholder: 'Enter number'
    },
    'de-DE': {
      label: 'Telefon Nummer',
      placeholder: 'Nummer eingeben'
    }
  },
  password: {
    'en-US': {
      label: 'Password',
      placeholder: 'Enter password'
    },
    'de-DE': {
      label: 'Passwort',
      placeholder: 'Passwort eingeben'
    }
  },
  new_password: {
    'en-US': {
      label: 'New Password',
      placeholder: 'Enter new password'
    },
    'de-DE': {
      label: 'Neues Passwort',
      placeholder: 'Neues passwort eingeben'
    }
  },
}