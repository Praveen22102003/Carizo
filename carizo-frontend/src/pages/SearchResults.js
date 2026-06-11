import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductList from "./ProductList";
import "../styles/SearchResults.css";

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hook to parse query params
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const searchTerm = query.get("q") || "";

  useEffect(() => {
    if (!searchTerm) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`/api/products/search?q=${encodeURIComponent(searchTerm)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch search results");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [searchTerm]);

  if (loading) return <p className="loading-text">Loading search results...</p>;
  if (error) return <p className="error-text">Error: {error}</p>;
  if (products.length === 0) return <p className="no-results-text">No results found for "{searchTerm}"</p>;

  return (
    <div className="search-results-container">
      <h2>Search results for "{searchTerm}"</h2>
      <ProductList products={products} />
    </div>
  );
};

export default SearchResults;
