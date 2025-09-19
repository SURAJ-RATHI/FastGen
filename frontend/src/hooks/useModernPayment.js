import { useState } from 'react';
import paymentService from '../services/paymentService';

const useModernPayment = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const initiatePayment = async (amount, plan) => {
    setIsLoading(true);
    try {
      const result = await paymentService.processPayment(amount, plan);
      
      if (result.success) {
        setPaymentData({
          amount,
          plan,
          order: result.order
        });
        setIsModalOpen(true);
      } else {
        throw new Error(result.error || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    try {
      // Simulate payment verification
      // In real implementation, you'd get these from Razorpay
      const mockPaymentId = 'pay_' + Date.now();
      const mockSignature = 'mock_signature_' + Date.now();
      
      const verifyResponse = await paymentService.verifyModernPayment(
        paymentData.order.id,
        mockPaymentId,
        mockSignature,
        paymentData.plan
      );

      if (verifyResponse.success) {
        // Payment successful
        console.log('Payment successful:', verifyResponse.subscription);
        setIsModalOpen(false);
        setPaymentData(null);
        return { success: true, subscription: verifyResponse.subscription };
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      throw error;
    }
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    setIsModalOpen(false);
    setPaymentData(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPaymentData(null);
  };

  return {
    isModalOpen,
    paymentData,
    isLoading,
    initiatePayment,
    handlePaymentSuccess,
    handlePaymentError,
    closeModal
  };
};

export default useModernPayment;
