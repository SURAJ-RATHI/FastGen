import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css'
import ToastContainer from './component/ToastContainer';
import ErrorBoundary from './component/ErrorBoundary';
import LoadingSpinner from './component/LoadingSpinner';
import { TabProvider } from './contexts/TabContext.jsx';

// Lazy load components for better performance
const SignUpPage = lazy(() => import('./component/SignUpPage'));
const SignInPage = lazy(() => import('./component/SignInPage'));
const Main = lazy(() => import('./component/Main'));
const LandingPage = lazy(() => import('./component/LandingPage'));
const Features = lazy(() => import('./component/Features'));
const Contact = lazy(() => import('./component/Contact'));
const Pricing = lazy(() => import('./component/Pricing'));
const SharedChat = lazy(() => import('./component/SharedChat'));
const VideoSearch = lazy(() => import('./component/VideoSearch'));
const HelpCenter = lazy(() => import('./component/HelpCenter'));
const Documentation = lazy(() => import('./component/Documentation'));
const PrivacyPolicy = lazy(() => import('./component/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./component/TermsOfService'));
const NotFound = lazy(() => import('./component/NotFound'));

function AppContent() {
  const location = useLocation();
  
  // Pages that need fixed height with no scrolling (main app)
  const fixedHeightPages = ['/main'];
  const isFixedHeightPage = fixedHeightPages.includes(location.pathname);
  
  // Professional loading component for Suspense
  const LoadingFallback = () => (
    <LoadingSpinner 
      size="xl" 
      color="blue" 
      text="Loading FastGen..." 
      fullScreen={true}
    />
  );

  return (
    <ErrorBoundary>
      <div className={isFixedHeightPage ? "overflow-hidden h-screen" : ""}>
        <TabProvider>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/signUp" element={<SignUpPage/>} />
              <Route path="/" element={<LandingPage/>} />
              <Route path="/signIn" element={<SignInPage/>} />
              <Route path="/main" element={<Main/>} />
              <Route path="/features" element={<Features/>} />
              <Route path="/contact" element={<Contact/>} />
              <Route path="/pricing" element={<Pricing/>} />
              <Route path="/shared-chat/:chatId" element={<SharedChat/>} />
              <Route path="/video-search" element={<VideoSearch/>} />
              <Route path="/help" element={<HelpCenter/>} />
              <Route path="/docs" element={<Documentation/>} />
              <Route path="/privacy" element={<PrivacyPolicy/>} />
              <Route path="/terms" element={<TermsOfService/>} />
              <Route path="*" element={<NotFound/>} />
            </Routes>
          </Suspense>
          <ToastContainer />
        </TabProvider>
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
