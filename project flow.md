# FastGen AI - Complete Project Flow Documentation

## 🏗️ Project Overview
FastGen is an AI-powered learning platform built with React frontend and Node.js backend, featuring intelligent chatbot, content search, quiz generation, and note-taking capabilities.

---

## 📁 Project Structure

```
fastgen2/
├── frontend/                 # React.js Frontend Application
│   ├── src/
│   │   ├── component/        # React Components
│   │   ├── contexts/        # React Context Providers
│   │   ├── hooks/          # Custom React Hooks
│   │   ├── services/       # Frontend Services
│   │   └── main.jsx        # Application Entry Point
│   ├── public/             # Static Assets
│   └── package.json        # Frontend Dependencies
├── server/                 # Node.js Backend Server
│   ├── routes/            # API Route Handlers
│   ├── models/            # MongoDB Database Models
│   ├── middleware/         # Express Middleware
│   ├── services/          # Backend Services
│   ├── auth/              # Authentication Logic
│   └── index.js           # Server Entry Point
└── project flow.md        # This Documentation
```

---

## 🚀 Application Initialization Flow

### 1. Server Startup (`server/index.js`)
**Location**: `server/index.js`
**Purpose**: Initialize Express server and connect to MongoDB

**Key Functions**:
- `connectDB()` - MongoDB connection setup
- `initializePinecone()` - Vector database initialization for semantic search
- CORS configuration for cross-origin requests
- Route mounting for all API endpoints

**Important Points**:
```javascript
// MongoDB connection with error handling
connectDB();

// Pinecone initialization for AI context retrieval
const initializePinecone = async () => {
  if (process.env.PINECONE_API_KEY && process.env.OPENAI_API_KEY) {
    await pineconeService.initialize();
  }
};

// CORS setup for multiple origins
app.use(cors({
  origin: ['https://fastgen-ai.vercel.app', 'https://fastgen.vercel.app'],
  credentials: true
}));
```

### 2. Frontend Initialization (`frontend/src/main.jsx`)
**Location**: `frontend/src/main.jsx`
**Purpose**: React application bootstrap

**Key Functions**:
- React DOM rendering
- AuthProvider context wrapping
- Global CSS imports

---

## 🔐 Authentication Flow

### 1. Authentication Context (`frontend/src/contexts/AuthContext.jsx`)
**Location**: `frontend/src/contexts/AuthContext.jsx`
**Purpose**: Global authentication state management

**Key Functions**:
- `signInWithGoogle(credential)` - Google OAuth authentication
- `signInWithEmail(email, password)` - Email/password authentication
- `signUpWithEmail(name, email, password)` - User registration
- `checkAuthStatus()` - Token validation on app load
- `signOut()` - User logout and token cleanup

**Important Points**:
```javascript
// Token management with localStorage
const [token, setToken] = useState(localStorage.getItem('authToken'));

// Axios header configuration
useEffect(() => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}, [token]);

// Google OAuth implementation
const signInWithGoogle = async (credential) => {
  const response = await axios.post(`${baseURL}/api/auth/google`, { credential });
  const { token: newToken, user: userData } = response.data;
  localStorage.setItem('authToken', newToken);
};
```

### 2. Authentication Routes (`server/routes/auth.js`)
**Location**: `server/routes/auth.js`
**Purpose**: Backend authentication endpoints

**Key Functions**:
- `POST /api/auth/signup` - Manual user registration
- `POST /api/auth/signin` - Email/password login
- `POST /api/auth/google` - Google OAuth verification
- `GET /api/auth/me` - Get current user data
- `POST /api/auth/logout` - Logout endpoint

**Important Points**:
```javascript
// Google OAuth verification
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const ticket = await googleClient.verifyIdToken({
  idToken: credential,
  audience: process.env.GOOGLE_CLIENT_ID
});

// JWT token generation
const token = jwt.sign(
  { userId: user._id },
  process.env.SESSION_SECRET,
  { expiresIn: '24h' }
);

// Password hashing with bcrypt
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
```

---

## 💬 Chat System Flow

### 1. Main Application (`frontend/src/component/Main.jsx`)
**Location**: `frontend/src/component/Main.jsx`
**Purpose**: Main application layout and tab management

