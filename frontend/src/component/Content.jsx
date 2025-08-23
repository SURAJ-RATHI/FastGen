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
      const res = await axios.get(`${import.meta.env.VITE_APP_BE_BASEURL}/yt`, {
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
    <div className="h-[91vh] bg-black overflow-hidden">
      <div className="h-full overflow-y-auto scrollbar-hide p-4">
      <label htmlFor="topic" className="block text-white mb-2 font-medium">Enter a topic:</label>
      <div className="flex items-center gap-3 mb-4">
        <input
          id="topic"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && getVideoRecommendations()}
          placeholder="e.g., Quadratic Equations"
          className="flex-1 px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={getVideoRecommendations}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition whitespace-nowrap"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
            {videoData.length} videos found
          </span>
          {videoData.length > 0 && (
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Reset
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videoData.map((video, index) => (
            <div
              key={video.videoId}
              className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors border border-gray-600 hover:border-blue-400 shadow-sm"
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
                <h3 className="text-white font-semibold text-sm mb-2 overflow-hidden" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {video.title}
                </h3>
                <p className="text-gray-300 text-xs mb-3">{video.channelTitle}</p>
                <a
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  Watch Video
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {videoData.length === 0 && !loading && !error && (
        <p className="text-gray-300 mt-6 text-center">
          No videos yet. Enter a topic above to get suggestions.
        </p>
      )}
      </div>
    </div>
  );
};

export default Content;