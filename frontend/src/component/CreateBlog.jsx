import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUpload, FiSend, FiEdit3, FiShare2, FiCopy, FiFileText } from 'react-icons/fi';
import axios from 'axios';

const CreateBlog = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [platform, setPlatform] = useState('reddit'); // reddit or stackoverflow
  const fileInputRef = useRef(null);

  const handleBack = () => {
    navigate('/content');
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

  const handleGenerateBlog = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGeneratedContent('');

    try {
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('platform', platform);
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
      console.error('Failed to generate blog:', error);
      setGeneratedContent('Sorry, I encountered an error generating your content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async (targetPlatform) => {
    if (!generatedContent) return;

    const shareData = {
      title: `Blog Post: ${prompt}`,
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Create Blog/Reddit</h1>
            <p className="text-gray-600 dark:text-gray-400">Generate engaging blog content with proper structure and SEO optimization</p>
          </div>
        </div>

        {/* Platform Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Select Platform</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setPlatform('reddit')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                platform === 'reddit'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Reddit
            </button>
            <button
              onClick={() => setPlatform('stackoverflow')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                platform === 'stackoverflow'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Stack Overflow
            </button>
          </div>
        </div>

        {/* Content Creation Interface */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Create Your Content</h2>
          
          <div className="space-y-4">
            {/* Prompt Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Describe what you want to write about
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`e.g., ${platform === 'reddit' ? 'Share insights about React.js best practices, create a discussion about AI trends...' : 'Ask a question about JavaScript debugging, share a solution for React state management...'}`}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
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
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
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
              onClick={handleGenerateBlog}
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
                  Generate Content
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Content */}
        {generatedContent && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Generated Content</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyContent}
                  className="flex items-center gap-2 px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  <FiCopy className="w-4 h-4" />
                  Copy
                </button>
                <button
                  onClick={() => handleShare(platform)}
                  className="flex items-center gap-2 px-3 py-1 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                >
                  <FiShare2 className="w-4 h-4" />
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
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => handleShare('reddit')}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <FiShare2 className="w-4 h-4" />
                Share on Reddit
              </button>
              <button
                onClick={() => handleShare('stackoverflow')}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <FiShare2 className="w-4 h-4" />
                Share on Stack Overflow
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateBlog;
