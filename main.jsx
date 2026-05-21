import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// The study guide saves progress via `window.storage`, which only exists inside
// Claude. On a normal website we provide a small localStorage-backed stand-in
// so that progress persists in each visitor's browser.
if (typeof window !== 'undefined' && !window.storage) {
  window.storage = {
    get: async (key) => {
      try {
        const value = localStorage.getItem(key);
        return value === null ? null : { value };
      } catch {
        return null;
      }
    },
    set: async (key, value) => {
      try {
        localStorage.setItem(key, value);
      } catch {}
      return { value };
    },
  };
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
