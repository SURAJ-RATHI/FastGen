import HomeHeader from "./HomeHeader";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Button from "./compo/Button";
import { useNavigate, Link } from "react-router-dom";

import axios from "axios";
import { Library } from 'lucide-react';

gsap.registerPlugin();

const LandingPage = () => {
  const wordRef = useRef(null);


  const words = ["Faster", " Smarter", " Effortlessly","24*7"];
  const navigate = useNavigate();



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
        `${import.meta.env.VITE_APP_BE_BASEURL}/api/email`,
        {
          to: 'kodr.test@gmail.com',
          subject: `FastGen Landing Page Contact - ${contactFormData.name}`,
          message: `Name: ${contactFormData.name}\nEmail: ${contactFormData.email}\n\nMessage:\n${contactFormData.message}\n\nTimestamp: ${new Date().toISOString()}`
        },
        { withCredentials: true }
      );
      
      setContactFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Failed to send message:', error);
      setContactSubmitStatus('Failed to send message. Please try again.');
    } finally {
      setIsSubmittingContact(false);
    }
  };


  useGSAP(() => {
    let index = 0;

    gsap.from('.tagline', {
      y: 70,
      opacity: 0,
      duration: 2,
      ease: 'power2.out'  // makes it smoother!
    });

    gsap.from('.symbol', {
      y: 30,
      opacity: 0,
      duration: 2,
      ease: 'power2.out'  // makes it smoother!
    });

    



    const flip = () => {
      // Animate out
      gsap.to(wordRef.current, {
        y: "100%", // Move down
        rotationX: 90,
        opacity: 0,
        duration: 0.3,
        ease: 'power1.in',
        onComplete: () => {
          // Update text
          index = (index + 1) % words.length;
          if (wordRef.current) {
            wordRef.current.textContent = words[index]; // Use textContent for safety
          }

          // Reset position
          gsap.set(wordRef.current, { y: "-100%", rotationX: -90, opacity: 0 });

          // Animate in
          gsap.to(wordRef.current, {
            y: "0%",
            rotationX: 0,
            opacity: 1,
            duration: 0.3,
            ease: 'power1.in',
          });
        },
      });
    };

    // the animation loop
    const interval = setInterval(flip, 2000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this runs once on mount
   

  return (
    <div className="bg-black min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <HomeHeader />
      
      {/* Hero Section - Compact Layout */}
      <div className="relative z-10 flex flex-col items-center py-12 px-4 pt-20">
        {/* Top Title with Gradient */}
        <div className="text-4xl md:text-6xl symbol font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent animate-fade-in hover:scale-105 transition-transform duration-300">
          FastGen
        </div>

        {/* Explore Button/Tag with Modern Design */}
        <div 
          onClick={() => navigate('/main')}
          className="group text-sm text-white px-6 py-3 rounded-full border border-white/20 shadow-lg bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg transition-all duration-300 cursor-pointer mb-6 hover:bg-gradient-to-r hover:from-white/20 hover:to-white/10 hover:border-white/30 hover:shadow-xl hover:scale-105"
        >
          <span className="flex items-center gap-2">
            explore FastGen 
            <span className="text-lg group-hover:animate-spin">✨</span>
          </span>
        </div>

        {/* Main Title with Enhanced Typography */}
        <div className="text-4xl md:text-6xl font-bold text-center text-white mb-4 leading-tight">
          <div className="tagline mb-2 animate-fade-in delay-200">Our AI Features that Works </div>
          <div className="tagline">
            <span className="relative inline-block align-middle">
              <span ref={wordRef} className="inline-block mb-3 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent font-bold animate-fade-in delay-400 hover:scale-110 transition-transform duration-500">
                {words[0]}
              </span>
            </span>
          </div>
        </div>
        
        {/* Enhanced Description */}
        <div className="text-center mb-8 max-w-3xl">
          <p className="tagline text-gray-300 text-lg md:text-xl leading-relaxed animate-fade-in delay-600">
            An AI-driven platform that makes life effortless using cutting-edge AI tools to 
            <span className="text-white font-semibold hover:text-blue-300 transition-colors duration-300"> maximize productivity</span> and 
            <span className="text-white font-semibold hover:text-purple-300 transition-colors duration-300"> accelerate learning</span>
          </p>
        </div>
        
        {/* Get Started Button */}
        <div className="tagline mb-8 animate-fade-in delay-800">
          <Button />
        </div>
        
        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-6 text-gray-400 animate-fade-in delay-1000">
          <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm hover:text-green-300 transition-colors duration-300">24/7 Available</span>
          </div>
          <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm hover:text-blue-300 transition-colors duration-300">AI-Powered</span>
          </div>
          <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-sm hover:text-purple-300 transition-colors duration-300">Secure & Private</span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features-section" className="py-16 px-4 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent animate-fade-in hover:scale-105 transition-transform duration-500">
            Our AI Features
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in delay-200">
            FastGen adapts to your learning style and pace for 
            <span className="text-white font-semibold hover:text-blue-300 transition-colors duration-300"> maximum results</span>
          </p>
          
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
            {[
              {
                title: "Personalized Chatbot",
                description: "FastGen's intelligent chatbot answers all your questions with context-aware responses and memory of past conversations.",
                icon: "🎯",
                route: "/main?tab=chatbot",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                title: "Content Searcher",
                description: "Discover the best YouTube videos and educational content tailored to your specific learning needs.",
                icon: "▶️",
                route: "/main?tab=content",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                title: "Key Points Extraction",
                description: "Automatically extract key insights from any uploaded file to focus on what really matters.",
                icon: "🔑",
                route: "/main?tab=chatbot",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                title: "Quiz Generator",
                description: "Generate intelligent quizzes from your files to test and reinforce your knowledge instantly.",
                icon: "❓",
                route: "/main?tab=quizzes",
                gradient: "from-orange-500 to-red-500"
              },
              {
                title: "Smart Notes",
                description: "Take organized notes as you learn with AI-powered suggestions and automatic categorization.",
                icon: "📝",
                route: "/main?tab=notes",
                gradient: "from-indigo-500 to-blue-500"
              },
              {
                title: "All Content in One Place",
                description: "Access all your study material including PDFs and text files in a unified, searchable content hub.",
                icon: "📚",
                route: "/main?tab=chatbot",
                gradient: "from-teal-500 to-cyan-500"
              }
            ].map((feature, index) => (
              <div
                key={index}
                onClick={() => navigate(feature.route)}
                className={`group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl text-white hover:scale-105 transition-all duration-500 cursor-pointer hover:border-white/20 hover:shadow-3xl hover:shadow-blue-500/10 animate-fade-in delay-${(index + 1) * 200}`}
              >
                <div className={`text-5xl mb-6 group-hover:scale-110 transition-transform duration-300 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-white transition-colors">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">{feature.description}</p>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing-section" className="py-16 px-4 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-100 to-blue-100 bg-clip-text text-transparent animate-fade-in hover:scale-105 transition-transform duration-500">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in delay-200">
            Choose the plan that fits your learning needs. All plans include our 
            <span className="text-white font-semibold hover:text-purple-300 transition-colors duration-300"> core AI features</span> with 
            <span className="text-white font-semibold hover:text-blue-300 transition-colors duration-300"> no hidden fees</span>.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Free",
                price: "$0",
                period: "month",
                description: "Perfect for getting started with FastGen",
                features: [
                  "5 AI-powered conversations per month",
                  "Basic quiz generation",
                  "Standard content analysis",
                  "Community support"
                ],
                buttonText: "Get Started Free",
                buttonStyle: "bg-gray-600 hover:bg-gray-700"
              },
              {
                name: "Pro",
                price: "$19",
                period: "month",
                description: "Best for students and professionals",
                features: [
                  "Unlimited AI conversations",
                  "Advanced quiz generation",
                  "Priority content analysis",
                  "Email support",
                  "Custom learning paths",
                  "Export to Notion"
                ],
                buttonText: "Start Pro Trial",
                buttonStyle: "bg-blue-600 hover:bg-blue-700",
                popular: true
              },
              {
                name: "Enterprise",
                price: "$49",
                period: "month",
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
                buttonStyle: "bg-purple-600 hover:bg-purple-700"
              }
            ].map((plan, index) => (
              <div 
                key={index}
                className={`group relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl p-8 rounded-3xl border-2 transition-all duration-500 animate-fade-in delay-${(index + 1) * 300} ${
                  plan.popular 
                    ? 'border-blue-500/50 scale-105 shadow-2xl shadow-blue-500/20' 
                    : 'border-gray-700/50 hover:border-gray-600/50'
                } hover:scale-105 hover:shadow-2xl`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-3">
                    <span className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{plan.price}</span>
                    <span className="text-gray-400 ml-2 text-lg">/{plan.period}</span>
                  </div>
                  <p className="text-gray-300 text-base leading-relaxed">{plan.description}</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-300">
                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => navigate('/main')}
                  className={`w-full py-4 px-6 rounded-xl text-white font-bold transition-all duration-300 ${plan.buttonStyle} hover:shadow-lg hover:scale-105 group-hover:shadow-xl`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-gray-400 mb-4">All plans include a 14-day free trial</p>
            <p className="text-gray-400">Need a custom plan? <span 
              onClick={() => {
                const element = document.getElementById('contact-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-blue-400 cursor-pointer hover:underline"
            >Contact us</span></p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact-section" className="py-16 px-4 bg-gray-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Have questions about FastGen? We'd love to hear from you.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="bg-gray-800 p-8 rounded-lg">
              <h3 className="text-2xl font-semibold text-white mb-4">Contact Info</h3>
              <div className="space-y-4 text-gray-300">
                <div>
                  <p className="font-medium text-white">Email:</p>
                  <p>kodr.test@gmail.com</p>
                </div>
                <div>
                  <p className="font-medium text-white">Phone:</p>
                  <p>+91 7015506489</p>
                </div>
                <div>
                  <p className="font-medium text-white">Address:</p>
                  <p>273, Bhiwani, Haryana-127021, India</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-lg">
              <h3 className="text-2xl font-semibold text-white mb-4">Quick Message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={contactFormData.name}
                  onChange={handleContactInputChange}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={contactFormData.email}
                  onChange={handleContactInputChange}
                  placeholder="Your Email"
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                  required
                />
                <textarea
                  name="message"
                  value={contactFormData.message}
                  onChange={handleContactInputChange}
                  placeholder="Your Message"
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 resize-none"
                  required
                ></textarea>
                
                {contactSubmitStatus && (
                  <div className={`text-center p-3 rounded-lg ${contactSubmitStatus.includes('success') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                    {contactSubmitStatus}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmittingContact}
                  className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingContact ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 text-white">
                  <Library className="w-full h-full" />
                </div>
                <span className="text-2xl font-bold text-white">FastGen</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Your AI-powered learning companion that adapts to your needs and helps you master topics quickly and efficiently.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://github.com/SURAJ-RATHI/FastGen" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a 
                  href="https://twitter.com/SurajRathi65983" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.linkedin.com/in/suraj127021" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.065 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => {
                      const element = document.getElementById('features-section');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-gray-400 hover:text-blue-400 transition-colors"
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
                    className="text-gray-400 hover:text-blue-400 transition-colors"
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
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <Link to="/main" className="text-gray-400 hover:text-blue-400 transition-colors">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/help" className="text-gray-400 hover:text-blue-400 transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/docs" className="text-gray-400 hover:text-blue-400 transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-400 hover:text-blue-400 transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 FastGen. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                Privacy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                Terms
              </Link>
              <Link to="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;