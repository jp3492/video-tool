import React from 'react'

interface iInput {
  id: string,
  inputType?: "text" | "number" | "email" | "password" | "textarea",
  initialValue?: string | number,
  label?: string,
  description?: string,
  covered?: boolean,
  value: string | number,
  disabled?: boolean,
  onChange: any,
  onBlur: any,
  hidden?: boolean,
  touched: boolean,
  error: string,
  placeholder?: string
}

export const Input = (props: iInput) => {
  const {
    id,
    label,
    description,
    inputType,
    covered,
    value,
    disabled,
    onChange,
    onBlur,
    hidden,
    touched,
    error,
    placeholder
  } = props

  return (
    <div className={`rf-input field-${id}`}>
      <label className="rf-field-label">
        {label}
      </label>
      <span className="rf-field-description">
        {description}
      </span>
      {
        inputType === "textarea" && !covered ?
          <textarea
            name={id}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            onChange={({ target: { name, value } }) => onChange(name, value)}
            onBlur={({ target: { name } }) => onBlur(name)}
            data-hidden={hidden}
            data-valid={touched ? error !== "" : false} /> :
          <input
            name={id}
            type={covered ? "password" : inputType}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            onChange={({ target: { name, value } }) => onChange(name, inputType === "number" ? Number(value) : value)}
            onBlur={({ target: { name } }) => onBlur(name)}
            data-hidden={hidden}
            data-valid={touched ? error === "" : true} />
      }
      <span className="rf-field-error">
        {touched ? error : null}
      </span>
    </div>
  )
}