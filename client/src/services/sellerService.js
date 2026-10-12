import api from "./api";

export const sellerService = {
  getDashboard: async () => {
    const response = await api.get("/seller/dashboard");
    return response.data;
  },

  getOrders: async () => {
    const response = await api.get("/seller/orders");
    return response.data;
  },

  approveSeller: async (sellerId) => {
    const response = await api.put(`/seller/${sellerId}/approve`);
    return response.data;
  },

  rejectSeller: async (sellerId) => {
    const response = await api.put(`/seller/${sellerId}/reject`);
    return response.data;
  },
};

export default sellerService;
