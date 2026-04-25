import React from 'react';

/**
 * Skeleton component for loading states.
 * Optimized for low-end devices by using simple CSS animations.
 */
const Skeleton = ({ width, height, circle, className = '' }) => {
  const style = {
    width: width || '100%',
    height: height || '20px',
    borderRadius: circle ? '50%' : 'var(--radius-md)',
  };

  return (
    <div 
      className={`shimmer ${className}`} 
      style={style}
    />
  );
};

export default Skeleton;
