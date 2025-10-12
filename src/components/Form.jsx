import React from "react";
import "../styles/Form.css";

export function Form({ onSubmit, className = "", children, ...props }) {
  return (
    <form className={`ui-form ${className}`} onSubmit={onSubmit} {...props}>
      {children}
    </form>
  );
}

export function FormField({
  id,
  name,
  label,
  type,
  value,
  onChange,
  placeholder,
  error,
  helpText,
  required,
  ...props
}) {
  const inputId = id || name;
  return (
    <div className={`ui-field ${error ? "has-error" : ""}`}>
      {label && (
        <label className="ui-field__label" htmlFor={inputId}>
          {label} {required && <span aria-hidden="true">*</span>}
        </label>
      )}
      <input
        className="ui-input"
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={helpText ? `${inputId}-help` : undefined}
        required={required}
        {...props}
      />
      {helpText && (
        <div id={`${inputId}-help`} className="ui-field__help">{helpText}</div>
      )}
      {error && <div className="ui-field__error">{error}</div>}
    </div>
  );
}

export function TextAreaField({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  error,
  required,
  ...props
}) {
  const areaId = id || name;
  return (
    <div className={`ui-field ${error ? "has-error" : ""}`}>
      {label && (
        <label className="ui-field__label" htmlFor={areaId}>
          {label} {required && <span aria-hidden="true">*</span>}
        </label>
      )}
      <textarea
        className="ui-input ui-textarea"
        id={areaId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        aria-invalid={!!error}
        required={required}
        {...props}
      />
      {error && <div className="ui-field__error">{error}</div>}
    </div>
  );
}

export function SelectField({
  id,
  name,
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select…",
  error,
  required,
  ...props
}) {
  const selectId = id || name;
  return (
    <div className={`ui-field ${error ? "has-error" : ""}`}>
      {label && (
        <label className="ui-field__label" htmlFor={selectId}>
          {label} {required && <span aria-hidden="true">*</span>}
        </label>
      )}
      <select
        className="ui-select"
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={!!error}
        {...props}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      {error && <div className="ui-field__error">{error}</div>}
    </div>
  );
}

export function CheckboxField({
  id,
  name,
  label,
  checked,
  onChange,
  error,
  required,
  ...props
}) {
  const inputId = id || name;
  return (
    <div className={`ui-check ${error ? "has-error" : ""}`}>
      <input
        className="ui-check__input"
        id={inputId}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        required={required}
        aria-invalid={!!error}
        {...props}
      />
      <label className="ui-check__label" htmlFor={inputId}>{label}</label>
      {error && <div className="ui-field__error ui-field__error--inline">{error}</div>}
    </div>
  );
}

export function Button({ children, variant = "primary", className = "", ...props }) {
  return (
    <button className={`${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function FormActions({ children, align = "end", className = "" }) {
  return <div className={`ui-actions ui-actions--${align} ${className}`}>{children}</div>;
}

export function FileUploadField({
  id,
  name,
  label = "Upload File",
  onChange,
  value,
  accept = "*",
  error,
  required,
  ...props
}) {
  const inputId = id || name;
  const fileName = value ? value.name : "No file chosen";

  return (
    <div className={`ui-field ${error ? "has-error" : ""}`}>
      {label && (
        <label className="ui-field__label" htmlFor={inputId}>
          {label} {required && <span aria-hidden="true">*</span>}
        </label>
      )}

      <div className="ui-file">
        <input
          id={inputId}
          name={name}
          type="file"
          accept={accept}
          onChange={onChange}
          required={required}
          {...props}
        />
        <label htmlFor={inputId} className="ui-btn ui-btn--outline">
          Upload File
        </label>
        <span className="ui-file__name">{fileName}</span>
      </div>

      {error && <div className="ui-field__error">{error}</div>}
    </div>
  );
}
