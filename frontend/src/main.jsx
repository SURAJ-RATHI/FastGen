import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './contexts/AuthContext.jsx'
import './index.css'
import App from './App.jsx'

// Register Service Worker for offline caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    })
      .then((registration) => {
        console.log('SW registered successfully: ', registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New SW available, will activate on next page load');
            }
          });
        });
      })
      .catch((registrationError) => {
        console.error('SW registration failed: ', registrationError);
        
        // Log specific error details
        if (registrationError.name === 'SecurityError') {
          console.error('Security error - check HTTPS and MIME type configuration');
        } else if (registrationError.name === 'TypeError') {
          console.error('Type error - check SW script path and content');
        }
      });
  });
} else {
  console.log('Service Worker not supported in this browser');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
