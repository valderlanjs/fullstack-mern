import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaSquarePlus } from "react-icons/fa6";
import {
  FaListAlt,
  FaUserCog,
  FaUserPlus,
  FaUsers,
  FaImage,
  FaBoxOpen,
  FaChevronDown,
  FaHome, // Ícone para o menu Home
} from "react-icons/fa";
import { BiLogOutCircle } from "react-icons/bi";

const Sidebar = ({ token, setToken }) => {
  // Estados para controlar a visibilidade de cada submenu
  const [isProdutosOpen, setIsProdutosOpen] = useState(false);
  const [isContatoOpen, setIsContatoOpen] = useState(false);
  const [isHomeOpen, setIsHomeOpen] = useState(false);

  return (
    <div className="max-sm:flexCenter max-xs:pb-3 rounded-xl bg-white pb-3 mb-3 sm:w-1/5 sm:min-h-screen pl-6 lg:pl-22 sm:pr-3">
      <div className="flex max-sm:items-center sm:flex-col pt-5">
        {/* Ajustado o gap para melhor espaçamento entre os menus */}
        <div className="flex sm:flex-col gap-x-5 gap-y-4 sm:pt-10">
          
          {/** Menu Dropdown Produtos */}
          <div className="flex flex-col">
            <button
              onClick={() => setIsProdutosOpen(!isProdutosOpen)}
              className="flexStart justify-between gap-x-2 p-5 bold-15 text-secondary cursor-pointer max-w-60 h-10 rounded-xl"
            >
              <div className="flexStart gap-x-2">
                <FaBoxOpen />
                <div className="hidden lg:flex">Produtos</div>
              </div>
              <FaChevronDown
                className={`transition-transform duration-300 ${
                  isProdutosOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isProdutosOpen ? "max-h-40" : "max-h-0"
              }`}
            >
              <div className="flex flex-col pl-6 pt-4 gap-y-4">
                <NavLink
                  to={"/"}
                  className={({ isActive }) =>
                    `flexStart gap-x-2 bold-15 cursor-pointer ${
                      isActive ? "active-link" : "text-wood"
                    }`
                  }
                >
                  <FaSquarePlus />
                  <div className="hidden lg:flex">Adicionar Produto</div>
                </NavLink>
                <NavLink
                  to={"/list"}
                  className={({ isActive }) =>
                    `flexStart gap-x-2 bold-15 cursor-pointer ${
                      isActive ? "active-link" : "text-wood"
                    }`
                  }
                >
                  <FaListAlt />
                  <div className="hidden lg:flex">Lista de Produtos</div>
                </NavLink>
              </div>
            </div>
          </div>

          {/** Menu Dropdown Contato */}
          <div className="flex flex-col">
            <button
              onClick={() => setIsContatoOpen(!isContatoOpen)}
              className="flexStart justify-between gap-x-2 p-5 bold-15 text-secondary cursor-pointer max-w-60 h-10 rounded-xl"
            >
              <div className="flexStart gap-x-2">
                <FaUsers />
                <div className="hidden lg:flex">Contato</div>
              </div>
              <FaChevronDown
                className={`transition-transform duration-300 ${
                  isContatoOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                // Altura maior pois contém mais links
                isContatoOpen ? "max-h-96" : "max-h-0" 
              }`}
            >
              <div className="flex flex-col pl-6 pt-4 gap-y-4">
                <NavLink
                  to={"/add-vendor"}
                  className={({ isActive }) =>
                    `flexStart gap-x-2 bold-15 cursor-pointer ${
                      isActive ? "active-link" : "text-wood"
                    }`
                  }
                >
                  <FaUserPlus />
                  <div className="hidden lg:flex">Adicionar Vendedor</div>
                </NavLink>
                <NavLink
                  to={"/list-vendor"}
                  className={({ isActive }) =>
                    `flexStart gap-x-2 bold-15 cursor-pointer ${
                      isActive ? "active-link" : "text-wood"
                    }`
                  }
                >
                  <FaUsers />
                  <div className="hidden lg:flex">Lista de Vendedores</div>
                </NavLink>
                <NavLink
                  to={"/update-banner"}
                  className={({ isActive }) =>
                    `flexStart gap-x-2 bold-15 cursor-pointer ${
                      isActive ? "active-link" : "text-wood"
                    }`
                  }
                >
                  <FaImage />
                  <div className="hidden lg:flex">Atualizar Banner</div>
                </NavLink>
              </div>
            </div>
          </div>

          {/** Menu Dropdown Home */}
          <div className="flex flex-col">
            <button
              onClick={() => setIsHomeOpen(!isHomeOpen)}
              className="flexStart justify-between gap-x-2 p-5 bold-15 text-secondary cursor-pointer max-w-60 h-10 rounded-xl"
            >
              <div className="flexStart gap-x-2">
                <FaHome />
                <div className="hidden lg:flex">Home</div>
              </div>
              <FaChevronDown
                className={`transition-transform duration-300 ${
                  isHomeOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isHomeOpen ? "max-h-40" : "max-h-0"
              }`}
            >
              <div className="flex flex-col pl-6 pt-4 gap-y-4">
                <NavLink
                  to={"/update-hero"}
                  className={({ isActive }) =>
                    `flexStart gap-x-2 bold-15 cursor-pointer ${
                      isActive ? "active-link" : "text-wood"
                    }`
                  }
                >
                  <FaImage />
                  <div className="hidden lg:flex">Atualizar Banner Principal</div>
                </NavLink>

               {/* <NavLink
                  to={"/create-card"}
                  className={({ isActive }) =>
                    `flexStart gap-x-2 bold-15 cursor-pointer ${
                      isActive ? "active-link" : "text-wood"
                    }`
                  }
                >
                  <FaImage />
                  <div className="hidden lg:flex">Atualizar Card</div>
                </NavLink>*/}
                <NavLink
                  to={"/manage-cards"}
                  className={({ isActive }) =>
                    `flexStart gap-x-2 bold-15 cursor-pointer ${
                      isActive ? "active-link" : "text-wood"
                    }`
                  }
                >
                  <FaImage />
                  <div className="hidden lg:flex">Atualizar Card</div>
                </NavLink>
              </div>
            </div>
          </div>


          {/** Card Grande */}
          
          {/** Link solitário que restou */}
          <NavLink
            to={"/change-credentials"}
            className={({ isActive }) =>
              isActive
                ? "active-link"
                : "flexStart gap-x-2 p-5 bold-15 text-secondary cursor-pointer max-w-60 h-10 rounded-xl"
            }
          >
            <FaUserCog />
            <div className="hidden lg:flex">Alterar Credenciais</div>
          </NavLink>
        </div>

        {/** Botão de logout na parte inferior */}
        <div className="max-sm:ml-5 sm:mt-80">
          {token && (
            <button
              onClick={() => setToken("")}
              className="flexStart gap-x-2 p-5 bold-15 text-red-500 cursor-pointer max-w-60 h-10 rounded-xl"
            >
              <BiLogOutCircle className="text-xl" />
              <div className="hidden lg:flex">Sair</div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;