import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

export default function SharedChat() {
  const { chatId } = useParams();
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedChat = async () => {
      try {
        setLoading(true);
        const apiUrl = `${import.meta.env.VITE_APP_BE_BASEURL}/shared-chat/public/${chatId}`;
        console.log('🔍 Fetching shared chat from:', apiUrl);
        console.log('🔍 Environment variable:', import.meta.env.VITE_APP_BE_BASEURL);
        
        const response = await axios.get(apiUrl);
        console.log('✅ API Response:', response.data);
        setChat(response.data);
      } catch (err) {
        console.error('❌ Error fetching shared chat:', err);
        console.error('❌ Error response:', err.response);
        if (err.response?.status === 410) {
          setError('This shared chat has expired.');
        } else if (err.response?.status === 404) {
          setError('Chat not found or has been removed.');
        } else {
          setError('Failed to load shared chat. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (chatId) {
      fetchSharedChat();
    }
  }, [chatId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#343541] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading shared chat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#343541] flex items-center justify-center">
        <div className="text-white text-center max-w-md mx-auto p-6">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4">Chat Unavailable</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="min-h-screen bg-[#343541] flex items-center justify-center">
        <div className="text-white text-center">
          <p>No chat data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#343541]">
      {/* Header */}
      <div className="bg-[#202123] border-b border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-medium text-gray-300 text-center">
            {chat.title || 'Shared Chat'}
          </h1>
          <p className="text-sm text-gray-400 text-center mt-2">
            Shared by {chat.sharedBy} • {new Date(chat.startedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="max-w-4xl mx-auto">
        {chat.messages && chat.messages.length > 0 ? (
          chat.messages.map((msg, idx) => (
            <div
              key={idx}
              className={`py-6 ${msg.sender === 'user' ? 'bg-[#343541]' : 'bg-[#444654]'}`}
            >
              <div className="px-4 flex gap-4">
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  msg.sender === 'user' ? 'bg-gray-600 text-white' : 'bg-green-600 text-white'
                }`}>
                  {msg.sender === 'user' ? 'U' : 'AI'}
                </div>
                
                {/* Message Content */}
                <div className="flex-1 text-gray-200 leading-relaxed">
                  {msg.sender === 'ai' ? (
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-300 mt-32">
            <div className="mb-4">
              <img 
                src="/logo.svg" 
                alt="FastGen Logo" 
                className="w-20 h-20 mx-auto animate-pulse"
              />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No Messages</h2>
            <p className="text-gray-400">This shared chat doesn't contain any messages.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-[#202123] border-t border-gray-700 p-4 mt-8">
        <div className="text-center text-gray-400 text-sm">
          <p>This is a shared chat from FastGen AI</p>
          <p className="mt-1">
            <a 
              href="/" 
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Create your own chat
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