**Key Functions**:
- Tab switching between ChatWindow, Content, Quizzes, Notes
- Responsive design (mobile vs desktop layouts)
- Authentication guard (redirects to signup if not authenticated)

**Important Points**:
```javascript
// Tab management with URL parameters
useEffect(() => {
  const tabParam = searchParams.get('tab');
  if (tabParam && ['chatbot', 'content', 'quizzes', 'notes'].includes(tabParam)) {
    setActiveTab(tabParam);
  }
}, [searchParams, setActiveTab]);

// Lazy loading for performance
const ChatWindow = lazy(() => import("./ChatWindow"));
const Content = lazy(() => import("./Content"));
const Quizzes = lazy(() => import("./Quizzes"));
const Notes = lazy(() => import("./Notes"));
```

### 2. Chat Window (`frontend/src/component/ChatWindow.jsx`)
**Location**: `frontend/src/component/ChatWindow.jsx`
**Purpose**: Main chat interface with AI conversation

**Key Functions**:
- `sendMessage()` - Send user message and receive AI response
- `createNewChat()` - Create new chat session
- `loadChatHistory()` - Load user's chat history
- `handleFileUpload()` - Upload and parse files for context
- `shareChat()` - Share chat with others
- `deleteChat()` - Delete chat sessions

**Important Points**:
```javascript
// Streaming response handling
const handleStreamingResponse = async (chatId, prompt) => {
  const eventSource = new EventSource(`${baseURL}/api/gemini/stream`);
  
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'chunk') {
      setMessages(prev => [...prev, { content: data.content, isStreaming: true }]);
    }
  };
};

// File upload with progress tracking
const handleFileUpload = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axios.post(`${baseURL}/api/upload`, formData, {
    onUploadProgress: (progressEvent) => {
      const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      setUploadProgress(progress);
    }
  });
};
```

### 3. Chat Routes (`server/routes/chats.js`)
**Location**: `server/routes/chats.js`
**Purpose**: Chat management API endpoints

**Key Functions**:
- `POST /api/chats` - Create new chat
- `GET /api/chats/getChat` - Get user's chat list
- `GET /api/chats/:chatId` - Get specific chat with messages
- `DELETE /api/chats/:chatId` - Delete chat and associated data
- `POST /api/chats/:chatId/share` - Share chat functionality

**Important Points**:
```javascript
// Optimized chat retrieval with pagination
const chats = await Chat.find(query)
  .select('title startedAt updatedAt messages')
  .sort({ [sort]: -1 })
  .limit(parseInt(limit))
  .skip(skip)
  .lean(); // Use lean() for better performance

// Bulk delete with Pinecone cleanup
await Message.deleteMany({ chat: { $in: chatIds } });
for (const chatId of chatIds) {
  await pineconeService.deleteChatVectors(req.user.userId, chatId);
}
```

### 4. AI Processing (`server/routes/gemini.js`)
**Location**: `server/routes/gemini.js`
**Purpose**: AI conversation processing with Gemini API

**Key Functions**:
- `POST /api/gemini/stream` - Streaming AI responses
- `POST /api/gemini` - Non-streaming AI responses
- `buildConversationContext()` - Build context from past conversations
- `generateChatTitle()` - Auto-generate chat titles
- `generateWithFallback()` - API key rotation for reliability

**Important Points**:
```javascript
// Streaming response generator
async function* generateStreamingResponse(prompt) {
  for (let attempt = 0; attempt < apiKeys.length; attempt++) {
    const genAI = new GoogleGenerativeAI(currentKey.key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContentStream(prompt);
    
    for await (const chunk of result.stream) {
      yield { text: chunk.text() };
    }
  }
}

// Context building with Pinecone RAG
async function buildConversationContext(userId, chatId, currentQuery) {
  const recentMessages = await Message.find({ chat: chatId })
    .sort({ createdAt: -1 })
    .limit(3);
  
  const relevantMessages = await pineconeService.searchSimilarMessages(
    userId, currentQuery, 5, chatId
  );
  
  return context;
}
```

---

## 📄 File Upload & Processing Flow

### 1. Upload Component (`frontend/src/component/ChatWindow.jsx`)
**Location**: `frontend/src/component/ChatWindow.jsx` (lines 200-300)
**Purpose**: File upload interface in chat

