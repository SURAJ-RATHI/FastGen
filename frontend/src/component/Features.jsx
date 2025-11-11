// src/components/FeaturePage.jsx
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

// Custom SVG Icons
const PersonalizedLearningIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 20C7 17 9.5 15 12 15C14.5 15 17 17 17 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 8L7 6L5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 8L17 6L19 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ContentHubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 8H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="7" cy="6" r="0.5" fill="currentColor"/>
    <circle cx="9" cy="6" r="0.5" fill="currentColor"/>
    <circle cx="11" cy="6" r="0.5" fill="currentColor"/>
    <rect x="6" y="11" width="12" height="1.5" rx="0.75" fill="currentColor"/>
    <rect x="6" y="14.5" width="9" height="1.5" rx="0.75" fill="currentColor"/>
    <rect x="6" y="18" width="7" height="1.5" rx="0.75" fill="currentColor"/>
    <path d="M16 13L19 16L16 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const KeyPointsIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 11L10 13L14 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 16H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 19H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="18" cy="18" r="2" fill="currentColor" opacity="0.6"/>
  </svg>
);

const QuizIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="11" r="1.5" fill="currentColor"/>
    <circle cx="9" cy="15" r="1.5" fill="currentColor"/>
    <circle cx="9" cy="19" r="1.5" fill="currentColor"/>
    <path d="M13 10H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M13 14H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M13 18H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const SmartNotesIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 19.5C4 18.6716 4.67157 18 5.5 18H18.5C19.3284 18 20 18.6716 20 19.5C20 20.3284 19.3284 21 18.5 21H5.5C4.67157 21 4 20.3284 4 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 4.5C4 3.67157 4.67157 3 5.5 3H12.5C13.3284 3 14 3.67157 14 4.5V19.5C14 20.3284 13.3284 21 12.5 21H5.5C4.67157 21 4 20.3284 4 19.5V4.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 7H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M7 11H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M7 15H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M15 7L17 9L20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 12L17 14L20 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const NotionAccessIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15"/>
    <circle cx="13" cy="2" r="2" fill="currentColor"/>
    <circle cx="11" cy="22" r="2" fill="currentColor"/>
    <path d="M12 10L12 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ModernDesignIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2"/>
    <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2"/>
    <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2"/>
    <rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2"/>
    <circle cx="7" cy="7" r="1.5" fill="currentColor"/>
    <circle cx="17" cy="7" r="1.5" fill="currentColor"/>
    <circle cx="7" cy="17" r="1.5" fill="currentColor"/>
    <circle cx="17" cy="17" r="1.5" fill="currentColor"/>
    <path d="M7 7L17 17M17 7L7 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
  </svg>
);

const features = [
  {
    title: "Personalized Learning",
    description: "FastGen adapts to your learning style and pace for maximum results.",
    icon: PersonalizedLearningIcon,
    route: "/main?tab=chatbot",
  },
  {
    title: "All Content in One Place",
    description: "Easily access all your study material including PDFs and text files in a single content hub.",
    icon: ContentHubIcon,
    route: "/main?tab=content",
  },
  {
    title: "Key Points Extraction",
    description: "Get key points from any uploaded file to focus on what really matters.",
    icon: KeyPointsIcon,
    route: "/main?tab=content",
  },
  {
    title: "Quiz Generator",
    description: "Generate quizzes from your files to test and reinforce your knowledge instantly.",
    icon: QuizIcon,
    route: "/main?tab=quizzes",
  },
  {
    title: "Smart Notes",
    description: "Take important notes as you learn and keep them organized.",
    icon: SmartNotesIcon,
    route: "/main?tab=notes",
  },
  {
    title: "One-Click Notion Access",
    description: "Open your Notion files directly with a single click—no more switching tabs.",
    icon: NotionAccessIcon,
    route: "/main?tab=content",
  },
  {
    title: "Super Modern Design",
    description: "FastGen boasts a sleek, vibrant UI that makes last-minute learning feel exciting and fun.",
    icon: ModernDesignIcon,
    route: "/main?tab=chatbot",
  },
];

export default function FeaturePage() {
  const cardsRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    gsap.from(cardsRef.current, {
      opacity: 0,
      y: 50,
      stagger: 0.2,
      duration: 1,
      ease: "power2.out",
    });
  }, []);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">FastGen</h1>
        <p className="text-lg md:text-xl text-gray-600">
          Our AI Features that adapt to your needs and help you master topics quickly.
        </p>
      </div>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 max-w-6xl mx-auto">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
          <div
            key={index}
            ref={(el) => (cardsRef.current[index] = el)}
            onClick={() => navigate(feature.route)}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-gray-900 transition-all duration-200 cursor-pointer hover:border-gray-300 hover:shadow-md"
          >
            <div className="mb-4 flex items-center justify-center">
              <IconComponent className="w-10 h-10 text-gray-900" />
            </div>
            <h2 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h2>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </div>
          );
        })}
      </div>
    </div>
  );
}
