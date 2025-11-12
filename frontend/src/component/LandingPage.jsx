import HomeHeader from "./HomeHeader";
import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate, Link } from "react-router-dom";

import axios from "axios";
import { Library, Target, Play, Key, HelpCircle, FileText, BookOpen } from 'lucide-react';
import useModernPayment from '../hooks/useModernPayment';
import { useAuth } from '../contexts/AuthContext';

// Lazy load payment modal - only loads when needed
const ModernPaymentModal = lazy(() => import('./ModernPaymentModal'));

// Move static data outside component to prevent recreation on every render
const FEATURES_DATA = [
  {
    title: "Personalized Chatbot",
    description: "FastGen's intelligent chatbot answers all your questions with context-aware responses and memory of past conversations.",
    icon: Target,
    route: "/main?tab=chatbot"
  },
  {
    title: "Content Searcher",
    description: "Discover the best YouTube videos and educational content tailored to your specific learning needs.",
    icon: Play,
    route: "/main?tab=content"
  },
  {
    title: "Key Points Extraction",
    description: "Automatically extract key insights from any uploaded file to focus on what really matters.",
    icon: Key,
    route: "/main?tab=chatbot"
  },
  {
    title: "Quiz Generator",
    description: "Generate intelligent quizzes from your files to test and reinforce your knowledge instantly.",
    icon: HelpCircle,
    route: "/main?tab=quizzes"
  },
  {
    title: "Smart Notes",
    description: "Take organized notes as you learn with AI-powered suggestions and automatic categorization.",
    icon: FileText,
    route: "/main?tab=notes"
  },
  {
    title: "All Content in One Place",
    description: "Access all your study material including PDFs and text files in a unified, searchable content hub.",
    icon: BookOpen,
    route: "/main?tab=chatbot"
  }
];

