import React, { ChangeEvent } from "react";
import "./input.scss";

export const InputField = ({
  label,
  className,
  ...inputProps
}: {
  label?: string;
  className?: string;
  type?: "text" | "number" | "email" | "password";
  disabled?: boolean;
  value: any;
  placeholder?: string;
  onChange: any;
}) => {
  return (
    <div className={`input ${className ? className : ""}`}>
      {label && <label>{label}</label>}
      <input {...inputProps} />
    </div>
  );
};
