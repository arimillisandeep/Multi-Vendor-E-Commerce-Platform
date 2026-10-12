const formatPrice = (price) => {
  if (price === null || price === undefined) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const formatDateTime = (dateString) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleString("en-US", options);
};

const getStockStatus = (stock, minimumStock) => {
  if (stock === 0) return { label: "Out of Stock", color: "error" };
  if (stock <= minimumStock) return { label: "Low Stock", color: "warning" };
  return { label: "In Stock", color: "success" };
};

const getOrderStatusLabel = (status) => {
  const labels = {
    placed: "Order Placed",
    confirmed: "Confirmed",
    packed: "Packed",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return labels[status] || status;
};

const getOrderStatusColor = (status) => {
  const colors = {
    placed: "info",
    confirmed: "primary",
    packed: "warning",
    shipped: "secondary",
    delivered: "success",
    cancelled: "error",
  };
  return colors[status] || "default";
};

export {
  formatPrice,
  formatDate,
  formatDateTime,
  getStockStatus,
  getOrderStatusLabel,
  getOrderStatusColor,
};
