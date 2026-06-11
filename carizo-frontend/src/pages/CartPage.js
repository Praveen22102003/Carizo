import React, { useEffect, useState } from "react";
import Cart from "../components/Cart";
import CheckoutForm from "../components/CheckoutForm";
import "../styles/CartPage.css";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    fetch(`/api/cart`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCart(data))
      .catch((err) => {
        console.error("Error loading cart:", err);
        setCart({ items: [] });
      });
  }, []);

  const updateQuantity = (productId, change) => {
    const item = cart.items.find((i) => i.product.id === productId);
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) {
      fetch(`/api/cart/remove?productId=${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then(() => {
        setCart((prev) => ({
          ...prev,
          items: prev.items.filter((i) => i.product.id !== productId),
        }));
      });
    } else {
      fetch(`/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          productId: productId,
          quantity: change,
        }),
      })
        .then((res) => res.json())
        .then((data) => setCart(data));
    }
  };

  return (
    <div>
      <h1>Your Shopping Cart</h1>
      {cart && cart.items ? (
        <>
          <Cart cart={cart} setCart={setCart} onUpdateQuantity={updateQuantity} />

          {cart.items.length > 0 && (
            <div className="checkout-btn-container">
              <button
                onClick={() => setShowCheckout(true)}
                className="proceed-checkout-btn"
              >
                Proceed to Checkout
              </button>
            </div>
          )}

          {/* Modal Overlay for Checkout Form */}
          {showCheckout && (
            <div className="checkout-overlay" onClick={() => setShowCheckout(false)}>
              <div
                className="checkout-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <CheckoutForm token={localStorage.getItem("token")} />
              </div>
            </div>
          )}
        </>
      ) : (
        <p>Loading cart...</p>
      )}
    </div>
  );
};

export default CartPage;
