import React, { useState } from "react";
import { formatPrice } from "../../utils/formatters";
import "./CartItem.css";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const maxQuantity = item.product?.stock || 1;

  const handleQuantityChange = (newQty) => {
    if (newQty < 1) {
      onRemove(item.product._id);
    } else if (newQty <= maxQuantity) {
      setQuantity(newQty);
      onUpdateQuantity(item.product._id, newQty);
    }
  };

  const subtotal = formatPrice(item.price * item.quantity);

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        {item.product?.images?.[0] ? (
          <img src={item.product.images[0]} alt={item.product.name} />
        ) : (
          <div className="cart-placeholder">No Image</div>
        )}
      </div>

      <div className="cart-item-details">
        <h3 className="cart-item-name">{item.product?.name}</h3>
        <div className="cart-item-seller">
          Sold by: {item.product?.seller?.user?.name || "Unknown"}
        </div>

        <div className="cart-item-price-qty">
          <span className="cart-item-price">{formatPrice(item.price)}</span>
          <div className="cart-item-quantity">
            <button
              className="qty-btn"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="qty-value">{quantity}</span>
            <button
              className="qty-btn"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= maxQuantity}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="cart-item-subtotal">
        {subtotal}
        <button
          className="cart-remove-btn"
          onClick={() => onRemove(item.product._id)}
          title="Remove from cart"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default CartItem;
