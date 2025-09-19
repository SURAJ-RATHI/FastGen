import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LuSendHorizontal } from 'react-icons/lu';
import { IoMdAttach } from 'react-icons/io';
import { FiShare2, FiTrash2, FiMoreVertical, FiEdit3, FiSearch } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import ShareModal from './ShareModal.jsx';
import TypingIndicator from './TypingIndicator.jsx';

// Memoized Message Component for better performance
const MessageItem = React.memo(({ msg, idx, user, searchQuery, highlightSearchTerms }) => {
  return (
    <div className="py-4 px-4">
      <div className={`max-w-3xl mx-auto flex gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
        {msg.sender === 'ai' && (
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-sm font-medium text-white flex-shrink-0">
            AI
          </div>
        )}
        <div className={`${msg.sender === 'user' ? 'max-w-[70%] text-right' : 'flex-1'} text-gray-100`}>
          {msg.sender === 'ai' ? (
            <div className="prose prose-invert max-w-none prose-sm">
              {msg.isStreaming ? (
                <div className="flex items-center space-x-2">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              ) : (
                searchQuery ? 
                  highlightSearchTerms(msg.content, searchQuery) : 
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
              )}
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
  );
});

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
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
  const [chatHistoryCache, setChatHistoryCache] = useState(null);
  const [cacheTimestamp, setCacheTimestamp] = useState(null);

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
  const loadMessages = useCallback(async (id, limit = 100) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BE_BASEURL}/api/messages/${id}`, {
        withCredentials: true,
        params: { limit },
        timeout: 10000 // 10 second timeout for faster failure
      });
      
      // Handle both old array format and new paginated format
      const messages = Array.isArray(response.data) ? response.data : response.data.messages;
      if (!Array.isArray(messages)) throw new Error('Invalid messages response: Expected an array');
      
      setMessages(messages);
    } catch (err) {
      if (err.response?.status === 500 && err.response?.data?.error?.includes('Cast to ObjectId failed')) {
        // New chat with no messages yet
        setMessages([]);
        return;
      }
      console.error('Failed to load messages:', err);
      setError(`Failed to load messages: ${err.message}`);
    }
  }, []);

  const loadChatHistory = useCallback(async (limit = 20, forceRefresh = false) => {
    try {
      // Check cache first (10 minute cache for better performance)
      const now = Date.now();
      const cacheAge = now - (cacheTimestamp || 0);
      const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
      
      if (!forceRefresh && chatHistoryCache && cacheAge < CACHE_DURATION) {
        console.log('Using cached chat history');
        setChatHistory(chatHistoryCache);
        return chatHistoryCache;
      }
      
      console.log('Loading chat history...'); // Debug log
      const res = await axios.get(`${import.meta.env.VITE_APP_BE_BASEURL}/api/chats/getChat`, {
        withCredentials: true,
        params: { limit, sort: 'updatedAt' }
      });
      
      const chats = Array.isArray(res.data) ? res.data : res.data?.chats || [];
      if (!Array.isArray(chats)) throw new Error('Invalid chats response: Expected an array');
      const sorted = chats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      console.log('Chat history loaded:', sorted.length, 'chats'); // Debug log
      
      // Update cache
      setChatHistoryCache(sorted);
      setCacheTimestamp(now);
      setChatHistory(sorted);
      return sorted; // important so callers can use immediately
    } catch (err) {
      console.error('Error loading chat history:', err);
      return [];
    }
  }, [chatHistoryCache, cacheTimestamp]);

  // Load chat history immediately when user signs in
  useEffect(() => {
    if (isSignedIn) {
      console.log('User signed in, loading chat history...'); // Debug log
      loadChatHistory();
    }
  }, [isSignedIn]); // Removed loadChatHistory and user from dependencies

  // Initialize chat once on sign-in - ULTRA OPTIMIZED
  useEffect(() => {
    let isMounted = true;
    
    const initializeChat = async () => {
      if (!isSignedIn) {
        setError('Please sign in to use the chat');
        return;
      }
      
      // Prevent multiple initializations
      if (chatId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const storedChatId = localStorage.getItem('chatId');
        
        if (storedChatId && storedChatId !== 'undefined' && storedChatId !== 'NaN') {
          // Set chat ID immediately for instant UI response
          setChatId(storedChatId);
          setCurrentChatTitle('Loading...');
          
          // Load chat history first (cached), then messages
          const chats = await loadChatHistory();
          if (!isMounted) return;
          
          const thisChat = chats.find(c => c._id === storedChatId);
          if (thisChat) {
            setCurrentChatTitle(thisChat.title || 'New Chat');
            // Load messages in background without blocking UI
            loadMessages(storedChatId).catch(err => 
              console.error('Background message loading failed:', err)
            );
          } else {
            // Chat not found, create new one
            await createNewChat();
          }
        } else {
          localStorage.removeItem('chatId');
          
          // Always create a new chat when no stored chatId (e.g., from "Explore Now" button)
          await createNewChat();
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Error initializing chat:', err);
        if (err.response?.status === 401) setError('Session expired. Please sign in again.');
        else if (err.response?.status >= 500) setError('Server error. Please try again later.');
        else setError(`Failed to initialize chat: ${err.message}`);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    const createNewChat = async () => {
      const newChatRes = await axios.post(
        `${import.meta.env.VITE_APP_BE_BASEURL}/api/chats`,
        {},
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );
      if (!isMounted) return;
      
      if (!newChatRes.data?._id) throw new Error('Failed to create new chat: No ID returned');
      
      const newChatId = newChatRes.data._id;
      const newChat = {
        _id: newChatId,
        title: 'New Chat',
        startedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: []
      };
      
      setChatId(newChatId);
      setCurrentChatTitle('New Chat');
      localStorage.setItem('chatId', newChatId);
      setMessages([]);
      
      // Update chat history optimistically
      setChatHistory([newChat]);
      setChatHistoryCache([newChat]);
      setCacheTimestamp(Date.now());
    };
    
    initializeChat();
    
    return () => {
      isMounted = false;
    };
  }, [isSignedIn]); // Removed loadChatHistory and loadMessages from dependencies

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
      
      // Try streaming first, fallback to regular request if it fails
      try {
        await handleStreamingResponse(originalPrompt);
      } catch (streamingError) {
        console.log('Streaming failed, falling back to regular request:', streamingError);
        await handleRegularResponse(originalPrompt);
      }
      
      setUploadedParsedFileName('');
      
      // Refresh chat title if we have 4 or 8 messages (when server generates title)
      if (messages.length + 2 === 4 || messages.length + 2 === 8) {
        setTimeout(() => {
          loadChatHistory(20, true); // Force refresh to get updated title
        }, 1000);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setMessages(prev => [...prev, { sender: 'ai', content: 'Sorry, I encountered an error. Please try again.' }]);
      setError(`Failed to send message: ${err.message}`);
      if (window.showToast) {
        window.showToast(`Failed to send message: ${err.message}`, 'error');
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleStreamingResponse = async (originalPrompt) => {
    // Get the auth token from localStorage
    const token = localStorage.getItem('authToken');
    
    // Use fetch for POST request with streaming
    const response = await fetch(`${import.meta.env.VITE_APP_BE_BASEURL}/api/gemini/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      credentials: 'include',
      body: JSON.stringify({
        chatId,
        prompt: originalPrompt,
        parsedFileName: uploadedParsedFileName || ''
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let aiMessageContent = '';
    let aiMessageIndex = -1;

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              switch (data.type) {
                case 'connected':
                  console.log('Stream connected');
                  break;
                  
                case 'typing':
                  // Add placeholder AI message
                  setMessages(prev => {
                    const updated = [...prev, { sender: 'ai', content: '', isStreaming: true }];
                    aiMessageIndex = updated.length - 1;
                    return updated;
                  });
                  break;
                  
                case 'chunk':
                  // Update AI message with new content
                  aiMessageContent += data.content;
                  setMessages(prev => {
                    const updated = [...prev];
                    if (updated[aiMessageIndex]) {
                      updated[aiMessageIndex] = { 
                        sender: 'ai', 
                        content: aiMessageContent,
                        isStreaming: true 
                      };
                    }
                    return updated;
                  });
                  break;
                  
                case 'complete':
                  // Mark streaming as complete
                  setMessages(prev => {
                    const updated = [...prev];
                    if (updated[aiMessageIndex]) {
                      updated[aiMessageIndex] = { 
                        sender: 'ai', 
                        content: aiMessageContent,
                        isStreaming: false 
                      };
                    }
                    return updated;
                  });
                  return;
                  
                case 'error':
                  throw new Error(data.message);
              }
            } catch (parseError) {
              console.error('Error parsing SSE data:', parseError);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  };

  const handleRegularResponse = async (originalPrompt) => {
    const res = await axios.post(
      `${import.meta.env.VITE_APP_BE_BASEURL}/api/gemini`,
      { chatId, prompt: originalPrompt, parsedFileName: uploadedParsedFileName },
      { withCredentials: true }
    );
    if (!res.data?.answer) throw new Error('No answer received from server');

    const aiMessage = { sender: 'ai', content: res.data.answer };
    setMessages(prev => {
      const updated = [...prev, aiMessage];
      // Don't set temporary title - let server generate proper title
      return updated;
    });
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
    
    // Validate file type
    if (!selected.type.includes('pdf')) {
      if (window.showToast) {
        window.showToast('Please upload a PDF file only', 'error');
      }
      return;
    }
    
    // Validate file size (10MB limit)
    if (selected.size > 10 * 1024 * 1024) {
      if (window.showToast) {
        window.showToast('File size must be less than 10MB', 'error');
      }
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', selected);
    formData.append('fileName', selected.name);
    
    try {
      const res = await axios.post(`${import.meta.env.VITE_APP_BE_BASEURL}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });
      
      if (!res.data?.parsedFileName) throw new Error('No parsed file name returned from server');
      
      setUploadedParsedFileName(res.data.parsedFileName);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      if (window.showToast) {
        window.showToast(`File "${selected.name}" uploaded successfully!`, 'success');
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(`Failed to upload file: ${err.message}`);
      if (window.showToast) {
        window.showToast(`Failed to upload file: ${err.message}`, 'error');
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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
      const newChat = {
        _id: newChatId,
        title: 'New Chat',
        startedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: []
      };
      
      // Update UI immediately
      setChatId(newChatId);
      setCurrentChatTitle('New Chat');
      localStorage.setItem('chatId', newChatId);
      
      // Update chat history optimistically (add new chat to top of list)
      setChatHistory(prev => [newChat, ...prev]);
      setChatHistoryCache(prev => prev ? [newChat, ...prev] : [newChat]);
      setCacheTimestamp(Date.now());
      
      if (window.showToast) {
        window.showToast('New chat created successfully', 'success');
      }
    } catch (err) {
      console.error('Error creating new chat:', err);
      setError('Failed to create new chat');
      if (window.showToast) {
        window.showToast('Failed to create new chat', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const switchToChat = async (id) => {
    try {
      setChatId(id);
      localStorage.setItem('chatId', id);
      
      // Use cached chat history first, then refresh if needed
      const found = chatHistory.find(c => c._id === id);
      if (found) {
        setCurrentChatTitle(found.title || `Chat ${new Date(found.startedAt || Date.now()).toLocaleDateString()}`);
      } else {
        // Only refresh if chat not found in cache
        const updatedHistory = await loadChatHistory(20, true);
        const foundChat = updatedHistory.find(c => c._id === id);
        setCurrentChatTitle(foundChat?.title || `Chat ${new Date(foundChat?.startedAt || Date.now()).toLocaleDateString()}`);
      }
      
      setPrompt('');
      setUploadedParsedFileName('');
      
      // Preload messages in background for better UX
      loadMessages(id).catch(err => 
        console.error('Background message loading failed:', err)
      );
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
      if (window.showToast) {
        window.showToast('Chat deleted successfully', 'success');
      }
    } catch (err) {
      console.error('Error deleting chat:', err);
      if (window.showToast) {
        window.showToast('Failed to delete chat. Please try again.', 'error');
      }
    }
  };

  const cancelDeleteChat = () => {
    setShowDeleteModal(false);
    setChatToDelete(null);
  };

  // Search functionality - OPTIMIZED with useCallback
  const searchChats = useCallback((query) => {
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
  }, [chatHistory]);

  // Highlight search terms in text - OPTIMIZED with useCallback
  const highlightSearchTerms = useCallback((text, searchQuery) => {
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
  }, []);

  // Update filtered chats when search query changes
  useEffect(() => {
    searchChats(searchQuery);
  }, [searchQuery]); // Removed chatHistory from dependencies to prevent excessive re-renders

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
      if (window.showToast) {
        window.showToast('Failed to share chat. Please try again.', 'error');
      }
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
        if (window.showToast) {
          window.showToast('Chat renamed successfully', 'success');
        }
      } else {
        console.log('Rename failed - no success flag:', response.data); // Debug log
        if (window.showToast) {
          window.showToast('Failed to rename chat. Server response indicates failure.', 'error');
        }
      }
    } catch (err) {
      console.error('Error renaming chat:', err);
      console.error('Error details:', err.response?.data); // Debug log
      if (window.showToast) {
        window.showToast(`Failed to rename chat: ${err.response?.data?.error || err.message}`, 'error');
      }
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
      <div className="relative flex h-screen bg-black">
        {/* Sidebar Skeleton */}
        <div className="w-64 bg-black flex flex-col h-screen">
          <div className="pt-8 px-3 pb-3 flex gap-2">
            <div className="flex-1 h-10 bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="w-10 h-10 bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
          <div className="px-3 mb-3">
            <div className="h-10 bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
          <div className="flex-1 px-3 space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-700 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
        
        {/* Main Content Skeleton */}
        <div className="flex-1 flex flex-col h-full">
          <div className="flex-1 p-4">
            <div className="max-w-3xl mx-auto space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-gray-700 rounded animate-pulse w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4">
            <div className="max-w-3xl mx-auto h-12 bg-gray-700 rounded-xl animate-pulse"></div>
          </div>
        </div>
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
    <div className="relative flex h-screen bg-black">


      {/* SIDEBAR */}
      <div className={`${sidebarOpen ? 'w-full md:w-64' : 'w-0'} bg-black flex flex-col transition-all duration-300 overflow-hidden h-screen md:relative absolute z-50`}>
        {/* Top controls */}
        <div className="pt-8 px-3 pb-3 flex gap-2">
          <button onClick={handleNewChat} className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New chat
          </button>
          <button onClick={toggleSidebar} className="py-2 px-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors" title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-3 mb-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none text-sm placeholder-gray-400"
            />
          </div>
        </div>

        {/* Chat history list */}
        <div className="flex-1 overflow-y-auto px-3 pb-20 space-y-2 scrollbar-hide">
          {searchQuery && filteredChats.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <FiSearch className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No chats found</p>
              <p className="text-xs mt-1">Try a different search term</p>
            </div>
          ) : (
            (searchQuery ? filteredChats : chatHistory).map((chat) => (
              <div key={chat._id} className={`group relative rounded-lg transition-colors ${chatId === chat._id ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
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

        {/* User info - Fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
          <div className="flex items-center gap-3 text-gray-300 p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors">
            <img 
              alt="Suraj Rathi" 
              className="w-8 h-8 rounded-full" 
              src="https://lh3.googleusercontent.com/a/ACg8ocI-pz2vamZU3_DjcH701awV83zThpQkB-APYHhXSmEy6ecP4g=s96-c"
            />
            <div className="text-sm">
              <div className="font-medium">Suraj Rathi</div>
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
              className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors" 
              title="Show sidebar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        )}

        {/* Messages - OPTIMIZED */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-32" ref={containerRef}>
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
            // Virtual scrolling for large message lists
            messages.length > 50 ? (
              <div className="space-y-0">
                {messages.slice(-50).map((msg, idx) => (
                  <MessageItem 
                    key={`${msg.sender}-${idx}-${msg.content.slice(0, 20)}`}
                    msg={msg} 
                    idx={idx} 
                    user={user}
                    searchQuery={searchQuery}
                    highlightSearchTerms={highlightSearchTerms}
                  />
                ))}
                {messages.length > 50 && (
                  <div className="text-center text-gray-400 py-4">
                    Showing last 50 messages. Scroll up to see more.
                  </div>
                )}
              </div>
            ) : (
              messages.map((msg, idx) => (
                <MessageItem 
                  key={`${msg.sender}-${idx}-${msg.content.slice(0, 20)}`}
                  msg={msg} 
                  idx={idx} 
                  user={user}
                  searchQuery={searchQuery}
                  highlightSearchTerms={highlightSearchTerms}
                />
              ))
            )
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

        {/* Input */}
        <div className={`fixed bottom-0 ${sidebarOpen ? 'left-64' : 'left-0'} right-0 p-4 bg-black z-50 transition-all duration-300`}>
          <div className="max-w-3xl mx-auto">
            {/* File attachment indicator */}
            {uploadedParsedFileName && (
              <div className="mb-2 p-2 bg-green-900 border border-green-700 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-300 text-sm">File attached</span>
                </div>
                <button 
                  onClick={() => {
                    setUploadedParsedFileName('');
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="text-green-400 hover:text-green-300 text-sm"
                >
                  Remove
                </button>
              </div>
            )}
            
            {/* Upload progress indicator */}
            {isUploading && (
              <div className="mb-2 p-2 bg-blue-900 border border-blue-700 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-blue-300 text-sm">Uploading file...</span>
                </div>
                <div className="w-full bg-blue-800 rounded-full h-1">
                  <div 
                    className="bg-blue-500 h-1 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            <div className="relative bg-gray-800 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full p-3 pr-16 bg-transparent text-white focus:outline-none resize-none placeholder-gray-400 text-sm"
                placeholder="Message FastGen AI..."
                disabled={!chatId}
                rows={1}
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
              <div className="absolute right-2 bottom-2 flex gap-1">
                <button 
                  onClick={handleAttachClick} 
                  disabled={isUploading}
                  className={`p-1.5 transition-colors rounded-lg group relative ${
                    isUploading 
                      ? 'text-blue-400 bg-blue-900 cursor-not-allowed' 
                      : uploadedParsedFileName
                        ? 'text-green-400 hover:text-green-300 hover:bg-green-900'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`} 
                  title={uploadedParsedFileName ? "File attached - click to change" : "Attach PDF file"}
                >
                  <IoMdAttach className={`w-4 h-4 ${isUploading ? 'animate-pulse' : ''}`} />
                  {uploadedParsedFileName && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                  <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {isUploading ? `Uploading... ${uploadProgress}%` : uploadedParsedFileName ? 'File attached' : 'PDF only (max 10MB)'}
                  </span>
                </button>
                <button 
                  onClick={handleSend} 
                  disabled={!chatId || !prompt.trim()} 
                  className={`p-1.5 rounded-lg transition-all duration-200 ${
                    !chatId || !prompt.trim() 
                      ? 'text-gray-500 bg-gray-700 cursor-not-allowed' 
                      : 'text-white bg-blue-600 hover:bg-blue-700'
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

