import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";
import axios from "axios";
import { backend_url } from "../App";

const Header = ({ token }) => {
  const [userInfo, setUserInfo] = useState({
    name: "Carregando...",
    email: "carregando..."
  });
  const [loading, setLoading] = useState(true);

  // Buscar informações do usuário logado da API
  useEffect(() => {
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
          headers: { token }
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

    fetchUserInfo();
  }, [token]);

  return (
    <header className="flex justify-between items-center py-3 px-6 bg-gradient-to-r from-white to-blue-50 shadow-sm">
      {/** LOGO */}
      <Link to={'/dashboard'} className="flex items-center group">
        <div className="ml-3 hidden md:block">
          <h1 className="text-lg font-bold text-gray-800">Painel Administrativo</h1>
          <p className="text-xs text-gray-500">Sistema de Gerenciamento</p>
        </div>
      </Link>

      {/** Área do Usuário */}
      <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
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
      </div>
    </header>
  );
}

export default Header;