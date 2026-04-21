import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, LockKey, CheckFat } from '@phosphor-icons/react';
import axiosClient from '../../api/axiosClient';
import { useToast } from '../../context/ToastContext';
import { useAuthStore } from '../../store/useAuthStore';

const ForceReset = () => {
  const [pw, setPw] = useState('');
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const { logout } = useAuthStore();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.patch('/users/change-password', { newPassword: pw });
      toast.success('Password updated! Please sign in again.');
      logout();
      navigate('/login');
    } catch (err) {
      toast.error('Error updating password. Please try again.');
    }
  };

  return (
    <div className="auth-page fade-up">
      <div className="auth-body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="auth-card">
          <div className="auth-logo">
            <ShieldCheck size={22} weight="fill" color="white" />
          </div>
          <h1 className="auth-title">{t('set_new_password')}</h1>
          <p className="auth-sub">{t('permanent_password_desc')}</p>
          <form onSubmit={submit}>
            <div className="field-group" style={{ marginBottom: 20 }}>
              <label className="field-label">{t('new_password_label')}</label>
              <div className="input-icon-wrap">
                <LockKey size={16} />
                <input 
                  type="password" 
                  className="field-input" 
                  placeholder="Choose a secure password" 
                  value={pw} 
                  onChange={e => setPw(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full" style={{ height: 48 }}>
              <CheckFat size={17} weight="bold" /> Save Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForceReset;