**Key Functions**:
- `handleFileUpload()` - Process file selection and upload
- `handleFileDrop()` - Drag and drop file handling
- Progress tracking during upload

**Important Points**:
```javascript
// File validation
const allowedTypes = ['application/pdf', 'text/plain'];
if (!allowedTypes.includes(file.type)) {
  setError('Only PDF and TXT files are allowed');
  return;
}

// Upload with progress
const formData = new FormData();
formData.append('file', file);
const response = await axios.post(`${baseURL}/api/upload`, formData, {
  onUploadProgress: (progressEvent) => {
    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    setUploadProgress(progress);
  }
});
```

### 2. Upload Routes (`server/routes/upload.js`)
**Location**: `server/routes/upload.js`
**Purpose**: File processing and text extraction

**Key Functions**:
- `POST /api/upload` - Handle file uploads
- PDF text extraction using PDF.js
- Text file processing
- Parsed text storage

**Important Points**:
```javascript
// PDF text extraction
if (originalName.endsWith('.pdf')) {
  const data = new Uint8Array(fs.readFileSync(filePath));
  const loadingTask = pdfjsLib.getDocument({ 
    data,
    standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/'
  });
  
  const pdf = await loadingTask.promise;
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    parsedText += strings.join(' ') + '\n\n';
  }
}

// Save parsed text and cleanup
const parsedFileName = `parsed-${req.file.filename}.txt`;
fs.writeFileSync(parsedFilePath, parsedText, 'utf8');
fs.unlinkSync(filePath); // Delete original file
```

---

## 🎯 Content Search Flow

### 1. Content Component (`frontend/src/component/Content.jsx`)
**Location**: `frontend/src/component/Content.jsx`
**Purpose**: YouTube video search and recommendations

**Key Functions**:
- `getVideoRecommendations()` - Search for relevant YouTube videos
- `handleVideoClick()` - Open video modal
- Local storage for search persistence

**Important Points**:
```javascript
// YouTube API integration
const getVideoRecommendations = async () => {
  const response = await axios.post(`${baseURL}/api/yt/search`, {
    topic: topic,
    maxResults: 10
  });
  
  setVideoData(response.data.videos);
  localStorage.setItem('searchTopic', topic);
  localStorage.setItem('videoData', JSON.stringify(response.data.videos));
};

// Video modal with embedded player
const VideoModal = ({ video, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <iframe
      src={`https://www.youtube.com/embed/${video.videoId}`}
      className="w-full h-full max-w-4xl max-h-96"
      allowFullScreen
    />
  </div>
);
```

### 2. YouTube Routes (`server/routes/yt.js`)
**Location**: `server/routes/yt.js`
**Purpose**: YouTube API integration

**Key Functions**:
- `POST /api/yt/search` - Search YouTube videos
- Video metadata extraction
- Search result formatting

---

## 📝 Quiz Generation Flow

### 1. Quizzes Component (`frontend/src/component/Quizzes.jsx`)
**Location**: `frontend/src/component/Quizzes.jsx`
**Purpose**: Quiz generation from uploaded files

**Key Functions**:
- `handleFileUpload()` - Upload file for quiz generation
- `handleSend()` - Generate quizzes from file content
- `handleReset()` - Clear current quiz data
- Question count selection

**Important Points**:
```javascript
// Quiz generation with file context
const handleSend = async () => {
  const response = await axios.post(`${baseURL}/api/GQuizzes/generate`, {
    parsedFileName: uploadedParsedFileName,
    questionCount: questionCount
  });
  
  setQuizzes(response.data.quizzes);
  localStorage.setItem('quizzes', JSON.stringify(response.data.quizzes));
};

