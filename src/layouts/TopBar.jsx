import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { House, MagnifyingGlass, ClipboardText, User, SignOut } from '@phosphor-icons/react';
import { useAuthStore } from '../store/useAuthStore';
import LangToggle from '../components/common/LangToggle';

const TopBar = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isAt = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: <House size={15}/> },
    { path: '/search', label: 'Search', icon: <MagnifyingGlass size={15}/> },
    { path: '/survey', label: 'Survey', icon: <ClipboardText size={15}/> },
    { path: '/profile', label: 'Profile', icon: <User size={15}/> }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="inner-topbar">
      <div 
        className="inner-topbar-brand" 
        onClick={() => navigate('/')}
        style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
      >
        <img src="/logo.png" alt="Logo" style={{ width: 28, height: 28, borderRadius: 6 }} />
        PBL Sheba
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div className="desktop-only-flex" style={{ gap: 2 }}>
          {navItems.map(({ path, label, icon }) => (
            <button 
              key={path} 
              onClick={() => navigate(path)} 
              className="navbar-link" 
              style={{ 
                fontSize: '0.85rem', 
                color: isAt(path) ? 'var(--green)' : undefined, 
                gap: 5 
              }}
            >
              {icon} {label}
            </button>
          ))}
        </div>
        <LangToggle />
        <button 
          className="btn btn-ghost btn-sm" 
          onClick={handleLogout} 
          style={{ padding: '0 10px', color: 'var(--grey-400)' }} 
          title="Sign out"
        >
          <SignOut size={18} />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
