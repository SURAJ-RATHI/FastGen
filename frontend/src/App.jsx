import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css'
import { TabProvider } from './contexts/TabContext.jsx';

// Lazy load all route components for better performance
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
const ToastContainer = lazy(() => import('./component/ToastContainer'));

// Loading component for Suspense
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-black">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

function AppContent() {
  const location = useLocation();
  
  // Pages that need fixed height with no scrolling (main app)
  const fixedHeightPages = ['/main'];
  const isFixedHeightPage = fixedHeightPages.includes(location.pathname);
  
  return (
    <div className={isFixedHeightPage ? "overflow-hidden h-screen" : ""}>
      <TabProvider>
        <Suspense fallback={<LoadingSpinner />}>
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
          </Routes>
        </Suspense>
        <Suspense fallback={null}>
          <ToastContainer />
        </Suspense>
      </TabProvider>
    </div>
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
