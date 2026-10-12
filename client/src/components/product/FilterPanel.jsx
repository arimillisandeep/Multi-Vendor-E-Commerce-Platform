import React from "react";
import "./FilterPanel.css";

const FilterPanel = ({
  categories,
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  return (
    <div className="filter-panel">
      <h3 className="filter-title">Filters</h3>

      <div className="filter-group">
        <label>Category</label>
        <select
          value={filters.category || ""}
          onChange={(e) => onFilterChange("category", e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Min Price</label>
        <input
          type="number"
          min="0"
          value={filters.minPrice || ""}
          onChange={(e) => onFilterChange("minPrice", e.target.value)}
          placeholder="0"
        />
      </div>

      <div className="filter-group">
        <label>Max Price</label>
        <input
          type="number"
          min="0"
          value={filters.maxPrice || ""}
          onChange={(e) => onFilterChange("maxPrice", e.target.value)}
          placeholder="Any"
        />
      </div>

      <div className="filter-group">
        <label>Min Rating</label>
        <select
          value={filters.minRating || ""}
          onChange={(e) => onFilterChange("minRating", e.target.value)}
        >
          <option value="">Any Rating</option>
          <option value="4">4+ stars</option>
          <option value="3">3+ stars</option>
          <option value="2">2+ stars</option>
          <option value="1">1+ star</option>
        </select>
      </div>

      <button className="btn btn-outline btn-clear" onClick={onClearFilters}>
        Clear Filters
      </button>
    </div>
  );
};

export default FilterPanel;
