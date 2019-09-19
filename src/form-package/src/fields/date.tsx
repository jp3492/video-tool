import React from 'react'
import DatePicker from 'react-datepicker'

export const Date = ({
  id,
  label,
  description,
  onBlur,
  onChange,
  value,
  touched,
  error,
  config
}) => {

  return (
    <div className={`rf-file field-${id}`}>
      <label className="rf-field-label">
        {label}
      </label>
      <span className="rf-field-description">
        {description}
      </span>
      <DatePicker
        onBlur={() => onBlur(id)}
        selected={value}
        onChange={date => onChange(id, date)}
        showYearDropdown
        dateFormatCalendar="MMMM"
        scrollableYearDropdown
        yearDropdownItemNumber={15}
        {
        ...config
        } />
      <span className="rf-field-error">
        {touched ? error : ""}
      </span>
    </div>
  )
}