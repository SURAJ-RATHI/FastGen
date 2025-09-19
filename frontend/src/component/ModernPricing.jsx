import React from 'react';
import { Check, Zap, Crown, Building } from 'lucide-react';
import ModernPaymentModal from './ModernPaymentModal';
import useModernPayment from '../hooks/useModernPayment';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ModernPricing = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const {
    isModalOpen,
    paymentData,
    isLoading,
    initiatePayment,
    handlePaymentSuccess,
    handlePaymentError,
    closeModal
  } = useModernPayment();

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'forever',
      icon: Zap,
      description: 'Perfect for getting started',
      features: [
        '5 AI conversations per day',
        'Basic AI models',
        'Standard support',
        'Community access'
      ],
      popular: false,
      buttonText: 'Current Plan',
      buttonStyle: 'secondary'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 999,
      period: 'month',
      icon: Crown,
      description: 'For power users and professionals',
      features: [
        'Unlimited AI conversations',
        'Advanced AI models (GPT-4, Claude)',
        'Priority support',
        'Custom integrations',
        'Advanced analytics',
        'API access'
      ],
      popular: true,
      buttonText: 'Upgrade to Pro',
      buttonStyle: 'primary'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 4999,
      period: 'month',
      icon: Building,
      description: 'For teams and organizations',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Custom AI training',
        'Dedicated support',
        'SLA guarantee',
        'Custom deployment',
        'White-label solution'
      ],
      popular: false,
      buttonText: 'Contact Sales',
      buttonStyle: 'secondary'
    }
  ];

  const handlePlanSelect = async (plan) => {
    if (plan.id === 'free') {
      return; // Already on free plan
    }
    
    if (plan.id === 'enterprise') {
      // Handle enterprise contact
      window.open('mailto:sales@fastgen.ai?subject=Enterprise Plan Inquiry', '_blank');
      return;
    }

    // Check if user is logged in before allowing subscription
    if (!isSignedIn) {
      navigate('/signUp');
      return;
    }

    try {
      await initiatePayment(plan.price, plan.id);
    } catch (error) {
      console.error('Failed to initiate payment:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Unlock the full potential of AI with our flexible pricing plans
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                  plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {plan.description}
                    </p>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        ₹{plan.price}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-gray-600 dark:text-gray-400">
                          /{plan.period}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handlePlanSelect(plan)}
                    disabled={isLoading}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                      plan.buttonStyle === 'primary'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transform hover:scale-105 active:scale-95'
                        : 'border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? 'Processing...' : plan.buttonText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Is there a free trial?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our Free plan is always available. Pro and Enterprise plans come with a 7-day free trial.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We accept all major credit cards, UPI, digital wallets, and net banking through Razorpay.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Absolutely! Cancel anytime with no questions asked. No hidden fees or long-term contracts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Payment Modal */}
      <ModernPaymentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        amount={paymentData?.amount}
        plan={paymentData?.plan}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
      />
    </div>
  );
};

export default ModernPricing;
