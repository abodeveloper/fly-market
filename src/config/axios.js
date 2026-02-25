import axios from 'axios';

// Get base URL from environment or use proxy/default
const API_URL = import.meta.env.VITE_API_URL || 'https://d.dev-baxa.me';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial for sending/receiving cookies automatically
});

// Add a response interceptor for global error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle unauthorized errors (e.g., token expiration/missing cookie)
    if (error.response && error.response.status === 401) {
      // You can dispatch a global event or redirect to login
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
