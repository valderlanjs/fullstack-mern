import React, { useState, useEffect } from "react";
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
  FaEdit,
  FaColumns,
  FaInfoCircle,
  FaCertificate,
  FaChartBar,
  FaEnvelope,
} from "react-icons/fa";

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
      {
        to: "/manage-banner-section",
        label: "Quarta Seção",
        icon: FaEdit,
      },
      {
        to: "/certification-section",
        label: "Quinta Seção",
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
    id: "faq",
    label: "FAQ",
    icon: FaEdit,
    type: "submenu",
    subItems: [
      {
        to: "/faq",
        label: "Editar FAQ",
        icon: FaColumns,
      },
    ],
  },
  {
    id: "pages",
    label: "Politica e Termos",
    icon: FaEdit,
    type: "submenu",
    subItems: [
      {
        to: "/pages",
        label: "Editar Termos e Politicas",
        icon: FaColumns,
      },
    ],
  },
  {
    id: "newsletter",
    label: "Newsletter",
    icon: FaEnvelope,
    to: "/newsletter",
    type: "direct",
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

const Sidebar = ({ token, isOpen, onClose }) => {
  const [openMenus, setOpenMenus] = useState({});
  const location = useLocation();

  // Inicializar menus abertos baseado na rota atual
  useEffect(() => {
    const initialOpenMenus = {};

    menuItems.forEach((menu) => {
      if (menu.type === "submenu" && menu.subItems) {
        const isActive = menu.subItems.some(
          (item) => location.pathname === item.to
        );
        if (isActive) {
          initialOpenMenus[menu.id] = true;
        }
      }
    });

    setOpenMenus(initialOpenMenus);
  }, [location.pathname]);

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const handleLinkClick = () => {
    // Fechar sidebar no mobile ao clicar em um link
    if (window.innerWidth < 640 && onClose) {
      onClose();
    }
  };

  // Verifica se algum subitem está ativo para manter o menu aberto
  const isSubItemActive = (subItems) => {
    if (!subItems || !Array.isArray(subItems)) {
      return false;
    }
    return subItems.some((item) => location.pathname === item.to);
  };

  return (
    <div
      className={`
      bg-white shadow-lg sm:shadow-none sm:min-h-screen sm:w-64 lg:w-72 p-4 sm:p-6
      fixed sm:relative left-0 top-0 h-full w-64 z-40 transform transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
      overflow-y-auto
    `}
    >
      {/** Logo/Header com botão fechar para mobile */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-secondary">Grupo Madenobre</h1>
          <p className="text-xs text-gray-500 mt-1">Gerenciamento do site</p>
        </div>
        <button
          onClick={onClose}
          className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FaTimes className="text-gray-600" />
        </button>
      </div>

      {/** Menu Navigation com Scroll */}
      <nav className="space-y-2 h-[calc(100vh-180px)] overflow-y-auto">
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

          const isMenuOpen = openMenus[menu.id] || false;

          return (
            <div
              key={menu.id}
              className="bg-gray-100 border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Item Direto (Dashboard, Newsletter) */}
              {isDirectItem ? (
                <NavLink
                  to={menu.to}
                  onClick={handleLinkClick}
                  className={({ isActive: navIsActive }) =>
                    `w-full flex items-center p-3 rounded-lg transition-all duration-200 group ${
                      navIsActive
                        ? "bg-blue-50 text-secondary font-semibold border-l-4 border-l-secondary"
                        : "text-gray-700 hover:bg-blue-50 hover:text-secondary"
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`text-lg ${
                        location.pathname === menu.to
                          ? "text-secondary"
                          : "text-gray-500 group-hover:text-secondary"
                      }`}
                    />
                    <span className="font-medium">{menu.label}</span>
                  </div>
                </NavLink>
              ) : (
                /* Menu com Subitens */
                <>
                  <button
                    onClick={() => toggleMenu(menu.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? "bg-blue-50 text-secondary font-semibold border-l-4 border-l-secondary"
                        : "text-gray-700 hover:bg-blue-50 hover:text-secondary"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`text-lg ${
                          isActive
                            ? "text-secondary"
                            : "text-gray-500 group-hover:text-secondary"
                        }`}
                      />
                      <span className="font-medium">{menu.label}</span>
                    </div>
                    <FaChevronDown
                      className={`text-xs transition-transform duration-300 ${
                        isMenuOpen
                          ? "rotate-180 text-secondary"
                          : "text-gray-400"
                      }`}
                    />
                  </button>

                  {/* Submenu */}
                  {hasSubItems && (
                    <div
                      className={`transition-all duration-300 ease-in-out ${
                        isMenuOpen
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="py-2 pl-4 pr-2 space-y-1">
                        {menu.subItems.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const isSubActive = location.pathname === subItem.to;

                          return (
                            <NavLink
                              key={subItem.to}
                              to={subItem.to}
                              onClick={handleLinkClick}
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

      {/* Mobile Bottom Info */}
      <div className="sm:hidden mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Painel Administrativo
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
