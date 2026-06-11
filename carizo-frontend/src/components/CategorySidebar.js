import React from "react";
import "../styles/CategorySidebar.css";

const CategorySidebar = ({ categories, selectedCategoryId, onCategorySelect }) => {
  return (
    <div className="category-sidebar">
      <h3>Categories</h3>
      <div className="category-circle-list">
        {categories.map(category => (
          <div
            key={category.id}
            className={`category-item ${category.id === selectedCategoryId ? "selected" : ""}`}
            onClick={() => onCategorySelect(category.id)}
          >
            {/* Display category image as circle, fallback to default if no image */}
            <img
              src={category.imageUrl || "/default-category.png"}
              alt={category.name}
              className="category-image"
            />
            <span className="category-name">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySidebar;
