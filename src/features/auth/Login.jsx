import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, LockKey, SignIn, Warning, Spinner, CaretLeft } from '@phosphor-icons/react';
import axiosClient from '../../api/axiosClient';
import { useAuthStore } from '../../store/useAuthStore';
import LangToggle from '../../components/common/LangToggle';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axiosClient.post('/auth/login', { phone, password });
      login(data, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Incorrect phone or password.');
    } finally {
      setLoading(false);
    }
  };

  const { t } = useTranslation();

  return (
    <div className="auth-page fade-up">
      <div className="auth-topbar">
        <button className="auth-back" onClick={() => navigate(-1)}>
          <CaretLeft size={15} weight="bold" /> {t('back')}
        </button>
        <div style={{ marginLeft: 'auto' }}>
          <LangToggle />
        </div>
      </div>
      <div className="auth-body">
        <div className="auth-card">
          <div className="auth-logo" style={{ background: 'none', width: 'auto', height: 'auto' }}>
            <img src="/logo.png" alt="PBL Sheba" style={{ width: 48, height: 48, borderRadius: 12 }} />
          </div>
          <h1 className="auth-title">{t('welcome_back')}</h1>
          <p className="auth-sub">{t('login_subtitle')}</p>

          {error && (
            <div className="alert-error">
              <Warning size={16} weight="fill" style={{ flexShrink: 0 }} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label className="field-label">{t('phone')}</label>
              <div className="input-icon-wrap">
                <Phone size={16} />
                <input 
                  type="tel" 
                  className="field-input" 
                  placeholder="017-XXXXXXXX" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  required 
                  autoFocus 
                />
              </div>
            </div>
            <div className="field-group" style={{ marginBottom: 24 }}>
              <label className="field-label">{t('password')}</label>
              <div className="input-icon-wrap">
                <LockKey size={16} />
                <input 
                  type="password" 
                  className="field-input" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ height: 48 }}>
              {loading ? (
                <Spinner size={18} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <>
                  <SignIn size={17} /> {t('sign_in')}
                </>
              )}
            </button>
          </form>

          <div className="auth-divider" />
          <p className="auth-footer-text">
            {t('no_account_msg')}{' '}
            <span className="auth-footer-link" onClick={() => navigate('/register')}>{t('register_here')}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
