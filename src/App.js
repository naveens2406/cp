import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import ToastProvider from './components/Toast';


// Global UI
import BackToTop from './components/BackToTop';
import PageProgressBar from './components/PageProgressBar';
import CookieBanner from './components/CookieBanner';

// Auth Components
import AdminLogin from './pages/auth/AdminLogin';
import CustomerLogin from './pages/auth/CustomerLogin';
import CustomerRegister from './pages/auth/CustomerRegister';
import AdminRegister from './pages/auth/AdminRegister';
// Customer Components
import CustomerDashboard from './pages/customer/Dashboard';
import Services from './pages/customer/Services';
import CreateOrder from './pages/customer/CreateOrder';
import OrderHistory from './pages/customer/OrderHistory';
import OrderDetails from './pages/customer/OrderDetails';
import CustomerProfile from './pages/customer/Profile';

// Admin Components
import AdminDashboard from './pages/admin/Dashboard';
import OrderManagement from './pages/admin/OrderManagement';
import InventoryManagement from './pages/admin/InventoryManagement';
import Analytics from './pages/admin/Analytics';
import CustomerManagement from './pages/admin/CustomerManagement';
import AdminProfile from './pages/admin/Profile';
import GalleryManagement from './pages/admin/GalleryManagement';
import Enquiries from './pages/admin/Enquiries';

// Public Components
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import GetQuote from './pages/GetQuote';
import FAQ from './pages/FAQ';
import Pricing from './pages/Pricing';
import NotFound from './pages/NotFound';

// Layout Components
import Layout from './components/Layout';
import CustomerLayout from './components/CustomerLayout';
import AdminLayout from './components/AdminLayout';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <div className="App">
              {/* Global UI Components */}
              <PageProgressBar />
              <BackToTop />
              <CookieBanner />

              <Routes>
              {/* Public Routes */}
              {/* Public Marketing Site (with Header/Footer) */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="get-quote" element={<GetQuote />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="pricing" element={<Pricing />} />
                <Route path="customer/login" element={<CustomerLogin />} />
                <Route path="admin/login" element={<AdminLogin />} />
                <Route path="customer/register" element={<CustomerRegister />} />
              </Route>

              {/* Customer Routes */}
              <Route path="/customer" element={
                <PrivateRoute><CustomerLayout /></PrivateRoute>
              }>
                <Route index element={<Navigate to="/customer/dashboard" replace />} />
                <Route path="dashboard" element={<CustomerDashboard />} />
                <Route path="services" element={<Services />} />
                <Route path="create-order" element={<CreateOrder />} />
                <Route path="orders" element={<OrderHistory />} />
                <Route path="orders/:id" element={<OrderDetails />} />
                <Route path="profile" element={<CustomerProfile />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminRoute><AdminLayout /></AdminRoute>
              }>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="orders" element={<OrderManagement />} />
                <Route path="inventory" element={<InventoryManagement />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="customers" element={<CustomerManagement />} />
                <Route path="gallery" element={<GalleryManagement />} />
                <Route path="enquiries" element={<Enquiries />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="register" element={<AdminRegister />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  );

}

export default App;
