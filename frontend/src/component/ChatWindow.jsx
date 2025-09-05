import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LuSendHorizontal } from 'react-icons/lu';
import { IoMdAttach } from 'react-icons/io';
import { FiShare2, FiTrash2, FiMoreVertical, FiEdit3, FiSearch } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import ShareModal from './ShareModal.jsx';

export default function ChatWindow() {
  const { user, isSignedIn } = useAuth();
  const navigate = useNavigate();
  
  // Debug: Log user data to see what's available
  useEffect(() => {
    console.log('ChatWindow - User data:', user);
    console.log('ChatWindow - User fields:', {
      displayName: user?.displayName,
      name: user?.name,
      email: user?.email,
      id: user?.id
    });
  }, [user]);

  // Hide scrollbars util
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      .scrollbar-hide::-webkit-scrollbar { display: none; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedParsedFileName, setUploadedParsedFileName] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatTitle, setCurrentChatTitle] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChats, setFilteredChats] = useState([]);

  const fileInputRef = useRef(null);
  const containerRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuId || editingChatId) closeMenu();
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId, editingChatId]);

  // --- Data loaders ---
  const loadMessages = async (id) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BE_BASEURL}/api/messages/${id}`, {
        withCredentials: true,
      });
      if (!Array.isArray(response.data)) throw new Error('Invalid messages response: Expected an array');
      setMessages(response.data);
    } catch (err) {
      if (err.response?.status === 500 && err.response?.data?.error?.includes('Cast to ObjectId failed')) {
        // New chat with no messages yet
        setMessages([]);
        return;
      }
      console.error('Failed to load messages:', err);
      setError(`Failed to load messages: ${err.message}`);
    }
  };

  const loadChatHistory = async () => {
    try {
      console.log('Loading chat history...'); // Debug log
      const res = await axios.get(`${import.meta.env.VITE_APP_BE_BASEURL}/api/chats/getChat`, {
        withCredentials: true,
      });
      const chats = Array.isArray(res.data) ? res.data : res.data?.chats || [];
      if (!Array.isArray(chats)) throw new Error('Invalid chats response: Expected an array');
      const sorted = chats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      console.log('Chat history loaded:', sorted.length, 'chats'); // Debug log
      setChatHistory(sorted);
      return sorted; // important so callers can use immediately
    } catch (err) {
      console.error('Error loading chat history:', err);
      return [];
    }
  };

  // Load chat history immediately when user signs in
  useEffect(() => {
    if (isSignedIn) {
      console.log('User signed in, loading chat history...'); // Debug log
      loadChatHistory();
    }
  }, [isSignedIn]);

  // Initialize chat once on sign-in
  useEffect(() => {
    const initializeChat = async () => {
      if (!isSignedIn) {
        setError('Please sign in to use the chat');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const storedChatId = localStorage.getItem('chatId');
        if (storedChatId && storedChatId !== 'undefined' && storedChatId !== 'NaN') {
          setChatId(storedChatId);
          await Promise.all([loadChatHistory(), loadMessages(storedChatId)]);
          // Try to set a nicer title from history
          const fromHist = (chats) => chats.find?.(c => c._id === storedChatId);
          const hist = await loadChatHistory();
          const thisChat = fromHist(hist);
          setCurrentChatTitle(thisChat?.title || 'New Chat');
        } else {
          localStorage.removeItem('chatId');
          const chats = await loadChatHistory();
          if (chats.length > 0) {
            const mostRecent = chats[0];
            setChatId(mostRecent._id);
            setCurrentChatTitle(mostRecent.title || `Chat ${new Date(mostRecent.startedAt).toLocaleDateString()}`);
            localStorage.setItem('chatId', mostRecent._id);
            await loadMessages(mostRecent._id);
          } else {
            // create a new chat
            const newChatRes = await axios.post(
              `${import.meta.env.VITE_APP_BE_BASEURL}/api/chats`,
              {},
              { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );
            if (!newChatRes.data?._id) throw new Error('Failed to create new chat: No ID returned');
            setChatId(newChatRes.data._id);
            setCurrentChatTitle('New Chat');
            localStorage.setItem('chatId', newChatRes.data._id);
            setMessages([]);
            await loadChatHistory();
          }
        }
      } catch (err) {
        console.error('Error initializing chat:', err);
        if (err.response?.status === 401) setError('Session expired. Please sign in again.');
        else if (err.response?.status >= 500) setError('Server error. Please try again later.');
        else setError(`Failed to initialize chat: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    initializeChat();
  }, [isSignedIn]);

  // Auto-scroll when messages change
  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // --- Handlers ---
  const handleSend = async () => {
    if (!prompt.trim() || !chatId) return;

    const originalPrompt = prompt; // capture before clearing
    const prevLen = messages.length;
    const userMessage = { sender: 'user', content: originalPrompt };

    setMessages(prev => [...prev, userMessage]);
    setPrompt('');

    try {
      setIsTyping(true);
      const res = await axios.post(
        `${import.meta.env.VITE_APP_BE_BASEURL}/api/gemini`,
        { chatId, prompt: originalPrompt, parsedFileName: uploadedParsedFileName },
        { withCredentials: true }
      );
      if (!res.data?.answer) throw new Error('No answer received from server');

      const aiMessage = { sender: 'ai', content: res.data.answer };
      setMessages(prev => {
        const updated = [...prev, aiMessage];
        if (prevLen === 0) {
          const newTitle = originalPrompt.length > 30 ? originalPrompt.slice(0, 30) + '...' : originalPrompt;
          setCurrentChatTitle(newTitle);
        }
        return updated;
      });
      setUploadedParsedFileName('');
    } catch (err) {
      console.error('Failed to send message:', err);
      setMessages(prev => [...prev, { sender: 'ai', content: 'Sorry, I encountered an error. Please try again.' }]);
      setError(`Failed to send message: ${err.message}`);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = async (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    const formData = new FormData();
    formData.append('file', selected);
    formData.append('fileName', selected.name);
    try {
      const res = await axios.post(`${import.meta.env.VITE_APP_BE_BASEURL}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      if (!res.data?.parsedFileName) throw new Error('No parsed file name returned from server');
      setUploadedParsedFileName(res.data.parsedFileName);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(`Failed to upload file: ${err.message}`);
    }
  };

  const handleAttachClick = () => fileInputRef.current?.click();

  const handleNewChat = async () => {
    try {
      setLoading(true);
      setError(null);
      setMessages([]);
      setPrompt('');
      setUploadedParsedFileName('');
      const newChatRes = await axios.post(
        `${import.meta.env.VITE_APP_BE_BASEURL}/api/chats`,
        {},
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );
      if (!newChatRes.data?._id) throw new Error('Failed to create new chat: No ID returned');
      const newChatId = newChatRes.data._id;
      setChatId(newChatId);
      setCurrentChatTitle('New Chat');
      localStorage.setItem('chatId', newChatId);
      await loadChatHistory();
    } catch (err) {
      console.error('Error creating new chat:', err);
      setError('Failed to create new chat');
    } finally {
      setLoading(false);
    }
  };

  const switchToChat = async (id) => {
    try {
      setChatId(id);
      localStorage.setItem('chatId', id);
      const found = chatHistory.find(c => c._id === id);
      setCurrentChatTitle(found?.title || `Chat ${new Date(found?.startedAt || Date.now()).toLocaleDateString()}`);
      setPrompt('');
      setUploadedParsedFileName('');
      await loadMessages(id);
    } catch (err) {
      console.error('Error switching to chat:', err);
      setError('Failed to load chat');
    }
  };

  const deleteChat = (chatIdToDelete) => {
    const chat = chatHistory.find(c => c._id === chatIdToDelete);
    setChatToDelete(chat);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  const confirmDeleteChat = async () => {
    if (!chatToDelete) return;
    try {
      console.log('Deleting chat:', chatToDelete._id); // Debug log
      await axios.delete(`${import.meta.env.VITE_APP_BE_BASEURL}/api/chats/${chatToDelete._id}`, { withCredentials: true });
      const updated = chatHistory.filter(c => c._id !== chatToDelete._id);
      setChatHistory(updated);
      if (chatId === chatToDelete._id) {
        if (updated.length > 0) {
          const next = updated[0];
          await switchToChat(next._id);
        } else {
          await handleNewChat();
        }
      }
      setShowDeleteModal(false);
      setChatToDelete(null);
    } catch (err) {
      console.error('Error deleting chat:', err);
      alert('Failed to delete chat. Please try again.');
    }
  };

  const cancelDeleteChat = () => {
    setShowDeleteModal(false);
    setChatToDelete(null);
  };

  // Search functionality
  const searchChats = (query) => {
    if (!query.trim()) {
      setFilteredChats(chatHistory);
      return;
    }

    const filtered = chatHistory.filter(chat => {
      // Search in chat title
      const titleMatch = chat.title?.toLowerCase().includes(query.toLowerCase());
      
      // Search in chat messages
      const messageMatch = chat.messages?.some(message => 
        message.content?.toLowerCase().includes(query.toLowerCase())
      );

      return titleMatch || messageMatch;
    });

    setFilteredChats(filtered);
  };

  // Highlight search terms in text
  const highlightSearchTerms = (text, searchQuery) => {
    if (!searchQuery.trim() || !text) return text;
    
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-400 text-black px-1 rounded font-medium">
          {part}
        </mark>
      ) : part
    );
  };

  // Update filtered chats when search query changes
  useEffect(() => {
    searchChats(searchQuery);
  }, [searchQuery, chatHistory]);

  const shareChat = async (chatIdToShare) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BE_BASEURL}/api/chats/${chatIdToShare}/share`,
        { shareType: 'public' },
        { withCredentials: true }
      );
      if (response.data?.success) {
        setShareData({
          type: 'create',
          shareUrl: response.data.share?.shareUrl,
          chatTitle: response.data.chatTitle,
          chatId: chatIdToShare,
        });
        setShowShareModal(true);
        setOpenMenuId(null);
      }
    } catch (err) {
      console.error('Error sharing chat:', err);
      alert('Failed to share chat. Please try again.');
    }
  };

  const renameChat = async (chatIdToRename, newTitle) => {
    try {
      console.log('Renaming chat:', chatIdToRename, 'to:', newTitle); // Debug log
      const response = await axios.put(
        `${import.meta.env.VITE_APP_BE_BASEURL}/api/gemini/chat-title/${chatIdToRename}`,
        { title: newTitle },
        { withCredentials: true }
      );
      console.log('Rename response:', response.data); // Debug log
      if (response.data?.success) {
        setChatHistory(prev => prev.map(c => (c._id === chatIdToRename ? { ...c, title: newTitle } : c)));
        if (chatId === chatIdToRename) setCurrentChatTitle(newTitle);
        setEditingChatId(null);
        setEditingTitle('');
        setOpenMenuId(null);
        console.log('Chat renamed successfully'); // Debug log
      } else {
        console.log('Rename failed - no success flag:', response.data); // Debug log
        alert('Failed to rename chat. Server response indicates failure.');
      }
    } catch (err) {
      console.error('Error renaming chat:', err);
      console.error('Error details:', err.response?.data); // Debug log
      alert(`Failed to rename chat: ${err.response?.data?.error || err.message}`);
    }
  };

  const startEditingTitle = (id, currentTitle) => {
    console.log('Starting to edit title for chat:', id, 'current title:', currentTitle); // Debug log
    setEditingChatId(id);
    setEditingTitle(currentTitle || '');
    setOpenMenuId(null);
    console.log('Edit state set - editingChatId:', id, 'editingTitle:', currentTitle || ''); // Debug log
  };

  const toggleMenu = (id, event) => {
    event.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const closeMenu = () => {
    setOpenMenuId(null);
    setEditingChatId(null);
    setEditingTitle('');
  };

  const toggleSidebar = () => setSidebarOpen(v => !v);

  // UI States
  if (!isSignedIn) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-4 bg-transparent rounded-2xl shadow-lg h-[80vh] flex items-center justify-center">
        <div className="text-white text-center"><p>Please sign in to use the chat</p></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-4 bg-transparent rounded-2xl shadow-lg h-[80vh] flex items-center justify-center">
        <div className="text-white">Loading chat...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-4 bg-transparent rounded-2xl shadow-lg h-[80vh] flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-[calc(100vh-120px)] bg-black">


      {/* SIDEBAR */}
      <div className={`${sidebarOpen ? 'w-full md:w-64' : 'w-0'} bg-black flex flex-col transition-all duration-300 overflow-hidden h-full md:relative absolute z-40 border-r border-gray-700`}>
        {/* Top controls */}
        <div className="p-3 flex gap-2">
          <button onClick={handleNewChat} className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-medium shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New chat
          </button>
          <button onClick={toggleSidebar} className="py-2.5 px-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors shadow-sm" title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mx-2 mb-2">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-gray-500 focus:outline-none text-sm placeholder-gray-400"
            />
          </div>
        </div>

        {/* Chat history list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
          {searchQuery && filteredChats.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <FiSearch className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No chats found</p>
              <p className="text-xs mt-1">Try a different search term</p>
            </div>
          ) : (
            (searchQuery ? filteredChats : chatHistory).map((chat) => (
              <div key={chat._id} className={`group relative rounded-md transition-colors ${chatId === chat._id ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
              <button onClick={() => switchToChat(chat._id)} className={`w-full p-3 text-left transition-colors ${chatId === chat._id ? 'text-white' : 'text-gray-300 hover:text-white'}`}>
                <div className="truncate text-sm">
                  {searchQuery ? 
                    highlightSearchTerms(
                      chat.title || (chat.messages?.[0]?.content?.slice(0,30) + '...') || `Chat ${new Date(chat.startedAt).toLocaleDateString()}`,
                      searchQuery
                    ) : 
                    (chat.title || (chat.messages?.[0]?.content?.slice(0,30) + '...') || `Chat ${new Date(chat.startedAt).toLocaleDateString()}`)
                  }
                </div>
              </button>
              {/* 3-dot menu */}
              <button onClick={(e) => toggleMenu(chat._id, e)} className="absolute right-2 top-2 opacity-100 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-white rounded" title="More options">
                <FiMoreVertical className="w-4 h-4" />
              </button>
              {openMenuId === chat._id && (
                <div className="absolute right-0 top-8 z-50 bg-gray-800 border border-gray-600 rounded-md shadow-lg min-w-[160px]">
                  <button onClick={(e) => { e.stopPropagation(); startEditingTitle(chat._id, chat.title); }} className="w-full px-3 py-2 text-left text-sm text-white hover:bg-gray-700 flex items-center gap-2"><FiEdit3 className="w-4 h-4" />Rename</button>
                  <button onClick={(e) => { e.stopPropagation(); shareChat(chat._id); }} className="w-full px-3 py-2 text-left text-sm text-white hover:bg-gray-700 flex items-center gap-2"><FiShare2 className="w-4 h-4" />Share</button>
                  <button onClick={(e) => { e.stopPropagation(); deleteChat(chat._id); }} className="w-full px-3 py-2 text-left text-sm text-white hover:bg-gray-700 flex items-center gap-2 border-t border-gray-600"><FiTrash2 className="w-4 h-4" />Delete</button>
                </div>
              )}
              {editingChatId === chat._id && (
                <div className="absolute right-0 top-8 z-50 bg-gray-800 border border-gray-600 rounded-md shadow-lg p-2 min-w-[220px]">
                  <input type="text" value={editingTitle} onChange={(e) => setEditingTitle(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') renameChat(chat._id, editingTitle); if (e.key === 'Escape') closeMenu(); }} className="w-full px-2 py-1 text-sm text-white bg-gray-700 border border-gray-500 rounded focus:outline-none focus:border-blue-500" placeholder="Enter new title..." autoFocus />
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => renameChat(chat._id, editingTitle)} className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                    <button onClick={closeMenu} className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )))}
        </div>

        {/* User info */}
        <div className="p-3 border-t border-gray-600">
          <div className="flex items-center gap-3 text-gray-300 p-2 rounded-md hover:bg-gray-700 cursor-pointer">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user?.displayName || user?.name || 'User'} 
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-lg">
                {(user?.displayName || user?.name || user?.email?.charAt(0) || 'U')}
            </div>
            )}
            <div className="text-sm">
              <div className="font-medium">
                {user?.displayName || user?.name || user?.email || 'User'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col h-full">
        {/* Sidebar toggle button when sidebar is closed */}
        {!sidebarOpen && (
          <div className="absolute left-4 top-4 z-10">
            <button 
              onClick={toggleSidebar} 
              className="p-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors shadow-sm border border-gray-600" 
              title="Show sidebar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-24" ref={containerRef}>
          {messages.length === 0 ? (
            <div className="text-center text-gray-300 mt-20">
              <div className="mb-3">
                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">How can I help you today?</h2>
              <p className="text-sm text-gray-400">Ask me anything or start a new conversation.</p>
            </div>
          ) : (
                        messages.map((msg, idx) => (
              <div key={idx} className="py-4 px-4">
                <div className={`max-w-3xl mx-auto flex gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-sm font-medium text-white flex-shrink-0">
                      AI
                    </div>
                  )}
                  <div className={`${msg.sender === 'user' ? 'max-w-[70%] text-right' : 'flex-1'} text-gray-100`}>
                    {msg.sender === 'ai' ? (
                      <div className="prose prose-invert max-w-none prose-sm">
                        {searchQuery ? 
                          highlightSearchTerms(msg.content, searchQuery) : 
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        }
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">
                        {searchQuery ? 
                          highlightSearchTerms(msg.content, searchQuery) : 
                          msg.content
                        }
                      </div>
                    )}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium text-white flex-shrink-0">
                      {user?.displayName?.charAt(0) || user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

                    {isTyping && (
            <div className="py-4 px-4">
              <div className="max-w-3xl mx-auto flex gap-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-sm font-medium text-white flex-shrink-0">AI</div>
                <div className="flex-1 text-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* File Upload Status */}
        {uploadedParsedFileName && (
          <div className="px-4 py-2 bg-blue-900/20 text-blue-300 text-center border-t border-gray-700">📎 File Uploaded: {uploadedParsedFileName}</div>
      )}

                {/* Input */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-gray-700 p-4 bg-black z-50">
          <div className="max-w-3xl mx-auto">
            <div className="relative bg-gray-800 rounded-2xl border border-gray-600 focus-within:border-blue-500 transition-colors">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full p-4 pr-20 bg-transparent text-white focus:outline-none resize-none placeholder-gray-400"
                placeholder="Message FastGen AI..."
                disabled={!chatId}
                rows={1}
                style={{ minHeight: '52px', maxHeight: '120px' }}
              />
              <div className="absolute right-2 bottom-2 flex gap-1">
                <button onClick={handleAttachClick} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors rounded-lg group relative" title="Attach PDF file">
                  <IoMdAttach className="w-4 h-4" />
                  <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    PDF only
                  </span>
                </button>
                <button 
                  onClick={handleSend} 
                  disabled={!chatId || !prompt.trim()} 
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    !chatId || !prompt.trim() 
                      ? 'text-gray-500 bg-gray-700 cursor-not-allowed' 
                      : 'text-white bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:scale-105'
                  }`} 
                  title="Send message"
                >
                  <LuSendHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf" />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-600">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <FiTrash2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Delete Conversation</h3>
                <p className="text-gray-300 text-sm">This action cannot be undone.</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete <span className="text-white font-medium">"{chatToDelete?.title || 'Untitled Chat'}"</span>? All messages will be permanently removed.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDeleteChat}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteChat}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal isOpen={showShareModal} onClose={() => { setShowShareModal(false); setShareData(null); }} shareData={shareData} />
    </div>
  );
}

