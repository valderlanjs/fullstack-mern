import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaPlusSquare,
  FaListAlt,
  FaUserCog,
  FaUserPlus,
  FaUsers,
  FaImage,
  FaBoxOpen,
  FaChevronDown,
  FaHome,
  FaShieldAlt,
  FaIdCard,
  FaStore,
  FaTimes,
  FaExclamationTriangle,
  FaEdit,
  FaColumns,
  FaInfoCircle,
  FaCertificate,
  FaChartBar,
} from "react-icons/fa";
import { BiLogOutCircle } from "react-icons/bi";

const Sidebar = ({ token, setToken }) => {
  const [openMenus, setOpenMenus] = useState({
    produtos: false,
    contato: false,
    home: false,
    usuarios: false,
    footer: false,
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const location = useLocation();

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const closeMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: false,
    }));
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setToken("");
    setShowLogoutModal(false);
    localStorage.removeItem("token");
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: FaChartBar,
      to: "/dashboard",
      type: "direct",
    },
    {
      id: "home",
      label: "Home",
      icon: FaHome,
      type: "submenu",
      subItems: [
        {
          to: "/update-hero",
          label: "Banner Principal",
          icon: FaImage,
        },
        {
          to: "/manage-cards",
          label: "Gerenciar Cards",
          icon: FaIdCard,
        },
        {
          to: "/manage-logo",
          label: "Gerenciar Logo",
          icon: FaStore,
        },
        {
          to: "/edit-home-section",
          label: "Informações",
          icon: FaInfoCircle,
        },
        {
          to: "/edit-features",
          label: "Certificações",
          icon: FaCertificate,
        },
      ],
    },
    {
      id: "produtos",
      label: "Produtos",
      icon: FaBoxOpen,
      type: "submenu",
      subItems: [
        {
          to: "/add-product",
          label: "Adicionar Produto",
          icon: FaPlusSquare,
        },
        {
          to: "/list",
          label: "Lista de Produtos",
          icon: FaListAlt,
        },
      ],
    },
    {
      id: "secoes",
      label: "Página Sobre",
      icon: FaColumns,
      type: "submenu",
      subItems: [
        {
          to: "/manage-about",
          label: "Primeira Seção",
          icon: FaEdit,
        },
        {
          to: "/manage-sections",
          label: "Segunda Seção",
          icon: FaEdit,
        },
        {
          to: "/manage-section-two",
          label: "Terceira Seção",
          icon: FaEdit,
        },
      ],
    },
    {
      id: "contato",
      label: "Contato",
      icon: FaUsers,
      type: "submenu",
      subItems: [
        {
          to: "/add-vendor",
          label: "Adicionar Vendedor",
          icon: FaUserPlus,
        },
        {
          to: "/list-vendor",
          label: "Lista de Vendedores",
          icon: FaUsers,
        },
        {
          to: "/update-banner",
          label: "Banner de Contato",
          icon: FaImage,
        },
      ],
    },
    {
      id: "footer",
      label: "Rodapé",
      icon: FaEdit,
      type: "submenu",
      subItems: [
        {
          to: "/edit-footer",
          label: "Editar Rodapé",
          icon: FaColumns,
        },
      ],
    },
    {
      id: "usuarios",
      label: "Usuários",
      icon: FaShieldAlt,
      type: "submenu",
      subItems: [
        {
          to: "/users",
          label: "Gerenciar Usuários",
          icon: FaUserCog,
        },
      ],
    },
  ];

  // Verifica se algum subitem está ativo para manter o menu aberto
  const isSubItemActive = (subItems) => {
    if (!subItems || !Array.isArray(subItems)) {
      return false;
    }
    return subItems.some((item) => location.pathname === item.to);
  };

  return (
    <>
      <div className="bg-white shadow-lg rounded-xl sm:rounded-none sm:shadow-none sm:min-h-screen sm:w-64 lg:w-72 p-4 sm:p-6 mb-4 sm:mb-0">
        {/* Logo/Header */}
        <div className="hidden sm:block mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-secondary">Grupo Madenobre</h1>
          <p className="text-xs text-gray-500 mt-1">Gerenciamento do site</p>
        </div>

        {/* Menu Navigation */}
        <nav className="space-y-2">
          {menuItems.map((menu) => {
            const Icon = menu.icon;
            const isDirectItem = menu.type === "direct";
            const hasSubItems =
              menu.type === "submenu" &&
              menu.subItems &&
              menu.subItems.length > 0;

            const isActive = isDirectItem
              ? location.pathname === menu.to
              : isSubItemActive(menu.subItems);

            const isOpen = openMenus[menu.id] || isActive;

            return (
              <div
                key={menu.id}
                className="bg-gray-100 border-b border-gray-300 last:border-b-0 rounded-xl"
              >
                {/* Item Direto (Dashboard) */}
                {isDirectItem ? (
                  <NavLink
                    to={menu.to}
                    className={({ isActive: navIsActive }) =>
                      `w-full flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-secondary group ${
                        navIsActive
                          ? "bg-blue-50 text-secondary font-semibold"
                          : "text-gray-700"
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`text-lg group-hover:text-secondary ${
                          location.pathname === menu.to
                            ? "text-secondary"
                            : "text-gray-500"
                        }`}
                      />
                      <span className="font-medium">{menu.label}</span>
                    </div>
                  </NavLink>
                ) : (
                  /* Menu com Subitens */
                  <>
                    <button
                      onClick={() => {
                        if (isOpen) {
                          closeMenu(menu.id);
                        } else {
                          toggleMenu(menu.id);
                        }
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-secondary group ${
                        isActive
                          ? "bg-blue-50 text-secondary font-semibold"
                          : "text-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`text-lg group-hover:text-secondary ${
                            isActive ? "text-secondary" : "text-gray-500"
                          }`}
                        />
                        <span className="font-medium">{menu.label}</span>
                      </div>
                      <FaChevronDown
                        className={`text-xs transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-secondary" : "text-gray-400"
                        }`}
                      />
                    </button>

                    {/* Submenu */}
                    {hasSubItems && (
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isOpen ? "max-h-96" : "max-h-0"
                        }`}
                      >
                        <div className="py-2 pl-9 space-y-1">
                          {menu.subItems.map((subItem) => {
                            const SubIcon = subItem.icon;
                            const isSubActive =
                              location.pathname === subItem.to;

                            return (
                              <NavLink
                                key={subItem.to}
                                to={subItem.to}
                                className={({ isActive: navIsActive }) =>
                                  `flex items-center gap-3 p-2 rounded-lg text-sm transition-all duration-200 group ${
                                    navIsActive || isSubActive
                                      ? "bg-secondary text-white shadow-md"
                                      : "text-gray-600 hover:bg-gray-200 hover:text-secondary"
                                  }`
                                }
                              >
                                <SubIcon className="text-sm" />
                                <span className="font-medium">
                                  {subItem.label}
                                </span>
                              </NavLink>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout Button */}
        {token && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
            >
              <BiLogOutCircle className="text-xl group-hover:scale-110 transition-transform" />
              <span className="font-medium">Sair do Sistema</span>
            </button>
          </div>
        )}

        {/* Mobile Bottom Info */}
        <div className="sm:hidden mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            Painel Administrativo
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FaExclamationTriangle className="text-red-600 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirmar Saída
                </h3>
              </div>
              <button
                onClick={handleCancelLogout}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6">
              <p className="text-gray-700 mb-2">
                Tem certeza que deseja sair do sistema?
              </p>
              <p className="text-sm text-gray-500">
                Você será redirecionado para a página de login.
              </p>
            </div>

            {/* Ações do Modal */}
            <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-200 rounded-b-xl">
              <button
                onClick={handleCancelLogout}
                className="flex-1 px-4 py-3 border border-green-600 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <BiLogOutCircle />
                Sair do Sistema
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
