import React from "react";
import { useApi } from "../hooks/useApi";
import orderService from "../services/orderService";
import OrderCard from "../components/order/OrderCard";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";
import ProtectedRoute from "../components/common/ProtectedRoute";
import "./OrdersPage.css";

const OrdersContent = () => {
  const ordersResult = useApi(() => orderService.getOrders(), true);

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
    return (
      <EmptyState
        message="You haven't placed any orders yet"
        icon="📦"
      />
    );
  }

  return (
    <div className="orders-page">
      <h1 className="page-title">My Orders</h1>
      <div className="orders-list">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
};

const OrdersPage = () => {
  return (
    <ProtectedRoute allowedRoles={["customer"]}>
      <OrdersContent />
    </ProtectedRoute>
  );
};

export default OrdersPage;
