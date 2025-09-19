import React, { useState } from 'react';
import { FiX, FiCopy, FiLink, FiLinkedin, FiTwitter } from 'react-icons/fi';
import { FaReddit, FaWhatsapp } from 'react-icons/fa';

export default function ShareModal({ isOpen, onClose, shareData }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareData?.shareUrl || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleSocialShare = (platform) => {
    const url = encodeURIComponent(shareData?.shareUrl || '');
    const text = encodeURIComponent(`Check out this chat: ${shareData?.chatTitle || 'Shared Chat'}`);
    
    let shareUrl = '';
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'reddit':
        shareUrl = `https://reddit.com/submit?url=${url}&title=${text}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#202123] rounded-lg w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium text-white">
            {shareData?.type === 'update' ? 'Update public link to chat' : 'Public link created'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="bg-gray-700 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm font-bold">i</span>
            </div>
            <div className="text-sm text-gray-200">
              <p className="font-semibold mb-1">
                This conversation may include personal information.
              </p>
              <p>Take a moment to check the content before sharing the link.</p>
            </div>
          </div>
        </div>

        {/* Privacy Info */}
        <p className="text-sm text-gray-300 mb-4">
          Your name, custom instructions, and any messages you add after sharing stay private.{' '}
          <a href="#" className="text-blue-400 hover:underline">Learn more</a>
        </p>

        {/* Share Link Input */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 bg-gray-700 rounded-lg p-3">
            <input
              type="text"
              value={shareData?.shareUrl || ''}
              readOnly
              className="w-full bg-transparent text-gray-300 text-sm outline-none"
              placeholder="https://yourapp.com/share/..."
            />
          </div>
          <button
            onClick={handleCopyLink}
            className={`px-4 py-3 rounded-lg font-medium transition-colors ${
              copied
                ? 'bg-green-600 text-white'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              {copied ? (
                <>
                  <span>✓</span>
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <FiCopy size={16} />
                  <span>Copy link</span>
                </>
              )}
            </div>
          </button>
        </div>

        {/* Social Media Sharing */}
        <div className="flex justify-center gap-6 mb-6">
          <button
            onClick={() => handleSocialShare('whatsapp')}
            className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors">
              <FaWhatsapp size={20} />
            </div>
            <span className="text-xs">WhatsApp</span>
          </button>

          <button
            onClick={() => handleSocialShare('linkedin')}
            className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors">
              <FiLinkedin size={20} />
            </div>
            <span className="text-xs">LinkedIn</span>
          </button>

          <button
            onClick={() => handleSocialShare('reddit')}
            className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors">
              <FaReddit size={20} />
            </div>
            <span className="text-xs">Reddit</span>
          </button>

          <button
            onClick={() => handleSocialShare('twitter')}
            className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors">
              <FiTwitter size={20} />
            </div>
            <span className="text-xs">X</span>
          </button>
        </div>


      </div>
    </div>
  );
}
