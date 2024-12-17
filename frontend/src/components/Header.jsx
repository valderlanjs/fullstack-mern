import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import Navbar from "./Navbar";

import { FaBarsStaggered, FaRegCircleUser } from "react-icons/fa6";
import { GiBeachBag } from "react-icons/gi";
import { TbArrowNarrowRight } from "react-icons/tb";
import { FaSearch } from "react-icons/fa";



const Header = () => {

  const [menuOpened, setMenuOpened] = useState(false)
  const [token, setToken] = useState(true)
  const navigate = useNavigate()

  const toggleMenu = () => {
    setMenuOpened((prev) => !prev)

  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
    //setCartItems({})
    navigate('/login')
  }

  return (
    <header className="py-5 w-full bg-white">
        <div className="max-padd-container flexBetween">
            {/* LOGO */}
            <Link to={"/"} className="flex-1 xl:hidden">
              <img src="/logo.png" alt="" className="w-24 h-28 object-contain flexCenter px-1 absolute -top-2 rounded-full" />
            </Link>

            {/* NAVIGATION */}
            <div className="flex-1">
              <Navbar />
            </div>

            {/* LOGO */}
            <Link to={"/"} className="flex-1 hidden xl:flex">
              <img src="/logo.png" alt="" className="w-24 h-28 object-contain flexCenter px-1 absolute -top-2 rounded-full" />
            </Link>

            {/* lado direito onde vai ficar o icone de pesquisa no qual posso retirar o de carrinho e user */}
            {/** ALTERAR ESSE LADO DIREITO PARA DEIXAR SÓ O DE PESQUISAR POREM COM UM INPUT  */}
            <div className="flexBetween gap-x-2 xs:gap-x-8">
                {/* Icone de barra de menu* */}
                {!menuOpened && (
                    <FaBarsStaggered 
                        onClick={toggleMenu}
                        className="xl:hidden cursor-pointer text-2xl" 
                    />
                )}
                
                <div>
                    {/* Icone de busca* */}
                    <FaSearch className="text-xl cursor-pointer" />
                </div>
                
                <Link to={'/cart'} className="flex relative">
                    {/* Icone do carrinho* */}
                    <GiBeachBag  className="text-[25px]"/>
                    <span className="bg-secondary text-white medium-14 absolute right-0.5 -top-3 flexCenter w-5 h-5 rounded-full shadow-inner ">0</span>
                </Link>
                
                <div className="group relative">
                    <div onClick={() => !token && navigate('/login')}>
                        <FaRegCircleUser className="text-2xl cursor-pointer" />
                    </div>
                    {
                        token && 
                            <>
                                <ul className="bg-white shadow-sm p-3  w-32 ring-1 ring-slate-900/15 rounded  absolute right-0 hidden group-hover:flex flex-col">
                                    <li 
                                        onClick={()=> navigate('/orders')} 
                                        className="flexBetween cursor-pointer"
                                    > 
                                        <p>Pedidos</p>
                                        <TbArrowNarrowRight className="text-[19px]  opacity-50" />
                                    </li>
                                    <hr className="my-2" />
                                    <li 
                                        onClick={logout}
                                        className="flexBetween cursor-pointer"
                                    > 
                                        <p>Logout</p>
                                        <TbArrowNarrowRight className="text-[19px] opacity-50" />
                                    </li>
                                </ul>
                            </>
                    }
                </div>
            </div>
        </div>
    </header>
  );
};

export default Header;
