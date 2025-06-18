import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: number;  // Size in pixels
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 40 }) => {
  return (
    <div 
      className="loading-spinner"
      style={{ 
        width: size,
        height: size
      }}
    >
      <div className="spinner-dot"></div>
    </div>
  );
};
