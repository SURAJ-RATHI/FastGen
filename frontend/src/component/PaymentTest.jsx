import React, { useState } from 'react';
import useModernPayment from '../hooks/useModernPayment';
import ModernPaymentModal from './ModernPaymentModal';

const PaymentTest = () => {
  const [message, setMessage] = useState('');
  const {
    isModalOpen,
    paymentData,
    isLoading,
    initiatePayment,
    handlePaymentSuccess,
    handlePaymentError,
    closeModal
  } = useModernPayment();

  const handlePayment = async (plan, amount) => {
    try {
      setMessage('Initiating payment...');
      await initiatePayment(amount, plan);
      setMessage('Payment modal opened');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const onPaymentSuccess = async (paymentDetails) => {
    try {
      const result = await handlePaymentSuccess(paymentDetails);
      setMessage(`Payment successful! Subscription: ${result.subscription.plan}`);
    } catch (error) {
      setMessage(`Payment failed: ${error.message}`);
    }
  };

  const onPaymentError = (error) => {
    setMessage(`Payment error: ${error}`);
    handlePaymentError(error);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Test Payment Flow
      </h2>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={() => handlePayment('pro', 99)}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {isLoading ? 'Loading...' : 'Pay ₹99 - Pro Plan'}
        </button>
        
        <button
          onClick={() => handlePayment('enterprise', 2999)}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {isLoading ? 'Loading...' : 'Pay ₹2999 - Enterprise Plan'}
        </button>
      </div>

      {message && (
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
        </div>
      )}

      <ModernPaymentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        amount={paymentData?.amount}
        plan={paymentData?.plan}
        orderId={paymentData?.order?.id}
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
      />
    </div>
  );
};

export default PaymentTest;