import React, { useEffect, useState } from "react";
import "../styles/AllOrdersPage.css";

const AllOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchAllOrders = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("/api/orders/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error("Failed to fetch orders.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAllOrders();
  }, []);

  return (
    <div className="orders-container">
      <h2>All Orders</h2>
      {orders.length === 0 ? (
        <div className="no-orders-container">
          <span className="no-orders-icon">🛍️</span>
          <h3>No Orders Yet</h3>
          <p>No orders have been placed yet.</p>
        </div>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Total Amount</th>
              <th>Order Date</th>
              <th>City</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.userId}</td>
                <td>₹{order.totalAmount}</td>
                <td>{order.orderDate?.substring(0, 10)}</td>
                <td>{order.city}</td>
                <td>{order.phoneNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllOrdersPage;
