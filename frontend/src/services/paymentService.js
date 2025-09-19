import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_BE_BASEURL || 'https://fastgen-5i9n.onrender.com';

// Create axios instance with optimized configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for caching
const requestCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

apiClient.interceptors.request.use((config) => {
  // Add cache key for GET requests
  if (config.method === 'get') {
    const cacheKey = `${config.url}${JSON.stringify(config.params || {})}`;
    const cached = requestCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return Promise.reject({
        isCached: true,
        data: cached.data,
        config
      });
    }
  }
  
  return config;
});

// Response interceptor for caching
apiClient.interceptors.response.use(
  (response) => {
    // Cache GET responses
    if (response.config.method === 'get') {
      const cacheKey = `${response.config.url}${JSON.stringify(response.config.params || {})}`;
      requestCache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
    }
    return response;
  },
  (error) => {
    // Handle cached responses
    if (error.isCached) {
      return Promise.resolve({
        data: error.data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: error.config
      });
    }
    return Promise.reject(error);
  }
);


class PaymentService {
  // Create payment order
  async createOrder(amount, plan) {
    const response = await apiClient.post('/api/payments/create-order', {
      amount,
      plan
    }, {
      withCredentials: true
    });
    
    return response.data;
  }

  // Verify payment
  async verifyPayment(orderId, paymentId, signature, plan) {
    const response = await apiClient.post('/api/payments/verify-payment', {
      orderId,
      paymentId,
      signature,
      plan
    }, {
      withCredentials: true
    });
    
    return response.data;
  }

  // Get subscription status
  async getSubscriptionStatus() {
    const response = await apiClient.get('/api/payments/subscription-status', {
      withCredentials: true
    });
    
    return response.data;
  }

  // Process payment with modern UI
  async processPayment(amount, plan) {
    try {
      // Create order
      const orderResponse = await this.createOrder(amount, plan);
      
      if (!orderResponse.success) return;

      const order = orderResponse.order;

      // Return order data for modern modal
      return {
        success: true,
        order: order,
        amount: amount,
        plan: plan
      };

    } catch {
      return { success: false };
    }
  }

  // Verify payment after modern modal completion
  async verifyModernPayment(orderId, paymentId, signature, plan) {
    const verifyResponse = await this.verifyPayment(orderId, paymentId, signature, plan);
    return verifyResponse;
  }

  // Legacy Razorpay popup method (kept for fallback)
  async processPaymentLegacy(amount, plan, onSuccess) {
    try {
      // Create order
      const orderResponse = await this.createOrder(amount, plan);
      
      if (!orderResponse.success) return;

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
            }
          } catch {
            // Silently handle error
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
            // Silently handle dismissal
          }
        }
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch {
      // Silently handle error
    }
  }
}

export default new PaymentService();
