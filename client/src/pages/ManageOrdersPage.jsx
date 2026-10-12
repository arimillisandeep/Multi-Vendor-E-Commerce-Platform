import React, { useState } from "react";
import { useApi } from "../hooks/useApi";
import adminService from "../services/adminService";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import StatusBadge from "../components/common/StatusBadge";
import { getOrderStatusLabel, getOrderStatusColor } from "../utils/formatters";
import ProtectedRoute from "../components/common/ProtectedRoute";
import "./ManageOrdersPage.css";

const ManageOrdersContent = () => {
  const ordersResult = useApi(() => adminService.getAllOrders(), true);

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

  return (
    <div className="manage-orders-page">
      <div className="page-header">
        <h1>Manage Orders</h1>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>#{order._id?.slice(-8)}</td>
                <td>{order.customer?.name || "N/A"}</td>
                <td>${order.totalAmount}</td>
                <td>{order.paymentMethod === "cod" ? "COD" : "Card (Demo)"}</td>
                <td>
                  <StatusBadge
                    status={getOrderStatusLabel(order.orderStatus)}
                    color={getOrderStatusColor(order.orderStatus)}
                  />
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <a
                    href={`/orders/${order._id}`}
                    className="btn btn-outline btn-sm"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <p className="no-data">No orders found.</p>
        )}
      </div>
    </div>
  );
};

const ManageOrdersPage = () => {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <ManageOrdersContent />
    </ProtectedRoute>
  );
};

export default ManageOrdersPage;