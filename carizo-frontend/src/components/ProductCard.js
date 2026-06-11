import React from "react";
import "../styles/ProductCard.css";

const ProductCard = ({ product, onAddToCart, role }) => {
  return (
    <div className="product-card">
      <img src={product.imageUrl} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p><strong>₹{product.price}</strong></p>
      <p>Stock: {product.stock}</p>

      {role === "ROLE_USER" && (
        <button
          className="add-to-cart-button"
          onClick={() => onAddToCart(product.id)}
        >
          Add to Cart
        </button>
      )}
    </div>
  );
};

export default ProductCard;
