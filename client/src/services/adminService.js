import api from "./api";

export const adminService = {
  getDashboard: async () => {
    const response = await api.get("/admin/dashboard");
    return response.data;
  },

  getUsers: async () => {
    const response = await api.get("/admin/users");
    return response.data;
  },

  getSellers: async () => {
    const response = await api.get("/admin/sellers");
    return response.data;
  },

  updateUserStatus: async (userId, isActive) => {
    const response = await api.put(`/admin/users/${userId}/status`, {
      isActive,
    });
    return response.data;
  },

  getAllProducts: async () => {
    const response = await api.get("/admin/products");
    return response.data;
  },

  getAllOrders: async () => {
    const response = await api.get("/admin/orders");
    return response.data;
  },

  createCategory: async (name, description) => {
    const response = await api.post("/admin/categories", { name, description });
    return response.data;
  },

  updateCategory: async (id, name, description) => {
    const response = await api.put(`/admin/categories/${id}`, {
      name,
      description,
    });
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  },
};

export default adminService;
