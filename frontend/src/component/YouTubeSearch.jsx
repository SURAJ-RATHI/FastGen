import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSearch, FiShare2, FiYoutube, FiClock } from 'react-icons/fi';
import axios from 'axios';

const YouTubeSearch = () => {
  const navigate = useNavigate();
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

  const handleBack = () => {
    navigate('/content');
  };

  const handleReset = () => {
    setTopic('');
    setVideoData([]);
    localStorage.removeItem('searchTopic');
    localStorage.removeItem('videoData');
  };

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
        params: { topic, maxResults: 20 }, // Request 20 videos instead of 10
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

  const handleShareVideo = (video) => {
    const shareData = {
      title: video.title,
      url: `https://www.youtube.com/watch?v=${video.videoId}`,
      text: `Check out this video: ${video.title}`
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareData.url);
      alert('Video URL copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={handleBack}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">YouTube Content Searcher</h1>
            <p className="text-gray-600 dark:text-gray-400">Find the best 20 video recommendations for any topic</p>
          </div>
        </div>

        {/* Search Interface */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && getVideoRecommendations()}
              placeholder="e.g., React.js tutorials, machine learning basics..."
              className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <button
              onClick={getVideoRecommendations}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Searching...
                </>
              ) : (
                <>
                  <FiSearch className="w-4 h-4" />
                  Search
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</div>
          )}

          {videoData.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-3 py-1 rounded-full text-sm">
                {videoData.length} videos found
              </span>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
              >
                <FiClock className="w-4 h-4" />
                Reset
              </button>
            </div>
          )}
        </div>

        {/* Video Results */}
        {videoData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videoData.map((video, index) => (
              <div
                key={video.videoId}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600 hover:border-red-400 shadow-sm"
              >
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    #{index + 1}
                  </div>
                </div>
                <div>
                  <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-sm mb-2 overflow-hidden" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {video.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs mb-3">{video.channelTitle}</p>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://www.youtube.com/watch?v=${video.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium transition-colors hover:text-red-700"
                    >
                      <FiYoutube className="w-4 h-4" />
                      Watch Video
                    </a>
                    <button
                      onClick={() => handleShareVideo(video)}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                      title="Share video"
                    >
                      <FiShare2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {videoData.length === 0 && !loading && !error && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            <FiYoutube className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No videos yet. Enter a topic above to get recommendations.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeSearch;
