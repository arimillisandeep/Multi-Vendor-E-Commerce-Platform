import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import cartService from "../services/cartService";
import orderService from "../services/orderService";
import { useApi } from "../hooks/useApi";
import { formatPrice } from "../utils/formatters";
import ProtectedRoute from "../components/common/ProtectedRoute";
import "./CheckoutPage.css";

const CheckoutContent = () => {
  const navigate = useNavigate();
  const cartResult = useApi(() => cartService.getCart(), true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const cart = cartResult.data?.data?.cart;
  const items = cart?.items || [];

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = 5.99;
  const total = subtotal + deliveryFee;

  const handleInputChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const requiredFields = ["fullName", "address", "city", "postalCode", "country", "phone"];
    const emptyFields = requiredFields.filter((f) => !shippingAddress[f]);
    if (emptyFields.length > 0) {
      setError(`Please fill in all fields: ${emptyFields.join(", ")}`);
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);

    try {
      const orderItems = items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        seller: item.product.seller?._id,
      }));

      const response = await orderService.createOrder({
        items: orderItems,
        totalAmount: total,
        shippingAddress,
        paymentMethod,
      });

      navigate(`/orders/${response.data.order._id}`);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (cartResult.loading) {
    return <div className="checkout-loading">Loading...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/products")}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-form">
          <h2>Checkout</h2>

          {error && <div className="checkout-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <h3>Shipping Address</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group full-width">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                />
              </div>
            </div>

            <h3>Payment Method</h3>
            <div className="payment-options">
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Cash on Delivery</span>
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>
                  Credit/Debit Card{" "}
                  <span className="demo-badge">(Demo)</span>
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-place-order"
              disabled={loading}
            >
              {loading ? "Placing order..." : `Place Order (${formatPrice(total)})`}
            </button>
          </form>
        </div>

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {items.map((item) => (
            <div key={item.product._id} className="summary-item">
              <span>
                {item.product.name} x {item.quantity}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
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
        </div>
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  return (
    <ProtectedRoute allowedRoles={["customer"]}>
      <CheckoutContent />
    </ProtectedRoute>
  );
};

export default CheckoutPage;
