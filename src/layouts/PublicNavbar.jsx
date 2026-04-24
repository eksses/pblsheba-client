import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';
import { useAuthStore } from '../store/useAuthStore';
import LangToggle from '../components/common/LangToggle';

const PublicNavbar = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
        <img src="/logo.png" alt="PBL Sheba" style={{ width: 32, height: 32, borderRadius: 8 }} />
        <span style={{ fontWeight: 900, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>PBL Sheba</span>
      </Link>
      <div className="navbar-actions">
        <LangToggle />
        {isAuthenticated ? (
          <Link to="/" className="btn btn-primary btn-sm">Dashboard</Link>
        ) : (
          <>
            <Link to="/login" className="navbar-link">Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Register <ArrowRight size={14} weight="bold" />
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default PublicNavbar;
