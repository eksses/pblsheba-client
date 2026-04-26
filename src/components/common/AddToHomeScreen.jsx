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
      // Show custom banner for all platforms
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Initial check for iOS
    if (/iphone|ipad|ipod/.test(userAgent) && !isStandalone && !isDismissed) {
      setTimeout(() => setShowPrompt(true), 2000);
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
  };

  if (!showPrompt) return null;

  return (
    <div className="pwa-prompt fade-up" style={{
      position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
      width: 'calc(100% - 40px)', maxWidth: 400, zIndex: 9999,
      background: 'white', padding: '16px', borderRadius: 16,
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: 12
    }}>
      <div className="pwa-icon" style={{ flexShrink: 0 }}>
        <img src="/logo.png" alt="PBL Sheba" style={{ width: 40, height: 40, borderRadius: 10 }} />
      </div>

      <div className="pwa-content" style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#1a1a1a' }}>{t('brand_name')}</h3>
        <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#666', lineHeight: 1.3 }}>
          {platform === 'ios' 
            ? t('pwa_install_ios', 'Tap share and "Add to Home Screen" to install.') 
            : t('pwa_install_generic', 'Install our app for a faster experience.')}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {deferredPrompt ? (
          <button 
            className="btn-primary" 
            onClick={handleInstall} 
            style={{ 
              padding: '8px 16px', borderRadius: 8, background: 'var(--blue, #2196f3)', 
              color: 'white', border: 'none', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer'
            }}
          >
            {t('install', 'Install')}
          </button>
        ) : platform === 'ios' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--blue)' }}>
            <Export size={22} weight="bold" />
          </div>
        )}
        <button onClick={dismissPrompt} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', padding: 4 }}>
          <X size={18} weight="bold" />
        </button>
      </div>
    </div>
  );
};

export default AddToHomeScreen;
