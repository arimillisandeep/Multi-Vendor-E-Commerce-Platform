import React from "react";
import { Link, useNavigate } from "react-router-dom";
import cartService from "../services/cartService";
import { useApi } from "../hooks/useApi";
import CartItem from "../components/cart/CartItem";
import { formatPrice } from "../utils/formatters";
import ProtectedRoute from "../components/common/ProtectedRoute";
import "./CartPage.css";

const CartPageContent = () => {
  const navigate = useNavigate();
  const cartResult = useApi(() => cartService.getCart(), true);

  const cart = cartResult.data?.data?.cart;
  const items = cart?.items || [];

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + deliveryFee;

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      await cartService.updateQuantity(productId, quantity);
      cartResult.execute();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update quantity");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await cartService.removeFromCart(productId);
      cartResult.execute();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to remove item");
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (cartResult.loading) {
    return <div className="cart-loading">Loading cart...</div>;
  }

  if (cartResult.error) {
    return (
      <div className="cart-error">
        Error: {cartResult.error?.response?.data?.message || "Failed to load cart"}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <Link to="/products" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-items">
          <h2 className="cart-title">Shopping Cart</h2>
          {items.map((item) => (
            <CartItem
              key={item.product._id}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemove}
            />
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>{formatPrice(deliveryFee)}</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <button className="btn btn-primary btn-checkout" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

const CartPage = () => {
  return (
    <ProtectedRoute allowedRoles={["customer"]}>
      <CartPageContent />
    </ProtectedRoute>
  );
};

export default CartPage;
