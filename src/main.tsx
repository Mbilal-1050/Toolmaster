import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Log Cross-Origin Isolation status for multi-threaded WASM / SharedArrayBuffer verification
if (typeof window !== 'undefined') {
  console.log('crossOriginIsolated:', window.crossOriginIsolated);
}

// Register Service Worker for PWA installability
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => {
        // Successfully registered service worker
      })
      .catch((err) => {
        console.debug('SW registration skipped or not supported in current environment:', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
