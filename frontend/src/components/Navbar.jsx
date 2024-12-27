import React from 'react';
import { FaRegWindowClose } from 'react-icons/fa';
import { Link, NavLink } from 'react-router-dom';
import { SiGooglehome, SiAtlassian, SiMaildotcom } from 'react-icons/si';
import { BsCollectionFill } from 'react-icons/bs';
import {  } from 'react-icons/fa';

const Navbar = ({containerStyles, toggleMenu, menuOpened}) => {
    
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
            to: "/mailto:valderlanjosr15@gmail.com",
            label: "Contato",
            icon: <SiMaildotcom />
        }
    ]

    return (
       <nav className={containerStyles}>
        {/** Botão de fechar barra de navegação */} 
        {menuOpened && (
            <>
                <FaRegWindowClose 
                    onClick={toggleMenu}
                    className="text-xl cursor-pointer self-end relative left-8 text-secondary"
                />
                {/*LOGO*/}
                <Link to={'/'} className='mb-10'>
                    <img src="/logo.png" alt="" className="w-24 h-28 object-contain " />
                </Link>
            </>
        )}
        {navItems.map(({to, label, icon}) => (
            <div key={label} className='inline-flex'>
                <NavLink 
                    to={to} 
                    className={({isActive}) => isActive ? "active-link flexCenter gap-x-2" : "flexCenter gap-x-2"}
                    onClick={menuOpened && toggleMenu}
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