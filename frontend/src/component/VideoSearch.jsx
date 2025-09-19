import React, { useState, useCallback, useMemo, memo } from 'react';
import { FiPlay, FiExternalLink, FiX } from 'react-icons/fi';
import LazyImage from './LazyImage';

// Memoized VideoCard component for better performance
const VideoCard = memo(({ video, index, onVideoClick }) => {
  const handleClick = useCallback((e) => {
    console.log('🖱️ Click event triggered!');
    console.log('🎯 Video being clicked:', video.title);
    console.log('📍 Event target:', e.target);
    console.log('📍 Current target:', e.currentTarget);
    
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🔒 Event prevented and stopped');
    onVideoClick(video);
  }, [video, onVideoClick]);

  return (
    <div
      onClick={handleClick}
      className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 hover:scale-105 transition-all duration-200 border border-gray-700 hover:border-blue-500 cursor-pointer select-none shadow-lg hover:shadow-xl"
    >
      <div className="relative">
        <LazyImage
          alt={video.title}
          className="w-full h-32 object-cover rounded-lg mb-3"
          src={video.thumbnail}
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          #{index + 1}
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {video.duration}
        </div>
      </div>
      <div>
        <h3
          className="text-gray-200 font-semibold text-sm mb-2 overflow-hidden"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {video.title}
        </h3>
        <p className="text-gray-400 text-xs mb-3">{video.channel}</p>
      </div>
    </div>
  );
});

VideoCard.displayName = 'VideoCard';

