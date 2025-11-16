// components/Navbar.jsx
import React from 'react';
import { FaRegWindowClose } from 'react-icons/fa';
import { Link, NavLink } from 'react-router-dom';
import { SiGooglehome, SiAtlassian, SiMaildotcom } from 'react-icons/si';
import { BsCollectionFill } from 'react-icons/bs';

const Navbar = ({ containerStyles, toggleMenu, menuOpened, logoUrl, altText }) => {
    
    const navItems = [
        {
            to: "/", 
            label: "Início", 
            icon: <SiGooglehome className="text-lg" />
        },
        {
            to: "/collection",
            label: "Produtos",
            icon: <BsCollectionFill className="text-lg" />
        },
        {
            to: "/about",
            label: "Sobre",
            icon: <SiAtlassian className="text-lg" />
        },
        {
            to: "/contact",
            label: "Contato",
            icon: <SiMaildotcom className="text-lg" />
        }
    ]

    // Valores padrão para evitar undefined
    const safeLogoUrl = logoUrl || "/logo.png";
    const safeAltText = altText || "Logo da empresa";

    // Função para lidar com o clique nos links
    const handleLinkClick = () => {
        if (menuOpened && toggleMenu) {
            toggleMenu();
        }
    };

    return (
       <nav className={containerStyles}>
        {/** Header do Menu Mobile */} 
        {menuOpened && (
            <div className="flexBetween border-b border-gray-100 pb-6 mb-4">
                {/* LOGO Mobile */}
                <Link 
                    to={'/'} 
                    className="transition-transform duration-300 hover:scale-105"
                    onClick={handleLinkClick}
                >
                    <img 
                        src={safeLogoUrl}
                        alt={safeAltText}
                        className="w-20 h-20 object-contain" 
                        onError={(e) => {
                            e.target.src = "/logo.png";
                        }}
                    />
                </Link>
                
                {/* Botão de fechar */}
                <button 
                    onClick={toggleMenu}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-300 text-2xl text-gray-600 hover:text-red-500 hover:scale-110"
                >
                    <FaRegWindowClose />
                </button>
            </div>
        )}
        
        {/* Links de Navegação */}
        {navItems.map(({to, label, icon}) => (
            <div key={label} className='inline-flex group relative'>
                <NavLink 
                    to={to} 
                    className={({isActive}) => 
                        `flex items-center gap-x-3 medium-16 transition-all duration-300 ${
                            isActive 
                                ? "text-green-600 font-semibold" 
                                : "text-gray-700 group-hover:text-green-600"
                        }`
                    }
                    onClick={handleLinkClick}
                >
                    <span className="text-xl">{icon}</span>
                    <span className="whitespace-nowrap relative">
                        {label}
                        {/* Linha verde no hover - EFEITO ORIGINAL */}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
                    </span>
                </NavLink>
            </div>
        ))}
       </nav>
    )
}

export default Navbar;