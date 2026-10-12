import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/formatters";
import ProtectedRoute from "../components/common/ProtectedRoute";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <ProtectedRoute allowedRoles={["customer"]}>
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-sidebar">
            <div className="profile-avatar">
              {user.name?.charAt(0) || "U"}
            </div>
            <h2>{user.name}</h2>
            <p className="profile-email">{user.email}</p>
            <div className="profile-role-badge">{user.role}</div>

            <nav className="profile-nav">
              <Link to="/profile" className="profile-nav-link active">
                My Profile
              </Link>
              <Link to="/orders" className="profile-nav-link">
                My Orders
              </Link>
              <Link to="/wishlist" className="profile-nav-link">
                Wishlist
              </Link>
              <button className="profile-nav-link logout-link" onClick={logout}>
                Logout
              </button>
            </nav>
          </div>

          <div className="profile-content">
            <h2>Profile Information</h2>
            <div className="profile-info-grid">
              <div className="info-row">
                <label>Full Name</label>
                <span>{user.name}</span>
              </div>
              <div className="info-row">
                <label>Email</label>
                <span>{user.email}</span>
              </div>
              <div className="info-row">
                <label>Role</label>
                <span className={`role-badge role-${user.role}`}>
                  {user.role}
                </span>
              </div>
              <div className="info-row">
                <label>Account Status</label>
                <span>{user.isActive ? "Active" : "Inactive"}</span>
              </div>
              <div className="info-row">
                <label>Member Since</label>
                <span>{formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
