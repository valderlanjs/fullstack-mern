// controllers/NewsletterController.js
import Newsletter from "../models/newslleterModel.js";

// Adicionar email à newsletter
export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "Email é obrigatório" 
      });
    }

    // Verificar se email já existe
    const existingSubscriber = await Newsletter.findOne({ 
      where: { email } 
    });

    if (existingSubscriber) {
      return res.status(400).json({ 
        success: false, 
        message: "Este email já está inscrito na newsletter" 
      });
    }

    // Criar novo inscrito
    const subscriber = await Newsletter.create({ email });

    res.status(201).json({ 
      success: true, 
      message: "Inscrito na newsletter com sucesso!",
      subscriber 
    });

  } catch (error) {
    console.error("Erro ao inscrever na newsletter:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erro interno ao processar inscrição" 
    });
  }
};

// Obter todos os inscritos
export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.findAll({
      order: [['subscribedAt', 'DESC']]
    });

    res.json({ 
      success: true, 
      subscribers,
      total: subscribers.length
    });

  } catch (error) {
    console.error("Erro ao buscar inscritos:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erro interno ao buscar inscritos" 
    });
  }
};

// Desativar inscrito
export const unsubscribe = async (req, res) => {
  try {
    const { id } = req.params;

    const subscriber = await Newsletter.findByPk(id);
    
    if (!subscriber) {
      return res.status(404).json({ 
        success: false, 
        message: "Inscrito não encontrado" 
      });
    }

    await subscriber.update({ isActive: false });

    res.json({ 
      success: true, 
      message: "Inscrito removido com sucesso" 
    });

  } catch (error) {
    console.error("Erro ao remover inscrito:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erro interno ao remover inscrito" 
    });
  }
};