import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApi } from "../../hooks/useApi";
import cartService from "../../services/cartService";
import { useRoleAccess } from "../../hooks/useRoleAccess";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isCustomer, isSeller, isAdmin } = useRoleAccess();

  const cartResult = useApi(cartService.getCart, isAuthenticated && isCustomer);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const totalCartItems =
    cartResult.data?.data?.cart?.items?.length || 0;

  const getDashboardLink = () => {
    if (isSeller) return "/seller/dashboard";
    if (isAdmin) return "/admin/dashboard";
    return "/profile";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          MultiVendor
        </Link>

        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search products..."
            className="navbar-search-input"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigate(`/?search=${encodeURIComponent(e.target.value)}`);
              }
            }}
          />
          <button
            className="navbar-search-btn"
            onClick={() => {
              const search = document.querySelector(".navbar-search-input");
              if (search.value.trim()) {
                navigate(`/?search=${encodeURIComponent(search.value.trim())}`);
              }
            }}
          >
            Search
          </button>
        </div>

        <div className="navbar-nav">
          <Link to="/products" className="nav-link">
            Products
          </Link>

          {isAuthenticated && isCustomer && (
            <Link to="/cart" className="nav-link cart-link">
              🛒 Cart
              {totalCartItems > 0 && (
                <span className="cart-badge">{totalCartItems}</span>
              )}
            </Link>
          )}

          {isAuthenticated && isCustomer && (
            <Link to="/wishlist" className="nav-link">
              Wishlist
            </Link>
          )}

          {isAuthenticated && (
            <Link to={getDashboardLink()} className="nav-link">
              Dashboard
            </Link>
          )}

          {isAuthenticated && !authLoading ? (
            <button className="nav-link btn-logout" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="nav-link">
              Login
            </Link>
          )}
        </div>

        <button
          className="navbar-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="navbar-mobile-menu">
          <Link to="/products" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            Products
          </Link>
          {isAuthenticated && isCustomer && (
            <Link to="/cart" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              Cart
            </Link>
          )}
          {isAuthenticated && (
            <Link to={getDashboardLink()} className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              Dashboard
            </Link>
          )}
          {isAuthenticated ? (
            <button className="mobile-nav-link btn-logout" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
