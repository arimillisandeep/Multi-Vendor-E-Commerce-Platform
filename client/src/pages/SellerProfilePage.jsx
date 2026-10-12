import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/formatters";
import "./SellerProfilePage.css";

const SellerProfilePage = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="seller-profile-page">
      <div className="profile-header">
        <h1>Seller Profile</h1>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          {user.name?.charAt(0) || "U"}
        </div>
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p className="profile-email">{user.email}</p>
          <p className="profile-role">Role: {user.role}</p>
          <p className="profile-date">
            Member since: {formatDate(user.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerProfilePage;