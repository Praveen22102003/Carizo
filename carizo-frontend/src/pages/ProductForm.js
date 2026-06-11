import React, { useState, useEffect } from "react";
import "../styles/ProductForm.css";

const ProductForm = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: { id: "" }, // Make category an object with an id
    stock: "",
  });

  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch category list from backend
    const fetchCategories = async () => {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      setProduct({ ...product, category: { id: value } });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        setMessage("Product added successfully!");
        setProduct({
          name: "",
          description: "",
          price: "",
          imageUrl: "",
          category: { id: "" },
          stock: "",
        });
      } else {
        const data = await response.json();
        setMessage("Failed to add product: " + (data.message || "Error"));
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className="product-form-container">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Product Name" value={product.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={product.description} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" value={product.price} onChange={handleChange} required />
        <input type="text" name="imageUrl" placeholder="Image URL" value={product.imageUrl} onChange={handleChange} required />
        
        <select name="category" value={product.category.id} onChange={handleChange} required>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input type="number" name="stock" placeholder="Stock Quantity" value={product.stock} onChange={handleChange} required />
        <button type="submit">Add Product</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ProductForm;
