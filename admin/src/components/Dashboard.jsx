// pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { backend_url } from "../App";
import { toast } from "react-toastify";
import {
  FaBox,
  FaUserTie,
  FaUsers,
  FaUserShield,
  FaStar,
  FaImage,
  FaIdCard,
  FaWhatsapp,
  FaChartBar,
  FaSpinner,
  FaClock,
  FaShoppingBag
} from "react-icons/fa";
import "../index.css";

const Dashboard = ({ token }) => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${backend_url}/api/dashboard/stats`, {
        headers: { token }
      });

      if (response.data.success) {
        setStats(response.data.stats);
      } else {
        toast.error("Erro ao carregar estatísticas do dashboard.");
      }
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      toast.error("Erro ao carregar dados do dashboard.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Função para formatar data
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto fade-in">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 text-center">
          <FaSpinner className="animate-spin text-3xl text-secondary mx-auto mb-4" />
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6 max-w-7xl mx-auto fade-in">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 text-center">
          <p className="text-gray-600">Erro ao carregar dados do dashboard.</p>
        </div>
      </div>
    );
  }

  const { overview, percentages, categoryStats, recentActivities } = stats;

  return (
    <div className="p-6 max-w-7xl mx-auto fade-in">
      {/* Header */}
      <div className="mb-8 slide-in-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <FaChartBar className="text-secondary" />
          Dashboard Geral
        </h1>
        <p className="text-gray-600">
          Visão geral do sistema e estatísticas em tempo real
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total de Produtos */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Produtos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{overview.totalProducts}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaBox className="text-blue-600 text-2xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <span>📈 Todos os produtos cadastrados</span>
          </div>
        </div>

        {/* Total de Vendedores */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vendedores</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{overview.totalVendors}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FaUserTie className="text-green-600 text-2xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-blue-600">
            <FaWhatsapp className="mr-1" />
            <span>{percentages.vendorsWithWhatsAppPercentage}% com WhatsApp</span>
          </div>
        </div>

        {/* Total de Usuários */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Usuários</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{overview.totalUsers}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FaUsers className="text-purple-600 text-2xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-purple-600">
            <FaUserShield className="mr-1" />
            <span>{overview.totalAdmins} administradores</span>
          </div>
        </div>

        {/* Produtos Populares */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Destaques</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{overview.popularProducts}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FaStar className="text-yellow-600 text-2xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-yellow-600">
            <span>{percentages.popularPercentage}% dos produtos</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Estatísticas por Categoria */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaShoppingBag className="text-blue-600" />
            Produtos por Categoria
          </h3>
          <div className="space-y-4">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{category}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ 
                        width: `${(count / overview.totalProducts) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-8 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Atividades Recentes */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaClock className="text-green-600" />
            Atividades Recentes
          </h3>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{activity.name}</p>
                  <p className="text-xs text-gray-500">{activity.category}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {formatDate(activity.date)}
                </span>
              </div>
            ))}
            {recentActivities.length === 0 && (
              <p className="text-gray-500 text-center py-4">Nenhuma atividade recente</p>
            )}
          </div>
        </div>
      </div>

      {/* Cards Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 card-hover">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <FaImage className="text-indigo-600 text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Banners</p>
              <p className="text-2xl font-bold text-gray-900">{overview.bannersCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 card-hover">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <FaIdCard className="text-pink-600 text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Cards</p>
              <p className="text-2xl font-bold text-gray-900">{overview.cardsCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 card-hover">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <FaWhatsapp className="text-teal-600 text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">WhatsApp</p>
              <p className="text-2xl font-bold text-gray-900">{overview.vendorsWithWhatsApp}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Botão de Atualizar */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={fetchDashboardStats}
          className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-300 font-medium flex items-center gap-2"
        >
          <FaChartBar />
          Atualizar Dashboard
        </button>
      </div>
    </div>
  );
};

export default Dashboard;