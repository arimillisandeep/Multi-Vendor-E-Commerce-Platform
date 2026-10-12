import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import productService from "../services/productService";
import { useApi } from "../hooks/useApi";
import reviewService from "../services/reviewService";
import cartService from "../services/cartService";
import wishlistService from "../services/wishlistService";
import { formatPrice, getStockStatus } from "../utils/formatters";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import StatusBadge from "../components/common/StatusBadge";
import { useAuth } from "../context/AuthContext";
import "./ProductDetailsPage.css";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const productResult = useApi(
    () => productService.getById(id),
    true
  );

  const reviewsResult = useApi(
    () => reviewService.getProductReviews(id),
    true
  );

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [purchaseCheck, setPurchaseCheck] = useState(false);

  const product = productResult.data?.data?.product;
  const reviews = reviewsResult.data?.data?.reviews || [];

  const stockStatus = product
    ? getStockStatus(product.stock, product.minimumStock)
    : null;

  const isInStock = product?.stock > 0;

  useEffect(() => {
    if (product && isAuthenticated) {
      checkPurchase();
    }
  }, [product, isAuthenticated]);

  const checkPurchase = async () => {
    try {
      const response = await reviewService.getProductReviews(id);
    } catch (error) {
      // Silent fail - just means they haven't purchased
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!isInStock) return;

    try {
      await cartService.addToCart(product._id, quantity);
      navigate("/cart");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!isInStock) return;

    try {
      await cartService.addToCart(product._id, quantity);
      navigate("/checkout");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      await wishlistService.addToWishlist(product._id);
      alert("Added to wishlist!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add to wishlist");
    }
  };

  if (productResult.loading) {
    return <Loading text="Loading product..." />;
  }

  if (productResult.error) {
    return (
      <ErrorMessage
        message={productResult.error?.response?.data?.message || "Product not found"}
        onRetry={() => productResult.execute()}
      />
    );
  }

  if (!product) return null;

  return (
    <div className="product-details-page">
      <div className="product-details-container">
        <div className="product-images">
          {product.images && product.images.length > 0 && (
            <>
              <div className="product-image-main">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                />
              </div>
              {product.images.length > 1 && (
                <div className="product-image-thumbnails">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`thumbnail ${
                        selectedImage === index ? "active" : ""
                      }`}
                    >
                      <img src={image} alt={`${product.name} ${index + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>

          <div className="product-rating-summary">
            ⭐ {product.rating ? product.rating.toFixed(1) : "0.0"}{" "}
            ({product.numReviews || 0} reviews)
          </div>

          <div className="product-price">{formatPrice(product.price)}</div>

          <div className="product-stock-status">
            <StatusBadge status={stockStatus?.label} color={stockStatus?.color} />
            <span className="stock-info">
              Stock: {product.stock} | Minimum: {product.minimumStock}
            </span>
          </div>

          <p className="product-description">{product.description}</p>

          <p className="product-seller-name">
            Sold by: {product.seller?.user?.name || product.seller?.storeName || "Unknown Seller"}
          </p>

          {isInStock && (
            <div className="product-actions">
              <div className="quantity-selector">
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  min="1"
                  max={product.stock}
                  onChange={(e) =>
                    setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))
                  }
                />
                <button
                  className="qty-btn"
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>

              <button className="btn btn-primary" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button className="btn btn-outline" onClick={handleBuyNow}>
                Buy Now
              </button>
              <button className="btn btn-outline" onClick={handleAddToWishlist}>
                Add to Wishlist
              </button>
            </div>
          )}

          {!isInStock && (
            <button className="btn btn-secondary" disabled>
              Out of Stock
            </button>
          )}
        </div>
      </div>

      <div className="product-reviews-section">
        <h2>Customer Reviews ({reviews.length})</h2>

        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review._id} className="review-item">
                <div className="review-header">
                  <span className="reviewer-name">
                    {review.customer?.name || "Anonymous"}
                  </span>
                  <span className="review-rating">
                    ⭐ {review.rating}/5
                  </span>
                </div>
                <p className="review-comment">{review.comment}</p>
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
