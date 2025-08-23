# FastGen - AI-Powered Learning Platform

FastGen is an intelligent AI-driven application that makes learning easier and more productive through advanced AI tools and automation.

## 🚀 Features

- **Personalized Chatbot**: AI-powered chatbot that answers all your questions
- **Content Searcher**: Find the best YouTube videos related to your search queries
- **Key Points Extraction**: Extract essential information from uploaded files
- **Quiz Generator**: Generate quizzes from your files to test knowledge
- **Smart Notes**: Take and organize important notes as you learn
- **Content Hub**: Access all your study materials in one centralized location

## 🏗️ Project Structure

```
fastgen2/
├── frontend/          # React.js frontend application
│   ├── src/          # Source code
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
├── server/           # Node.js backend server
│   ├── routes/       # API routes
│   ├── models/       # Database models
│   ├── auth/         # Authentication logic
│   └── package.json  # Backend dependencies
└── README.md         # Project documentation
```

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI framework
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **GSAP** - Animation library

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Multer** - File upload handling

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SURAJ-RATHI/FastGen.git
   cd FastGen
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Environment Setup**
   Create `.env` files in both `frontend/` and `server/` directories with your configuration.

5. **Start the development servers**
   
   **Backend:**
   ```bash
   cd server
   npm start
   ```
   
   **Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

## 📱 Usage

1. **Sign Up**: Create a new account to get started
2. **Upload Files**: Add your study materials (PDFs, text files)
3. **Ask Questions**: Use the AI chatbot for personalized assistance
4. **Generate Quizzes**: Create quizzes from your uploaded content
5. **Take Notes**: Organize your learning with smart notes
6. **Search Content**: Find relevant YouTube videos and resources

## 🔧 Configuration

### Frontend Environment Variables
```env
VITE_APP_BE_BASEURL=http://localhost:5000
```

### Backend Environment Variables
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
```

## 📁 API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/chats` - Create chat sessions
- `POST /api/messages` - Send messages
- `POST /api/upload` - File upload
- `GET /api/youtube` - YouTube video search

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **SURAJ-RATHI** - Project Lead & Developer

## 📞 Support

- **Email**: kodr.test@gmail.com
- **Phone**: +91 7015506489
- **Address**: 273, Bhiwani, Haryana-127021, India

## 🔮 Roadmap

- [ ] Mobile app development
- [ ] Advanced AI features
- [ ] Team collaboration tools
- [ ] API rate limiting
- [ ] Performance optimizations
- [ ] Multi-language support

---

⭐ Star this repository if you find it helpful!

