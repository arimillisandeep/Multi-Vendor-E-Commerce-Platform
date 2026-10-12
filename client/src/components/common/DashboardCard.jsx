import React from "react";
import "./DashboardCard.css";

const DashboardCard = ({ title, value, icon, trend, color = "primary" }) => {
  return (
    <div className={`dashboard-card dashboard-card-${color}`}>
      <div className="dashboard-card-body">
        <div className="dashboard-card-info">
          <h3 className="dashboard-card-title">{title}</h3>
          <p className="dashboard-card-value">{value}</p>
          {trend && (
            <span className="dashboard-card-trend">{trend}</span>
          )}
        </div>
        {icon && <div className="dashboard-card-icon">{icon}</div>}
      </div>
    </div>
  );
};

export default DashboardCard;
