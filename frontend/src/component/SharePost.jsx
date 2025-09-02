import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLinkedin, FiTwitter, FiMessageCircle, FiArrowLeft, FiUpload, FiSend } from 'react-icons/fi';

const SharePost = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleBack = () => {
    navigate('/content');
  };

  const handlePlatformSelect = (platform) => {
    navigate(`/share-post/${platform}`, { 
      state: { 
        prompt, 
        selectedFile,
        platform 
      } 
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleGeneratePost = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    // Here you would call your AI API to generate content
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Share Post</h1>
            <p className="text-gray-600 dark:text-gray-400">Create and share content across social platforms</p>
          </div>
        </div>

        {/* Post Creation Interface */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Create Your Post</h2>
          
          <div className="space-y-4">
            {/* Prompt Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Describe what you want to post about
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Share insights about AI trends, create a professional update about my latest project..."
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
                <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                  <FiUpload className="w-4 h-4" />
                  Upload File
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  />
                </label>
                {selectedFile && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedFile.name}
                  </span>
                )}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGeneratePost}
              disabled={!prompt.trim() || isGenerating}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>
                  <FiSend className="w-4 h-4" />
                  Generate Post
                </>
              )}
            </button>
          </div>
        </div>

        {/* Platform Selection */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* LinkedIn */}
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500"
            onClick={() => handlePlatformSelect('linkedin')}
          >
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <FiLinkedin className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">LinkedIn</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Share professional updates and insights with your network
            </p>
            <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
              Share on LinkedIn →
            </div>
          </div>

          {/* Twitter */}
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-400"
            onClick={() => handlePlatformSelect('twitter')}
          >
            <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center mb-4">
              <FiTwitter className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Twitter</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Tweet your thoughts and engage with the community
            </p>
            <div className="flex items-center text-blue-400 text-sm font-medium">
              Share on Twitter →
            </div>
          </div>

          {/* Discord/Slack */}
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-purple-500"
            onClick={() => handlePlatformSelect('discord')}
          >
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
              <FiMessageCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Discord/Slack</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Share updates with your team and community channels
            </p>
            <div className="flex items-center text-purple-600 dark:text-purple-400 text-sm font-medium">
              Share on Discord/Slack →
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharePost;
