import React from "react";
import { useParams } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import orderService from "../services/orderService";
import { formatPrice, formatDate, getOrderStatusLabel, getOrderStatusColor } from "../utils/formatters";
import StatusBadge from "../components/common/StatusBadge";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import ProtectedRoute from "../components/common/ProtectedRoute";
import "./OrderDetailsPage.css";

const OrderDetailsContent = () => {
  const { id } = useParams();
  const orderResult = useApi(() => orderService.getOrderById(id), true);

  if (orderResult.loading) {
    return <Loading text="Loading order..." />;
  }

  if (orderResult.error) {
    return (
      <ErrorMessage
        message={orderResult.error?.response?.data?.message || "Failed to load order"}
        onRetry={() => orderResult.execute()}
      />
    );
  }

  const order = orderResult.data?.data?.order;

  if (!order) return null;

  return (
    <div className="order-details-page">
      <div className="order-details-container">
        <div className="order-header">
          <h1>Order Details</h1>
          <div className="order-header-meta">
            <p>
              <span>Order ID:</span> {order._id}
            </p>
            <p>
              <span>Date:</span> {formatDate(order.createdAt)}
            </p>
            <StatusBadge
              status={getOrderStatusLabel(order.orderStatus)}
              color={getOrderStatusColor(order.orderStatus)}
            />
          </div>
        </div>

        <div className="order-section">
          <h2>Shipping Address</h2>
          <div className="address-block">
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
            <p>Phone: {order.shippingAddress.phone}</p>
          </div>
        </div>

        <div className="order-section">
          <h2>Payment</h2>
          <p>
            <span>Method:</span>{" "}
            {order.paymentMethod === "cod" ? "Cash on Delivery" : "Credit Card (Demo)"}
          </p>
          <p>
            <span>Status:</span>{" "}
            <StatusBadge
              status={order.paymentStatus}
              color={order.paymentStatus === "paid" ? "success" : "warning"}
            />
          </p>
        </div>

        <div className="order-section">
          <h2>Order Items</h2>
          <div className="order-items-list">
            {order.items.map((item, index) => (
              <div key={index} className="order-item-row">
                <div className="order-item-info">
                  {item.product?.images?.[0] && (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="order-item-image"
                    />
                  )}
                  <div>
                    <p className="order-item-name">{item.product?.name}</p>
                    <p className="order-item-seller">
                      Sold by: {item.seller?.user?.name || "Unknown"}
                    </p>
                  </div>
                </div>
                <div className="order-item-price-qty">
                  <span>{formatPrice(item.price)}</span>
                  <span>x {item.quantity}</span>
                  <span className="order-item-total">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-total-section">
          <div className="total-row">
            <span>Subtotal</span>
            <span>{formatPrice(order.totalAmount - 5.99)}</span>
          </div>
          <div className="total-row">
            <span>Delivery Fee</span>
            <span>{formatPrice(5.99)}</span>
          </div>
          <div className="total-row grand-total">
            <span>Total</span>
            <span>{formatPrice(order.totalAmount)}</span>
          </div>
        </div>

        {order.orderStatus === "placed" && (
          <button
            className="btn btn-outline"
            onClick={async () => {
              try {
                await orderService.updateOrderStatus(id, "cancelled");
                orderResult.execute();
              } catch (error) {
                alert(error.response?.data?.message || "Failed to cancel order");
              }
            }}
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
};

const OrderDetailsPage = () => {
  return (
    <ProtectedRoute allowedRoles={["customer", "seller", "admin"]}>
      <OrderDetailsContent />
    </ProtectedRoute>
  );
};

export default OrderDetailsPage;
