// src/pages/Main.jsx
import { useEffect, useState, Suspense, lazy } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useTab } from "../contexts/TabContext.jsx";
import Header from "./Header";
import { useNavigate, useSearchParams } from "react-router-dom";

// Lazy load components for better performance
const ChatWindow = lazy(() => import("./ChatWindow"));
const Content = lazy(() => import("./Content"));
const Quizzes = lazy(() => import("./Quizzes"));
const Notes = lazy(() => import("./Notes"));

const Main = () => {
  const { isLoading } = useAuth();
  const { activeTab, setActiveTab } = useTab();
  const { isSignedIn } = useAuth();
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

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // 1024px for mobile/tablet, 1024px+ gets desktop behavior
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Loading component for Suspense
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );

  // Mobile layout: Show only one component at a time
  if (isMobile) {
    return (
      <div className="bg-black overflow-hidden min-h-screen">
        <div className="fixed top-0 left-0 right-0 z-50">
          <Header />
        </div>
        <div className="pt-20 pb-8">
          <Suspense fallback={<LoadingSpinner />}>
            {activeTab === 'content' ? (
              <Content />
            ) : activeTab === 'quizzes' ? (
              <Quizzes />
            ) : activeTab === 'notes' ? (
              <Notes />
            ) : (
              <ChatWindow />
            )}
          </Suspense>
        </div>
      </div>
    );
  }

  // Desktop/Tablet layout: Show each tool in full view
  return (
    <div className="bg-black overflow-hidden min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>
      <div className="pt-20 pb-8">
        <Suspense fallback={<LoadingSpinner />}>
          {activeTab === 'content' ? (
            <Content />
          ) : activeTab === 'quizzes' ? (
            <Quizzes />
          ) : activeTab === 'notes' ? (
            <Notes />
          ) : (
            <ChatWindow />
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default Main;