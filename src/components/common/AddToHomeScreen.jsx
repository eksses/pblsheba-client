import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Share, Download, X } from 'lucide-react';

const AddToHomeScreen = () => {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [platform, setPlatform] = useState('');

  useEffect(() => {
    // Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('ios');
    } else if (/android/.test(userAgent)) {
      setPlatform('android');
    }

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    
    // Hide prompt if already installed or dismissed this session
    const isDismissed = sessionStorage.getItem('pwa_prompt_dismissed');
    if (isStandalone || isDismissed) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after a short delay to not annoy the user immediately
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // For iOS, show it manually since they don't support beforeinstallprompt
    if (/iphone|ipad|ipod/.test(userAgent) && !isStandalone && !isDismissed) {
      setTimeout(() => setShowPrompt(true), 5000);
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
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="pwa-prompt fade-up">
      <button className="pwa-close" onClick={dismissPrompt} aria-label="Close">
        <X size={18} />
      </button>
      
      <div className="pwa-icon">
        <img src="/logo.png" alt="Logo" />
      </div>

      <div className="pwa-content">
        <h3>{t('brand_name')}</h3>
        <p>{platform === 'ios' ? 'Install this app on your iPhone: tap share and "Add to Home Screen"' : 'Install our app for a faster, better experience'}</p>
      </div>

      {platform === 'android' && deferredPrompt ? (
        <button className="btn btn-primary btn-sm" onClick={handleInstall}>
          <Download size={16} />
          Install
        </button>
      ) : platform === 'ios' ? (
        <div className="ios-hint">
          <Share size={16} />
          <span>Tap Share</span>
        </div>
      ) : null}
    </div>
  );
};

export default AddToHomeScreen;
