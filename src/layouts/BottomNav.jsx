import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { House, MagnifyingGlass, ClipboardText, User } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const isAt = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: t('dashboard') || 'Home', icon: House },
    { path: '/search', label: t('search_members') || 'Search', icon: MagnifyingGlass },
    { path: '/survey', label: t('collect_data') || 'Survey', icon: ClipboardText },
    { path: '/profile', label: t('my_profile') || 'Profile', icon: User }
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map(({ path, label, icon: Icon }) => {
        const active = isAt(path);
        return (
          <button 
            key={path} 
            onClick={() => navigate(path)} 
            className={`bottom-nav-item${active ? ' active' : ''}`}
            aria-label={label}
          >
            <Icon 
              size={24} 
              weight={active ? 'fill' : 'bold'} 
              style={{ transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)', transform: active ? 'scale(1.1)' : 'scale(1)' }}
            />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
