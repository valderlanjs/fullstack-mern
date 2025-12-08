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
  FaFileAlt,
  FaQuestionCircle,
  FaBullhorn,
  FaHeadSideVirus,
} from "react-icons/fa";

// Menu base - itens que aparecem para todos os usuários autenticados
const getMenuItems = (currentUser) => {
  const baseMenuItems = [
    // 1 - Dashboard
    {
      id: "dashboard",
      label: "Dashboard",
      icon: FaChartBar,
      to: "/dashboard",
      type: "direct",
    },

    // 2 - Home
    {
      id: "home",
      label: "Home",
      icon: FaHome,
      type: "submenu",
      subItems: [
        { to: "/update-hero", label: "Banner Principal", icon: FaImage },
        { to: "/manage-cards", label: "Gerenciar Cards", icon: FaIdCard },
        { to: "/manage-logo", label: "Gerenciar Logo", icon: FaStore },
        { to: "/edit-home-section", label: "Informações", icon: FaInfoCircle },
        { to: "/edit-features", label: "Certificações", icon: FaCertificate },
      ],
    },
  ];

  // 3 - Produtos (somente admin ou permissão)
  if (currentUser?.isAdmin || currentUser?.permissions?.manageProducts) {
    baseMenuItems.push({
      id: "produtos",
      label: "Produtos",
      icon: FaBoxOpen,
      type: "submenu",
      subItems: [
        { to: "/add-product", label: "Adicionar Produto", icon: FaPlusSquare },
        { to: "/list", label: "Lista de Produtos", icon: FaListAlt },
      ],
    });
  }

  // 4 - Contato (somente admin ou permissão)
  if (currentUser?.isAdmin || currentUser?.permissions?.manageVendors) {
    baseMenuItems.push({
      id: "contato",
      label: "Contato",
      icon: FaUsers,
      type: "submenu",
      subItems: [
        { to: "/add-vendor", label: "Adicionar Vendedor", icon: FaUserPlus },
        { to: "/list-vendor", label: "Lista de Vendedores", icon: FaUsers },
        { to: "/update-banner", label: "Banner de Contato", icon: FaImage },
      ],
    });
  }

  // 5 - Sobre
  baseMenuItems.push({
    id: "secoes",
    label: "Página Sobre",
    icon: FaColumns,
    type: "submenu",
    subItems: [
      { to: "/manage-about", label: "Introdução", icon: FaEdit },
      { to: "/manage-sections", label: "Missão e Visão", icon: FaEdit },
      { to: "/manage-section-two", label: "Nossos Serviços", icon: FaEdit },
      { to: "/manage-banner-section", label: "Sustentabilidade", icon: FaEdit },
      { to: "/certification-section", label: "Certificações", icon: FaEdit },
    ],
  });

  // 6 - Marketing (admin ou permissão)
  if (currentUser?.isAdmin || currentUser?.permissions?.manageMarketing) {
    baseMenuItems.push({
      id: "marketing",
      label: "Marketing",
      icon: FaBullhorn,
      type: "submenu",
      subItems: [
        {
          to: "/marketing-messages",
          label: "Mensagens Promocionais",
          icon: FaEdit,
        },
        {
          to: "/tracking-codes",
          label: "Códigos de Rastreamento",
          icon: FaHeadSideVirus,
        },
      ],
    });
  }

  // 7 - WhatsApp
  baseMenuItems.push({
    id: "whatsapp",
    label: "WhatsApp",
    icon: FaEnvelope,
    to: "/whatsapp",
    type: "direct",
  });

  // 8 - Rodapé
  baseMenuItems.push({
    id: "footer",
    label: "Rodapé",
    icon: FaEdit,
    type: "submenu",
    subItems: [{ to: "/edit-footer", label: "Editar Rodapé", icon: FaColumns }],
  });

  // 9 - Newsletter
  baseMenuItems.push({
    id: "newsletter",
    label: "Newsletter",
    icon: FaEnvelope,
    to: "/newsletter",
    type: "direct",
  });

  // 10 - FAQ
  baseMenuItems.push({
    id: "faq",
    label: "FAQ",
    icon: FaQuestionCircle,
    type: "submenu",
    subItems: [{ to: "/faq", label: "Editar FAQ", icon: FaEdit }],
  });

  // 11 - Políticas e Termos
  if (currentUser?.isAdmin || currentUser?.permissions?.managePrivacyTerms) {
    baseMenuItems.push({
      id: "pages",
      label: "Política e Termos",
      icon: FaFileAlt,
      type: "submenu",
      subItems: [
        { to: "/pages", label: "Editar Termos e Políticas", icon: FaEdit },
      ],
    });
  }

  // 12 - Usuários
  if (currentUser?.isAdmin) {
    baseMenuItems.push({
      id: "usuarios",
      label: "Usuários",
      icon: FaShieldAlt,
      type: "submenu",
      subItems: [{ to: "/users", label: "Gerenciar Usuários", icon: FaUserCog }],
    });
  }

  return baseMenuItems;
};

const Sidebar = ({ token, currentUser, isOpen, onClose }) => {
  const [openMenus, setOpenMenus] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const location = useLocation();

  // Atualiza os menus quando o currentUser muda
  useEffect(() => {
    const items = getMenuItems(currentUser);
    setMenuItems(items);

    console.log("🔐 Sidebar - Usuário atual:", currentUser);
    console.log(
      "📋 Menus disponíveis:",
      items.map((item) => item.label)
    );
  }, [currentUser]);

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
  }, [location.pathname, menuItems]);

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

  // Informações do usuário para debug
  const userInfo = currentUser
    ? {
        name: currentUser.name,
        isAdmin: currentUser.isAdmin,
        permissions: currentUser.permissions,
      }
    : null;

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

          {/* Informações do usuário logado */}
          {currentUser && (
            <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs font-medium text-blue-800 truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-blue-600">
                {currentUser.isAdmin ? "👑 Administrador" : "👤 Usuário"}
              </p>
            </div>
          )}
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
        {menuItems.length === 0 ? (
          // Loading state
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Carregando menus...</p>
          </div>
        ) : (
          menuItems.map((menu) => {
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
                            const isSubActive =
                              location.pathname === subItem.to;

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
          })
        )}
      </nav>

      {/* Debug Info - Remova em produção */}
      {currentUser && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-gray-300">
          <p className="text-xs font-medium text-gray-700">
            Permissões Ativas:
          </p>
          <div className="mt-1 flex flex-wrap gap-1">
            {currentUser.isAdmin ? (
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                Administrador
              </span>
            ) : (
              Object.entries(currentUser.permissions || {}).map(
                ([key, value]) =>
                  value && (
                    <span
                      key={key}
                      className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                    >
                      {key
                        .replace("manage", "")
                        .replace(/([A-Z])/g, " $1")
                        .trim()}
                    </span>
                  )
              )
            )}
          </div>
        </div>
      )}

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
