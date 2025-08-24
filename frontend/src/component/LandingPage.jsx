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
    <div className="bg-black">
      <HomeHeader />
      <div className="flex flex-col items-center py-20 px-4 pt-32">
        {/* Top Title */}
        <div className="text-3xl md:text-4xl symbol font-semibold text-blue-400 mb-4">
          FastGen
        </div>

        {/* Explore Button/Tag */}
        <div 
          onClick={() => navigate('/main')}
          className="text-sm text-gray-300 px-3 py-1 rounded-full border border-gray-600 shadow-sm bg-gray-800 transition transform cursor-pointer mb-6 hover:bg-gray-700 hover:border-gray-500 hover:shadow-md"
        >
          explore FastGen ✨
        </div>

        {/* Main Title */}
        <div className="text-4xl md:text-6xl font-bold text-center text-white mb-4 leading-tight">
          <div className="tagline">Our AI Features that Works </div>
          <div className="tagline">
            {" "}
            <span className="relative inline-block align-middle">
              <span ref={wordRef} className="inline-block mb-3 text-blue-400 font-bold">
                {words[0]}
              </span>
            </span>
          </div>
        </div>
        
        <div className="text-center mb-6">
          <p className="tagline text-gray-300 text-lg">
            An AI-driven app that makes  <br />
            Life Easy using AI tools to increase productivity <br />
          </p>
        </div>
        
        {/* Get Started Button */}
        <Button />
      </div>

      {/* Features Section */}
      <div id="features-section" className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
            Our AI Features
          </h2>
          <p className="text-xl text-gray-300 mb-16 max-w-3xl mx-auto">
            FastGen adapts to your learning style and pace for maximum results.
          </p>
          
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
            {[
              {
                title: "Personalized Chatbot",
                description: "FastGen’s chatbot answers all your questions — from learning to personal queries.",
                icon: "🎯",
              },
              {
                title: "Content Searcher",
                description: "Suggest Best youtube video related to your search query",
                icon: "▶️",
              },
              {
                title: "Key Points Extraction",
                description: "Get key points from any uploaded file to focus on what really matters.",
                icon: "🔑",
              },
              {
                title: "Quiz Generator",
                description: "Generate quizzes from your files to test and reinforce your knowledge instantly.",
                icon: "❓",
              },
              {
                title: "Smart Notes",
                description: "Take important notes as you learn and keep them organized.",
                icon: "📝",
              },
              {
                title: "All Content in One Place",
                description: "Easily access all your study material including PDFs and text files in a single content hub",
                icon: "📚",
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-lg border border-gray-600 rounded-2xl p-6 shadow-lg text-white hover:scale-105 transition-transform"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing-section" className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-300 mb-16 max-w-3xl mx-auto">
            Choose the plan that fits your learning needs. All plans include our core AI features with no hidden fees.
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
                className={`relative bg-gray-800 p-8 rounded-2xl border-2 ${
                  plan.popular 
                    ? 'border-blue-500 scale-105' 
                    : 'border-gray-600'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-2">/{plan.period}</span>
                  </div>
                  <p className="text-gray-300 text-sm">{plan.description}</p>
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
                  className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition-colors ${plan.buttonStyle}`}
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
      <div id="contact-section" className="py-20 px-4 bg-gray-900/50">
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