// src/pages/Main.jsx
import { useEffect, useState, Suspense, lazy, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useTab } from "../contexts/TabContext.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";

// Lazy load components for better performance
const Header = lazy(() => import("./Header"));
const ChatWindow = lazy(() => import("./ChatWindow"));
const Content = lazy(() => import("./Content"));
const Quizzes = lazy(() => import("./Quizzes"));
const Notes = lazy(() => import("./Notes"));

// Loading component outside to prevent recreation
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

const Main = () => {
  // Call useAuth only once
  const { isLoading, isSignedIn } = useAuth();
  const { activeTab, setActiveTab } = useTab();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!isLoading && !isSignedIn) {
      navigate('/signUp');
    }
  }, [isLoading, isSignedIn, navigate]);

  // Handle URL parameters to set active tab
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['chatbot', 'content', 'quizzes', 'notes'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams, setActiveTab]);

  // Optimize resize listener with debouncing
  useEffect(() => {
    let timeoutId;
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    const debouncedCheckScreenSize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkScreenSize, 150);
    };

    checkScreenSize(); // Initial check
    window.addEventListener('resize', debouncedCheckScreenSize);

    return () => {
      window.removeEventListener('resize', debouncedCheckScreenSize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Memoize the active component to prevent unnecessary re-renders
  const ActiveComponent = useMemo(() => {
    switch (activeTab) {
      case 'content':
        return Content;
      case 'quizzes':
        return Quizzes;
      case 'notes':
        return Notes;
      default:
        return ChatWindow;
    }
  }, [activeTab]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Mobile layout: Show only one component at a time
  if (isMobile) {
    return (
      <div className="bg-black overflow-hidden min-h-screen">
        <div className="fixed top-0 left-0 right-0 z-50">
          <Suspense fallback={<div className="h-16 bg-black" />}>
            <Header />
          </Suspense>
        </div>
        <div className="pt-16 pb-8">
          <Suspense fallback={<LoadingSpinner />}>
            <ActiveComponent />
          </Suspense>
        </div>
      </div>
    );
  }

  // Desktop/Tablet layout: Show each tool in full view
  return (
    <div className="bg-black overflow-hidden min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Suspense fallback={<div className="h-16 bg-black" />}>
          <Header />
        </Suspense>
      </div>
      <div className="pt-16 pb-8">
        <Suspense fallback={<LoadingSpinner />}>
          <ActiveComponent />
        </Suspense>
      </div>
    </div>
  );
};

export default Main;