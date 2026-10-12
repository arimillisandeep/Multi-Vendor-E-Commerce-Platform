import React from "react";
import ProductCard from "./ProductCard";
import EmptyState from "../common/EmptyState";
import "./ProductGrid.css";

const ProductGrid = ({ products, loading, error, onRetry }) => {
  if (loading) {
    return (
      <div className="product-grid">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="product-skeleton">
            <div className="skeleton-image"></div>
            <div className="skeleton-body">
              <div className="skeleton-line"></div>
              <div className="skeleton-line-short"></div>
              <div className="skeleton-line"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-grid">
        <EmptyState message={error} icon="⚠" />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="product-grid">
        <EmptyState message="No products found" icon="📭" />
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
