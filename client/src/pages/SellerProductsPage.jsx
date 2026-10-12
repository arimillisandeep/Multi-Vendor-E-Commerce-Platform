import React, { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import productService from "../services/productService";
import categoryService from "../services/categoryService";
import ProductCard from "../components/product/ProductCard";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import ProtectedRoute from "../components/common/ProtectedRoute";
import "./SellerProductsPage.css";

const SellerProductsContent = () => {
  const productsResult = useApi(
    () => productService.getSellerProducts(),
    true
  );

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});

  useEffect(() => {
    if (productsResult.data?.data?.products) {
      setProducts(productsResult.data.data.products);
    }
  }, [productsResult.data]);

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    try {
      await productService.delete(productId);
      setProducts(products.filter((p) => p._id !== productId));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete product");
    }
  };

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

  return (
    <div className="products-list-page">
      <div className="page-header">
        <h1>My Products</h1>
      </div>

      {products.length === 0 ? (
        <div className="empty-products">
          <p>You haven't added any products yet.</p>
        </div>
      ) : (
        <div className="products-grid-seller">
          {products.map((product) => (
            <div key={product._id} className="product-item-seller">
              <ProductCard product={product} />
              <div className="product-actions-seller">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() =>
                    (window.location.href = `/seller/edit-product/${product._id}`)
                  }
                >
                  Edit
                </button>
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SellerProductsPage = () => {
  return (
    <ProtectedRoute allowedRoles={["seller"]}>
      <SellerProductsContent />
    </ProtectedRoute>
  );
};

export default SellerProductsPage;
