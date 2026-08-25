'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('SpectrumOS PWA Service Worker registered:', reg.scope);
        })
        .catch((err) => {
          console.warn('Service worker registration notice:', err);
        });
    }
  }, []);

  return null;
}
