import React from "react";
import { useApi } from "../hooks/useApi";
import productService from "../services/productService";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";
import StatusBadge from "../components/common/StatusBadge";
import { getStockStatus } from "../utils/formatters";
import ProtectedRoute from "../components/common/ProtectedRoute";
import "./SellerInventoryPage.css";

const SellerInventoryContent = () => {
  const productsResult = useApi(
    () => productService.getSellerProducts(),
    true
  );

  if (productsResult.loading) {
    return <Loading text="Loading inventory..." />;
  }

  if (productsResult.error) {
    return (
      <ErrorMessage
        message={productsResult.error?.response?.data?.message || "Failed to load inventory"}
        onRetry={() => productsResult.execute()}
      />
    );
  }

  const products = productsResult.data?.data?.products || [];

  const lowStockProducts = products.filter(
    (p) => p.stock <= p.minimumStock
  );
  const outOfStockProducts = products.filter((p) => p.stock === 0);
  const inStockProducts = products.filter(
    (p) => p.stock > p.minimumStock
  );

  return (
    <div className="seller-inventory-page">
      <div className="page-header">
        <h1>Inventory Management</h1>
      </div>

      <div className="inventory-summary">
        <div className="inventory-stat">
          <span className="stat-value">{products.length}</span>
          <span className="stat-label">Total Products</span>
        </div>
        <div className="inventory-stat warning">
          <span className="stat-value">{lowStockProducts.length}</span>
          <span className="stat-label">Low Stock</span>
        </div>
        <div className="inventory-stat error">
          <span className="stat-value">{outOfStockProducts.length}</span>
          <span className="stat-label">Out of Stock</span>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="inventory-section">
          <h2>⚠ Low Stock Products</h2>
          <div className="inventory-table">
            <div className="inventory-table-header">
              <span>Product</span>
              <span>Stock</span>
              <span>Minimum</span>
              <span>Status</span>
            </div>
            {lowStockProducts.map((product) => {
              const status = getStockStatus(product.stock, product.minimumStock);
              return (
                <div key={product._id} className="inventory-table-row">
                  <span className="product-name">{product.name}</span>
                  <span>{product.stock}</span>
                  <span>{product.minimumStock}</span>
                  <StatusBadge status={status.label} color={status.color} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {outOfStockProducts.length > 0 && (
        <div className="inventory-section">
          <h2>🚫 Out of Stock Products</h2>
          <div className="inventory-table">
            <div className="inventory-table-header">
              <span>Product</span>
              <span>Stock</span>
              <span>Minimum</span>
              <span>Status</span>
            </div>
            {outOfStockProducts.map((product) => (
              <div key={product._id} className="inventory-table-row">
                <span className="product-name">{product.name}</span>
                <span>{product.stock}</span>
                <span>{product.minimumStock}</span>
                <StatusBadge status="Out of Stock" color="error" />
              </div>
            ))}
          </div>
        </div>
      )}

      {products.length === 0 && (
        <EmptyState message="No products in inventory" icon="📦" />
      )}
    </div>
  );
};

const SellerInventoryPage = () => {
  return (
    <ProtectedRoute allowedRoles={["seller"]}>
      <SellerInventoryContent />
    </ProtectedRoute>
  );
};

export default SellerInventoryPage;