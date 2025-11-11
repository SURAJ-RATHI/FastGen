import { Library } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTab } from '../contexts/TabContext.jsx';

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
        <header className="w-full bg-white shadow-sm pt-3 md:pt-4 flex items-center justify-between border-b border-gray-200">
            {/* Logo */}
            <div 
                onClick={() => navigate('/')}
                className="flex items-center space-x-1.5 text-base md:text-xl px-3 md:px-6 font-semibold text-gray-900 cursor-pointer hover:text-gray-700 transition-colors"
            >
                <div><Library
                className='h-5 w-5 md:h-8 md:w-8 text-gray-900'
                
                /></div>
                <span>FastGen</span>
            </div>

            {/* Navigation - Hidden on mobile, visible on tablet and above */}
            <nav className="hidden md:flex space-x-1 text-gray-600 font-medium">
                <button 
                    onClick={() => handleTabClick('chatbot')}
                    className={`px-4 py-2 rounded-md transition-colors cursor-pointer ${
                        activeTab === 'chatbot' 
                            ? 'bg-gray-900 text-white' 
                            : 'hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                    Chatbot
                </button>
                <button 
                    onClick={() => handleTabClick('content')}
                    className={`px-4 py-2 rounded-md transition-colors cursor-pointer ${
                        activeTab === 'content' 
                            ? 'bg-gray-900 text-white' 
                            : 'hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                    Content
                </button>
                <button 
                    onClick={() => handleTabClick('quizzes')}
                    className={`px-4 py-2 rounded-md transition-colors cursor-pointer ${
                        activeTab === 'quizzes' 
                            ? 'bg-gray-900 text-white' 
                            : 'hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                    Quizzes
                </button>
                <button 
                    onClick={() => handleTabClick('notes')}
                    className={`px-4 py-2 rounded-md transition-colors cursor-pointer ${
                        activeTab === 'notes' 
                            ? 'bg-gray-900 text-white' 
                            : 'hover:text-gray-900 hover:bg-gray-100'
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
                            className="px-3 py-1.5 bg-gray-900 text-white rounded-md text-xs font-medium hover:bg-gray-800 transition-colors"
                            title="More Tools"
                        >
                           + More Tools
                        </button>
                        
                        {/* Mobile Tools Dropdown */}
                        {showMobileTools && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                <div className="py-2">
                                    <button
                                        onClick={() => {
                                            setActiveTab('chatbot');
                                            setShowMobileTools(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                                            activeTab === 'chatbot' 
                                                ? 'bg-gray-900 text-white' 
                                                : 'text-gray-700 hover:bg-gray-50'
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
                                                ? 'bg-gray-900 text-white' 
                                                : 'text-gray-700 hover:bg-gray-50'
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
                                                ? 'bg-gray-900 text-white' 
                                                : 'text-gray-700 hover:bg-gray-50'
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
                                                ? 'bg-gray-900 text-white' 
                                                : 'text-gray-700 hover:bg-gray-50'
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
                            className="flex items-center space-x-1.5 p-1 rounded-md hover:bg-gray-100 transition-colors"
                        >
                            {user?.avatar ? (
                                <img 
                                    src={user.avatar} 
                                    alt={user.displayName || user.name} 
                                    className="w-5 h-5 md:w-8 md:h-8 rounded-full"
                                />
                            ) : (
                                <div className="w-5 h-5 md:w-8 md:h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-medium">
                                    {(user?.displayName || user?.name)?.charAt(0) || 'U'}
                                </div>
                            )}
                            <span className="text-gray-900 text-xs md:text-sm hidden md:block font-medium">
                                {user?.displayName || user?.name || 'User'}
                            </span>
                        </button>
                        
                        {/* Profile Dropdown */}
                        {showProfile && (
                            <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
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
                                                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white text-lg font-medium">
                                                    {(user?.displayName || user?.name)?.charAt(0) || 'U'}
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="text-gray-900 font-medium text-sm">
                                                    {user?.displayName || user?.name || 'User'}
                                                </h3>
                                                <p className="text-gray-600 text-xs">
                                                    {user?.email || 'No email'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-2">
                                       
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center gap-2 transition-colors border-t border-gray-200 pt-2"
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
                                    className="px-4 py-2 rounded-md bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => navigate('/signUp')}
                                    className="px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium"
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