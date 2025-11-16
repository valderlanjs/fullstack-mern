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
import AdminFeatures from "./pages/AdminFeature";
import Dashboard from "./components/Dashboard";
import ManageSections from "./pages/SectionAboutOne";
import ManageAboutSection from "./pages/AboutAdmin";
import ManageServicesSection from "./pages/ManageSectionService";
import AboutSectionBannerAdmin from "./pages/AbourBanner";
import CertificationAdmin from "./pages/CertificationSection";
import NewsletterManager from "./pages/NewsletterAdmin";
import FaqAdmin from "./pages/FaqAdmin";
import PagesAdmin from "./pages/PagesAdmin";

export const backend_url = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Simular um loading inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setCurrentUser(null);
        return;
      }

      try {
        const response = await axios.get(`${backend_url}/api/user/current`, {
          headers: {
            Authorization: `Bearer ${token}`, // ← MUDE PARA Authorization
          },
        });

        if (response.data.success) {
          setCurrentUser(response.data.user);
          console.log("✅ Usuário atual carregado:", response.data.user);
        }
      } catch (error) {
        console.error("❌ Erro ao carregar usuário atual:", error);
        setCurrentUser(null);
        // Se der erro, pode ser token inválido, então limpa o token
        setToken("");
        localStorage.removeItem("token");
      }
    };

    fetchCurrentUser();
  }, [token]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setCurrentUser(null);
    }
  }, [token]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

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
        <div className="flex min-h-screen">
          {/* Sidebar - Agora faz parte do fluxo normal do flex */}
          <div
            className={`
            fixed inset-y-0 left-0 z-40
            sm:relative sm:z-auto
            transform transition-transform duration-300 ease-in-out
            ${
              isSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full sm:translate-x-0"
            }
          `}
          >
            <Sidebar
              token={token}
              currentUser={currentUser}
              isOpen={isSidebarOpen}
              onClose={closeSidebar}
            />
          </div>

          {/* Overlay para mobile */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
              onClick={closeSidebar}
            />
          )}

          {/* Conteúdo Principal - Lado direito */}
          <div className="flex-1 flex flex-col min-w-0">
            {" "}
            {/* min-w-0 para evitar overflow */}
            {/* Header Fixo */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
              <Header
                token={token}
                currentUser={currentUser}
                setToken={setToken}
                onToggleSidebar={toggleSidebar}
                isSidebarOpen={isSidebarOpen}
              />
            </div>
            {/* Área de Conteúdo das Páginas */}
            <div className="flex-1 pt-16 overflow-auto">
              {" "}
              {/* pt-16 para compensar o header fixo */}
              <div className="w-full h-full p-4 sm:p-6 lg:p-8">
                <Routes>
                  <Route path="/" element={<Dashboard token={token} currentUser={currentUser}/>} />
                  <Route
                    path="/dashboard"
                    element={
                      <Dashboard token={token} currentUser={currentUser} />
                    }
                  />
                  <Route
                    path="/list"
                    element={<List token={token} currentUser={currentUser} />}
                  />
                  <Route
                    path="/add-product"
                    element={<Add token={token} currentUser={currentUser} />}
                  />
                  <Route
                    path="/list-vendor"
                    element={
                      <ListVendor token={token} currentUser={currentUser} />
                    }
                  />
                  <Route
                    path="/add-vendor"
                    element={
                      <AddVendor token={token} currentUser={currentUser} />
                    }
                  />
                  <Route
                    path="/update-banner"
                    element={
                      <UpdateBanner token={token} currentUser={currentUser} />
                    }
                  />
                  <Route
                    path="/update-hero"
                    element={
                      <UpdateHero token={token} currentUser={currentUser} />
                    }
                  />
                  <Route
                    path="/manage-cards"
                    element={
                      <ManageCards token={token} currentUser={currentUser} />
                    }
                  />
                  <Route
                    path="/manage-logo"
                    element={
                      <LogoManager token={token} currentUser={currentUser} />
                    }
                  />
                  <Route
                    path="/edit-home-section"
                    element={
                      <AdminHomeSection
                        token={token}
                        currentUser={currentUser}
                      />
                    }
                  />
                  <Route
                    path="/manage-about"
                    element={
                      <ManageAboutSection
                        token={token}
                        currentUser={currentUser}
                      />
                    }
                  />
                  <Route
                    path="/manage-sections"
                    element={
                      <ManageSections token={token} currentUser={currentUser} />
                    }
                  />
                  <Route
                    path="/manage-section-two"
                    element={
                      <ManageServicesSection
                        token={token}
                        currentUser={currentUser}
                      />
                    }
                  />
                  <Route
                    path="/manage-banner-section"
                    element={
                      <AboutSectionBannerAdmin
                        token={token}
                        currentUser={currentUser}
                      />
                    }
                  />
                  <Route
                    path="/faq"
                    element={
                      <FaqAdmin token={token} currentUser={currentUser} />
                    }
                  />
                  <Route
                    path="/certification-section"
                    element={
                      <CertificationAdmin
                        token={token}
                        currentUser={currentUser}
                      />
                    }
                  />
                  <Route
                    path="/pages"
                    element={
                      <PagesAdmin token={token} currentUser={currentUser} />
                    }
                  />
                  <Route
                    path="/edit-features"
                    element={
                      <AdminFeatures token={token} currentUser={currentUser} />
                    }
                  />
                  <Route
                    path="/newsletter"
                    element={
                      <NewsletterManager
                        token={token}
                        currentUser={currentUser}
                      />
                    }
                  />
                  <Route
                    path="/edit-footer"
                    element={
                      <AdminFooter token={token} currentUser={currentUser} />
                    }
                  />
                  <Route
                    path="/users"
                    element={
                      <UserManagement token={token} currentUser={currentUser} />
                    }
                  />
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
