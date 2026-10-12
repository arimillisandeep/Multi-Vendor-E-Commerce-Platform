import React from "react";
import { Link } from "react-router-dom";
import productService from "../services/productService";
import { useApi } from "../hooks/useApi";
import ProductGrid from "../components/product/ProductGrid";
import SearchBar from "../components/product/SearchBar";
import "./HomePage.css";

const HomePage = () => {
  const productsResult = useApi(
    () => productService.getAll({ limit: 8, sortBy: "createdAt", sortOrder: "desc" }),
    true
  );

  const handleSearch = (searchTerm) => {
    if (searchTerm) {
      window.location.href = `/products?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Discover Amazing Products from Trusted Sellers</h1>
          <p>Multi-vendor marketplace with quality assurance and fast delivery.</p>
          <div className="hero-search">
            <SearchBar onSearch={handleSearch} placeholder="Search for products..." />
          </div>
          <Link to="/products" className="btn btn-primary btn-lg">
            Start Shopping
          </Link>
        </div>
      </section>

      <section className="featured-section">
        <h2 className="section-title">Featured Products</h2>
        <ProductGrid
          products={productsResult.data?.data?.products || []}
          loading={productsResult.loading}
          error={productsResult.error}
        />
      </section>
    </div>
  );
};

export default HomePage;
