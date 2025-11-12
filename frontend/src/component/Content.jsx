import { useEffect, useState } from "react";
import axios from "axios";
import UpgradeModal from './UpgradeModal';

const Content = () => {
  const [topic, setTopic] = useState('');
  const [videoData, setVideoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeModalData, setUpgradeModalData] = useState(null);

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
    setVideoData([]);
    localStorage.removeItem('searchTopic');
    localStorage.removeItem('videoData');
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    setSelectedVideo(null);
  };

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
      
      // Only show upgrade modal for explicit usage limit errors (429 with upgradeRequired flag)
      if (err.response?.status === 429 && err.response?.data?.upgradeRequired) {
        const usageData = err.response.data.usage;
        setUpgradeModalData({
          usage: usageData,
          featureType: 'videoRecommendations'
        });
        setShowUpgradeModal(true);
      } else if (err.response?.status === 500 && err.response?.data?.error?.includes('YouTube API key not set')) {
        setError('YouTube API not configured. Please contact support.');
      } else {
        setError('Failed to fetch videos.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white overflow-hidden">
      <div className="h-full overflow-y-auto scrollbar-hide p-4">
      <label htmlFor="topic" className="block text-gray-900 mb-2 font-medium">Enter a topic:</label>
      <div className="flex items-center gap-3 mb-4">
        <input
          id="topic"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && getVideoRecommendations()}
          placeholder="e.g., Quadratic Equations"
          className="flex-1 px-4 py-2 rounded-md bg-white text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
        />
        <button
          onClick={getVideoRecommendations}
          className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors whitespace-nowrap font-medium"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-medium">
            {videoData.length} videos found
          </span>
          {videoData.length > 0 && (
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 rounded-md transition-colors flex items-center gap-2 font-medium"
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
              onClick={() => handleVideoClick(video)}
              className="bg-white rounded-lg p-4 hover:bg-gray-50 transition-colors border border-gray-200 hover:border-gray-300 shadow-sm cursor-pointer"
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
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-30 rounded-lg">
                  <div className="bg-red-600 rounded-full p-3">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-gray-900 font-medium text-sm mb-2 overflow-hidden" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {video.title}
                </h3>
                <p className="text-gray-600 text-xs mb-3">{video.channelTitle}</p>
                <div className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-700 text-sm font-medium transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  Click to Watch
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {videoData.length === 0 && !loading && !error && (
        <p className="text-gray-600 mt-6 text-center">
          No videos yet. Enter a topic above to get suggestions.
        </p>
      )}
      </div>

      {/* YouTube Video Modal */}
      {showVideoModal && selectedVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl bg-white rounded-lg overflow-hidden border border-gray-200 shadow-xl">
            {/* Close button */}
            <button
              onClick={closeVideoModal}
              className="absolute top-4 right-4 z-10 bg-white text-gray-400 rounded-full p-2 hover:text-gray-600 hover:bg-gray-50 transition-all border border-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Video Info */}
            <div className="p-4 bg-white border-b border-gray-200">
              <h2 className="text-gray-900 text-lg font-medium mb-2">{selectedVideo.title}</h2>
              <p className="text-gray-600 text-sm">{selectedVideo.channelTitle}</p>
            </div>
            
            {/* YouTube Embed */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            
            {/* Action buttons */}
            <div className="p-4 bg-white flex gap-3 border-t border-gray-200">
              <a
                href={`https://www.youtube.com/watch?v=${selectedVideo.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-md transition-colors font-medium"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Open in YouTube
              </a>
              <button
                onClick={closeVideoModal}
                className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 rounded-md transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
        usageData={upgradeModalData?.usage}
        featureType={upgradeModalData?.featureType}
      />
    </div>
  );
};

export default Content;

