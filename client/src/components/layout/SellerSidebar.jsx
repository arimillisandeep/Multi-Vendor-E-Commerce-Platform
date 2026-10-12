import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const SellerSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/seller/dashboard", icon: "📊" },
    { name: "My Products", path: "/seller/products", icon: "📦" },
    { name: "Add Product", path: "/seller/add-product", icon: "➕" },
    { name: "Orders", path: "/seller/orders", icon: "🛒" },
    { name: "Inventory", path: "/seller/inventory", icon: "📋" },
    { name: "Profile", path: "/seller/profile", icon: "👤" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Seller Panel</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${
              location.pathname === item.path ? "sidebar-link-active" : ""
            }`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default SellerSidebar;
