import React from "react";
import { Link } from "react-router-dom";
import sellerService from "../services/sellerService";
import { useApi } from "../hooks/useApi";
import DashboardCard from "../components/common/DashboardCard";
import OrderCard from "../components/order/OrderCard";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import { formatPrice } from "../utils/formatters";
import ProtectedRoute from "../components/common/ProtectedRoute";
import "./SellerDashboardPage.css";

const SellerDashboardContent = () => {
  const dashboardResult = useApi(() => sellerService.getDashboard(), true);

  if (dashboardResult.loading) {
    return <Loading text="Loading dashboard..." />;
  }

  if (dashboardResult.error) {
    return (
      <ErrorMessage
        message={dashboardResult.error?.response?.data?.message || "Failed to load dashboard"}
        onRetry={() => dashboardResult.execute()}
      />
    );
  }

  const data = dashboardResult.data?.data;

  if (!data) return null;

  const stats = [
    { title: "Total Products", value: data.totalProducts, icon: "📦", color: "primary" },
    { title: "Total Orders", value: data.totalOrders, icon: "🛒", color: "secondary" },
    { title: "Pending Orders", value: data.pendingOrders, icon: "⏳", color: "warning" },
    { title: "Low Stock", value: data.lowStockCount, icon: "⚠", color: "error" },
    { title: "Out of Stock", value: data.outOfStockProducts, icon: "🚫", color: "error" },
    { title: "Total Revenue", value: formatPrice(data.totalRevenue), icon: "💰", color: "success" },
  ];

  return (
    <div className="seller-dashboard">
      <h1 className="dashboard-title">Seller Dashboard</h1>

      <div className="stats-grid">
        {stats.map((stat) => (
          <DashboardCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      <div className="dashboard-section">
        <h2>Low Stock Alert</h2>
        {data.lowStockProducts && data.lowStockProducts.length > 0 ? (
          <div className="low-stock-grid">
            {data.lowStockProducts.map((product) => (
              <div key={product._id} className="low-stock-card">
                <div className="low-stock-image">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} />
                  ) : (
                    <div className="placeholder">No Image</div>
                  )}
                </div>
                <div className="low-stock-info">
                  <h3>{product.name}</h3>
                  <p>Stock: {product.stock} / Minimum: {product.minimumStock}</p>
                  <span className="low-stock-warning">
                    Low Stock - Reorder Required
                  </span>
                </div>
                <Link
                  to={`/seller/edit-product/${product._id}`}
                  className="btn btn-outline btn-sm"
                >
                  Restock
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-alerts">No low stock products. All good!</p>
        )}
      </div>

      <div className="dashboard-section">
        <h2>Recent Orders</h2>
        <div className="recent-orders">
          {data.recentOrders && data.recentOrders.length > 0 ? (
            data.recentOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                linkPrefix="/seller/orders"
              />
            ))
          ) : (
            <p className="no-orders">No recent orders.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const SellerDashboardPage = () => {
  return (
    <ProtectedRoute allowedRoles={["seller"]}>
      <SellerDashboardContent />
    </ProtectedRoute>
  );
};

export default SellerDashboardPage;
