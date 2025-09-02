import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiLinkedin, FiTwitter, FiMessageCircle, FiArrowLeft, FiUpload, FiSend, FiCheck } from 'react-icons/fi';
import axios from 'axios';

const SharePost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [prompt, setPrompt] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState(location.state?.selectedPlatform || '');
  const [showPlatformSelection, setShowPlatformSelection] = useState(!location.state?.selectedPlatform);
  const fileInputRef = useRef(null);

  const platforms = [
    { id: 'linkedin', name: 'LinkedIn', icon: FiLinkedin, color: 'blue', description: 'Professional networking and business content' },
    { id: 'twitter', name: 'Twitter', icon: FiTwitter, color: 'blue', description: 'Short-form content and trending topics' },
    { id: 'discord', name: 'Discord', icon: FiMessageCircle, color: 'purple', description: 'Community and gaming content' },
    { id: 'slack', name: 'Slack', icon: FiMessageCircle, color: 'green', description: 'Team communication and updates' },
    { id: 'dont-know', name: "Don't Know", icon: FiCheck, color: 'gray', description: 'Let AI choose the best platform' }
  ];

  const handleBack = () => {
    navigate('/content');
  };

  const handlePlatformSelect = (platform) => {
    setSelectedPlatform(platform.name);
    setShowPlatformSelection(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAttachClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const generateViralContent = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGeneratedContent('');

    try {
      // Create platform-specific prompt for viral content
      const platformPrompts = {
        'LinkedIn': `Create a viral LinkedIn post about "${prompt}". Make it professional, engaging, and include relevant hashtags. Focus on business insights, career tips, or industry trends. Use bullet points and emojis strategically.`,
        'Twitter': `Create a viral tweet about "${prompt}". Make it concise, engaging, and include trending hashtags. Focus on current events, humor, or valuable insights. Use emojis and make it shareable.`,
        'Discord': `Create a viral Discord message about "${prompt}". Make it community-focused, engaging, and include relevant emojis. Focus on gaming, tech, or community topics.`,
        'Slack': `Create a viral Slack message about "${prompt}". Make it professional, informative, and team-focused. Include relevant context and actionable insights.`,
        "Don't Know": `Create viral social media content about "${prompt}". Make it engaging, shareable, and include relevant hashtags and emojis. Optimize for maximum engagement across platforms.`
      };

      const enhancedPrompt = platformPrompts[selectedPlatform] || platformPrompts["Don't Know"];

      const formData = new FormData();
      formData.append('prompt', enhancedPrompt);
      formData.append('platform', selectedPlatform);
      formData.append('contentType', 'viral-post');
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_APP_BE_BASEURL}/api/gemini`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      if (response.data?.answer) {
        setGeneratedContent(response.data.answer);
      } else {
        throw new Error('No content generated');
      }
    } catch (error) {
      console.error('Failed to generate viral content:', error);
      setGeneratedContent('Sorry, I encountered an error generating your viral content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async (targetPlatform) => {
    if (!generatedContent) return;

    const shareData = {
      title: `Viral Post: ${prompt}`,
      text: generatedContent,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(generatedContent);
      alert('Content copied to clipboard!');
    }
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(generatedContent);
    alert('Content copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={handleBack}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Create Viral Post</h1>
            <p className="text-gray-600 dark:text-gray-400">Generate engaging content optimized for your chosen platform</p>
          </div>
        </div>

        {/* Platform Selection */}
        {showPlatformSelection && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Choose Your Platform</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {platforms.map((platform) => (
                <div
                  key={platform.id}
                  onClick={() => handlePlatformSelect(platform)}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer border-2 border-transparent hover:border-blue-500"
                >
                  <div className={`w-10 h-10 bg-${platform.color}-500 rounded-lg flex items-center justify-center mb-3`}>
                    <platform.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {platform.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {platform.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Platform Display */}
        {selectedPlatform && !showPlatformSelection && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <FiLinkedin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Selected Platform: {selectedPlatform}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Content will be optimized for {selectedPlatform}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPlatformSelection(true)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Change Platform
              </button>
            </div>
          </div>
        )}

        {/* Content Creation Interface */}
        {selectedPlatform && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Create Your Viral Post</h2>
            
            <div className="space-y-4">
              {/* Prompt Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What do you want to post about?
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Share insights about AI trends, create a professional update about my latest project, discuss the future of remote work..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Attach files (optional)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleAttachClick}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FiUpload className="w-4 h-4" />
                    Upload File
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  />
                  {selectedFile && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedFile.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateViralContent}
                disabled={!prompt.trim() || isGenerating}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating Viral Content...
                  </>
                ) : (
                  <>
                    <FiSend className="w-4 h-4" />
                    Generate Viral Post
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Generated Content */}
        {generatedContent && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Generated Viral Content</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyContent}
                  className="flex items-center gap-2 px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Copy
                </button>
                <button
                  onClick={() => handleShare(selectedPlatform)}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Share
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-gray-100 font-mono">
                  {generatedContent}
                </pre>
              </div>
            </div>

            {/* Platform-specific sharing */}
            <div className="mt-4 flex gap-3 flex-wrap">
              <button
                onClick={() => handleShare('linkedin')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Share on LinkedIn
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
              >
                Share on Twitter
              </button>
              <button
                onClick={() => handleShare('discord')}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Share on Discord
              </button>
              <button
                onClick={() => handleShare('slack')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Share on Slack
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharePost;
