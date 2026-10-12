import React from "react";
import { useApi } from "../hooks/useApi";
import adminService from "../services/adminService";
import DashboardCard from "../components/common/DashboardCard";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import { formatPrice } from "../utils/formatters";
import ProtectedRoute from "../components/common/ProtectedRoute";
import "./AdminDashboardPage.css";

const AdminDashboardContent = () => {
  const dashboardResult = useApi(() => adminService.getDashboard(), true);

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
    { title: "Total Customers", value: data.totalUsers, icon: "👥", color: "primary" },
    { title: "Total Sellers", value: data.totalSellers, icon: "🏪", color: "secondary" },
    { title: "Pending Seller Approvals", value: data.pendingSellers, icon: "⏳", color: "warning" },
    { title: "Total Products", value: data.totalProducts, icon: "📦", color: "success" },
    { title: "Total Orders", value: data.totalOrders, icon: "📋", color: "info" },
    { title: "Total Categories", value: data.totalCategories, icon: "🏷️", color: "secondary" },
    { title: "Total Revenue", value: formatPrice(data.totalRevenue), icon: "💰", color: "success" },
  ];

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Admin Dashboard</h1>

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
    </div>
  );
};

const AdminDashboardPage = () => {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
};

export default AdminDashboardPage;