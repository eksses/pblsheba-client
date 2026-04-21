import React from 'react';
import { createPortal } from 'react-dom';
import Spinner from '../ui/Spinner';

const GlobalLoading = ({ open, text }) => {
  if (!open) return null;

  return createPortal(
    <div className="global-loading-overlay">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <Spinner size={40} weight="bold" color="var(--primary)" />
        <div className="loading-text" style={{ fontWeight: 600, color: 'var(--text-heading)' }}>
          {text || 'Processing...'}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default GlobalLoading;
