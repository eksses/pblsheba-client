import React from 'react';

/**
 * Premium Skeleton Loader for Low-End Devices
 * Uses lightweight CSS animations instead of complex JS-based ones.
 */
const Skeleton = ({ width, height, borderRadius = 8, className = '' }) => {
  return (
    <div 
      className={`skeleton-loader ${className}`}
      style={{ 
        width: width || '100%', 
        height: height || '20px', 
        borderRadius: borderRadius 
      }}
    />
  );
};

export default Skeleton;
