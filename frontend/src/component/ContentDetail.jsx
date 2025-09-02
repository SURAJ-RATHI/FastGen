import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiEdit3, FiShare2, FiCopy, FiSave, FiTrash2 } from 'react-icons/fi';

const ContentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const content = location.state?.content || {
    id: id,
    type: 'blog',
    title: 'Sample Content',
    platform: 'Reddit',
    createdAt: '2 hours ago',
    status: 'published',
    content: 'This is a sample content that would be displayed here...'
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content.content || '');
  const [editedTitle, setEditedTitle] = useState(content.title);

  const handleBack = () => {
    navigate('/content');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Here you would save the changes to your backend
    setIsEditing(false);
    // Update the content object
    content.title = editedTitle;
    content.content = editedContent;
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent(content.content || '');
    setEditedTitle(content.title);
  };

  const handleShare = async () => {
    const shareData = {
      title: editedTitle,
      text: editedContent,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(editedContent);
      alert('Content copied to clipboard!');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editedContent);
    alert('Content copied to clipboard!');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      // Here you would delete from your backend
      navigate('/content');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBack}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Content Details</h1>
              <p className="text-gray-600 dark:text-gray-400">View and edit your content</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiEdit3 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FiShare2 className="w-4 h-4" />
                  Share
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <FiCopy className="w-4 h-4" />
                  Copy
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FiSave className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </>
            )}
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FiTrash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Content Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                content.status === 'published' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}>
                {content.status}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {content.platform} • {content.createdAt}
              </span>
            </div>
          </div>
          
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full text-2xl font-bold text-gray-900 dark:text-gray-100 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 mb-4"
            />
          ) : (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {content.title}
            </h2>
          )}
        </div>

        {/* Content Body */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Content</h3>
          
          {isEditing ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={15}
              placeholder="Enter your content here..."
            />
          ) : (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-gray-100 font-mono">
                  {content.content || 'No content available'}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentDetail;
