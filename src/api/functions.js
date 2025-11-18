import api from './../utils/api';

export const stripeWebhook = async (payload, signature, endpointSecret) => {
  try {
    const response = await api.post('/stripe/webhook', payload, {
      headers: {
        'Stripe-Signature': signature
      },
      params: { endpoint_secret: endpointSecret }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createCheckout = async (priceId, successUrl, cancelUrl, metadata = {}) => {
  try {
    const response = await api.post('/stripe/create-checkout-session', {
      priceId,
      successUrl,
      cancelUrl,
      metadata
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createCustomerPortal = async (returnUrl) => {
  try {
    const response = await api.post('/stripe/customer-portal', { returnUrl });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
