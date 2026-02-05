import React from 'react';

type InputProps = {
  label: string;
  placeholder?: string;
  value?: string;
  type?: string;
  onChange?: (value: string) => void;
};

const Input = ({ label, placeholder, value, type = 'text', onChange }: InputProps) => {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
      />
    </label>
  );
};

export default Input;
