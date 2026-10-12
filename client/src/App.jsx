import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PublicLayout from "./layouts/PublicLayout";
import CustomerLayout from "./layouts/CustomerLayout";
import SellerLayout from "./layouts/SellerLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";

import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import WishlistPage from "./pages/WishlistPage";
import ProfilePage from "./pages/ProfilePage";
import SellerDashboardPage from "./pages/SellerDashboardPage";
import SellerProductsPage from "./pages/SellerProductsPage";
import AddProductPage from "./pages/AddProductPage";
import EditProductPage from "./pages/EditProductPage";
import SellerOrdersPage from "./pages/SellerOrdersPage";
import SellerInventoryPage from "./pages/SellerInventoryPage";
import SellerProfilePage from "./pages/SellerProfilePage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ManageUsersPage from "./pages/ManageUsersPage";
import ManageSellersPage from "./pages/ManageSellersPage";
import ManageProductsPage from "./pages/ManageProductsPage";
import ManageCategoriesPage from "./pages/ManageCategoriesPage";
import ManageOrdersPage from "./pages/ManageOrdersPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          } />
          <Route path="/products" element={
            <PublicLayout>
              <ProductsPage />
            </PublicLayout>
          } />
          <Route path="/products/:id" element={
            <PublicLayout>
              <ProductDetailsPage />
            </PublicLayout>
          } />
          <Route path="/login" element={
            <PublicLayout>
              <LoginPage />
            </PublicLayout>
          } />
          <Route path="/register" element={
            <PublicLayout>
              <RegisterPage />
            </PublicLayout>
          } />
          <Route path="/cart" element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerLayout>
                <CartPage />
              </CustomerLayout>
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerLayout>
                <CheckoutPage />
              </CustomerLayout>
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute allowedRoles={["customer", "seller", "admin"]}>
              <CustomerLayout>
                <OrdersPage />
              </CustomerLayout>
            </ProtectedRoute>
          } />
          <Route path="/orders/:id" element={
            <ProtectedRoute allowedRoles={["customer", "seller", "admin"]}>
              <CustomerLayout>
                <OrderDetailsPage />
              </CustomerLayout>
            </ProtectedRoute>
          } />
          <Route path="/wishlist" element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerLayout>
                <WishlistPage />
              </CustomerLayout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerLayout>
                <ProfilePage />
              </CustomerLayout>
            </ProtectedRoute>
          } />

          <Route path="/seller/dashboard" element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerLayout>
                <SellerDashboardPage />
              </SellerLayout>
            </ProtectedRoute>
          } />
          <Route path="/seller/products" element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerLayout>
                <SellerProductsPage />
              </SellerLayout>
            </ProtectedRoute>
          } />
          <Route path="/seller/add-product" element={
            <ProtectedRoute allowedRoles={["seller", "admin"]}>
              <SellerLayout>
                <AddProductPage />
              </SellerLayout>
            </ProtectedRoute>
          } />
          <Route path="/seller/edit-product/:id" element={
            <ProtectedRoute allowedRoles={["seller", "admin"]}>
              <SellerLayout>
                <EditProductPage />
              </SellerLayout>
            </ProtectedRoute>
          } />
          <Route path="/seller/orders" element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerLayout>
                <SellerOrdersPage />
              </SellerLayout>
            </ProtectedRoute>
          } />
          <Route path="/seller/inventory" element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerLayout>
                <SellerInventoryPage />
              </SellerLayout>
            </ProtectedRoute>
          } />
          <Route path="/seller/profile" element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerLayout>
                <SellerProfilePage />
              </SellerLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <AdminDashboardPage />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <ManageUsersPage />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/sellers" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <ManageSellersPage />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <ManageProductsPage />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/categories" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <ManageCategoriesPage />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <ManageOrdersPage />
              </AdminLayout>
            </ProtectedRoute>
          } />

          <Route path="*" element={
            <PublicLayout>
              <NotFoundPage />
            </PublicLayout>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
