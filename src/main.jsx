import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import './index.css'
import App from './App.jsx'

if (import.meta.env.PROD && import.meta.env.VITE_ENABLE_LOGS !== 'true') {
  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};
  console.error = () => {};
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register Service Worker for Push Notifications
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      // Only unregister if we need a fresh start (optional, but good for debugging)
      // for (let reg of registrations) await reg.unregister();

      const reg = await navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' });
      console.log('Service Worker registered successfully:', reg.scope);
      
      // Wait for the service worker to be ready and active
      await navigator.serviceWorker.ready;
      console.log('Service Worker is ready and active.');
      
      // Dispatch a custom event so components know it's safe to subscribe
      window.dispatchEvent(new CustomEvent('sw-ready'));
      
    } catch (err) {
      console.error('Service Worker registration failed:', err);
    }
  });
}
