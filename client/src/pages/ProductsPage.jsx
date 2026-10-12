import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import productService from "../services/productService";
import { useApi } from "../hooks/useApi";
import ProductGrid from "../components/product/ProductGrid";
import FilterPanel from "../components/product/FilterPanel";
import Pagination from "../components/common/Pagination";
import "./ProductsPage.css";

const ProductsPage = () => {
  const location = useLocation();
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const productsResult = useApi(
    () => productService.getAll({ ...filters, page: currentPage, limit: 12 }),
    true
  );

  const categoriesResult = useApi(
    () => productService.getCategories(),
    true
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newFilters = {};

    if (params.get("search")) newFilters.search = params.get("search");
    if (params.get("category")) newFilters.category = params.get("category");
    if (params.get("minPrice")) newFilters.minPrice = params.get("minPrice");
    if (params.get("maxPrice")) newFilters.maxPrice = params.get("maxPrice");
    if (params.get("minRating")) newFilters.minRating = params.get("minRating");

    setFilters(newFilters);
    setCurrentPage(1);
  }, [location.search]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    const { sortBy, sortOrder } = e.target.value.split("|");
    setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const products = productsResult.data?.data?.products || [];
  const pagination = productsResult.data
    ? {
        page: productsResult.data.pagination.page,
        pages: productsResult.data.pagination.pages,
        total: productsResult.data.pagination.total,
      }
    : { page: 1, pages: 1, total: 0 };

  const categories = categoriesResult.data?.data?.categories || [];

  return (
    <div className="products-page">
      <div className="products-container">
        <aside className="products-sidebar">
          <FilterPanel
            categories={categories}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </aside>

        <main className="products-main">
          <div className="products-toolbar">
            <select
              value={`${filters.sortBy || "createdAt"}|${filters.sortOrder || "desc"}`}
              onChange={handleSortChange}
              className="sort-select"
            >
              <option value="createdAt|desc">Newest</option>
              <option value="price|asc">Price: Low to High</option>
              <option value="price|desc">Price: High to Low</option>
              <option value="rating|desc">Highest Rated</option>
            </select>
          </div>

          <ProductGrid
            products={products}
            loading={productsResult.loading}
            error={productsResult.error?.response?.data?.message || productsResult.error?.message}
          />

          {productsResult.data && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;
