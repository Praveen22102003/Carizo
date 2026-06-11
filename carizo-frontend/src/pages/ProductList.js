import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/ProductList.css";

const ProductList = ({ products: propProducts, title = "Available Products" }) => {
  const [products, setProducts] = useState([]);
  const [addedToCartIds, setAddedToCartIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  // Load products
  useEffect(() => {
    if (propProducts) {
      setProducts(propProducts);
    } else {
      fetch("/api/products")
        .then(res => res.json())
        .then(data => setProducts(data))
        .catch(err => console.error("Error fetching products:", err));
    }
  }, [propProducts]);

  // Load cart items to highlight already-added ones
  useEffect(() => {
    if (role === "ROLE_USER") {
      fetch("/api/cart/my-cart", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })
        .then(res => res.json())
        .then(data => {
          const ids = data.items.map(item => item.product.id);
          setAddedToCartIds(ids);
        })
        .catch(err => console.error("Error fetching cart items:", err));
    }
  }, [role]);

  const handleAddToCart = (productId) => {
    fetch("/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ productId, quantity: 1 })
    })
      .then(res => {
        if (res.ok) {
          toast.success("Product added to cart!");
          setAddedToCartIds(prev => [...prev, productId]);
        } else {
          toast.error("Failed to add to cart.");
        }
      })
      .catch(err => console.error("Error adding to cart:", err));
  };

  const handleGoToCart = () => {
    navigate("/cart");
  };

  const handleDelete = (productId) => {
    fetch(`/api/products/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        if (res.ok) {
          toast.success("Product deleted successfully.");
          setProducts(products.filter(p => p.id !== productId));
        } else {
          toast.error("Failed to delete product");
        }
      })
      .catch(err => console.error("Error deleting product:", err));
    setShowModal(false);
    setSelectedProductId(null);
  };

  return (
    <div className="product-list">
      <h2>{title}</h2>

      <div className="product-grid">
        {products.map(product => (
          <div className="product-card" key={product.id}>
            <img src={product.imageUrl} alt={product.name} className="product-image" />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p><strong>₹{product.price}</strong></p>
            <p>Stock: {product.stock}</p>

            {role === "ROLE_ADMIN" && (
              <button
                className="delete-button"
                onClick={() => {
                  setSelectedProductId(product.id);
                  setShowModal(true);
                }}
              >
                Delete
              </button>
            )}

            {role === "ROLE_USER" && (
              !addedToCartIds.includes(product.id) ? (
                <button className="add-to-cart-button" onClick={() => handleAddToCart(product.id)}>
                  Add to Cart
                </button>
              ) : (
                <button className="go-to-cart-button" onClick={handleGoToCart}>
                  Go to Cart
                </button>
              )
            )}
          </div>
        ))}
      </div>

      {/* Modal for Confirm Delete */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to delete this product?</p>
            <div className="modal-actions">
              <button onClick={() => handleDelete(selectedProductId)}>Yes, Delete</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
