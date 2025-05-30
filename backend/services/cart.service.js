// src/services/cartService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1'; // Thay đổi theo port backend của bạn

// Get token from localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const cartService = {
    // Get user cart
    getCart: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/cart`, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error getting cart:', error);
            throw error;
        }
    },

    // Add item to cart
    addToCart: async (productId, quantity = 1, size = '', color = '') => {
        try {
            const response = await axios.post(`${API_BASE_URL}/cart/add`, {
                productId,
                quantity,
                size,
                color
            }, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    },

    // Update item quantity
    updateQuantity: async (productId, quantity, size = '', color = '') => {
        try {
            const response = await axios.put(`${API_BASE_URL}/cart/update/${productId}`, {
                quantity,
                size,
                color
            }, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error updating quantity:', error);
            throw error;
        }
    },

    // Remove item from cart
    removeFromCart: async (productId, size = '', color = '') => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/cart/remove/${productId}`, {
                data: { size, color },
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    },

    // Clear cart
    clearCart: async () => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/cart/clear`, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    }
};
