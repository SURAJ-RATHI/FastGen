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
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    try {
      // Verify payment with Razorpay response
      const verifyResponse = await paymentService.verifyModernPayment(
        paymentDetails.razorpay_order_id,
        paymentDetails.razorpay_payment_id,
        paymentDetails.razorpay_signature,
        paymentData.plan
      );

      if (verifyResponse.success) {
        // Payment successful
        setIsModalOpen(false);
        setPaymentData(null);
        return { success: true, subscription: verifyResponse.subscription };
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const handlePaymentError = (error) => {
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
