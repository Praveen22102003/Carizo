import React, { useEffect, useState, useRef } from "react";
import "../styles/Home.css";
import ProductList from "./ProductList";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  const [showAllCategoryProducts, setShowAllCategoryProducts] = useState(false);
  const [showAllNewArrivals, setShowAllNewArrivals] = useState(false);
  const [showAllBestSellers, setShowAllBestSellers] = useState(false);

  const filteredProductsRef = useRef(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));

    fetch("/api/products/new-arrivals")
      .then((res) => res.json())
      .then((data) => setNewArrivals(data))
      .catch((err) => console.error("Error fetching new arrivals:", err));

    fetch("/api/products/best-sellers")
      .then((res) => res.json())
      .then((data) => setBestSellers(data))
      .catch((err) => console.error("Error fetching best sellers:", err));
  }, []);

  // Fetch products whenever a category is selected
  useEffect(() => {
    if (selectedCategoryId) {
      fetch(`/api/products/category/${selectedCategoryId}`)
        .then((res) => res.json())
        .then((data) => setCategoryProducts(data))
        .catch((err) =>
          console.error("Error fetching products by category:", err)
        );
    } else {
      setCategoryProducts([]);
      setShowAllCategoryProducts(false);
    }
  }, [selectedCategoryId]);

  // Detect clicks outside filtered products to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        filteredProductsRef.current &&
        !filteredProductsRef.current.contains(event.target)
      ) {
        setSelectedCategoryId(null);
      }
    }

    if (selectedCategoryId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedCategoryId]);

  // Section header with toggle button
  const SectionHeader = ({ title, showAll, toggleShowAll, itemCount }) => (
    <div className="section-header">
      <h2>{title}</h2>
      {itemCount > 4 && (
        <button onClick={toggleShowAll} className="view-toggle-button">
          {showAll ? "Show Less" : "View All"}
        </button>
      )}
    </div>
  );

  return (
    <main className="home">
      <h1>Welcome to Carizo</h1>
      <p>Shop top-quality products from trusted vendors.</p>

      {/* Category Filter Section */}
      {categories.length > 0 && (
        <section className="category-filter">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`category-item ${
                selectedCategoryId === cat.id ? "selected" : ""
              }`}
              onClick={() =>
                setSelectedCategoryId(
                  selectedCategoryId === cat.id ? null : cat.id
                )
              }
            >
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="category-image"
                loading="lazy"
              />
              <div className="category-name">{cat.name}</div>
            </div>
          ))}
        </section>
      )}

      {/* Show products only if a category is selected */}
      {selectedCategoryId ? (
        <section
          className="product-section filtered-products"
          ref={filteredProductsRef}
        >
          <SectionHeader
            title="Products"
            showAll={showAllCategoryProducts}
            toggleShowAll={() => setShowAllCategoryProducts(!showAllCategoryProducts)}
            itemCount={categoryProducts.length}
          />
          <ProductList
            products={
              showAllCategoryProducts
                ? categoryProducts
                : categoryProducts.slice(0, 4)
            }
          />
        </section>
      ) : (
        <p style={{ textAlign: "center", marginTop: "2rem", color: "#555" }}>
          Please select a category to see products.
        </p>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="product-section new-arrivals">
          <SectionHeader
            title="New Arrivals"
            showAll={showAllNewArrivals}
            toggleShowAll={() => setShowAllNewArrivals(!showAllNewArrivals)}
            itemCount={newArrivals.length}
          />
          <ProductList
            products={showAllNewArrivals ? newArrivals : newArrivals.slice(0, 4)}
          />
        </section>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="product-section best-sellers">
          <SectionHeader
            title="Best Sellers"
            showAll={showAllBestSellers}
            toggleShowAll={() => setShowAllBestSellers(!showAllBestSellers)}
            itemCount={bestSellers.length}
          />
          <ProductList
            products={showAllBestSellers ? bestSellers : bestSellers.slice(0, 4)}
          />
        </section>
      )}
    </main>
  );
};

export default Home;
