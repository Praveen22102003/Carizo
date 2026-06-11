import React, { useEffect, useState } from "react";
import OrderCard from "../components/OrderCard";
import "../styles/UserOrdersPage.css";
const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("/api/orders/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Error fetching user orders:", err));
  }, [token]);

  return (
    <div className="orders-page">
      <h2 >My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => <OrderCard key={order.id} order={order} />)
      )}
    </div>
  );
};

export default UserOrdersPage;
