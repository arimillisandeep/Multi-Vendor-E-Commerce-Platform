import React from "react";
import AdminSidebar from "../components/layout/AdminSidebar";
import "./DashboardLayout.css";

const AdminLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <div className="dashboard-header-container">
          <h1 className="dashboard-logo">MultiVendor</h1>
          <span className="dashboard-role">Admin Panel</span>
        </div>
      </header>
      <div className="dashboard-body">
        <AdminSidebar />
        <main className="dashboard-main">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
