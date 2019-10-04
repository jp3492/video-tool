import React from 'react'

interface iProps {
  // field props
  label?: string,
  description?: string,
  error: string,
  touched: boolean,
  // input specific props
  type: string,
  value: string | number,
  onChange: any,
  onBlur: any,
  inputType: string,
  id: string,
  dependencies: any[],
  placeholder: string,
  path: string[],
  inGrid: boolean
}

const placeholders: any = {
  text: "Text",
  number: "Number",
  email: "Email",
  password: "Password"
}

const Textfield = ({
  label,
  description,
  error,
  touched,
  inputType,
  id,
  dependencies,
  placeholder,
  path = id.split("."),
  inGrid,
  ...inputProps
}: iProps) => (
    <div
      style={{ gridArea: inGrid ? path[path.length - 1] : "" }}
      className={`ptf__authentication__form-${id}`}>
      <label>
        {label}
      </label>
      <p className="ptf__field__description">
        {description}
      </p>
      {
        inputType === "textarea" ?
          <textarea
            placeholder={placeholder ? placeholder : "Input Textarea..."}
            data-invalid={touched ? error !== "" : false}
            {...inputProps}
            name={id} /> :
          <input
            placeholder={placeholder ? placeholder : `Input ${placeholders[inputType]}`}
            data-invalid={touched ? error !== "" : false}
            {...inputProps}
            value={inputType === "number" ? Number(inputProps.value) : inputProps.value}
            type={inputType === "number" ? "number" : inputType === "password" ? "password" : "text"}
            name={id} />
      }
      <p className="ptf__field__error">
        {touched ? error : ""}
      </p>
    </div>
  )

export default Textfield