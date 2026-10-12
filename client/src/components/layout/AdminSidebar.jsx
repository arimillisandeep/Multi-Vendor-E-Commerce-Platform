import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { name: "Users", path: "/admin/users", icon: "👥" },
    { name: "Sellers", path: "/admin/sellers", icon: "🏪" },
    { name: "Products", path: "/admin/products", icon: "📦" },
    { name: "Categories", path: "/admin/categories", icon: "🏷️" },
    { name: "Orders", path: "/admin/orders", icon: "🛒" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
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

export default AdminSidebar;
