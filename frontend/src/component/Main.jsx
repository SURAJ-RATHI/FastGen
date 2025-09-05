// src/pages/Main.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useTab } from "../contexts/TabContext.jsx";
import ChatWindow from "./ChatWindow";
import Content from "./Content";
import Quizzes from "./Quizzes";
import Notes from "./Notes";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const { isLoading } = useAuth();
  const { activeTab } = useTab();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!isLoading && !isSignedIn) {
      navigate('/signUp');
    }
  }, [isLoading, isSignedIn, navigate]);

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

  // Mobile layout: Show only one component at a time
  if (isMobile) {
    return (
      <div className="bg-black overflow-hidden min-h-screen">
        <div className="fixed top-0 left-0 right-0 z-50">
          <Header />
        </div>
        <div className="pt-20 pb-8">
          {activeTab === 'content' ? (
            <Content />
          ) : activeTab === 'quizzes' ? (
            <Quizzes />
          ) : activeTab === 'notes' ? (
            <Notes />
          ) : (
            <ChatWindow />
          )}
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
        {activeTab === 'content' ? (
          <Content />
        ) : activeTab === 'quizzes' ? (
          <Quizzes />
        ) : activeTab === 'notes' ? (
          <Notes />
        ) : (
          <ChatWindow />
        )}
      </div>
    </div>
  );
};

export default Main;