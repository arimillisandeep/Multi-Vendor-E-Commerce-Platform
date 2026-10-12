import React from "react";
import { Link } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import wishlistService from "../services/wishlistService";
import ProductCard from "../components/product/ProductCard";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";
import ProtectedRoute from "../components/common/ProtectedRoute";
import "./WishlistPage.css";

const WishlistContent = () => {
  const wishlistResult = useApi(() => wishlistService.getWishlist(), true);

  if (wishlistResult.loading) {
    return <Loading text="Loading wishlist..." />;
  }

  if (wishlistResult.error) {
    return (
      <ErrorMessage
        message={wishlistResult.error?.response?.data?.message || "Failed to load wishlist"}
        onRetry={() => wishlistResult.execute()}
      />
    );
  }

  const products = wishlistResult.data?.data?.wishlist?.products || [];

  if (products.length === 0) {
    return (
      <div className="wishlist-empty">
        <EmptyState message="Your wishlist is empty" icon="💝" />
        <Link to="/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h1 className="page-title">My Wishlist</h1>
      <div className="wishlist-grid">
        {products.map((product) => (
          <div key={product._id} className="wishlist-item">
            <ProductCard product={product} />
            <button
              className="btn btn-outline btn-remove-wishlist"
              onClick={async () => {
                try {
                  await wishlistService.removeFromWishlist(product._id);
                  wishlistResult.execute();
                } catch (error) {
                  alert("Failed to remove from wishlist");
                }
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const WishlistPage = () => {
  return (
    <ProtectedRoute allowedRoles={["customer"]}>
      <WishlistContent />
    </ProtectedRoute>
  );
};

export default WishlistPage;
