import React from 'react';
import './DisplayBox.css';

interface DisplayBoxProps {
  label: string;
  value: string | number;
}

export const DisplayBox: React.FC<DisplayBoxProps> = ({ label, value }) => {
  return (
    <div className="display-box">
      <div className="display-label">{label}</div>
      <div className="display-value">{value}</div>
    </div>
  );
};
