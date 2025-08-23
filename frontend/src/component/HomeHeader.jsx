import { Library, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useState, useEffect, useRef } from 'react';

const HomeHeader = () => {
    const { isSignedIn, user, signOut } = useAuth();
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const profileMenuRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
        setShowProfileMenu(false);
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: 'smooth' });
        setShowMobileMenu(false); // Close mobile menu after navigation
    };

    return ( 
        <header className="w-full bg-black/80 backdrop-blur-md shadow-md py-2 md:py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
            {/* Logo */}
            <div 
                onClick={() => navigate('/')}
                className="flex items-center space-x-1.5 text-base md:text-xl px-3 md:px-6 font-bold text-blue-400 cursor-pointer hover:text-blue-300 transition-colors"
            >
                <div><Library
                className='h-5 w-5 md:h-8 md:w-8 text-white'
                
                /></div>
                <span>FastGen</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6 text-gray-300 font-medium">
                <button 
                    onClick={() => scrollToSection('features-section')}
                    className="px-6 py-3 transition-colors cursor-pointer border-b-2 hover:text-blue-400 hover:bg-gray-800 border-transparent"
                >
                    Features
                </button>
                <button 
                    onClick={() => scrollToSection('contact-section')}
                    className="px-6 py-3 transition-colors cursor-pointer border-b-2 hover:text-blue-400 hover:bg-gray-800 border-transparent"
                >
                    Contact Us
                </button>
                <button 
                    onClick={() => scrollToSection('pricing-section')}
                    className="px-6 py-3 transition-colors cursor-pointer border-b-2 hover:text-blue-400 hover:bg-gray-800 border-transparent"
                >
                    Pricing
                </button>
            </nav>

            {/* Right Side - Auth and Mobile Toggle */}
            <div className="flex items-center space-x-2">
                {/* Auth Buttons */}
                {isSignedIn ? (
                    <div className="flex space-x-2 mr-1 items-center">
                        {/* Profile Button with User Info Display */}
                        <div className="relative" ref={profileMenuRef}>
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
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

                            {/* User Info Display */}
                            {showProfileMenu && (
                                <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800 border border-gray-600 rounded-md shadow-lg z-50">
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
                            onClick={() => navigate('/signUp')}
                            className="px-4 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold shadow"
                        >
                            Get started
                        </button>
                    </div>
                )}

                {/* Mobile Navigation Toggle - Rightmost */}
                <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="md:hidden flex items-center justify-center text-gray-300 hover:text-blue-400 transition-colors px-3 py-2 ml-2"
                >
                    {showMobileMenu ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </button>
            </div>

            {/* Mobile Navigation Menu - Overlay */}
            {showMobileMenu && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900/95 border-t border-gray-700 shadow-lg">
                    <nav className="flex flex-col space-y-1 px-3 py-3">
                        <button 
                            onClick={() => scrollToSection('features-section')}
                            className="px-4 py-3 text-left text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-lg transition-colors font-medium"
                        >
                            Features
                        </button>
                        <button 
                            onClick={() => scrollToSection('contact-section')}
                            className="px-4 py-3 text-left text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-lg transition-colors font-medium"
                        >
                            Contact Us
                        </button>
                        <button 
                            onClick={() => scrollToSection('pricing-section')}
                            className="px-4 py-3 text-left text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-lg transition-colors font-medium"
                        >
                            Pricing
                        </button>
                    </nav>
                </div>
            )}
        </header>
     );
}
 
export default HomeHeader;
