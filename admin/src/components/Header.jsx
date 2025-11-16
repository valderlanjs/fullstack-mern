import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaChevronDown, FaExclamationTriangle, FaTimes, FaBars } from "react-icons/fa";
import { BiLogOutCircle } from "react-icons/bi";
import axios from "axios";
import { backend_url } from "../App";

const Header = ({ token, setToken, onToggleSidebar, isSidebarOpen }) => {
  const [userInfo, setUserInfo] = useState({
    name: "Carregando...",
    email: "carregando..."
  });
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Buscar informações do usuário logado da API
  const fetchUserInfo = async () => {
    try {
      if (!token) {
        setUserInfo({
          name: "Administrador",
          email: "usuário@email.com"
        });
        setLoading(false);
        return;
      }

      const response = await axios.get(`${backend_url}/api/user/current`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setUserInfo({
          name: response.data.user.name,
          email: response.data.user.email
        });
      }
    } catch (error) {
      console.error("Erro ao carregar informações do usuário:", error);
      // Fallback: tentar decodificar do token
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserInfo({
          name: payload.name || "Administrador",
          email: payload.email || "admin@sistema.com"
        });
      } catch {
        setUserInfo({
          name: "Administrador",
          email: "usuário@email.com"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [token]);

  // Adicione este useEffect para recarregar as informações quando o token mudar
  useEffect(() => {
    if (token) {
      fetchUserInfo();
    }
  }, [token]);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setShowUserMenu(false);
  };

  const handleConfirmLogout = () => {
    setToken("");
    setShowLogoutModal(false);
    localStorage.removeItem("token");
    // Limpar as informações do usuário ao fazer logout
    setUserInfo({
      name: "Administrador",
      email: "usuário@email.com"
    });
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Fechar menu quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <>
      <header className="flex justify-between items-center py-3 px-6 bg-gradient-to-r from-white to-blue-50 shadow-sm">
        {/** Logo e Menu Hamburguer */}
        <div className="flex items-center gap-4">
          {/** Botão Hamburguer para Mobile */}
          <button
            onClick={onToggleSidebar}
            className="sm:hidden p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <FaBars className="text-lg text-gray-600" />
          </button>

          {/** LOGO */}
          <Link to={'/dashboard'} className="flex items-center group">
            <div className="ml-3 hidden md:block">
              <h1 className="text-lg font-bold text-gray-800">Painel Administrativo</h1>
              <p className="text-xs text-gray-500">Sistema de Gerenciamento</p>
            </div>
          </Link>
        </div>

        {/** Área do Usuário com Menu Dropdown */}
        <div className="relative user-menu-container">
          <button
            onClick={toggleUserMenu}
            className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            {/** Avatar do Usuário */}
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-secondary to-blue-600 rounded-full">
              <FaUserCircle className="text-white text-lg" />
            </div>
            
            {/** Informações do Usuário */}
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-semibold text-gray-800 truncate max-w-32">
                {loading ? "Carregando..." : userInfo.name}
              </span>
              <span className="text-xs text-gray-500 truncate max-w-32">
                {loading ? "carregando..." : userInfo.email}
              </span>
            </div>
            
            <FaChevronDown 
              className={`text-xs text-gray-400 transition-transform duration-200 ${
                showUserMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {/** Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
              {/** Informações do usuário no dropdown */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {userInfo.name}
                </p>
                <p className="text-xs text-gray-500 truncate mt-1">
                  {userInfo.email}
                </p>
              </div>
              
              {/** Botão de Sair */}
              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors rounded-lg mx-2 my-1"
              >
                <BiLogOutCircle className="text-lg" />
                <span className="font-medium">Sair do Sistema</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/** Modal de Confirmação de Logout - CENTRALIZADO */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FaExclamationTriangle className="text-red-600 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirmar Saída
                </h3>
              </div>
              <button
                onClick={handleCancelLogout}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6">
              <p className="text-gray-700 mb-2">
                Tem certeza que deseja sair do sistema?
              </p>
              <p className="text-sm text-gray-500">
                Você será redirecionado para a página de login.
              </p>
            </div>

            {/* Ações do Modal */}
            <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={handleCancelLogout}
                className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <BiLogOutCircle />
                Sair do Sistema
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;