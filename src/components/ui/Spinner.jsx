import React from 'react';
import { Spinner as SpinnerIcon } from '@phosphor-icons/react';

const Spinner = ({ size = 18, color = 'currentColor', className = '', ...props }) => {
  return (
    <SpinnerIcon 
      size={size} 
      color={color} 
      className={`spin ${className}`} 
      style={{ animation: 'spin 1s linear infinite', ...props.style }}
      {...props}
    />
  );
};

export default Spinner;