// File upload with validation
const handleFileUpload = async (file) => {
  if (!['application/pdf', 'text/plain'].includes(file.type)) {
    setError('Only PDF and TXT files are allowed');
    return;
  }
  
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${baseURL}/api/upload`, formData);
  setUploadedParsedFileName(response.data.parsedFileName);
};
```

### 2. Quiz Routes (`server/routes/GQuizzes.js`)
**Location**: `server/routes/GQuizzes.js`
**Purpose**: AI-powered quiz generation

**Key Functions**:
- `POST /api/GQuizzes/generate` - Generate quizzes from file content
- Question validation and formatting
- Multiple choice question generation

---

## 📋 Notes Management Flow

### 1. Notes Component (`frontend/src/component/Notes.jsx`)
**Location**: `frontend/src/component/Notes.jsx`
**Purpose**: Simple note-taking interface

**Key Functions**:
- `useEffect()` - Auto-save notes to localStorage
- `handleNotionToggle()` - Open Notion integration
- Real-time text editing

**Important Points**:
```javascript
// Auto-save to localStorage
useEffect(() => {
  localStorage.setItem('notes', userText);
}, [userText]);

// Notion integration
const handleNotionToggle = () => {
  window.open("https://www.notion.com/");
};

// Full-screen textarea
<textarea
  value={userText}
  onChange={(e) => setUserText(e.target.value)}
  className="w-full h-full p-8 text-base outline-none resize-none bg-gray-800 text-white"
/>
```

---

## 🗄️ Database Models

### 1. User Model (`server/models/User.js`)
**Location**: `server/models/User.js`
**Purpose**: User data schema and authentication

**Key Fields**:
- `googleId` - Google OAuth identifier
- `name` - User's display name
- `email` - User's email (unique)
- `password` - Hashed password (for manual signup)
- `subscription` - Subscription plan and status

**Important Points**:
```javascript
// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Subscription schema
subscription: {
  plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
  status: { type: String, enum: ['free', 'active', 'expired', 'cancelled'], default: 'free' },
  startDate: { type: Date },
  endDate: { type: Date }
}
```

### 2. Chat Model (`server/models/Chat.js`)
**Location**: `server/models/Chat.js`
**Purpose**: Chat session management

**Key Fields**:
- `user` - Reference to User model
- `title` - Chat title (auto-generated)
- `archived` - Soft delete flag
- `messages` - Array of Message references
- `startedAt` - Chat creation timestamp

**Important Points**:
```javascript
// Compound index for performance
chatSchema.index({ user: 1, archived: 1, startedAt: -1 });

// Message reference array
messages: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Message'
}]
```

### 3. Message Model (`server/models/Message.js`)
**Location**: `server/models/Message.js`
**Purpose**: Individual message storage

**Key Fields**:
- `chat` - Reference to Chat model
- `sender` - 'user' or 'ai'
- `content` - Message text content
- `sentAt` - Message timestamp

**Important Points**:
```javascript
// Compound index for efficient retrieval
messageSchema.index({ chat: 1, sentAt: 1 });

// Content validation
content: {
  type: String,
  required: true,
  trim: true,
  minlength: 1,
  maxlength: 10000
}
```

---

## 🔍 Vector Search & RAG Implementation

### 1. Pinecone Service (`server/services/pineconeService.js`)
**Location**: `server/services/pineconeService.js`
**Purpose**: Vector database operations for semantic search

**Key Functions**:
- `initialize()` - Initialize Pinecone index
- `generateEmbedding(text)` - Create vector embeddings using Gemini
- `upsertMessage()` - Store message vectors
- `searchSimilarMessages()` - Semantic search for relevant context
- `deleteChatVectors()` - Cleanup vectors on chat deletion

**Important Points**:
```javascript
// Embedding generation with Gemini
async generateEmbedding(text) {
  const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Convert text to 1536-dimensional vector: "${text}"`;
  const result = await model.generateContent(prompt);
  const embedding = JSON.parse(result.response.text());
  return embedding;
}

// Vector storage with metadata
await this.index.upsert([{
  id: `${userId}_${chatId}_${messageId}`,
  values: embedding,
  metadata: {
    userId: userId.toString(),
    chatId: chatId.toString(),
    content: content.substring(0, 1000),
    sender,
    timestamp: new Date().toISOString()
  }
}]);

// Semantic search with filters
const searchResponse = await this.index.query({
  vector: queryEmbedding,
  topK: limit,
  includeMetadata: true,
  filter: { userId: userId.toString() }
});
```

---

## 💳 Payment Integration Flow

### 1. Payment Routes (`server/routes/payments.js`)
**Location**: `server/routes/payments.js`
**Purpose**: Razorpay payment processing

**Key Functions**:
- `POST /api/payments/create-order` - Create payment order
- `POST /api/payments/verify` - Verify payment signature
- `POST /api/payments/webhook` - Handle payment webhooks

**Important Points**:
```javascript
// Razorpay initialization
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Order creation
const order = await razorpay.orders.create({
  amount: amount * 100, // Convert to paise
  currency: currency,
  receipt: `order_${userId}_${Date.now()}`,
  notes: { plan, userId }
});

