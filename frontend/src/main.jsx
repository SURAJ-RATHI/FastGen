import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './contexts/AuthContext.jsx'
import './index.css'
import App from './App.jsx'

// Register Service Worker for offline caching (only in production)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    // Try main service worker first
    navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none'
    })
      .then((registration) => {
        if (import.meta.env.DEV) {
          console.log('SW registered: ', registration);
        }
      })
      .catch((registrationError) => {
        // Try fallback service worker
        navigator.serviceWorker.register('/sw-fallback.js')
          .then((registration) => {
            if (import.meta.env.DEV) {
              console.log('Fallback SW registered: ', registration);
            }
          })
          .catch((fallbackError) => {
            // Silently fail - don't show errors to users
            if (import.meta.env.DEV) {
              console.log('Both SW registrations failed: ', fallbackError);
            }
          });
      });
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
