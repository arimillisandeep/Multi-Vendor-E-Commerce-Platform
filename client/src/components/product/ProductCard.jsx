import React from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatters";
import { getStockStatus } from "../../utils/formatters";
import StatusBadge from "../common/StatusBadge";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const stockStatus = getStockStatus(product.stock, product.minimumStock);
  const firstImage =
    product.images && product.images.length > 0 ? product.images[0] : null;
  const sellerName =
    product.seller?.user?.name ||
    product.seller?.storeName ||
    "Unknown Seller";

  return (
    <div className="product-card">
      <div className="product-card-image">
        {firstImage ? (
          <img src={firstImage} alt={product.name} loading="lazy" />
        ) : (
          <div className="product-placeholder">No Image</div>
        )}
      </div>

      <div className="product-card-body">
        <h3 className="product-name">
          <Link to={`/products/${product._id}`}>{product.name}</Link>
        </h3>

        <div className="product-price">
          {formatPrice(product.price)}
        </div>

        <div className="product-meta">
          <span className="product-seller">Sold by: {sellerName}</span>
          <div className="product-rating">
            ⭐ {product.rating ? product.rating.toFixed(1) : "0.0"} (
            {product.numReviews || 0})
          </div>
        </div>

        <div className="product-stock">
          <StatusBadge status={stockStatus.label} color={stockStatus.color} />
          {product.outOfStock && (
            <span className="stock-badge out-of-stock">Out of Stock</span>
          )}
          {product.lowStock && !product.outOfStock && (
            <span className="stock-badge low-stock">Low Stock</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
