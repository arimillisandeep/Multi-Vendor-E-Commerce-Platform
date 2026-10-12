import React from "react";
import "./StatusBadge.css";

const StatusBadge = ({ status, color }) => {
  return (
    <span className={`status-badge status-${color || status}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
