import React from 'react';
import { X, Crown, Zap, Video, FileText, Check } from 'lucide-react';

const UpgradeModal = ({ isOpen, onClose, usageData, featureType }) => {
  if (!isOpen) return null;

  const getFeatureIcon = (type) => {
    switch (type) {
      case 'chatbotChats':
        return <Zap className="w-6 h-6 text-gray-900" />;
      case 'videoRecommendations':
        return <Video className="w-6 h-6 text-gray-900" />;
      case 'contentGenerations':
        return <FileText className="w-6 h-6 text-gray-900" />;
      default:
        return <Zap className="w-6 h-6 text-gray-900" />;
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
    onClose();
    
    // Navigate to pricing section
    setTimeout(() => {
      if (window.location.pathname === '/') {
        // If on home page, scroll to pricing section
        const pricingSection = document.getElementById('pricing-section');
        if (pricingSection) {
          pricingSection.scrollIntoView({ behavior: 'smooth' });
          
          // Highlight the Pro plan after scrolling
          setTimeout(() => {
            // Find the Pro plan card (second card in the grid)
            const pricingCards = pricingSection.querySelectorAll('.group');
            const proPlanCard = pricingCards[1]; // Pro plan is the second card (index 1)
            
            if (proPlanCard) {
              // Add highlight effect
              proPlanCard.style.transform = 'scale(1.05)';
              proPlanCard.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.5)';
              proPlanCard.style.borderColor = 'rgba(59, 130, 246, 0.8)';
              
              // Find and highlight the Subscribe Now button
              const subscribeButton = proPlanCard.querySelector('button');
              if (subscribeButton) {
                subscribeButton.style.transform = 'scale(1.1)';
                subscribeButton.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.6)';
                subscribeButton.style.backgroundColor = 'rgb(37, 99, 235)'; // blue-600
              }
              
              // Reset after 4 seconds
              setTimeout(() => {
                proPlanCard.style.transform = '';
                proPlanCard.style.boxShadow = '';
                proPlanCard.style.borderColor = '';
                if (subscribeButton) {
                  subscribeButton.style.transform = '';
                  subscribeButton.style.boxShadow = '';
                  subscribeButton.style.backgroundColor = '';
                }
              }, 4000);
            }
          }, 1000);
        }
      } else {
        // If not on home page, navigate to dedicated pricing page
        window.location.href = '/pricing';
        
        // After navigation, highlight the Pro plan
        setTimeout(() => {
          // Wait for page to load and then highlight the Pro plan
          const highlightProPlan = () => {
            // Find the Pro plan card (second card in the grid)
            const pricingCards = document.querySelectorAll('.relative.bg-gray-800');
            const proPlanCard = pricingCards[1]; // Pro plan is the second card (index 1)
            
            if (proPlanCard) {
              proPlanCard.style.transform = 'scale(1.05)';
              proPlanCard.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.5)';
              proPlanCard.style.borderColor = 'rgba(59, 130, 246, 0.8)';
              
              const subscribeButton = proPlanCard.querySelector('button');
              if (subscribeButton) {
                subscribeButton.style.transform = 'scale(1.1)';
                subscribeButton.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.6)';
                subscribeButton.style.backgroundColor = 'rgb(37, 99, 235)';
              }
              
              setTimeout(() => {
                proPlanCard.style.transform = '';
                proPlanCard.style.boxShadow = '';
                proPlanCard.style.borderColor = '';
                if (subscribeButton) {
                  subscribeButton.style.transform = '';
                  subscribeButton.style.boxShadow = '';
                  subscribeButton.style.backgroundColor = '';
                }
              }, 4000);
            } else {
              // If elements not found yet, try again after a short delay
              setTimeout(highlightProPlan, 500);
            }
          };
          
          highlightProPlan();
        }, 1000);
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg max-w-md w-full mx-2 sm:mx-4 overflow-hidden border border-gray-200 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 text-center relative border-b border-gray-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
            <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-gray-900" />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Upgrade to Pro</h2>
          </div>
          
          <p className="text-gray-600 text-sm">
            You've reached your daily limit
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Usage Info */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              {getFeatureIcon(featureType)}
              <span className="text-red-700 font-medium text-sm sm:text-base">
                {getFeatureName(featureType)} Limit Reached
              </span>
            </div>
            {usageData && (
              <p className="text-red-600 text-sm">
                You've used <strong>{usageData.used}/{usageData.limit}</strong> today.
                {usageData.remaining > 0 && (
                  <span className="ml-2 text-gray-500">
                    ({usageData.remaining} remaining)
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Pro Benefits */}
          <div className="mb-6">
            <h3 className="text-gray-900 font-medium mb-4 text-center text-base">
              Pro Plan Benefits
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm">Unlimited AI conversations</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm">Unlimited video recommendations</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm">Unlimited content generation</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm">Advanced AI models (GPT-4, Claude)</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm">Priority support</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm">Custom integrations</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md transition-colors text-sm font-medium"
            >
              Maybe Later
            </button>
            <button
              onClick={handleUpgrade}
              className="flex-1 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-md transition-colors font-medium text-sm"
            >
              Upgrade Now
            </button>
          </div>

          {/* Pricing Info */}
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">
              Starting at <span className="text-gray-900 font-medium">₹99/month</span>
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
