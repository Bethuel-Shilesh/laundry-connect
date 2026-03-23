import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getAllShops = () => API.get('/shops/');
export const getShopById = (id) => API.get(`/shops/${id}`);
export const createShop = (data) => API.post('/shops/', data);
export const updateShop = (id, data) => API.put(`/shops/${id}`, data);
export const getServicesByShop = (shopId) => API.get(`/services/${shopId}`);
export const createService = (shopId, data) => API.post(`/services/?shop_id=${shopId}`, data);
export const createOrder = (data) => API.post('/orders/', data);
export const getMyOrders = () => API.get('/orders/');
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });
export const getShopReviews = (shopId) => API.get(`/reviews/${shopId}`);
export const createReview = (data) => API.post('/reviews/', data);
export const createPayment = (data) => API.post('/payments/', data);
export const getMyPayments = () => API.get('/payments/');
export const getAdminStats = () => API.get('/admin/stats');
export const getPendingShops = () => API.get('/admin/shops/pending');
export const approveShop = (id) => API.put(`/admin/shops/${id}/approve`);
export const getAllUsers = () => API.get('/admin/users'); 
