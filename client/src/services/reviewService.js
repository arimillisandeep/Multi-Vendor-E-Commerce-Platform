import api from "./api";

export const reviewService = {
  addReview: async (productId, rating, comment) => {
    const response = await api.post(`/products/${productId}/reviews`, {
      rating,
      comment,
    });
    return response.data;
  },

  updateReview: async (productId, reviewId, rating, comment) => {
    const response = await api.put(
      `/products/${productId}/reviews/${reviewId}`,
      { rating, comment }
    );
    return response.data;
  },

  deleteReview: async (productId, reviewId) => {
    const response = await api.delete(
      `/products/${productId}/reviews/${reviewId}`
    );
    return response.data;
  },

  getProductReviews: async (productId) => {
    const response = await api.get(`/products/${productId}/reviews`);
    return response.data;
  },
};

export default reviewService;
