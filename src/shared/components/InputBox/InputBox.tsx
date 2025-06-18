import React from 'react';
import './InputBox.css';

interface InputBoxProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'number';
  placeholder?: string;
}

export const InputBox: React.FC<InputBoxProps> = ({ 
  label, 
  value, 
  onChange, 
  type = 'text',
  placeholder 
}) => {
  return (
    <div className="input-box">
      <div className="input-label">{label}</div>
      <input
        type={type}
        className="input-value"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};
