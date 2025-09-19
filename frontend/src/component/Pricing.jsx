import HomeHeader from "./HomeHeader";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import paymentService from '../services/paymentService';

const Pricing = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const handlePlanSelect = async (plan) => {
    if (plan.name === 'Free') {
      navigate('/main');
      return;
    }
    
    if (plan.name === 'Enterprise') {
      // Handle enterprise contact
      window.open('mailto:sales@fastgen.ai?subject=Enterprise Plan Inquiry', '_blank');
      return;
    }

    // Check if user is logged in before allowing subscription
    if (!isSignedIn) {
      navigate('/signUp');
      return;
    }

    // For Pro plan, directly open Razorpay payment page
    if (plan.name === 'Pro') {
      try {
        await paymentService.processPaymentLegacy(
          999, 
          'pro',
          () => {
            // Payment success
            navigate('/main');
          },
          () => {
            // Payment error - silently handle
          }
        );
      } catch (error) {
        console.error('Failed to initiate payment:', error);
      }
    }
  };

  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "month",
      description: "Perfect for getting started with FastGen",
      features: [
        "5 AI-powered conversations per month",
        "Basic quiz generation",
        "Standard content analysis",
        "Community support"
      ],
      buttonText: "Get Started Free",
      buttonStyle: "bg-gray-600 hover:bg-gray-700"
    },
    {
      name: "Pro",
      price: "₹999",
      period: "month",
      description: "Best for students and professionals",
      features: [
        "Unlimited AI conversations",
        "Advanced quiz generation",
        "Priority content analysis",
        "Email support",
        "Custom learning paths",
        "Export to Notion"
      ],
      buttonText: "Subscribe Now",
      buttonStyle: "bg-blue-600 hover:bg-blue-700",
      popular: true
    },
    {
      name: "Enterprise",
      price: "₹2,999",
      period: "month",
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Advanced analytics",
        "API access",
        "Priority support",
        "Custom integrations",
        "White-label options"
      ],
      buttonText: "Contact Sales",
      buttonStyle: "bg-purple-600 hover:bg-purple-700"
    }
  ];

  return (
    <div className="bg-black min-h-screen">
      <HomeHeader />
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Choose the plan that fits your learning needs. All plans include our core AI features with <span className="text-purple-400 font-bold">no hidden fees</span>.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className={`relative bg-gray-800 p-6 rounded-2xl border-2 ${
                  plan.popular 
                    ? 'border-blue-500 scale-105' 
                    : 'border-gray-600'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-2">/{plan.period}</span>
                  </div>
                  <p className="text-gray-300 text-sm">{plan.description}</p>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-300 text-sm">
                      <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition-colors ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-2">All plans include secure payment processing</p>
            <p className="text-gray-400 mb-2">Powered by Razorpay • Secure & reliable payments</p>
            <p className="text-gray-400">Need a custom plan? <span className="text-blue-400 cursor-pointer hover:underline">Contact us</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
