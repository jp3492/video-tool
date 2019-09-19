import React from 'react'

export const Checkbox = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  description,
  error,
  disabled,
  hidden,
  touched
}) => {

  return (
    <div className={`rf-checkbox field-${id}`}>
      <label className="rf-field-label">
        {label}
      </label>
      <label>
        <input
          name={id}
          type="checkbox"
          value={value}
          onChange={({ target: { name, value } }) => onChange(name, Boolean(value))}
          onBlur={({ target: { name } }) => onBlur(name)}
          disabled={disabled}
          data-hidden={hidden}
          data-valid={touched ? error !== "" : false} />
        <span>{description}</span>
      </label>
      <span className="rf-field-error">
        {touched ? error : null}
      </span>
    </div>
  )
}