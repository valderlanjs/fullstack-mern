import React from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";

const Header = ({ userEmail = "usuario@email.com", userName = "Admin" }) => {
  return (
    <header className="flex justify-between items-center py-3 px-6 bg-gradient-to-r from-white to-blue-50 shadow-sm">
      {/** LOGO */}
      <Link to={'/'} className="flex items-center group">

        <div className="ml-3 hidden md:block">
          <h1 className="text-lg font-bold text-gray-800">Painel Administrativo</h1>
          <p className="text-xs text-gray-500">Sistema de Gerenciamento</p>
        </div>
      </Link>

      {/** Área do Usuário com Dropdown */}
      <div className="relative group">
        <button className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
          {/** Avatar do Usuário */}
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-secondary to-blue-600 rounded-full">
            <FaUserCircle className="text-white text-lg" />
          </div>
          
          {/** Informações do Usuário */}
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-semibold text-gray-800 truncate max-w-32">
              {userName}
            </span>
            <span className="text-xs text-gray-500 truncate max-w-32">
              {userEmail}
            </span>
          </div>

        
        </button>

       
      </div>
    </header>
  );
}

export default Header;