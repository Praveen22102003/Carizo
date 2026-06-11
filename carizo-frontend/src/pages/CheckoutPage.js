import React from 'react';
import CheckoutForm from '../components/CheckoutForm';  // Adjust path as needed

// Assume you have a way to get the JWT token (e.g., from context or localStorage)
function CheckoutPage() {
  // For example, get token from localStorage or app context
  const token = localStorage.getItem('token'); 

  if (!token) {
    return <p>Please login to proceed with checkout.</p>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Checkout</h2>
      <CheckoutForm token={token} />
    </div>
  );
}

export default CheckoutPage;
