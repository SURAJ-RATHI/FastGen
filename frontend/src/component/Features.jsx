// src/components/FeaturePage.jsx
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { Target, BookOpen, Key, HelpCircle, FileText, Zap, Sparkles } from 'lucide-react';

const features = [
  {
    title: "Personalized Learning",
    description: "FastGen adapts to your learning style and pace for maximum results.",
    icon: Target,
    route: "/main?tab=chatbot",
  },
  {
    title: "All Content in One Place",
    description: "Easily access all your study material including PDFs and text files in a single content hub.",
    icon: BookOpen,
    route: "/main?tab=content",
  },
  {
    title: "Key Points Extraction",
    description: "Get key points from any uploaded file to focus on what really matters.",
    icon: Key,
    route: "/main?tab=content",
  },
  {
    title: "Quiz Generator",
    description: "Generate quizzes from your files to test and reinforce your knowledge instantly.",
    icon: HelpCircle,
    route: "/main?tab=quizzes",
  },
  {
    title: "Smart Notes",
    description: "Take important notes as you learn and keep them organized.",
    icon: FileText,
    route: "/main?tab=notes",
  },
  {
    title: "One-Click Notion Access",
    description: "Open your Notion files directly with a single click—no more switching tabs.",
    icon: Zap,
    route: "/main?tab=content",
  },
  {
    title: "Super Modern Design",
    description: "FastGen boasts a sleek, vibrant UI that makes last-minute learning feel exciting and fun.",
    icon: Sparkles,
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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-8">
      <div className="max-w-6xl mx-auto text-center mb-20">
        <h1 className="text-5xl font-bold text-white mb-4">FastGen</h1>
        <p className="text-xl text-white">Our AI Features that </p>
        <p className="text-md text-white mt-2">
          An AI-driven app that adapts to your needs and helps you master topics quickly.
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
            className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-4 shadow-lg text-white hover:scale-105 transition-transform cursor-pointer hover:border-blue-400 hover:bg-white/30"
          >
            <div className="mb-3">
              <IconComponent className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-semibold mb-2">{feature.title}</h2>
            <p className="text-xs">{feature.description}</p>
          </div>
          );
        })}
      </div>
    </div>
  );
}
