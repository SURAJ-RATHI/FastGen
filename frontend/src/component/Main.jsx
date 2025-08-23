// src/pages/Main.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useTab } from "../contexts/TabContext.jsx";
import ChatWindow from "./ChatWindow";
import Split from "react-split";
import Content from "./Content";
import Quizzes from "./Quizzes";
import Notes from "./Notes";
import Header from "./Header";
import Footer from "./Footer";
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
        <div className="pt-14 pb-8">
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
        <Footer />
      </div>
    );
  }

  // Desktop/Tablet layout: Show Chatbot full-width by default, split view when tool is selected
  return (
    <div className="bg-black overflow-hidden min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>
      {activeTab === 'chatbot' ? (
        // Default view: Chatbot full-width
        <div className="pt-16 pb-8">
          <ChatWindow />
        </div>
      ) : (
        // Tool selected: Split view with Chatbot on left, selected tool on right
        <div className="pt-16">
              <Split
        className="flex h-[calc(100vh-120px)]"
        sizes={[50, 50]}
        minSize={[550, 300]}
        gutterSize={2}
        direction="horizontal"
        style={{ '--gutter-background': '#374151' }}
      >
          <div className="h-full bg-transparent">
            <ChatWindow />
          </div>
                  <div className="h-full bg-transparent">
          <div className="text-white flex flex-col h-full">
            <div className="flex-1">
              {activeTab === 'content' ? <Content /> : activeTab === 'quizzes' ? <Quizzes /> : <Notes />}
            </div>
          </div>
        </div>
      </Split>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Main;