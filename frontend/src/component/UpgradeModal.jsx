import React from 'react';
import { X, Crown, Zap, Video, FileText, Check } from 'lucide-react';

const UpgradeModal = ({ isOpen, onClose, usageData, featureType }) => {
  if (!isOpen) return null;

  const getFeatureIcon = (type) => {
    switch (type) {
      case 'chatbotChats':
        return <Zap className="w-6 h-6 text-blue-400" />;
      case 'videoRecommendations':
        return <Video className="w-6 h-6 text-red-400" />;
      case 'contentGenerations':
        return <FileText className="w-6 h-6 text-green-400" />;
      default:
        return <Zap className="w-6 h-6 text-blue-400" />;
    }
  };

  const getFeatureName = (type) => {
    switch (type) {
      case 'chatbotChats':
        return 'AI Chatbot Conversations';
      case 'videoRecommendations':
        return 'Video Recommendations';
      case 'contentGenerations':
        return 'Content Generation';
      default:
        return 'Feature';
    }
  };

  const handleUpgrade = () => {
    // Navigate to pricing page
    window.location.href = '/#pricing';
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-md w-full mx-4 overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center justify-center gap-3 mb-2">
            <Crown className="w-8 h-8 text-yellow-300" />
            <h2 className="text-2xl font-bold text-white">Upgrade to Pro</h2>
          </div>
          
          <p className="text-blue-100 text-sm">
            You've reached your monthly limit!
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Usage Info */}
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-2">
              {getFeatureIcon(featureType)}
              <span className="text-red-400 font-semibold">
                {getFeatureName(featureType)} Limit Reached
              </span>
            </div>
            {usageData && (
              <p className="text-red-300 text-sm">
                You've used <strong>{usageData.used}/{usageData.limit}</strong> this month.
                {usageData.remaining > 0 && (
                  <span className="ml-2 text-gray-400">
                    ({usageData.remaining} remaining)
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Pro Benefits */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-4 text-center">
              🚀 Pro Plan Benefits
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>Unlimited AI conversations</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>Unlimited video recommendations</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>Unlimited content generation</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>Advanced AI models (GPT-4, Claude)</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>Priority support</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>Custom integrations</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Maybe Later
            </button>
            <button
              onClick={handleUpgrade}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all transform hover:scale-105 font-semibold"
            >
              Upgrade Now
            </button>
          </div>

          {/* Pricing Info */}
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">
              Starting at <span className="text-white font-semibold">₹999/month</span>
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Cancel anytime • No hidden fees
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
