import React from 'react';

const StatusBadge = ({ status }) => {
  const map = { 
    approved: 'badge-green', 
    pending: 'badge-amber', 
    rejected: 'badge-red' 
  };
  
  return (
    <span className={`badge ${map[status] || 'badge-amber'}`}>
      {status || 'pending'}
    </span>
  );
};

export default StatusBadge;
