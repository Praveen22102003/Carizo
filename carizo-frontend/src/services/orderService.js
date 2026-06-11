// src/services/orderService.js

import axios from 'axios';

// No base URL needed here if proxy is configured in package.json
const API_PATH = '/api/orders';  // relative to proxy

export const checkout = async (shippingData, token) => {
  try {
    const response = await axios.post(
      `${API_PATH}/checkout`,
      shippingData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
