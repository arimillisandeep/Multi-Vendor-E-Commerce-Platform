import React from "react";
import { Link } from "react-router-dom";
import { formatPrice, formatDate, getOrderStatusLabel, getOrderStatusColor } from "../../utils/formatters";
import StatusBadge from "../common/StatusBadge";
import "./OrderCard.css";

const OrderCard = ({ order, linkPrefix = "/orders" }) => {
  const itemCount = order.items?.length || 0;
  const firstItem = order.items?.[0];
  const statusLabel = getOrderStatusLabel(order.orderStatus);
  const statusColor = getOrderStatusColor(order.orderStatus);

  return (
    <div className="order-card">
      <div className="order-card-header">
        <div className="order-info">
          <h3 className="order-id">Order #{order._id?.slice(-8)}</h3>
          <p className="order-date">{formatDate(order.createdAt)}</p>
        </div>
        <StatusBadge status={statusLabel} color={statusColor} />
      </div>

      <div className="order-items">
        {firstItem && (
          <div className="order-item-preview">
            {firstItem.product?.images?.[0] && (
              <img
                src={firstItem.product.images[0]}
                alt={firstItem.product?.name}
                className="order-item-image"
              />
            )}
            <div className="order-item-name">
              {firstItem.product?.name || "Product image"}
            </div>
          </div>
        )}
        {itemCount > 1 && (
          <span className="order-more">+{itemCount - 1} more items</span>
        )}
      </div>

      <div className="order-card-footer">
        <div className="order-total">{formatPrice(order.totalAmount)}</div>
        <Link to={`${linkPrefix}/${order._id}`} className="btn btn-outline btn-sm">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;
