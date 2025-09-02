import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShare2, FiYoutube, FiEdit3, FiClock, FiFileText, FiHome, FiMessageCircle } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext.jsx';

const ContentPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [contentHistory] = useState([
    {
      id: 1,
      type: 'blog',
      title: 'The Future of AI in Content Creation',
      platform: 'Reddit',
      createdAt: '2 hours ago',
      status: 'published'
    },
    {
      id: 2,
      type: 'post',
      title: 'Weekly Tech Roundup',
      platform: 'LinkedIn',
      createdAt: '1 day ago',
      status: 'published'
    },
    {
      id: 3,
      type: 'blog',
      title: 'React.js Best Practices',
      platform: 'Stack Overflow',
      createdAt: '3 days ago',
      status: 'draft'
    }
  ]);

  const handleSharePost = () => {
    navigate('/share-post');
  };

  const handleYouTubeSearch = () => {
    navigate('/youtube-search');
  };

  const handleCreateBlog = () => {
    navigate('/create-blog');
  };

  const handleContentHistory = (content) => {
    navigate(`/content/${content.id}`, { state: { content } });
  };

  const handleGoToMain = () => {
    navigate('/main');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleGoToMain}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg transition-colors"
              >
                <FiHome className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Content Hub</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Create, manage, and share content</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-medium text-white">
                {user?.displayName?.charAt(0) || user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Content Creation Hub
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Create, manage, and share content across multiple platforms with AI assistance
          </p>
        </div>

        {/* Main Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Share Post Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer" onClick={handleSharePost}>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
              <FiShare2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Share Post</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create and share posts on LinkedIn, Twitter, and Discord/Slack with one-click publishing
            </p>
            <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
              Create Post →
            </div>
          </div>

          {/* YouTube Content Searcher Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer" onClick={handleYouTubeSearch}>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
              <FiYoutube className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">YouTube Content Searcher</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Find the best 20 video recommendations for any topic with AI-powered search
            </p>
            <div className="flex items-center text-red-600 dark:text-red-400 text-sm font-medium">
              Search Videos →
            </div>
          </div>

          {/* Create Blog/Reddit Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer" onClick={handleCreateBlog}>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
              <FiEdit3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Create Blog/Reddit</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Generate engaging blog content with proper structure and SEO optimization for Reddit and Stack Overflow
            </p>
            <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
              Create Content →
            </div>
          </div>
        </div>

        {/* Content History */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Content History</h2>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
              <FiClock className="w-4 h-4" />
              <span>Recent Activities</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {contentHistory.map((content) => (
              <div 
                key={content.id} 
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                onClick={() => handleContentHistory(content)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <FiFileText className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{content.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{content.platform} • {content.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    content.status === 'published' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {content.status}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <FiEdit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPage;
