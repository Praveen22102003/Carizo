import React from "react";
import ProductForm from "./ProductForm";
import "../styles/ProductForm.css";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>Vendor Dashboard</h1>
      <ProductForm />
    </div>
  );
};

export default AdminDashboard;
