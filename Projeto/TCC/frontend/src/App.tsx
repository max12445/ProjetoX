import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Home } from "./pages/Home";
import { AddProduct } from "./pages/AddProduct";
import { MyProducts } from "./pages/MyProducts";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminOverview } from "./pages/AdminOverview";
import { ProductDetails } from "./pages/ProductDetails";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { OrderHistory } from "./pages/OrderHistory";
import { EditProduct } from "./pages/EditProduct";
import { Profile } from "./pages/Profile";
import { Support } from "./pages/Support";
import { AdminSupport } from "./pages/AdminSupport";
import { AdminOrders } from "./pages/AdminOrders";
import { MerchantOrders } from "./pages/MerchantOrders";
import { MerchantDashboard } from "./pages/MerchantDashboard";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <ProductProvider>
            <Router>
              <div className="min-h-screen bg-surface text-ink font-sans flex flex-col">
                <Navbar onMenuToggle={() => setMenuOpen((open) => !open)} />
                <div className="flex flex-1 items-stretch">
                  <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
                  <main className="flex-1 min-w-0">
                    <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/produto/:id" element={<ProductDetails />} />
                    <Route
                      path="/cadastrar-produto"
                      element={
                        <ProtectedRoute>
                          <AddProduct />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/meus-produtos"
                      element={
                        <ProtectedRoute role="comerciante">
                          <MyProducts />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/editar-produto/:id"
                      element={
                        <ProtectedRoute role="comerciante">
                          <EditProduct />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/login" element={<Login />} />
                    <Route path="/registro" element={<Register />} />
                    <Route
                      path="/admin/pendentes"
                      element={
                        <ProtectedRoute role="admin">
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/dashboard"
                      element={
                        <ProtectedRoute role="admin">
                          <AdminOverview />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/pedidos"
                      element={
                        <ProtectedRoute role="admin">
                          <AdminOrders />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/painel"
                      element={
                        <ProtectedRoute role="comerciante">
                          <MerchantDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/minhas-vendas"
                      element={
                        <ProtectedRoute role="comerciante">
                          <MerchantOrders />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/carrinho" element={<Cart />} />
                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute>
                          <Checkout />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/meus-pedidos"
                      element={
                        <ProtectedRoute>
                          <OrderHistory />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/perfil"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/suporte" element={<Support />} />
                    <Route
                      path="/admin/suporte"
                      element={
                        <ProtectedRoute role="admin">
                          <AdminSupport />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                </div>
              </div>
            </Router>
          </ProductProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;