import React from 'react'

export const MultipleSelect = ({
  id,
  label,
  description,
  options,
  onBlur,
  onChange,
  value,
  error,
  touched
}) => {
  const handleChange = selectedKey => {
    if (value.includes(selectedKey)) {
      onChange(id, value.filter(v => v !== selectedKey))
    } else {
      onChange(id, [...value, selectedKey])
    }
  }
  return (
    <div className={`rf-multiple-select field-${id}`}>
      <label className="rf-field-label">
        {label}
      </label>
      <span className="rf-field-description">
        {description}
      </span>
      <ul onBlur={() => onBlur(id)}>
        {
          options.map(({
            key, value
          }, i) => (
              <label key={i}>
                <input
                  type="checkbox"
                  value={value.includes(key)}
                  onChange={() => handleChange(key)}
                />
                <span>{value}</span>
              </label>
            ))
        }
      </ul>
      <span className="rf-field-error">
        {touched ? error : null}
      </span>
    </div>
  )
}