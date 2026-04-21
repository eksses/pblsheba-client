import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { House, MagnifyingGlass, ClipboardText, User } from '@phosphor-icons/react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAt = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: House },
    { path: '/search', label: 'Search', icon: MagnifyingGlass },
    { path: '/survey', label: 'Survey', icon: ClipboardText },
    { path: '/profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map(({ path, label, icon: Icon }) => (
        <button 
          key={path} 
          onClick={() => navigate(path)} 
          className={`bottom-nav-item${isAt(path) ? ' active' : ''}`}
        >
          <Icon size={22} weight={isAt(path) ? 'fill' : 'regular'} />
          <span style={{ fontSize: '0.75rem', marginTop: 4 }}>{label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
