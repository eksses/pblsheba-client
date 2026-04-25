import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Export, DownloadSimple, X } from '@phosphor-icons/react';

const AddToHomeScreen = () => {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [platform, setPlatform] = useState('');

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('ios');
    } else if (/android/.test(userAgent)) {
      setPlatform('android');
    }

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    let isDismissed = false;
    try {
      isDismissed = sessionStorage.getItem('pwa_prompt_dismissed') === 'true';
    } catch (e) {
      console.warn('Session storage blocked');
    }
    
    if (isStandalone || isDismissed) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShowPrompt(true), 4000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    if (/iphone|ipad|ipod/.test(userAgent) && !isStandalone && !isDismissed) {
      setTimeout(() => setShowPrompt(true), 6000);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    try {
      sessionStorage.setItem('pwa_prompt_dismissed', 'true');
    } catch (e) {
      // Fallback if storage is blocked
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="pwa-prompt fade-up">
      <button className="pwa-close" onClick={dismissPrompt} aria-label="Close">
        <X size={14} weight="bold" />
      </button>
      
      <div className="pwa-icon">
        <img src="/logo.png" alt="PBL Sheba" />
      </div>

      <div className="pwa-content">
        <h3>{t('brand_name')}</h3>
        <p>
          {platform === 'ios' 
            ? t('pwa_install_ios', 'Tap share and "Add to Home Screen" to install.') 
            : t('pwa_install_android', 'Install our app for a faster experience.')}
        </p>
      </div>

      {platform === 'android' && deferredPrompt ? (
        <button className="btn btn-primary btn-sm" onClick={handleInstall} style={{ padding: '0 12px', height: 32, fontSize: '0.75rem' }}>
          <DownloadSimple size={16} weight="bold" />
          {t('install', 'Install')}
        </button>
      ) : platform === 'ios' ? (
        <div className="ios-hint">
          <Export size={20} weight="bold" />
          <span>{t('tap_share', 'Share')}</span>
        </div>
      ) : null}
    </div>
  );
};

export default AddToHomeScreen;
