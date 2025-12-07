// controllers/dashboardController.js
import Product from "../models/productModel.js";
import Vendor from "../models/vendorModel.js";
import User from "../models/userModel.js";
import HeroBanner from "../models/heroModel.js";
import Card from "../models/CardModel.js";
import { Op } from "sequelize";

export const getDashboardStats = async (req, res) => {
  try {
    // Buscar todas as estatísticas em paralelo
    const [
      totalProducts,
      totalVendors,
      totalUsers,
      totalAdmins,
      popularProducts,
      bannersCount,
      cardsCount,
      productsByCategory
    ] = await Promise.all([
      // Total de produtos
      Product.count(),

      // Total de vendedores
      Vendor.count(),

      // Total de usuários
      User.count(),

      // Total de administradores
      User.count({ where: { isAdmin: true } }),

      // Produtos populares
      Product.count({ where: { popular: true } }),

      // Banners ativos
      HeroBanner.count(),

      // Cards ativos
      Card.count(),

      // Produtos por categoria
      Product.findAll({
        attributes: [
          'category',
          [Product.sequelize.fn('COUNT', Product.sequelize.col('id')), 'count']
        ],
        group: ['category'],
        raw: true
      })
    ]);

    // Calcular porcentagem de produtos populares
    const popularPercentage = totalProducts > 0 
      ? Math.round((popularProducts / totalProducts) * 100) 
      : 0;

    // Últimas atividades (produtos recentes)
    const recentProducts = await Product.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: ['id', 'name', 'category', 'createdAt']
    });

    // Estatísticas por categoria
    const categoryStats = productsByCategory.reduce((acc, item) => {
      acc[item.category] = parseInt(item.count);
      return acc;
    }, {});

    const stats = {
      overview: {
        totalProducts,
        totalVendors,
        totalUsers,
        totalAdmins,
        popularProducts,
        bannersCount,
        cardsCount
      },
      percentages: {
        popularPercentage,
        adminPercentage: totalUsers > 0 
          ? Math.round((totalAdmins / totalUsers) * 100) 
          : 0
      },
      categoryStats,
      recentActivities: recentProducts.map(product => ({
        id: product.id,
        name: product.name,
        category: product.category,
        date: product.createdAt,
        type: 'product'
      }))
    };

    res.json({ success: true, stats });
  } catch (error) {
    console.error("Erro ao buscar estatísticas do dashboard:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erro ao carregar estatísticas do dashboard." 
    });
  }
};
