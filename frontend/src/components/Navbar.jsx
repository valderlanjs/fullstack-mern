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
            icon: <SiGooglehome />
        },
        {
            to: "/collection",
            label: "Produtos",
            icon: <BsCollectionFill />
        },
        {
            to: "/about",
            label: "Sobre",
            icon: <SiAtlassian />
        },
        {
            to: "/contact",
            label: "Contato",
            icon: <SiMaildotcom />
        }
    ]

    // Valores padrão para evitar undefined
    const safeLogoUrl = logoUrl || "/logo.png";
    const safeAltText = altText || "Logo da empresa";

    return (
       <nav className={containerStyles}>
        {/** Botão de fechar barra de navegação */} 
        {menuOpened && (
            <>
                <FaRegWindowClose 
                    onClick={toggleMenu}
                    className="text-xl cursor-pointer self-end relative left-8 text-secondary transition-transform duration-300 hover:scale-110"
                />
                {/*LOGO*/}
                <Link to={'/'} className='mb-10 transition-opacity duration-300'>
                    <img 
                        src={safeLogoUrl}  // ← CORRIGIDO: usando safeLogoUrl
                        alt={safeAltText}   // ← CORRIGIDO: usando safeAltText
                        className="w-24 h-28 object-contain transition-transform duration-300 hover:scale-105" 
                        onError={(e) => {
                            e.target.src = "/logo.png"; // Fallback seguro
                        }}
                    />
                </Link>
            </>
        )}
        {navItems.map(({to, label, icon}) => (
            <div key={label} className='inline-flex'>
                <NavLink 
                    to={to} 
                    className={({isActive}) => 
                        isActive 
                            ? "active-link flexCenter gap-x-2 transition-all duration-300" 
                            : "flexCenter gap-x-2 transition-all duration-300 hover:text-secondary"
                    }
                    onClick={menuOpened ? toggleMenu : undefined}
                >
                    {icon}
                    <h5 className='medium-16'>{label}</h5>
                </NavLink>
            </div>
        ))}
       </nav>
    )
}

export default Navbar;