const PRICING_PLANS = [
  {
    name: "Free",
    price: "₹0",
    period: "month",
    plan: "free",
    amount: 0,
    description: "Perfect for getting started with FastGen",
    features: [
      "10 AI-powered conversations per day",
      "Basic quiz generation",
      "Standard content analysis",
      "Community support",
      "Unlimited notes creation"
    ],
    buttonText: "Get Started Free",
    buttonStyle: "bg-gray-900 hover:bg-gray-800 text-white"
  },
  {
    name: "Pro",
    price: "₹99",
    period: "month",
    plan: "pro",
    amount: 99,
    description: "Best for students and professionals",
    features: [
      "Unlimited AI conversations",
      "Advanced quiz generation",
      "Priority content analysis",
      "Email support",
      "Custom learning paths",
      "Export to Notion"
    ],
    buttonText: "Subscribe Now",
    buttonStyle: "bg-gray-900 hover:bg-gray-800 text-white",
    popular: true
  },
  {
    name: "Enterprise",
    price: "₹2,999",
    period: "month",
    plan: "enterprise",
    amount: 2999,
    description: "For teams and organizations",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Advanced analytics",
      "API access",
      "Priority support",
      "Custom integrations",
      "White-label options"
    ],
    buttonText: "Contact Sales",
    buttonStyle: "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
  }
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  
  // Rotating text for hero section
  const rotatingTexts = ['Faster', 'Smarter', '24*7', 'smoothly'];
  const [currentRotatingText, setCurrentRotatingText] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRotatingText((prev) => (prev + 1) % rotatingTexts.length);
    }, 2000); // Change every 2 seconds
    
    return () => clearInterval(interval);
  }, [rotatingTexts.length]);
  
  // Modern payment hook
  const {
    isModalOpen,
    paymentData,
    initiatePayment,
    handlePaymentSuccess,
    handlePaymentError,
    closeModal
  } = useModernPayment();
  
  // Payment handling functions
  const handlePayment = async (plan, amount) => {
    if (plan === 'free') {
      navigate('/main');
      return;
    }
    
    if (plan === 'enterprise') {
      // For enterprise, redirect to contact or show contact form
      navigate('/main?tab=contact');
      return;
    }
    
    // Check if user is logged in before allowing subscription
    if (!isSignedIn) {
      navigate('/signUp');
      return;
    }
    
    try {
      await initiatePayment(amount, plan);
    } catch {
      // Silently handle error
    }
  };

  // Handle payment success
  const onPaymentSuccess = async (paymentDetails) => {
    try {
      await handlePaymentSuccess(paymentDetails);
      navigate('/main');
    } catch {
      // Silently handle error
    }
  };

  // Handle payment error
  const onPaymentError = (error) => {
    handlePaymentError(error);
  };



  // Contact form state
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSubmitStatus, setContactSubmitStatus] = useState('');

  const handleContactInputChange = (e) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    if (!contactFormData.name || !contactFormData.email || !contactFormData.message) {
      setContactSubmitStatus('Please fill in all fields');
      return;
    }

    setIsSubmittingContact(true);
    setContactSubmitStatus('');

    try {
      await axios.post(
        `${import.meta.env.VITE_APP_BE_BASEURL}/api/email/send-email`,
        {
          to: 'kodr.test@gmail.com',
          subject: `FastGen Landing Page Contact - ${contactFormData.name}`,
          message: `Name: ${contactFormData.name}\nEmail: ${contactFormData.email}\n\nMessage:\n${contactFormData.message}\n\nTimestamp: ${new Date().toISOString()}`
        },
        { withCredentials: true }
      );
      
      setContactFormData({ name: '', email: '', message: '' });
      setContactSubmitStatus('Message sent successfully!');
    } catch (error) {
      console.error('Failed to send message:', error);
      setContactSubmitStatus('Failed to send message. Please try again.');
    } finally {
      setIsSubmittingContact(false);
    }
  };

  return (
    <div className="bg-white min-h-screen relative overflow-hidden">
      <HomeHeader />
      
      {/* Hero Section - Cal.com Style */}
      <div className="relative z-10 flex flex-col items-center justify-center py-20 px-6 pt-32 min-h-[70vh] md:min-h-[80vh]">
        {/* Main Title */}
        <div className="text-5xl md:text-7xl font-semibold text-center text-gray-900 mb-6 leading-tight max-w-4xl">
          Our AI Features that Works <span className="text-gray-600 transition-opacity duration-500">{rotatingTexts[currentRotatingText]}</span>
        </div>
        
        {/* Description */}
        <div className="text-center mb-12 max-w-2xl">
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
            An AI-driven platform that makes life effortless using cutting-edge AI tools to maximize productivity and accelerate learning
          </p>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <button
            onClick={() => {
              if (isSignedIn) {
                navigate('/main?tab=chatbot');
              } else {
                navigate('/signUp');
              }
            }}
            className="px-8 py-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-base"
          >
            Explore Now
          </button>
          <button
            onClick={() => {
              const element = document.getElementById('features-section');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 bg-white text-gray-900 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors text-base"
          >
            Learn More
          </button>
        </div>
        
        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>24/7 Available</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>AI-Powered</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Secure & Private</span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features-section" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
              Our AI Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              FastGen adapts to your learning style and pace for maximum results
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
            {FEATURES_DATA.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
              <div
                key={index}
                onClick={() => navigate(feature.route)}
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="mb-4">
                  <IconComponent className="w-8 h-8 text-gray-900" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
            })}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing-section" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your learning needs. All plans include our core AI features with no hidden fees.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING_PLANS.map((plan, index) => (
              <div 
                key={index}
                className={`relative bg-white border rounded-xl p-8 transition-all duration-200 ${
                  plan.popular 
                    ? 'border-gray-900 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gray-900 text-white px-4 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-3">
                    <span className="text-5xl font-semibold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2 text-lg">/{plan.period}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start text-gray-600 text-sm">
                      <svg className="w-5 h-5 text-gray-900 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handlePayment(plan.plan, plan.amount)}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-2">All plans include secure payment processing</p>
            <p className="text-gray-500 text-sm mb-4">Powered by Razorpay • Secure & reliable payments</p>
            <p className="text-gray-600">Need a custom plan? <span 
              onClick={() => {
                const element = document.getElementById('contact-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-gray-900 cursor-pointer hover:underline font-medium"
            >Contact us</span></p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact-section" className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions about FastGen? We'd love to hear from you.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Info</h3>
              <div className="space-y-4 text-gray-600">
                <div>
                  <p className="font-medium text-gray-900 mb-1">Email:</p>
                  <p className="text-sm">kodr.test@gmail.com</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">Phone:</p>
                  <p className="text-sm">+91 7015506489</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">Address:</p>
                  <p className="text-sm">273, Bhiwani, Haryana-127021, India</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={contactFormData.name}
                  onChange={handleContactInputChange}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200"
                  required
                  autoComplete="name"
                />
                <input
                  type="email"
                  name="email"
                  value={contactFormData.email}
                  onChange={handleContactInputChange}
                  placeholder="Your Email"
                  className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200"
                  required
                  autoComplete="email"
                />
                <textarea
                  name="message"
                  value={contactFormData.message}
                  onChange={handleContactInputChange}
                  placeholder="Your Message"
                  rows="4"
                  className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all duration-200 resize-none"
                  required
                ></textarea>
                
                {contactSubmitStatus && (
                  <div className={`text-center p-3 rounded-lg text-sm ${contactSubmitStatus.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {contactSubmitStatus}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmittingContact}
                  className="w-full px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingContact ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 text-gray-900">
                  <Library className="w-full h-full" />
                </div>
                <span className="text-2xl font-semibold text-gray-900">FastGen</span>
              </div>
              <p className="text-gray-600 mb-6 max-w-md text-sm">
                Your AI-powered learning companion that adapts to your needs and helps you master topics quickly and efficiently.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://github.com/SURAJ-RATHI/FastGen" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a 
                  href="https://twitter.com/SurajRathi65983" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.linkedin.com/in/suraj127021" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.065 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-gray-900 font-semibold mb-4 text-sm">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => {
                      const element = document.getElementById('features-section');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer text-sm focus:outline-none"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      const element = document.getElementById('pricing-section');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer text-sm focus:outline-none"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      const element = document.getElementById('contact-section');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer text-sm focus:outline-none"
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <Link to="/main" className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer text-sm focus:outline-none">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-gray-900 font-semibold mb-4 text-sm">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/help" className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer text-sm focus:outline-none">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/docs" className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer text-sm focus:outline-none">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer text-sm focus:outline-none">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer text-sm focus:outline-none">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2024 FastGen. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors text-sm cursor-pointer focus:outline-none">
                Privacy
              </Link>
              <Link to="/terms" className="text-gray-600 hover:text-gray-900 transition-colors text-sm cursor-pointer focus:outline-none">
                Terms
              </Link>
              <Link to="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors text-sm cursor-pointer focus:outline-none">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Modern Payment Modal - Lazy loaded */}
      {isModalOpen && (
        <Suspense fallback={null}>
          <ModernPaymentModal
            isOpen={isModalOpen}
            onClose={closeModal}
            amount={paymentData?.amount}
            plan={paymentData?.plan}
            orderId={paymentData?.order?.id}
            onPaymentSuccess={onPaymentSuccess}
            onPaymentError={onPaymentError}
          />
        </Suspense>
      )}
    </div>
  );
};

export default LandingPage;