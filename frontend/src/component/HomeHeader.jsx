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
        <header className="w-full bg-white border-b border-gray-200 py-3 md:py-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
            {/* Logo */}
            <div 
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-base md:text-lg px-4 md:px-6 font-semibold text-gray-900 cursor-pointer hover:text-gray-700 transition-colors"
            >
                <div><Library
                className='h-5 w-5 md:h-6 md:w-6 text-gray-900'
                
                /></div>
                <span>FastGen</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1 text-gray-600 font-medium">
                <button 
                    onClick={() => scrollToSection('features-section')}
                    className="px-4 py-2 rounded-lg transition-colors cursor-pointer hover:text-gray-900 hover:bg-gray-100"
                >
                    Features
                </button>
                <button 
                    onClick={() => scrollToSection('pricing-section')}
                    className="px-4 py-2 rounded-lg transition-colors cursor-pointer hover:text-gray-900 hover:bg-gray-100"
                >
                    Pricing
                </button>
                <button 
                    onClick={() => scrollToSection('contact-section')}
                    className="px-4 py-2 rounded-lg transition-colors cursor-pointer hover:text-gray-900 hover:bg-gray-100"
                >
                    Contact
                </button>
            </nav>

            {/* Right Side - Auth and Mobile Toggle */}
            <div className="flex items-center space-x-3">
                {/* Auth Buttons */}
                {isSignedIn ? (
                    <div className="flex space-x-2 mr-2 items-center">
                        {/* Profile Button with User Info Display */}
                        <div className="relative" ref={profileMenuRef}>
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                {user?.avatar ? (
                                    <img 
                                        src={user.avatar} 
                                        alt={user.displayName || user.name} 
                                        className="w-6 h-6 md:w-7 md:h-7 rounded-full"
                                    />
                                ) : (
                                    <div className="w-6 h-6 md:w-7 md:h-7 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-medium">
                                        {(user?.displayName || user?.name)?.charAt(0) || 'U'}
                                    </div>
                                )}
                                <span className="text-gray-900 text-sm hidden md:block font-medium">
                                    {user?.displayName || user?.name || 'User'}
                                </span>
                            </button>

                            {/* User Info Display */}
                            {showProfileMenu && (
                                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
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
                                                    <h3 className="text-gray-900 font-semibold text-sm">
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
                                                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2 transition-colors border-t border-gray-200 pt-2"
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
                            className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium"
                        >
                            Get started
                        </button>
                    </div>
                )}

                {/* Mobile Navigation Toggle - Rightmost */}
                <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="md:hidden flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors px-3 py-2"
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
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
                    <nav className="flex flex-col space-y-1 px-4 py-3">
                        <button 
                            onClick={() => scrollToSection('features-section')}
                            className="px-4 py-3 text-left text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                        >
                            Features
                        </button>
                        <button 
                            onClick={() => scrollToSection('pricing-section')}
                            className="px-4 py-3 text-left text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                        >
                            Pricing
                        </button>
                        <button 
                            onClick={() => scrollToSection('contact-section')}
                            className="px-4 py-3 text-left text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                        >
                            Contact
                        </button>
                    </nav>
                </div>
            )}
        </header>
     );
}
 
export default HomeHeader;
