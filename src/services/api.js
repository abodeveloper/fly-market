import axiosInstance from '../config/axios';

// --- Auth API ---
export const authAPI = {
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },
  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },
  status: async () => {
    const response = await axiosInstance.get('/auth/status');
    return response.data;
  },
};

// --- User API ---
export const userAPI = {
  getProfile: async (id) => {
    const response = await axiosInstance.get(`/user/${id}`);
    return response.data;
  },
  updateProfile: async (id, data) => {
    const response = await axiosInstance.patch(`/user/${id}`, data);
    return response.data;
  }
};

// --- Products API ---
export const productAPI = {
  getProducts: async ({ sort, categoryId, productName } = {}) => {
    const params = {};
    if (sort) params.sort = sort;
    if (categoryId) params.categoryId = categoryId;
    if (productName) params.productName = productName;
    
    const response = await axiosInstance.get('/product', { params });
    return response.data;
  },
  getProductById: async (id) => {
    const response = await axiosInstance.get(`/product/${id}`);
    return response.data;
  }
};

// --- Categories API ---
export const categoryAPI = {
  getCategories: async () => {
    const response = await axiosInstance.get('/category');
    return response.data;
  },
  getCategoryById: async (id) => {
    const response = await axiosInstance.get(`/category/${id}`);
    return response.data;
  }
};

// --- Cart API ---
export const cartAPI = {
  getCart: async () => {
    try {
      const response = await axiosInstance.get('/cart');
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return { cartItems: [], totalAmount: 0 };
      }
      throw error;
    }
  },
  addToCart: async ({ productId }) => {
    const response = await axiosInstance.post('/cart/add', { productId });
    return response.data;
  },
  updateCartItem: async ({ productId, quantity }) => {
    const response = await axiosInstance.patch('/cart/update', { productId, quantity });
    return response.data;
  },
  removeFromCart: async ({ productId }) => {
    const response = await axiosInstance.delete('/cart/remove', { data: { productId } });
    return response.data;
  }
};

// --- Orders API ---
export const orderAPI = {
  getOrders: async () => {
    const response = await axiosInstance.get('/order');
    return response.data;
  },
  placeOrder: async () => {
    const response = await axiosInstance.post('/order');
    return response.data;
  }
};

// --- Reviews API ---
export const reviewAPI = {
  getReviewsByUserId: async () => {
    try {
      const response = await axiosInstance.get('/review');
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return [];
      }
      throw error;
    }
  },
  getProductReviews: async (productId) => {
    const response = await axiosInstance.get(`/review/product/${productId}`);
    return response.data;
  },
  createReview: async (reviewData) => {
    const response = await axiosInstance.post('/review', reviewData);
    return response.data;
  }
};
