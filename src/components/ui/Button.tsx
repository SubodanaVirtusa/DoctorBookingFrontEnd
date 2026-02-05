import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
};

const Button = ({ children, variant = 'primary', size = 'md', onClick, type = 'button' }: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`button button-${variant} button-${size}`}
    >
      {children}
    </button>
  );
};

export default Button;
