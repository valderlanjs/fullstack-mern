import React, { useContext, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import Navbar from "./Navbar";

import { FaBarsStaggered, FaRegCircleUser } from "react-icons/fa6";
import { TbArrowNarrowRight } from "react-icons/tb";
import { FaSearch } from "react-icons/fa";
import { ShopContext } from "../context/ShopContext";



const Header = () => {

  const {setShowSearch} = useContext(ShopContext)
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
    <header className="w-full bg-white">
        <div className="max-padd-container flexBetween">
            {/* LOGO */}
            <Link to={"/"} className="flex-1 xl:hidden">
              <img src="/logo.png" alt="" className="w-24 h-28 object-contain flexCenter px-1 absolute -top-2 rounded-full" />
            </Link>

            {/* NAVIGATION */}
            <div className="flex-1">
              <Navbar 
                menuOpened={menuOpened} 
                toggleMenu={toggleMenu} 
                containerStyles={`${menuOpened ? "flex flex-col gap-y-12 h-screen w-[222px] absolute left-0 top-0 bg-white z-50 px-10 py-4 shadow-xl" : "hidden xl:flex gap-x-5 xl:gap-x-8 medium-15 rounded-full px-2 py-5" }`}
              />
            </div>

            {/* LOGO */}
            <Link to={"/"} className="flex hidden xl:flex">
              <img src="/logo.png" alt="" className="w-[130px] h-[130px] object-contain flexCenter px-1 -top-2" />
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
                {/*}
                <div>
                    Icone de busca
                    <FaSearch onClick={() => setShowSearch((prev) => !prev)} className="text-xl cursor-pointer" />
                </div> */}
                
                
                
                {/*<div className="group relative">
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
                </div>*/}
            </div>
        </div>
    </header>
  );
};

export default Header;
