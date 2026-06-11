import React from "react";
import "../styles/OrderCard.css";

const OrderCard = ({ order }) => {
  return (
    <div className="order-card">
      <h4>Order ID: {order.id}</h4>
      <p>Ordered Date: {new Date(order.orderDate).toLocaleDateString()}</p>
      <ul>
        {order.items.map((item) => (
          <li key={item.id}>
            {item.product.name} - Qty: {item.quantity}
          </li>
        ))}
      </ul>
      <p>Total Price: ₹{order.totalAmount}</p>
    </div>
  );
};

export default OrderCard;
