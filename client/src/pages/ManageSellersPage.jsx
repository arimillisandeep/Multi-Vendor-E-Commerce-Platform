import React from "react";
import { useApi } from "../hooks/useApi";
import adminService from "../services/adminService";
import sellerService from "../services/sellerService";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import StatusBadge from "../components/common/StatusBadge";
import ProtectedRoute from "../components/common/ProtectedRoute";
import "./ManageSellersPage.css";

const ManageSellersContent = () => {
  const sellersResult = useApi(() => adminService.getAllSellers(), true);

  if (sellersResult.loading) {
    return <Loading text="Loading sellers..." />;
  }

  if (sellersResult.error) {
    return (
      <ErrorMessage
        message={sellersResult.error?.response?.data?.message || "Failed to load sellers"}
        onRetry={() => sellersResult.execute()}
      />
    );
  }

  const sellers = sellersResult.data?.data?.sellers || [];

  const handleApprove = async (sellerId) => {
    try {
      await sellerService.approveSeller(sellerId);
      sellersResult.execute();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to approve seller");
    }
  };

  const handleReject = async (sellerId) => {
    try {
      await sellerService.rejectSeller(sellerId);
      sellersResult.execute();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reject seller");
    }
  };

  return (
    <div className="manage-sellers-page">
      <div className="page-header">
        <h1>Manage Sellers</h1>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Store Name</th>
              <th>Owner</th>
              <th>Email</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr key={seller._id}>
                <td>{seller.storeName}</td>
                <td>{seller.user?.name || "N/A"}</td>
                <td>{seller.user?.email || "N/A"}</td>
                <td>
                  <StatusBadge status={seller.status} color={
                    seller.status === "approved" ? "success" :
                    seller.status === "rejected" ? "error" : "warning"
                  } />
                </td>
                <td>{new Date(seller.createdAt).toLocaleDateString()}</td>
                <td>
                  {seller.status === "pending" && (
                    <>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleApprove(seller._id)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => handleReject(seller._id)}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sellers.length === 0 && (
          <p className="no-data">No sellers found.</p>
        )}
      </div>
    </div>
  );
};

const ManageSellersPage = () => {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <ManageUsersContent />
    </ProtectedRoute>
  );
};

export default ManageSellersPage;