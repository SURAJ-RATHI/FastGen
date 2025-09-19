import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTab } from '../contexts/TabContext.jsx';
import LazyImage from './LazyImage';

const Header = () => {
    const { isSignedIn, user, signOut } = useAuth();
    const navigate = useNavigate();
    const { activeTab, setActiveTab } = useTab();
    const [showMobileTools, setShowMobileTools] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const mobileToolsRef = useRef(null);
    const profileRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close mobile tools dropdown
            if (mobileToolsRef.current && !mobileToolsRef.current.contains(event.target)) {
                setShowMobileTools(false);
            }
            // Close profile dropdown
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfile(false);
            }
        };

        // Handle both mouse and touch events
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);

    // Close dropdowns when pressing Escape key
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                setShowMobileTools(false);
                setShowProfile(false);
            }
        };

        document.addEventListener('keydown', handleEscapeKey);
        
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, []);



    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        // For mobile, you can add navigation logic here if needed
    };

    return ( 
        <header className="w-full bg-transparent shadow-md pt-3 md:pt-4 flex items-center justify-between border-b border-gray-700">
            {/* Logo */}
            <div 
                onClick={() => navigate('/')}
                className="flex items-center space-x-1.5 text-base md:text-xl px-3 md:px-6 font-bold text-blue-400 cursor-pointer hover:text-blue-300 transition-colors"
            >
                <div className="h-5 w-5 md:h-8 md:w-8">
                    <LazyImage 
                        src="/logo.svg" 
                        alt="FastGen Logo" 
                        className="h-full w-full object-contain"
                    />
                </div>
                <span>FastGen</span>
            </div>

            {/* Navigation - Hidden on mobile, visible on tablet and above */}
            <nav className="hidden md:flex space-x-6 text-gray-300 font-medium">
                <button 
                    onClick={() => handleTabClick('chatbot')}
                    className={`px-6 py-3 transition-colors cursor-pointer border-b-2 ${
                        activeTab === 'chatbot' 
                            ? 'bg-blue-600 text-white border-blue-400' 
                            : 'hover:text-blue-400 hover:bg-gray-800 border-transparent'
                    }`}
                >
                    Chatbot
                </button>
                <button 
                    onClick={() => handleTabClick('content')}
                    className={`px-6 py-3 transition-colors cursor-pointer border-b-2 ${
                        activeTab === 'content' 
                            ? 'bg-blue-600 text-white border-blue-400' 
                            : 'hover:text-blue-400 hover:bg-gray-800 border-transparent'
                    }`}
                >
                    Content
                </button>
                <button 
                    onClick={() => handleTabClick('quizzes')}
                    className={`px-6 py-3 transition-colors cursor-pointer border-b-2 ${
                        activeTab === 'quizzes' 
                            ? 'bg-blue-600 text-white border-blue-400' 
                            : 'hover:text-blue-400 hover:bg-gray-800 border-transparent'
                    }`}
                >
                    Quizzes
                </button>
                <button 
                    onClick={() => handleTabClick('notes')}
                    className={`px-6 py-3 transition-colors cursor-pointer border-b-2 ${
                        activeTab === 'notes' 
                            ? 'bg-blue-600 text-white border-blue-400' 
                            : 'hover:text-blue-400 hover:bg-gray-800 border-transparent'
                    }`}
                >
                    Notes
                </button>
            </nav>



            {/* Auth Buttons */}
        <div className="flex items-center space-x-2">
            {isSignedIn ? (
                <div className="flex space-x-2 mr-1 items-center">
                    {/* More Tools Button - Visible only on mobile */}
                    <div className="md:hidden relative" ref={mobileToolsRef}>
                        <button
                            onClick={() => setShowMobileTools(!showMobileTools)}
                            className="px-1.5 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                            title="More Tools"
                        >
                           + More Tools
                        </button>
                        
                        {/* Mobile Tools Dropdown */}
                        {showMobileTools && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50">
                                <div className="py-2">
                                    <button
                                        onClick={() => {
                                            setActiveTab('chatbot');
                                            setShowMobileTools(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                                            activeTab === 'chatbot' 
                                                ? 'bg-blue-600 text-white' 
                                                : 'text-gray-300 hover:bg-gray-700'
                                        }`}
                                    >
                                        Chatbot
                                    </button>
                                    <button
                                        onClick={() => {
                                            setActiveTab('content');
                                            setShowMobileTools(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                                            activeTab === 'content' 
                                                ? 'bg-blue-600 text-white' 
                                                : 'text-gray-300 hover:bg-gray-700'
                                        }`}
                                    >
                                        Content
                                    </button>
                                    <button
                                        onClick={() => {
                                            setActiveTab('quizzes');
                                            setShowMobileTools(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                                            activeTab === 'quizzes' 
                                                ? 'bg-blue-600 text-white' 
                                                : 'text-gray-300 hover:bg-gray-700'
                                        }`}
                                    >
                                        Quizzes
                                    </button>
                                    <button
                                        onClick={() => {
                                            setActiveTab('notes');
                                            setShowMobileTools(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                                            activeTab === 'notes' 
                                                ? 'bg-blue-600 text-white' 
                                                : 'text-gray-300 hover:bg-gray-700'
                                        }`}
                                    >
                                        Notes
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile Button */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setShowProfile(!showProfile)}
                            className="flex items-center space-x-1.5 p-1 rounded hover:bg-gray-800 transition-colors"
                        >
                            {user?.avatar ? (
                                <img 
                                    src={user.avatar} 
                                    alt={user.displayName || user.name} 
                                    className="w-5 h-5 md:w-8 md:h-8 rounded-full"
                                />
                            ) : (
                                <div className="w-5 h-5 md:w-8 md:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-medium shadow-lg">
                                    {(user?.displayName || user?.name)?.charAt(0) || 'U'}
                                </div>
                            )}
                            <span className="text-white text-xs md:text-sm hidden md:block font-medium">
                                {user?.displayName || user?.name || 'User'}
                            </span>
                        </button>
                        
                        {/* Profile Dropdown */}
                        {showProfile && (
                            <div className="absolute top-full right-0 mt-2 w-64 bg-gray-800 border border-gray-600 rounded-md shadow-lg z-50">
                                <div className="p-4">
                                    {/* User Details */}
                                    <div className="mb-4">
                                        <div className="flex items-center space-x-3 mb-3">
                                            {user?.avatar ? (
                                                <img 
                                                    src={user.avatar} 
                                                    alt={user.displayName || user.name} 
                                                    className="w-12 h-12 rounded-full"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-medium">
                                                    {(user?.displayName || user?.name)?.charAt(0) || 'U'}
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="text-white font-semibold text-sm">
                                                    {user?.displayName || user?.name || 'User'}
                                                </h3>
                                                <p className="text-gray-300 text-xs">
                                                    {user?.email || 'No email'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-2">
                                       
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full px-3 py-2 text-left text-sm text-white hover:bg-gray-700 rounded flex items-center gap-2 transition-colors border-t border-gray-600 pt-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                    ) : (
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => navigate('/signIn')}
                                    className="px-4 py-1 rounded-lg bg-gray-800 text-white hover:bg-blue-600 transition-colors font-semibold"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => navigate('/signUp')}
                                    className="px-4 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold shadow"
                                >
                                    Get started
                                </button>
                            </div>
            )}
        </div>        
    </header>
     );
}
 
export default Header;