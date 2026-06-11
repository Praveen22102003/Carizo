import React, { useState, useEffect } from "react";
import CategoryList from "../components/CategoryList";
import AddCategory from "../components/AddCategory";
import CategorySidebar from "../components/CategorySidebar";
import ProductList from "../pages/ProductList"; // import ProductList
import "../styles/CategoryPage.css";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [errorCategories, setErrorCategories] = useState(null);
  const [errorProducts, setErrorProducts] = useState(null);

  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [categorySelected, setCategorySelected] = useState(false); // new flag

  const role = localStorage.getItem("role");
  const isAdmin = role === "ROLE_ADMIN";

  // Fetch categories
  const fetchCategories = () => {
    setLoadingCategories(true);
    fetch("/api/categories")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then(data => {
        setCategories(data);
        setLoadingCategories(false);
      })
      .catch(err => {
        setErrorCategories(err.message);
        setLoadingCategories(false);
      });
  };

  // Fetch all products (for users initially)
  const fetchAllProducts = () => {
    setLoadingProducts(true);
    fetch("/api/products")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setLoadingProducts(false);
      })
      .catch(err => {
        setErrorProducts(err.message);
        setLoadingProducts(false);
      });
  };

  // Fetch products filtered by category
  const fetchProductsByCategory = (categoryId) => {
    setLoadingProducts(true);
    setErrorProducts(null);
    fetch(`/api/products/category/${categoryId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setLoadingProducts(false);
      })
      .catch(err => {
        setErrorProducts(err.message);
        setLoadingProducts(false);
      });
  };

  useEffect(() => {
    fetchCategories();

    if (!isAdmin) {
      fetchAllProducts(); // Load all products for users initially
    }
  }, []);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setCategorySelected(true);
    fetchProductsByCategory(categoryId);
  };

  const handleAddClick = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCategory(null);
    fetchCategories();
  };

  return (
    <div className="category-page-container">
      <h1>Category Management</h1>

      {!showForm && (
        <>
          {isAdmin ? (
            <>
              <button className="add-category-btn" onClick={handleAddClick}>
                + Add Category
              </button>

              {loadingCategories && <p>Loading categories...</p>}
              {errorCategories && <p className="error">{errorCategories}</p>}

              {!loadingCategories && !errorCategories && (
                <CategoryList
                  categories={categories}
                  onDelete={fetchCategories}
                  onEdit={handleEdit}
                />
              )}
            </>
          ) : (
            <>
              {loadingCategories && <p>Loading categories...</p>}
              {errorCategories && <p className="error">{errorCategories}</p>}

              {!loadingCategories && !errorCategories && (
                <div style={{ display: "flex", gap: "20px" }}>
                  <CategorySidebar
                    categories={categories}
                    selectedCategoryId={selectedCategoryId}
                    onCategorySelect={handleCategorySelect}
                  />
                  <div style={{ flex: 1 }}>
                    <h2>
                      {selectedCategoryId
                        ? `Products for category: ${
                            categories.find(c => c.id === selectedCategoryId)?.name || ""
                          }`
                        : "All Products"}
                    </h2>

                    {loadingProducts && <p>Loading products...</p>}
                    {errorProducts && <p className="error">{errorProducts}</p>}

                    {!loadingProducts && !errorProducts && (
                      <>
                        {products.length > 0 ? (
                          <ProductList products={products} />
                        ) : categorySelected ? (
                          <p>No products found in this category.</p>
                        ) : (
                          <p>No products available.</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {showForm && (
        <AddCategory
          categoryToEdit={editingCategory}
          onSave={handleFormClose}
          onCancel={handleFormClose}
        />
      )}
    </div>
  );
};

export default CategoryPage;
