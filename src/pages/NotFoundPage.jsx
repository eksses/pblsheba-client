import React from 'react';
import { useNavigate } from 'react-router-dom';
import { House } from '@phosphor-icons/react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="fade-up" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      padding: 20, 
      textAlign: 'center' 
    }}>
      <div style={{ fontSize: '6rem', fontWeight: 900, color: 'var(--grey-200)', marginBottom: -20 }}>
        404
      </div>
      <House size={120} weight="duotone" color="var(--primary)" style={{ opacity: 0.1, marginBottom: 30 }} />
      <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 10 }}>Page Not Found</h1>
      <p className="text-muted" style={{ maxWidth: 400, marginBottom: 30 }}>
        The page you are looking for might have been removed or is temporarily unavailable.
      </p>
      <button className="btn btn-primary" onClick={() => navigate('/')}>
        Go to Home
      </button>
    </div>
  );
};

export default NotFoundPage;
