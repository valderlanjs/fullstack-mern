// controllers/faqController.js
import { Faq } from "../models/Faq.js";

// GET /api/faqs - Listar todas as FAQs (público)
export const getFaqs = async (req, res) => {
  try {
    const faqs = await Faq.findAll({
      order: [['order', 'ASC']]
    });
    
    res.json({ 
      success: true, 
      faqs 
    });
  } catch (error) {
    console.error("Erro ao buscar FAQs:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erro interno do servidor" 
    });
  }
};

// POST /api/faqs - Criar nova FAQ (admin)
export const createFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: "Pergunta e resposta são obrigatórias"
      });
    }

    // Encontrar a última ordem
    const lastFaq = await Faq.findOne({
      order: [['order', 'DESC']]
    });

    const newOrder = lastFaq ? lastFaq.order + 1 : 1;

    const faq = await Faq.create({
      question,
      answer,
      order: newOrder
    });

    res.status(201).json({
      success: true,
      faq
    });
  } catch (error) {
    console.error("Erro ao criar FAQ:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
};

// PUT /api/faqs/:id - Atualizar FAQ (admin)
export const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;

    const faq = await Faq.findByPk(id);
    
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ não encontrada"
      });
    }

    await faq.update({
      question: question || faq.question,
      answer: answer || faq.answer
    });

    res.json({
      success: true,
      faq
    });
  } catch (error) {
    console.error("Erro ao atualizar FAQ:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
};

// DELETE /api/faqs/:id - Deletar FAQ (admin)
export const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;

    const faq = await Faq.findByPk(id);
    
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ não encontrada"
      });
    }

    await faq.destroy();

    res.json({
      success: true,
      message: "FAQ deletada com sucesso"
    });
  } catch (error) {
    console.error("Erro ao deletar FAQ:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
};

// PUT /api/faqs/:id/move - Mover FAQ na ordem (admin)
export const moveFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { direction } = req.body;

    if (!direction || !['up', 'down'].includes(direction)) {
      return res.status(400).json({
        success: false,
        message: "Direção inválida. Use 'up' ou 'down'"
      });
    }

    const faq = await Faq.findByPk(id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ não encontrada"
      });
    }

    const allFaqs = await Faq.findAll({
      order: [['order', 'ASC']]
    });

    const currentIndex = allFaqs.findIndex(f => f.id === parseInt(id));

    if ((direction === 'up' && currentIndex === 0) || 
        (direction === 'down' && currentIndex === allFaqs.length - 1)) {
      return res.status(400).json({
        success: false,
        message: "Movimento inválido"
      });
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const targetFaq = allFaqs[targetIndex];

    // Trocar as ordens
    const tempOrder = faq.order;
    await faq.update({ order: targetFaq.order });
    await targetFaq.update({ order: tempOrder });

    res.json({
      success: true,
      message: "Ordem atualizada com sucesso"
    });
  } catch (error) {
    console.error("Erro ao mover FAQ:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
};