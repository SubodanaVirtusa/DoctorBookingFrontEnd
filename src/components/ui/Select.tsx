import React from 'react';

type SelectProps = {
  label: string;
  value?: string;
  options: string[];
  placeholder?: string;
  onChange?: (value: string) => void;
};

const Select = ({ label, value, options, placeholder, onChange }: SelectProps) => {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value ?? ''} onChange={(event) => onChange?.(event.target.value)}>
        <option value="" disabled>
          {placeholder ?? 'Select'}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
};

export default Select;
