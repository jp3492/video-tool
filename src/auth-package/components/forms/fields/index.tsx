import React from 'react'

import Text from './input/input'

export const Field = (props: any) => {
  const {
    defaultValue,
    disabledFields = [],
    enabledFields = [],
    visibleFields = [],
    hiddenFields = [],
    disabled,
    hidden,
    visible,
    ...fieldProps
  } = props

  const isDisabled = disabledFields.includes(fieldProps.id)

  if (hiddenFields.includes(fieldProps.id) || (hidden && !visibleFields.includes(fieldProps.id))) {
    return null
  }

  switch (props.type) {
    case "input": return <Text {...fieldProps} disabled={isDisabled} />
    default: return null
  }
}