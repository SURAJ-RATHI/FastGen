import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Wallet, CheckCircle } from 'lucide-react';

const ModernPaymentModal = ({ 
  isOpen, 
  onClose, 
  amount, 
  plan, 
  onPaymentSuccess, 
  onPaymentError 
}) => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState('method'); // method, details, processing, success

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, RuPay'
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: Smartphone,
      description: 'Google Pay, PhonePe, Paytm'
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: Wallet,
      description: 'Paytm, Mobikwik, Freecharge'
    }
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    setStep('processing');
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would integrate with Razorpay API
      // For now, we'll simulate success
      setStep('success');
      
      setTimeout(() => {
        onPaymentSuccess({
          plan: plan,
          amount: amount,
          method: selectedMethod
        });
        onClose();
      }, 1500);
      
    } catch (error) {
      setStep('method');
      setIsProcessing(false);
      onPaymentError(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {step === 'method' && 'Choose Payment Method'}
              {step === 'details' && 'Payment Details'}
              {step === 'processing' && 'Processing Payment'}
              {step === 'success' && 'Payment Successful'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {step === 'method' && `Complete your ${plan} plan purchase`}
              {step === 'details' && 'Enter your payment information'}
              {step === 'processing' && 'Please wait while we process your payment'}
              {step === 'success' && 'Your subscription has been activated'}
            </p>
          </div>
          {step !== 'processing' && step !== 'success' && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'method' && (
            <>
              {/* Amount Display */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{amount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Plan</p>
                    <p className="font-semibold text-gray-900 dark:text-white capitalize">{plan}</p>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 mb-6">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all ${
                        selectedMethod === method.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          selectedMethod === method.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900 dark:text-white">{method.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{method.description}</p>
                        </div>
                        {selectedMethod === method.id && (
                          <div className="ml-auto">
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Pay Button */}
              <button
                onClick={() => setStep('details')}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Continue to Payment
              </button>
            </>
          )}

          {step === 'details' && (
            <>
              {/* Payment Form */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setStep('method')}
                  className="flex-1 py-3 px-6 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePayment}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Pay ₹{amount}
                </button>
              </div>
            </>
          )}

          {step === 'processing' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Processing Payment
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Please don't close this window...
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Your {plan} plan has been activated
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {step !== 'processing' && step !== 'success' && (
          <div className="px-6 pb-6">
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-2 h-2 text-white" />
              </div>
              <span>Secured by Razorpay</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernPaymentModal;