// Payment verification
const crypto = require('crypto');
const generatedSignature = crypto
  .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
  .update(`${orderId}|${paymentId}`)
  .digest('hex');
```

---

## 🛡️ Security & Middleware

### 1. Authentication Middleware (`server/middleware/authMiddleware.js`)
**Location**: `server/middleware/authMiddleware.js`
**Purpose**: JWT token validation

**Key Functions**:
- `requireAuth` - Verify JWT tokens
- Token extraction from Authorization header
- User context injection

### 2. Usage Middleware (`server/middleware/usageMiddleware.js`)
**Location**: `server/middleware/usageMiddleware.js`
**Purpose**: Usage tracking and limits

**Key Functions**:
- `checkUsageLimit()` - Enforce usage limits
- `incrementUsage()` - Track user usage
- Subscription-based limits

---

## 🚀 Deployment Configuration

### 1. Frontend Deployment (`frontend/vercel.json`)
**Location**: `frontend/vercel.json`
**Purpose**: Vercel deployment configuration

### 2. Backend Deployment (`server/render.yaml`)
**Location**: `server/render.yaml`
**Purpose**: Render.com deployment configuration

### 3. Environment Variables
**Frontend**:
- `VITE_APP_BE_BASEURL` - Backend API URL

**Backend**:
- `MONGODB_URI` - MongoDB connection string
- `SESSION_SECRET` - JWT secret key
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GEMINI_KEYS` - Comma-separated Gemini API keys
- `PINECONE_API_KEY` - Pinecone vector database key
- `RAZORPAY_KEY_ID` - Razorpay payment key
- `RAZORPAY_KEY_SECRET` - Razorpay payment secret

---

## 🔧 Key Technologies & Libraries

### Frontend:
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **React Markdown** - Markdown rendering

### Backend:
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **PDF.js** - PDF text extraction
- **Google Generative AI** - AI responses
- **Pinecone** - Vector database
- **Razorpay** - Payment processing

---

## 📊 Performance Optimizations

### 1. Frontend Optimizations:
- Lazy loading of components
- Memoized message components
- Local storage caching
- Responsive design with mobile-first approach

### 2. Backend Optimizations:
- Database indexing for faster queries
- Lean queries for better performance
- API key rotation for reliability
- Streaming responses for real-time chat
- Vector search for context retrieval

### 3. Database Optimizations:
- Compound indexes on frequently queried fields
- Pagination for large datasets
- Soft deletes for data recovery
- Efficient aggregation pipelines

---

## 🐛 Error Handling & Logging

### 1. Frontend Error Handling:
- Try-catch blocks in async functions
- User-friendly error messages
- Loading states for better UX
- Network error detection

### 2. Backend Error Handling:
- Comprehensive error middleware
- Detailed logging for debugging
- Graceful fallbacks for external services
- CORS error handling

---

## 🔄 Data Flow Summary

1. **User Authentication** → JWT token → Context state
2. **File Upload** → Multer processing → Text extraction → Storage
3. **Chat Message** → Context building → AI processing → Response streaming
4. **Vector Storage** → Pinecone indexing → Semantic search → Context retrieval
5. **Payment Flow** → Razorpay order → Verification → Subscription update
6. **Quiz Generation** → File content → AI processing → Structured output

---

## 📝 Development Notes

### Important Reminders:
- Always validate file types before upload
- Implement proper error boundaries in React
- Use environment variables for sensitive data
- Implement rate limiting for API endpoints
- Regular database backups
- Monitor API usage and costs
- Test payment flows in sandbox mode
- Implement proper logging for debugging

### Security Considerations:
- Validate all user inputs
- Sanitize file uploads
- Implement CSRF protection
- Use HTTPS in production
- Regular security audits
- Monitor for suspicious activities

---

*This documentation provides a comprehensive overview of the FastGen AI project architecture, data flow, and implementation details. For specific implementation questions, refer to the individual file locations mentioned above.*
