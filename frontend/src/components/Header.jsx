// components/Header.jsx
import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { FaBarsStaggered } from "react-icons/fa6";
import { ShopContext } from "../context/ShopContext";
import useLogo from "../hooks/uselogo";

const Header = () => {
  const { setShowSearch } = useContext(ShopContext);
  const [menuOpened, setMenuOpened] = useState(false);
  const [token, setToken] = useState(true);
  const navigate = useNavigate();
  const { logo, loading, error } = useLogo();

  // Detecta quando a tela é xl ou maior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setMenuOpened(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setMenuOpened((prev) => !prev);
  };

  // Logo padrão caso não carregue do banco
  const logoUrl = logo?.imageUrl || "/logo.png";
  const altText = logo?.altText || "Logo da empresa";

  if (loading) {
    return (
      <header className="w-full bg-white relative">
        <div className="max-padd-container flexBetween h-32">
          <div className="w-32 h-32 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="w-full bg-white relative">
      <div className="max-padd-container flexBetween">
        {/* NAVIGATION */}
        <div className="flex-1">
          {/* Menu Desktop */}
          <Navbar 
            containerStyles="hidden xl:flex gap-x-5 xl:gap-x-8 medium-15 rounded-full px-2 py-5"
          />
          
          {/* Menu Mobile com transição */}
          <div className={`
            xl:hidden flex flex-col gap-y-12 h-screen w-[222px] absolute left-0 top-0 bg-white z-50 px-10 py-4 shadow-xl
            transition-transform duration-500 ease-in-out
            ${menuOpened ? "translate-x-0" : "-translate-x-full"}
          `}>
            <Navbar 
              menuOpened={menuOpened} 
              toggleMenu={toggleMenu} 
              containerStyles="flex flex-col gap-y-12"
              logoUrl={logoUrl}  // ← CORRIGIDO: Passando logoUrl
              altText={altText}   // ← CORRIGIDO: Passando altText
            />
          </div>
        </div>

        {/* LOGO - Agora dinâmica */}
        <Link to={"/"} className="hidden xl:flex transition-transform duration-300 hover:scale-105">
          <img 
            src={logoUrl} 
            alt={altText}
            className="w-[130px] h-[130px] object-contain flexCenter px-1 -top-2" 
            onError={(e) => {
              e.target.src = "/logo.png";
            }}
          />
        </Link>

        <div className="flexBetween gap-x-2 xs:gap-x-8 h-12">
          <FaBarsStaggered 
            onClick={toggleMenu}
            className={`xl:hidden cursor-pointer text-2xl transition-transform duration-300 hover:scale-110 ${
              menuOpened ? "hidden" : "block"
            }`} 
          />
        </div>
      </div>

      {/* Overlay */}
      <div 
        className={`xl:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          menuOpened ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
      />
    </header>
  );
};

export default Header;