import { useAuth } from "../context/AuthContext";

export const useRoleAccess = () => {
  const { user, isAuthenticated, loading } = useAuth();

  const hasRole = (role) => {
    if (loading) return false;
    if (!isAuthenticated) return false;
    return user?.role === role;
  };

  const hasAnyRole = (roles) => {
    if (loading) return false;
    if (!isAuthenticated) return false;
    return roles.includes(user?.role);
  };

  return {
    user,
    isAuthenticated,
    isLoading: loading,
    isCustomer: hasRole("customer"),
    isSeller: hasRole("seller"),
    isAdmin: hasRole("admin"),
    hasRole,
    hasAnyRole,
  };
};

export default useRoleAccess;
