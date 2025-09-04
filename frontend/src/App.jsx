import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css'
import SignUpPage from './component/SignUpPage'
import SignInPage from './component/SignInPage';
import Main from './component/Main';
import LandingPage from './component/LandingPage';
import Features from './component/Features';
import Contact from './component/Contact';
import Pricing from './component/Pricing';
import SharedChat from './component/SharedChat';
import VideoSearch from './component/VideoSearch';
import HelpCenter from './component/HelpCenter';
import Documentation from './component/Documentation';
import PrivacyPolicy from './component/PrivacyPolicy';
import TermsOfService from './component/TermsOfService';
import { TabProvider } from './contexts/TabContext.jsx';

function AppContent() {
  const location = useLocation();
  
  // Pages that need fixed height with no scrolling (main app)
  const fixedHeightPages = ['/main'];
  const isFixedHeightPage = fixedHeightPages.includes(location.pathname);
  
  return (
    <div className={isFixedHeightPage ? "overflow-hidden h-screen" : ""}>
      <TabProvider>
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
