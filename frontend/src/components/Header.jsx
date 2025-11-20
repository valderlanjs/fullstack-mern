// components/Header.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { FaBarsStaggered } from "react-icons/fa6";
import MarketingBar from "./MessageBar";

import useLogo from "../hooks/uselogo";

const Header = () => {
  const [menuOpened, setMenuOpened] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { logo, loading, error } = useLogo();

  // Detecta quando a tela é xl ou maior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setMenuOpened(false);
      }
    };

    // Detecta scroll para efeito de header fixo
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpened((prev) => !prev);
  };

  // Função para fechar o menu quando um item é clicado
  const handleMenuItemClick = () => {
    setMenuOpened(false);
  };

  // Logo padrão caso não carregue do banco
  const logoUrl = logo?.imageUrl || "/logo.png";
  const altText = logo?.altText || "Logo da empresa";

  if (loading) {
    return (
      <header
        className={`w-full bg-white sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "shadow-lg bg-white/95 backdrop-blur-sm" : "bg-white"
        }`}
      >
        <div className="max-padd-container flexBetween h-20">
          <div className="w-32 h-8 bg-gray-200 animate-pulse rounded"></div>
          <div className="w-32 h-32 bg-gray-200 animate-pulse rounded-full"></div>
          <div className="w-8 h-8 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </header>
    );
  }

  return (
    <>
    <MarketingBar />
      <header
        className={`w-full bg-white sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "shadow-lg bg-white/95 backdrop-blur-sm" : "bg-white"
        }`}
      >
        <div className="max-padd-container flexBetween h-20">
          {/* LOGO - Mobile */}
          <Link
            to={"/"}
            className="xl:hidden transition-transform duration-300 hover:scale-105 flex-shrink-0"
            onClick={() => setMenuOpened(false)}
          >
            <img
              src={logoUrl}
              alt={altText}
              className="w-16 h-16 object-contain"
              onError={(e) => {
                e.target.src = "/logo.png";
              }}
            />
          </Link>

          {/* NAVIGATION - Desktop */}
          <div className="flex-1">
            <Navbar containerStyles="hidden xl:flex gap-x-6 xl:gap-x-8 medium-15" />
          </div>

          {/* LOGO - Desktop (à direita com tamanho aumentado) */}
          <Link
            to={"/"}
            className="hidden xl:flex transition-all duration-300 hover:scale-105 flex-shrink-0"
          >
            <img
              src={logoUrl}
              alt={altText}
              className="w-24 h-24 object-contain"
              onError={(e) => {
                e.target.src = "/logo.png";
              }}
            />
          </Link>

          {/* Menu Mobile Button */}
          <div className="flex items-center gap-x-4">
            <FaBarsStaggered
              onClick={toggleMenu}
              className={`xl:hidden cursor-pointer text-2xl transition-all duration-300 hover:scale-110 hover:text-green-600 ${
                menuOpened ? "hidden" : "block"
              }`}
            />
          </div>

          {/* Menu Mobile com transição */}
          <div
            className={`
          xl:hidden flex flex-col gap-y-8 h-screen w-80 absolute left-0 top-0 bg-white z-50 px-8 py-6 shadow-2xl
          transition-transform duration-500 ease-in-out
          ${menuOpened ? "translate-x-0" : "-translate-x-full"}
        `}
          >
            {/* Navigation Mobile - Passando toggleMenu para fechar automaticamente */}
            <Navbar
              containerStyles="flex flex-col gap-y-6"
              toggleMenu={toggleMenu}
              menuOpened={menuOpened}
              logoUrl={logoUrl}
              altText={altText}
            />
          </div>
        </div>

        {/* Overlay */}
        <div
          className={`xl:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300 ${
            menuOpened
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={toggleMenu}
        />
      </header>
    </>
  );
};

export default Header;
