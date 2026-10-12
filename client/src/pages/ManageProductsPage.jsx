import React, { useState } from "react";
import { useApi } from "../hooks/useApi";
import adminService from "../services/adminService";
import productService from "../services/productService";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import StatusBadge from "../components/common/StatusBadge";
import { getStockStatus } from "../utils/formatters";
import ProtectedRoute from "../components/common/ProtectedRoute";
import "./ManageProductsPage.css";

const ManageProductsContent = () => {
  const productsResult = useApi(() => adminService.getAllProducts(), true);

  if (productsResult.loading) {
    return <Loading text="Loading products..." />;
  }

  if (productsResult.error) {
    return (
      <ErrorMessage
        message={productsResult.error?.response?.data?.message || "Failed to load products"}
        onRetry={() => productsResult.execute()}
      />
    );
  }

  const products = productsResult.data?.data?.products || [];

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    try {
      await productService.delete(productId);
      productsResult.execute();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div className="manage-products-page">
      <div className="page-header">
        <h1>Manage Products</h1>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Seller</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const stockStatus = getStockStatus(product.stock, product.minimumStock);
              return (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.seller?.user?.name || "N/A"}</td>
                  <td>{product.category?.name || "N/A"}</td>
                  <td>${product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    <StatusBadge status={stockStatus.label} color={stockStatus.color} />
                  </td>
                  <td>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {products.length === 0 && (
          <p className="no-data">No products found.</p>
        )}
      </div>
    </div>
  );
};

const ManageProductsPage = () => {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <ManageProductsContent />
    </ProtectedRoute>
  );
};

export default ManageProductsPage;