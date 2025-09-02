import React, { useState, useRef } from 'react';
import { FiShare2, FiYoutube, FiEdit3, FiFileText, FiLinkedin, FiTwitter } from 'react-icons/fi';
import { FaDiscord, FaSlack } from 'react-icons/fa';

const Content = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentHistory, setContentHistory] = useState([]);
  const fileInputRef = useRef(null);

  const handleGenerate = async (type) => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      // Simulate API call - replace with actual API
      const response = await new Promise(resolve => 
        setTimeout(() => resolve({ 
          content: `Generated ${type} content for: "${prompt}"\n\nThis is a sample generated content that would be created based on your prompt. It includes proper structure and formatting for ${type}.` 
        }), 2000)
      );
      
      const newContent = {
        id: Date.now(),
        type,
        prompt,
        content: response.content,
        timestamp: new Date().toISOString(),
        isEditing: false
      };
      
      setGeneratedContent(response.content);
      setContentHistory(prev => [newContent, ...prev]);
      setActiveCard(type);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = (platform, content) => {
    const shareText = content || generatedContent;
    const encodedText = encodeURIComponent(shareText);
    
    const shareUrls = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent('Check out this content')}&summary=${encodedText}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      discord: `https://discord.com/api/webhooks/...`, // Would need webhook setup
      slack: `https://slack.com/api/chat.postMessage` // Would need Slack app setup
    };
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank');
    }
  };

  const handleEdit = (contentId) => {
    setContentHistory(prev => 
      prev.map(item => 
        item.id === contentId 
          ? { ...item, isEditing: !item.isEditing }
          : item
      )
    );
  };

  const handleSaveEdit = (contentId, newContent) => {
    setContentHistory(prev => 
      prev.map(item => 
        item.id === contentId 
          ? { ...item, content: newContent, isEditing: false }
          : item
      )
    );
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Handle file upload logic here
      console.log('File uploaded:', file.name);
    }
  };

  const renderSharePostCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
        <FiShare2 className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Share Post</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Create and share content across social media platforms
      </p>
      
      {activeCard === 'share' ? (
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Write your post content here..."
            className="w-full p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
            rows={4}
          />
          
          <div className="flex gap-2">
            <button
              onClick={() => handleGenerate('share')}
              disabled={isGenerating || !prompt.trim()}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : 'Generate Post'}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,.pdf,.txt"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              📎
            </button>
          </div>

          {generatedContent && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Generated Content:</h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">{generatedContent}</p>
              
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleShare('linkedin', generatedContent)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <FiLinkedin className="w-4 h-4" />
                  LinkedIn
                </button>
                <button
                  onClick={() => handleShare('twitter', generatedContent)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors text-sm"
                >
                  <FiTwitter className="w-4 h-4" />
                  Twitter
                </button>
                <button
                  onClick={() => handleShare('discord', generatedContent)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  <FaDiscord className="w-4 h-4" />
                  Discord
                </button>
                <button
                  onClick={() => handleShare('slack', generatedContent)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <FaSlack className="w-4 h-4" />
                  Slack
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setActiveCard('share')}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Share Post
        </button>
      )}
    </div>
  );

  const renderYouTubeCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
        <FiYoutube className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">YouTube Content Searcher</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Search and find 20 relevant YouTube videos for any topic
      </p>
      
      {activeCard === 'youtube' ? (
        <div className="space-y-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter topic to search for videos..."
            className="w-full p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-200 dark:border-gray-600 focus:border-red-500 focus:outline-none"
          />
          
          <button
            onClick={() => handleGenerate('youtube')}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isGenerating ? 'Searching...' : 'Search 20 Videos'}
          </button>

          {generatedContent && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Found Videos:</h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">{generatedContent}</p>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleShare('linkedin', generatedContent)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <FiLinkedin className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setActiveCard('youtube')}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
        >
          Search Videos
        </button>
      )}
    </div>
  );

  const renderBlogCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
        <FiFileText className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Create Blog/Reddit</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Generate engaging blog content with proper structure and SEO optimization
      </p>
      
      {activeCard === 'blog' ? (
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your blog topic or requirements..."
            className="w-full p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-200 dark:border-gray-600 focus:border-green-500 focus:outline-none resize-none"
            rows={4}
          />
          
          <div className="flex gap-2">
            <button
              onClick={() => handleGenerate('blog')}
              disabled={isGenerating || !prompt.trim()}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : 'Generate Blog'}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,.pdf,.txt"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              📎
            </button>
          </div>

          {generatedContent && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Generated Blog:</h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">{generatedContent}</p>
              
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleShare('linkedin', generatedContent)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <FiLinkedin className="w-4 h-4" />
                  LinkedIn
                </button>
                <button
                  onClick={() => handleShare('twitter', generatedContent)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors text-sm"
                >
                  <FiTwitter className="w-4 h-4" />
                  Twitter
                </button>
                <button
                  onClick={() => handleShare('discord', generatedContent)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  <FaDiscord className="w-4 h-4" />
                  Discord
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setActiveCard('blog')}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
        >
          Create Blog
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Content Creation Hub
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Create, generate, and share content across multiple platforms with AI assistance
          </p>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {renderSharePostCard()}
          {renderYouTubeCard()}
          {renderBlogCard()}
        </div>

        {/* Content History */}
        {contentHistory.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Content History</h2>
            <div className="space-y-4">
              {contentHistory.map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.type === 'share' ? 'bg-blue-100 text-blue-800' :
                        item.type === 'youtube' ? 'bg-red-100 text-red-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        title="Edit"
                      >
                        <FiEdit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleShare('linkedin', item.content)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Share"
                      >
                        <FiShare2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Prompt:</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{item.prompt}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Content:</h3>
                    {item.isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          defaultValue={item.content}
                          className="w-full p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
                          rows={6}
                          onBlur={(e) => handleSaveEdit(item.id, e.target.value)}
                        />
                        <button
                          onClick={() => handleSaveEdit(item.id, document.querySelector(`textarea[defaultvalue="${item.content}"]`).value)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">{item.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Content;