import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import productService from "../services/productService";
import categoryService from "../services/categoryService";
import Loading from "../components/common/Loading";
import ProtectedRoute from "../components/common/ProtectedRoute";
import "./AddProductPage.css";

const AddProductContent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const categoriesResult = useApi(() => categoryService.getAllCategories(), true);
  const productResult = useApi(
    () => (isEdit ? productService.getById(id) : null),
    isEdit
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    minimumStock: "5",
    images: [""],
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit && productResult.data?.data?.product) {
      const product = productResult.data.data.product;
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category?._id || product.category,
        stock: product.stock,
        minimumStock: product.minimumStock,
        images: product.images && product.images.length > 0 ? product.images : [""],
      });
    }
  }, [productResult.data, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const removeImageField = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const processedData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      minimumStock: Number(formData.minimumStock),
      images: formData.images.filter((img) => img.trim() !== ""),
    };

    if (processedData.images.length === 0) {
      setError("At least one product image URL is required");
      return;
    }

    try {
      if (isEdit) {
        await productService.update(id, processedData);
      } else {
        await productService.create(processedData);
      }
      navigate("/seller/products");
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to save product"
      );
    }
  };

  if ((isEdit && productResult.loading) || categoriesResult.loading) {
    return <Loading text="Loading..." />;
  }

  const categories = categoriesResult.data?.data?.categories || [];

  return (
    <div className="add-product-page">
      <div className="page-header">
        <h1>{isEdit ? "Edit Product" : "Add New Product"}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-row">
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Price ($) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="form-control"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="form-control"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="form-control"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Stock *</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Minimum Stock *</label>
            <input
              type="number"
              name="minimumStock"
              value={formData.minimumStock}
              onChange={handleChange}
              required
              min="0"
              className="form-control"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Product Images (URLs) *</label>
          {formData.images.map((img, index) => (
            <div key={index} className="image-input-row">
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={img}
                onChange={(e) => handleImageChange(index, e.target.value)}
                className="form-control"
                required={index === 0}
              />
              {formData.images.length > 1 && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => removeImageField(index)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={addImageField}
          >
            Add Another Image
          </button>
        </div>

        <button type="submit" className="btn btn-primary btn-submit">
          {isEdit ? "Update Product" : "Create Product"}
        </button>
      </form>
    </div>
  );
};

const AddProductPage = () => {
  return (
    <ProtectedRoute allowedRoles={["seller", "admin"]}>
      <AddProductContent />
    </ProtectedRoute>
  );
};

export default AddProductPage;
