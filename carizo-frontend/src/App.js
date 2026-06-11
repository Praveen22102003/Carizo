import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import the styles

import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProductForm from "./pages/ProductForm";
import ProductList from "./pages/ProductList";
import CartPage from "./pages/CartPage";
import CheckoutPage from './pages/CheckoutPage';
import CategoryPage from "./pages/CategoryPage";
import SearchResults from "./pages/SearchResults"; 
import UserOrdersPage from "./pages/UserOrdersPage";
import AllOrdersPage from "./pages/AllOrdersPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/add-product" element={<ProductForm />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/search" element={<SearchResults />} /> 
        <Route path="/my" element={<UserOrdersPage />} />
        <Route path="/all" element={<AllOrdersPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <Footer />
      
      {/* ✅ Toast container for showing popup messages */}
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar
        closeOnClick
        pauseOnHover={false}
        draggable={false}
      />
    </Router>
  );
}

export default App;
