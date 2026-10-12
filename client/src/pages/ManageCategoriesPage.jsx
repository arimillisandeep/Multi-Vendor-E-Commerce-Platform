import React, { useState } from "react";
import { useApi } from "../hooks/useApi";
import adminService from "../services/adminService";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import ProtectedRoute from "../components/common/ProtectedRoute";
import "./ManageCategoriesPage.css";

const ManageCategoriesContent = () => {
  const categoriesResult = useApi(() => adminService.getAllCategories(), true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCategories = () => {
    categoriesResult.execute();
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description || "" });
    setError("");
    setSuccess("");
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }
    try {
      await adminService.deleteCategory(categoryId);
      setSuccess("Category deleted successfully");
      loadCategories();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete category");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editingCategory) {
        await adminService.updateCategory(editingCategory._id, formData.name, formData.description);
        setSuccess("Category updated successfully");
      } else {
        await adminService.createCategory(formData.name, formData.description);
        setSuccess("Category created successfully");
      }
      setFormData({ name: "", description: "" });
      setEditingCategory(null);
      loadCategories();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save category");
    }
  };

  if (categoriesResult.loading) {
    return <Loading text="Loading categories..." />;
  }

  if (categoriesResult.error) {
    return (
      <ErrorMessage
        message={categoriesResult.error?.response?.data?.message || "Failed to load categories"}
        onRetry={loadCategories}
      />
    );
  }

  const categories = categoriesResult.data?.data?.categories || [];

  return (
    <div className="manage-categories-page">
      <div className="page-header">
        <h1>Manage Categories</h1>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="category-form-container">
        <h2>{editingCategory ? "Edit Category" : "Add New Category"}</h2>
        <form onSubmit={handleSubmit} className="category-form">
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="3"
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {editingCategory ? "Update Category" : "Create Category"}
          </button>
          {editingCategory && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setEditingCategory(null);
                setFormData({ name: "", description: "" });
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="categories-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category.description || "N/A"}</td>
                <td>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleEdit(category)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => handleDelete(category._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && <p className="no-data">No categories found.</p>}
      </div>
    </div>
  );
};

const ManageCategoriesPage = () => {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <ManageCategoriesContent />
    </ProtectedRoute>
  );
};

export default ManageCategoriesPage;