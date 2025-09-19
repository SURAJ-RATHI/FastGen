import React from 'react';
import ModernPaymentModal from './ModernPaymentModal';
import useModernPayment from '../hooks/useModernPayment';

const PaymentTest = () => {
  const {
    isModalOpen,
    paymentData,
    isLoading,
    initiatePayment,
    handlePaymentSuccess,
    handlePaymentError,
    closeModal
  } = useModernPayment();

  const testPayment = async (amount, plan) => {
    try {
      await initiatePayment(amount, plan);
    } catch (error) {
      console.error('Payment test failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Modern Payment Test
        </h1>
        
        <div className="space-y-4">
          <button
            onClick={() => testPayment(999, 'pro')}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Test Pro Plan (₹999)'}
          </button>
          
          <button
            onClick={() => testPayment(4999, 'enterprise')}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Test Enterprise Plan (₹4999)'}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This will open the modern payment modal instead of the ugly Razorpay popup
          </p>
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

export default PaymentTest;
