import { useEffect, useState } from "react";
import axios from "axios";

const Content = () => {
  const [topic, setTopic] = useState('');
  const [videoData, setVideoData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  // Load topic and videoData from localStorage on mount
  useEffect(() => {
    const savedTopic = localStorage.getItem('searchTopic');
    const savedVideos = localStorage.getItem('videoData');
    if (savedTopic) {
      setTopic(savedTopic);
    }
    if (savedVideos) {
      setVideoData(JSON.parse(savedVideos));
    }
  }, []);

  const handleReset = () => {
    setTopic('');
    setVideoData([])
      localStorage.removeItem('searchTopic');
      localStorage.removeItem('videoData');

  }

  // Save topic and videoData to localStorage only when a new search is performed
  const getVideoRecommendations = async () => {
    if (!topic) {
      setError('Please enter a topic.');
      return;
    }

    // Clear any existing cached data
    localStorage.removeItem('videoData');
    setVideoData([]);

    setLoading(true);
    setError('');

    try {
      const res = await axios.get(`${import.meta.env.VITE_APP_BE_BASEURL}/api/yt`, {
        params: { topic },
        headers: {
          'Cache-Control': 'no-cache'
        },
        withCredentials: true
      });

      if (!res.data) {
        throw new Error(`Request failed: ${res.status}`);
      }

      console.log('Response:', res.data);
      console.log('Videos count:', res.data.videos?.length || 0);
      const newVideos = res.data.videos || [];
      setVideoData(newVideos);

      // Save to localStorage only after a successful search
      localStorage.setItem('searchTopic', topic);
      localStorage.setItem('videoData', JSON.stringify(newVideos));
    } catch (err) {
      console.error(err);
      if (err.response?.status === 500 && err.response?.data?.error?.includes('YouTube API key not set')) {
        setError('YouTube API not configured. Please contact support.');
      } else {
        setError('Failed to fetch videos.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Content Generation
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Create engaging content for your projects with AI assistance
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Content Types */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Blog Posts</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Generate engaging blog content with proper structure and SEO optimization
            </p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Create Blog Post
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Social Media</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create compelling social media posts for various platforms
            </p>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              Create Post
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Email Content</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Generate professional email content for marketing campaigns
            </p>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
              Create Email
            </button>
          </div>
        </div>

        {/* Recent Content */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Recent Content</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">Blog Post</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                The Future of AI in Content Creation
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Exploring how artificial intelligence is revolutionizing the way we create and consume content...
              </p>
              <div className="flex gap-2">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Edit</button>
                <button className="text-gray-600 hover:text-gray-700 text-sm">Share</button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">Social Media</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">1 day ago</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Weekly Tech Roundup
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This week's biggest tech news and innovations that are shaping our digital future...
              </p>
              <div className="flex gap-2">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Edit</button>
                <button className="text-gray-600 hover:text-gray-700 text-sm">Share</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;