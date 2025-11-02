import React, { useEffect, useState } from "react";
import axios from "axios";
import { Route, Routes, Navigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import Register from "./components/Register";

import Add from "./pages/Add";
import List from "./pages/List";
import ListVendor from "./pages/ListVendor";
import AddVendor from "./pages/AddVendor";
import UpdateBanner from "./pages/UpdateBanner";
import UpdateHero from "./pages/UpdateHero";
import ManageCards from "./pages/manageCards";
import LogoManager from "./pages/LogoManager";
import UserManagement from "./pages/UserManagement";
import AdminFooter from "./pages/adminFooter";
import AdminHomeSection from "./pages/AdminHomeSection";

export const backend_url = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular um loading inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-10">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-16"
      />
      
      {token ? (
        <div className="flex flex-col min-h-screen">
          {/* Header Fixo */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
            <Header token={token} setToken={setToken} />
          </div>
          
          {/* Conteúdo Principal */}
          <div className="flex flex-1 pt-16"> {/* pt-16 para compensar o header fixo */}
            {/* Sidebar - Fixo em desktop, hidden em mobile */}
            <div className="hidden sm:block fixed left-0 top-16 h-[calc(100vh-4rem)] z-40">
              <Sidebar token={token} setToken={setToken} />
            </div>
            
            {/* Área de Conteúdo */}
            <div className="flex-1 sm:ml-64 lg:ml-72 transition-all duration-300">
              <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <Routes>
                  <Route path="/" element={<Add token={token} />} />
                  <Route path="/list" element={<List token={token} />} />
                  <Route path="/list-vendor" element={<ListVendor token={token} />} />
                  <Route path="/add-vendor" element={<AddVendor token={token} />} />
                  <Route path="/update-banner" element={<UpdateBanner token={token} />} />
                  <Route path="/update-hero" element={<UpdateHero token={token} />} />
                  <Route path="/manage-cards" element={<ManageCards token={token} />} />
                  <Route path="/manage-logo" element={<LogoManager token={token} />} />
                  <Route path="/edit-home-section" element={<AdminHomeSection token={token} />} />
                  <Route path="/edit-footer" element={<AdminFooter token={token} />} />
                  <Route path="/users" element={<UserManagement token={token} />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Páginas de Auth com background gradient
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <Routes>
            <Route 
              path="/login" 
              element={
                <div className="min-h-screen flex items-center justify-center p-4">
                  <Login setToken={setToken} />
                </div>
              } 
            />
            <Route 
              path="/register" 
              element={
                <div className="min-h-screen flex items-center justify-center p-4">
                  <Register />
                </div>
              } 
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      )}
    </main>
  );
}

export default App;