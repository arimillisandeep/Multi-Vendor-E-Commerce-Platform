import api from "./api";

export const categoryService = {
  getAll: async () => {
    const response = await api.get("/categories");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  create: async (name, description) => {
    const response = await api.post("/admin/categories", { name, description });
    return response.data;
  },

  update: async (id, name, description) => {
    const response = await api.put(`/admin/categories/${id}`, {
      name,
      description,
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  },
};

export default categoryService;