export default function VideoSearch() {
  const [searchTopic, setSearchTopic] = useState('book');
  const [videos] = useState([
    {
      id: 1,
      title: "romance only bookstore in NYC 🍎💌",
      channel: "Haley Pham",
      thumbnail: "https://i.ytimg.com/vi/-3hamTnw26I/mqdefault.jpg",
      videoId: "-3hamTnw26I",
      duration: "12:34"
    },
    {
      id: 2,
      title: "Random things in Japanese bookstores that make sense",
      channel: "ALLSTAR STEVEN",
      thumbnail: "https://i.ytimg.com/vi/gkow7b_Ryfo/mqdefault.jpg",
      videoId: "gkow7b_Ryfo",
      duration: "8:45"
    },
    {
      id: 3,
      title: "My hot controversial book takes #bookish #booktok #booktube #bookreview #reading #books #booksummary",
      channel: "Readers Archive",
      thumbnail: "https://i.ytimg.com/vi/_ZVaOpOYQCk/mqdefault.jpg",
      videoId: "_ZVaOpOYQCk",
      duration: "15:22"
    },
    {
      id: 4,
      title: "Books that deserve more hate #booktok #booktube #bookish #bookreview #books #reading #booksummary",
      channel: "Readers Archive",
      thumbnail: "https://i.ytimg.com/vi/08bY8gW_YFs/mqdefault.jpg",
      videoId: "08bY8gW_YFs",
      duration: "18:56"
    },
    {
      id: 5,
      title: "Mini Book Storage Box | Mini Book 📚 #minibook #shorts #crafts-to-craft",
      channel: "Crafts-to-craft",
      thumbnail: "https://i.ytimg.com/vi/V4uJBBqE6WA/mqdefault.jpg",
      videoId: "V4uJBBqE6WA",
      duration: "2:15"
    },
    {
      id: 6,
      title: "The Most Traumatic Children's Book I've EVER Read... #3",
      channel: "LaurenZside",
      thumbnail: "https://i.ytimg.com/vi/QS17R6SYPaw/mqdefault.jpg",
      videoId: "QS17R6SYPaw",
      duration: "22:18"
    },
    {
      id: 7,
      title: "BOOK RECS for 13 year olds ⭐️ #bookreview #authors #books",
      channel: "alimariebooks",
      thumbnail: "https://i.ytimg.com/vi/thcjdLSNa7A/mqdefault.jpg",
      videoId: "thcjdLSNa7A",
      duration: "9:42"
    },
    {
      id: 8,
      title: "Books with \"touch her and die\" book trope #bookrecommendations #booktube #booktok #books #reading",
      channel: "Sophie Ji",
      thumbnail: "https://i.ytimg.com/vi/mXM4BCT3KJE/mqdefault.jpg",
      videoId: "mXM4BCT3KJE",
      duration: "14:33"
    },
    {
      id: 9,
      title: "Diy Mini Notebook Easy📒 | Mini Notebook #shorts #mininotebookcraft #crafts-to-craft",
      channel: "Crafts-to-craft",
      thumbnail: "https://i.ytimg.com/vi/R3T7yDvbuJY/mqdefault.jpg",
      videoId: "R3T7yDvbuJY",
      duration: "1:58"
    },
    {
      id: 10,
      title: "Ranking Ai ASMR Books #asmr #voiceover #relaxing #satisfying #trending",
      channel: "5xViral",
      thumbnail: "https://i.ytimg.com/vi/ISTjI1HUeug/mqdefault.jpg",
      videoId: "ISTjI1HUeug",
      duration: "6:27"
    }
  ]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);

  const handleSearch = useCallback(() => {
    // Implement actual search functionality here
    console.log('Searching for:', searchTopic);
  }, [searchTopic]);

  const handleVideoCardClick = useCallback((video) => {
    console.log('🎬 Video card clicked!');
    console.log('📹 Video details:', video);
    console.log('🔍 Current state - selectedVideo:', selectedVideo);
    console.log('🔍 Current state - showVideoPlayer:', showVideoPlayer);
    
    setSelectedVideo(video);
    console.log('✅ selectedVideo set to:', video.title);
    
    setShowVideoPlayer(true);
    console.log('✅ showVideoPlayer set to: true');
    
    // Log the updated state after a brief delay
    setTimeout(() => {
      console.log('🔄 State after update - selectedVideo:', selectedVideo);
      console.log('🔄 State after update - showVideoPlayer:', showVideoPlayer);
    }, 100);
  }, [selectedVideo, showVideoPlayer]);

  const handlePlayVideo = useCallback(() => {
    // This function is now called from the preview modal if needed
    setShowVideoPreview(false);
    setShowVideoPlayer(true);
  }, []);

  const handlePlayOnYouTube = useCallback((videoId) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  }, []);

  const handleClosePreview = useCallback(() => {
    setShowVideoPreview(false);
    setSelectedVideo(null);
  }, []);

  const handleCloseVideo = useCallback(() => {
    setShowVideoPlayer(false);
    setSelectedVideo(null);
  }, []);

  // Memoize the video grid to prevent unnecessary re-renders
  const videoGrid = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {videos.map((video, index) => (
        <VideoCard 
          key={video.id} 
          video={video} 
          index={index} 
          onVideoClick={handleVideoCardClick}
        />
      ))}
    </div>
  ), [videos, handleVideoCardClick]);

  return (
    <div className="bg-[#113] bg-opacity-40 backdrop-blur-md rounded-lg shadow-lg border hover:shadow-[0_0_10px_rgba(90,175,255,0.4)] border-gray-700 p-4 max-w-xl mx-auto mt-1" style={{ height: '88vh' }}>
      {/* Search Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Video Search</h2>
        <div className="flex gap-2">
          <button
            onClick={() => window.open('https://www.youtube.com', '_blank')}
            className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded transition-colors flex items-center gap-2"
          >
            <FiExternalLink className="w-4 h-4" />
            Open in New Tab
          </button>
          <button
            onClick={() => window.close()}
            className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-2 rounded transition-colors flex items-center gap-2"
          >
            <FiX className="w-4 h-4" />
            Close
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <label htmlFor="topic" className="block text-gray-300 mb-2">Enter a topic:</label>
        <div className="flex gap-2">
          <input
            id="topic"
            placeholder="e.g., Quadratic Equations"
            className="flex-1 px-4 py-2 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            value={searchTopic}
            onChange={(e) => setSearchTopic(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <div className="text-gray-300 text-center">
          <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">{videos.length} videos found</span>
        </div>
      </div>

      {/* Video Grid */}
      <div className="overflow-y-auto" style={{ height: 'calc(88vh - 200px)' }}>
        {videoGrid}
      </div>

      {/* Video Preview Modal */}
      {showVideoPreview && selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-[#202123] rounded-lg p-6 max-w-4xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">{selectedVideo.title}</h3>
              <button
                onClick={handleClosePreview}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>
            
            <div className="relative">
              <LazyImage
                alt={selectedVideo.title}
                className="w-full h-80 object-cover rounded-lg"
                src={selectedVideo.thumbnail}
              />
              {/* Large Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={handlePlayVideo}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full p-6 transition-colors shadow-lg hover:scale-110 transform"
                >
                  <FiPlay size={48} className="ml-2" />
                </button>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <div>
                <p className="text-gray-300 text-sm">Channel: {selectedVideo.channel}</p>
                <p className="text-gray-400 text-xs">Duration: {selectedVideo.duration}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handlePlayVideo}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
                >
                  <FiPlay className="w-4 h-4" />
                  Play Video
                </button>
                <button
                  onClick={() => handlePlayOnYouTube(selectedVideo.videoId)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
                >
                  <FiExternalLink className="w-4 h-4" />
                  Open on YouTube
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {showVideoPlayer && selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-[#202123] rounded-lg p-6 max-w-4xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">{selectedVideo.title}</h3>
              <button
                onClick={handleCloseVideo}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>
            
            <div className="relative">
              <iframe
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <p className="text-gray-300 text-sm">Channel: {selectedVideo.channel}</p>
              <button
                onClick={() => handlePlayOnYouTube(selectedVideo.videoId)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
              >
                <FiExternalLink className="w-4 h-4" />
                Open on YouTube
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
