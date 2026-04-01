import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Shops from './pages/Shops';
import ShopDetails from './pages/ShopDetails';
import OrderTracking from './pages/OrderTracking';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/shops" element={<Shops />} />
          <Route path="/shops/:id" element={<ShopDetails />} />
          <Route path="/orders" element={<OrderTracking />} />
          
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;