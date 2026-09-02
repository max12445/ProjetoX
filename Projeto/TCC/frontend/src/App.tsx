import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Home } from "./pages/Home";
import { AddProduct } from "./pages/AddProduct";
import { MyProducts } from "./pages/MyProducts";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { AdminDashboard } from "./pages/AdminDashboard";
import { ProductDetails } from "./pages/ProductDetails";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { OrderHistory } from "./pages/OrderHistory";
import { EditProduct } from "./pages/EditProduct";
import { AdminOrders } from "./pages/AdminOrders";
import { MerchantOrders } from "./pages/MerchantOrders";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <ProductProvider>
            <Router>
              <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
                <Navbar />
                <main className="flex-1">
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
                      path="/admin/pedidos"
                      element={
                        <ProtectedRoute role="admin">
                          <AdminOrders />
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
                  </Routes>
                </main>
              </div>
            </Router>
          </ProductProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;