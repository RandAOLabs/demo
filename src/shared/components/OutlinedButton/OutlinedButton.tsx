import React from 'react';
import './OutlinedButton.css';

interface OutlinedButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const OutlinedButton: React.FC<OutlinedButtonProps> = ({ 
  text, 
  onClick,
  className = '',
  disabled = false
}) => {
  return (
    <button 
      className={`outlined-button ${className} ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default OutlinedButton;
