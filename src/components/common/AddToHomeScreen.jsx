import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Export, X, SealCheck } from '@phosphor-icons/react';
import { useAuthStore } from '../../store/useAuthStore';

const AUTO_DISMISS_SECONDS = 7;

const AddToHomeScreen = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [platform, setPlatform] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(AUTO_DISMISS_SECONDS);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    if (isIos) setPlatform('ios');
    else if (isAndroid) setPlatform('android');

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

    // Check if user dismissed the prompt recently (within 24 hours)
    let isDismissed = false;
    try {
      const dismissedUntil = localStorage.getItem('pwa_prompt_dismissed_until');
      if (dismissedUntil && Number(dismissedUntil) > Date.now()) {
        isDismissed = true;
      }
    } catch (_) {}

    if (isStandalone || isDismissed) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Initial check for iOS devices
    let iosTimer = null;
    if (isIos && !isStandalone && !isDismissed) {
      iosTimer = setTimeout(() => setShowPrompt(true), 1800);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      if (iosTimer) clearTimeout(iosTimer);
    };
  }, []);

  // Auto-dismiss countdown timer
  useEffect(() => {
    if (!showPrompt || isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          dismissPrompt(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showPrompt, isPaused]);

  const dismissPrompt = (saveDismissal = true) => {
    setIsClosing(true);
    setTimeout(() => {
      setShowPrompt(false);
      setIsClosing(false);
      if (saveDismissal) {
        try {
          // Dismiss for 24 hours so it does not annoy the user
          localStorage.setItem('pwa_prompt_dismissed_until', String(Date.now() + 24 * 60 * 60 * 1000));
        } catch (_) {}
      }
    }, 280);
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      dismissPrompt(true);
    }
  };

  if (!showPrompt) return null;

  return (
    <div 
      className="pwa-prompt"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      style={{
        position: 'fixed',
        bottom: isAuthenticated 
          ? 'calc(env(safe-area-inset-bottom, 12px) + 72px)' 
          : 'calc(env(safe-area-inset-bottom, 12px) + 16px)',
        left: 12,
        right: 12,
        margin: '0 auto',
        maxWidth: 390,
        width: 'calc(100% - 24px)',
        boxSizing: 'border-box',
        zIndex: 9999,
        background: '#ffffff',
        borderRadius: 16,
        boxShadow: '0 12px 36px -4px rgba(0, 0, 0, 0.16), 0 4px 12px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isClosing ? 0 : 1,
        transform: isClosing ? 'translateY(16px) scale(0.97)' : 'translateY(0) scale(1)'
      }}
    >
      <div style={{ padding: '14px 14px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Top Header Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <img 
              src="/logo.png" 
              alt="Trust Unity BD" 
              style={{ width: 36, height: 36, borderRadius: 9, flexShrink: 0, objectFit: 'contain', border: '1px solid #f1f5f9' }} 
            />
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {t('brand_name') || 'Trust Unity BD'}
                </h4>
                <SealCheck size={14} weight="fill" color="#16a34a" style={{ flexShrink: 0 }} />
              </div>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>
                {platform === 'ios' ? 'iOS Web App' : 'Fast & Offline Ready'}
              </p>
            </div>
          </div>

          <button 
            onClick={() => dismissPrompt(true)}
            aria-label="Close"
            style={{ 
              background: '#f1f5f9', border: 'none', color: '#64748b', cursor: 'pointer',
              width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'background 0.2s', padding: 0
            }}
          >
            <X size={15} weight="bold" />
          </button>
        </div>

        {/* Action / Instruction Area */}
        {platform === 'ios' ? (
          <div style={{ 
            background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, 
            padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10 
          }}>
            <div style={{ 
              width: 30, height: 30, borderRadius: 8, background: '#e0f2fe', color: '#0284c7', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
            }}>
              <Export size={18} weight="bold" />
            </div>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#334155', lineHeight: 1.35 }}>
              Tap <strong style={{ color: '#0284c7' }}>Share</strong> then select <strong style={{ color: '#0f172a' }}>"Add to Home Screen"</strong> to install.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '8px 12px' }}>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#334155', lineHeight: 1.35, flex: 1 }}>
              Install on your home screen for quick 1-tap access.
            </p>
            {deferredPrompt && (
              <button 
                onClick={handleInstall} 
                style={{ 
                  padding: '6px 14px', borderRadius: 8, background: '#16a34a', 
                  color: 'white', border: 'none', fontWeight: 700, fontSize: '0.78rem', 
                  cursor: 'pointer', flexShrink: 0, boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)'
                }}
              >
                {t('install', 'Install')}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Auto-Dismiss Progress Bar */}
      <div style={{ height: 3, width: '100%', background: '#f1f5f9', overflow: 'hidden' }}>
        <div style={{ 
          height: '100%', 
          background: 'linear-gradient(90deg, #16a34a, #22c55e)',
          width: `${(timeLeft / AUTO_DISMISS_SECONDS) * 100}%`,
          transition: isPaused ? 'none' : 'width 1s linear'
        }} />
      </div>
    </div>
  );
};

export default AddToHomeScreen;
