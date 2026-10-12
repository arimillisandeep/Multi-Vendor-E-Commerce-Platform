import React from "react";
import { useApi } from "../hooks/useApi";
import adminService from "../services/adminService";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import ProtectedRoute from "../components/common/ProtectedRoute";
import "./ManageUsersPage.css";

const ManageUsersContent = () => {
  const usersResult = useApi(() => adminService.getUsers(), true);

  if (usersResult.loading) {
    return <Loading text="Loading users..." />;
  }

  if (usersResult.error) {
    return (
      <ErrorMessage
        message={usersResult.error?.response?.data?.message || "Failed to load users"}
        onRetry={() => usersResult.execute()}
      />
    );
  }

  const users = usersResult.data?.data?.users || [];

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await adminService.updateUserStatus(userId, !currentStatus);
      usersResult.execute();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update user status");
    }
  };

  return (
    <div className="manage-users-page">
      <div className="page-header">
        <h1>Manage Customers</h1>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span
                    className={`status ${user.isActive ? "active" : "inactive"}`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleToggleStatus(user._id, user.isActive)}
                  >
                    {user.isActive ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="no-data">No customers found.</p>
        )}
      </div>
    </div>
  );
};

const ManageUsersPage = () => {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <ManageUsersContent />
    </ProtectedRoute>
  );
};

export default ManageUsersPage;