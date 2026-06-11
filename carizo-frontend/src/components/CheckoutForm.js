import React, { useState, useEffect } from 'react';
import '../styles/CheckoutForm.css';
import { checkout } from '../services/orderService';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

function CheckoutForm({ token }) {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const orderData = await checkout(
        { address, city, postalCode, phoneNumber },
        token
      );
      setOrder(orderData);
      toast.success('Order placed successfully!');
    } catch (err) {
      setError(err.message || 'Error during checkout');
    }
  };

  // Redirect to home after 2 seconds on successful order
  useEffect(() => {
    if (order) {
      const timer = setTimeout(() => {
        navigate('/my');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [order, navigate]);

  return (
    <div className="checkout-form-container">
      <form className="checkout-form" onSubmit={handleSubmit}>
        <input
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <input
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <input
          placeholder="Postal Code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          required
        />
        <input
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <button type="submit">Confirm Order</button>

        {error && <p className="error">{error}</p>}
        {order && (
          <div className="order-summary">
            <h3>Order ID: {order.id}</h3>
            <p>Total: ₹{order.totalAmount}</p>
          </div>
        )}
      </form>
    </div>
  );
}

export default CheckoutForm;
