import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/Header"; 
import { Footer } from "./components/Footer";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Layout only for pages that need header/footer
const Layout = ({ children }) => (
    <div className="app">
        <Header />
        {children}
        <Footer />
    </div>
);

export default function App() {
  const location = useLocation();
  
  // Auth pages don't need header/footer
  const authRoutes = ["/login", "/signup"];
  const isAuthPage = authRoutes.includes(location.pathname);

  return (
    <>
      {isAuthPage ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      ) : (
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<div className="container text-center" style={{ padding: '5rem', fontSize: '1.5rem' }}><h1>404 | Page Not Found</h1></div>} />
          </Routes>
        </Layout>
      )}
    </>
  );
}