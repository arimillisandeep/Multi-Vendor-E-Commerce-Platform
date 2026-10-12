import React from "react";
import SellerSidebar from "../components/layout/SellerSidebar";
import "./DashboardLayout.css";

const SellerLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <div className="dashboard-header-container">
          <h1 className="dashboard-logo">MultiVendor</h1>
          <span className="dashboard-role">Seller Panel</span>
        </div>
      </header>
      <div className="dashboard-body">
        <SellerSidebar />
        <main className="dashboard-main">{children}</main>
      </div>
    </div>
  );
};

export default SellerLayout;
