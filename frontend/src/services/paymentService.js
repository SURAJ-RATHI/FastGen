import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_BE_BASEURL || 'https://fastgen-5i9n.onrender.com';

// Debug logging
console.log('🔍 PaymentService Debug:');
console.log('VITE_APP_BE_BASEURL:', import.meta.env.VITE_APP_BE_BASEURL);
console.log('API_BASE_URL:', API_BASE_URL);
console.log('Environment:', import.meta.env.MODE);

class PaymentService {
  // Create payment order
  async createOrder(amount, plan) {
    try {
      console.log('🚀 Creating payment order...');
      console.log('Request URL:', `${API_BASE_URL}/api/payments/create-order`);
      console.log('Request data:', { amount, plan });
      
      const response = await axios.post(`${API_BASE_URL}/api/payments/create-order`, {
        amount,
        plan
      }, {
        withCredentials: true
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating payment order:', error);
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
      console.error('Error verifying payment:', error);
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
      console.error('Error getting subscription status:', error);
      throw error;
    }
  }

  // Process payment with Razorpay
  async processPayment(amount, plan, onSuccess, onError) {
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
