import React from 'react'

export const Select = ({
  label,
  description,
  id,
  value,
  disabled,
  onChange,
  onBlur,
  hidden,
  touched,
  error,
  options = []
}) => {

  return (
    <div className={`rf-select field-${id}`}>
      <label className="rf-field-label">
        {label}
      </label>
      <span className="rf-field-description">
        {description}
      </span>
      <select
        name={id}
        value={value}
        disabled={disabled}
        onChange={({ target: { name, value } }) => onChange(name, value)}
        onBlur={({ target: { name } }) => onBlur(name)}
        data-hidden={hidden}
        data-valid={touched ? error !== "" : false}>
        <option value="">
          None
        </option>
        {
          options.map(({
            key, value
          }, i) => (
              <option
                value={key}
                key={i}>
                {value}
              </option>
            ))
        }
      </select>
      <span className="rf-field-error">
        {touched ? error : null}
      </span>
    </div>
  )
}
