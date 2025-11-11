import React, { useState, useEffect } from 'react';
import { Crown, Zap, Video, FileText, AlertTriangle } from 'lucide-react';
import usageService from '../services/usageService';

const UsageDisplay = ({ onUpgradeClick }) => {
  const [usageData, setUsageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsageData();
  }, []);

  const fetchUsageData = async () => {
    try {
      setLoading(true);
      const data = await usageService.getUsageStatus();
      const formattedData = usageService.formatUsageForDisplay(data);
      setUsageData(formattedData);
    } catch (err) {
      console.error('Failed to fetch usage data:', err);
      setError('Failed to load usage data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-700 rounded w-full"></div>
            <div className="h-3 bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !usageData) {
    return (
      <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 text-red-400">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm">{error || 'Unable to load usage data'}</span>
        </div>
      </div>
    );
  }

  const { plan, chatbotChats, videoRecommendations, contentGenerations } = usageData;

  const UsageItem = ({ icon: Icon, label, usage, color = 'blue' }) => {
    const isApproaching = usageService.isApproachingLimit(usage);
    const hasReached = usageService.hasReachedLimit(usage);
    
    const bgColor = hasReached ? 'bg-red-900/20 border-red-500' : 
                   isApproaching ? 'bg-yellow-900/20 border-yellow-500' : 
                   'bg-gray-800 border-gray-700';
    
    const textColor = hasReached ? 'text-red-400' : 
                     isApproaching ? 'text-yellow-400' : 
                     'text-gray-300';

    return (
      <div className={`${bgColor} border rounded-lg p-3`}>
        <div className="flex items-center gap-2 mb-2">
          <Icon className={`w-4 h-4 text-${color}-400`} />
          <span className={`text-sm font-medium ${textColor}`}>{label}</span>
        </div>
        <div className={`text-xs ${textColor}`}>
          {usage.isUnlimited ? (
            <span className="text-green-400">Unlimited</span>
          ) : (
            <span>
              {usage.used}/{usage.limit} used
              {usage.remaining > 0 && (
                <span className="ml-2 text-gray-500">({usage.remaining} remaining)</span>
              )}
            </span>
          )}
        </div>
        {hasReached && (
          <div className="mt-2 text-xs text-red-400 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Limit reached! Upgrade for unlimited access.
          </div>
        )}
        {isApproaching && !hasReached && (
          <div className="mt-2 text-xs text-yellow-400 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Approaching limit! Consider upgrading.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {plan === 'free' ? (
            <Zap className="w-5 h-5 text-gray-400" />
          ) : (
            <Crown className="w-5 h-5 text-yellow-400" />
          )}
          <h3 className="text-white font-semibold">
            {plan === 'free' ? 'Free Plan' : `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`}
          </h3>
        </div>
        {plan === 'free' && onUpgradeClick && (
          <button
            onClick={onUpgradeClick}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs px-3 py-1 rounded-lg transition-all transform hover:scale-105"
          >
            Upgrade
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <UsageItem
          icon={Zap}
          label="AI Chats"
          usage={chatbotChats}
          color="blue"
        />
        <UsageItem
          icon={Video}
          label="Video Recommendations"
          usage={videoRecommendations}
          color="red"
        />
        <UsageItem
          icon={FileText}
          label="Content Generation"
          usage={contentGenerations}
          color="green"
        />
      </div>

      {plan === 'free' && (
        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500 rounded-lg">
          <div className="text-blue-400 text-sm">
            <strong>🚀 Upgrade to Pro for unlimited access!</strong>
            <ul className="mt-2 text-xs text-blue-300 space-y-1">
              <li>• Unlimited AI conversations</li>
              <li>• Advanced AI models (GPT-4, Claude)</li>
              <li>• Priority support</li>
              <li>• Custom integrations</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsageDisplay;
