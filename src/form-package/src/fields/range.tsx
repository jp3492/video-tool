import React from 'react'

export const Range = ({
  id,
  label,
  description,
  onBlur,
  onChange,
  value,
  error,
  min,
  max,
  disabled,
  hidden,
  touched
}) => {
  return (
    <div className={`rf-range field-${id}`}>
      <label className={`rf-input field-${id}`}>
        {label}
      </label>
      <span className="rf-field-description">
        {description}
      </span>
      <input
        name={id}
        min={min}
        max={max}
        type="range"
        value={value}
        disabled={disabled}
        onChange={({ target: { name, value } }) => onChange(name, Number(value))}
        onBlur={({ target: { name } }) => onBlur(name)}
        data-hidden={hidden}
        data-valid={touched ? error === "" : true} />
      <span>
        {value}
      </span>
      <span className="rf-field-error">
        {touched ? error : null}
      </span>
    </div>
  )
}