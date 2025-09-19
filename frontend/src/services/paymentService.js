import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_BE_BASEURL || 'https://fastgen-5i9n.onrender.com';


class PaymentService {
  // Create payment order
  async createOrder(amount, plan) {
    try {
      
      const response = await axios.post(`${API_BASE_URL}/api/payments/create-order`, {
        amount,
        plan
      }, {
        withCredentials: true
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Verify payment
  async verifyPayment(orderId, paymentId, signature, plan) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/payments/verify-payment`, {
        orderId,
        paymentId,
        signature,
        plan
      }, {
        withCredentials: true
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get subscription status
  async getSubscriptionStatus() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/payments/subscription-status`, {
        withCredentials: true
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Process payment with modern UI
  async processPayment(amount, plan, onSuccess, onError) {
    try {
      // Create order
      const orderResponse = await this.createOrder(amount, plan);
      
      if (!orderResponse.success) {
        throw new Error('Failed to create payment order');
      }

      const order = orderResponse.order;

      // Return order data for modern modal
      return {
        success: true,
        order: order,
        amount: amount,
        plan: plan
      };

    } catch (error) {
      onError(error.message || 'Payment processing failed');
      return { success: false, error: error.message };
    }
  }

  // Verify payment after modern modal completion
  async verifyModernPayment(orderId, paymentId, signature, plan) {
    try {
      const verifyResponse = await this.verifyPayment(orderId, paymentId, signature, plan);
      return verifyResponse;
    } catch (error) {
      throw error;
    }
  }

  // Legacy Razorpay popup method (kept for fallback)
  async processPaymentLegacy(amount, plan, onSuccess, onError) {
    try {
      // Create order
      const orderResponse = await this.createOrder(amount, plan);
      
      if (!orderResponse.success) {
        throw new Error('Failed to create payment order');
      }

      const order = orderResponse.order;

      // Configure Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'FastGen AI',
        description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Subscription`,
        order_id: order.id,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyResponse = await this.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              plan
            );

            if (verifyResponse.success) {
              onSuccess(verifyResponse.subscription);
            } else {
              onError('Payment verification failed');
            }
          } catch (error) {
            onError(error.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: 'User',
          email: 'user@example.com'
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: () => {
            onError('Payment cancelled by user');
          }
        }
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      onError(error.message || 'Payment processing failed');
    }
  }
}

export default new PaymentService();
