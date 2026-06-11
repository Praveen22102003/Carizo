import React from "react";
import "../styles/Cart.css";

const Cart = ({ cart, setCart }) => {
  // Function to remove item
  const removeItem = (productId) => {
    fetch(`/api/cart/remove?productId=${productId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(updatedCart => setCart(updatedCart))
      .catch(() => alert("Failed to remove item"));
  };

  // Function to update quantity (+1 or -1)
  const updateQuantity = (productId, change) => {
    fetch(`/api/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        productId: productId,
        quantity: change  // Send just the change (+1 or -1)
      })
    })
      .then(res => res.json())
      .then(updatedCart => setCart(updatedCart))
      .catch(() => alert("Failed to update quantity"));
  };

  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table className="cart-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cart.items.map(item => (
              <tr key={item.id}>
                <td>{item.product.name}</td>
                <td>₹{item.product.price}</td>
                <td>
                  <button onClick={() => updateQuantity(item.product.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, 1)}>+</button>
                </td>
                <td>₹{item.product.price * item.quantity}</td>
                <td>
                  <button className="remove-btn" onClick={() => removeItem(item.product.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3"><strong>Total Price</strong></td>
              <td colSpan="2">₹{totalPrice}</td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
};

export default Cart;
