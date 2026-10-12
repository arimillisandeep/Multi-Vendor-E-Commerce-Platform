import React from "react";
import { Link } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import sellerService from "../services/sellerService";
import orderService from "../services/orderService";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";
import StatusBadge from "../components/common/StatusBadge";
import { getOrderStatusLabel, getOrderStatusColor } from "../utils/formatters";
import ProtectedRoute from "../components/common/ProtectedRoute";
import "./SellerOrdersPage.css";

const SellerOrdersContent = () => {
  const ordersResult = useApi(() => sellerService.getOrders(), true);

  if (ordersResult.loading) {
    return <Loading text="Loading orders..." />;
  }

  if (ordersResult.error) {
    return (
      <ErrorMessage
        message={ordersResult.error?.response?.data?.message || "Failed to load orders"}
        onRetry={() => ordersResult.execute()}
      />
    );
  }

  const orders = ordersResult.data?.data?.orders || [];

  if (orders.length === 0) {
    return <EmptyState message="No orders yet" icon="📦" />;
  }

  const handleStatusChange = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      ordersResult.execute();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update order status");
    }
  };

  return (
    <div className="seller-orders-page">
      <div className="page-header">
        <h1>Customer Orders</h1>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>#{order._id?.slice(-8)}</td>
                <td>{order.customer?.name || "N/A"}</td>
                <td>${order.totalAmount}</td>
                <td>
                  <StatusBadge
                    status={getOrderStatusLabel(order.orderStatus)}
                    color={getOrderStatusColor(order.orderStatus)}
                  />
                </td>
                <td>{order.items?.length || 0} items</td>
                <td>
                  <select
                    className="status-select"
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Update
                    </option>
                    <option value="confirmed">Confirm</option>
                    <option value="packed">Pack</option>
                    <option value="shipped">Ship</option>
                    <option value="delivered">Deliver</option>
                    <option value="cancelled">Cancel</option>
                  </select>
                  <Link
                    to={`/orders/${order._id}`}
                    className="btn btn-outline btn-sm"
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SellerOrdersPage = () => {
  return (
    <ProtectedRoute allowedRoles={["seller"]}>
      <SellerOrdersContent />
    </ProtectedRoute>
  );
};

export default SellerOrdersPage;
