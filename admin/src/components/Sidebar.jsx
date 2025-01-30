import React from "react";
import { NavLink } from "react-router-dom";
import { FaSquarePlus } from "react-icons/fa6";
import { FaListAlt, FaUserCog } from "react-icons/fa";
import { BiLogOutCircle } from "react-icons/bi";

const Sidebar = ({ token, setToken }) => {
  return (
    <div className="max-sm:flexCenter max-xs:pb-3 rounded-xl bg-white pb-3 mb-3 sm:w-1/5 sm:min-h-screen pl-6 lg:pl-22 sm:pr-3">
      <div className="flex max-sm:items-center sm:flex-col pt-5">
        <div className="flex sm:flex-col gap-x-5 gap-y-8 sm:pt-10">
          <NavLink
            to={"/"}
            className={({ isActive }) =>
              isActive
                ? "active-link"
                : "flexStart gap-x-2 p-5 bold-15 text-secondary cursor-pointer max-w-60 h-10 rounded-xl"
            }
          >
            <FaSquarePlus />
            <div className="hidden lg:flex">Adicionar Produto</div>
          </NavLink>

          <NavLink
            to={"/list"}
            className={({ isActive }) =>
              isActive
                ? "active-link"
                : "flexStart gap-x-2 p-5 bold-15 text-secondary cursor-pointer max-w-60 h-10 rounded-xl"
            }
          >
            <FaListAlt />
            <div className="hidden lg:flex">Lista de Produtos</div>
          </NavLink>

          <NavLink
            to={"/change-credentials"}
            className={({ isActive }) =>
              isActive
                ? "active-link"
                : "flexStart gap-x-2 p-5 bold-15 text-secondary cursor-pointer max-w-60 h-10 rounded-xl"
            }
          >
            <FaUserCog/>
            <div className="hidden lg:flex">Alterar Crendenciais</div>
          </NavLink>
        </div>

        {/** botão de logout na parte inferior */}
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
