import MarketingMessage from "../models/messageModel.js";

const createMessage = async (req, res) => {
  try {
    const { message, backgroundColor, textColor, buttonText, buttonLink } = req.body;

    // Desativa todas as outras mensagens
    await MarketingMessage.update({ isActive: false }, { where: {} });

    const marketingMessage = await MarketingMessage.create({
      message,
      isActive: true,
      backgroundColor,
      textColor,
      buttonText,
      buttonLink
    });

    res.status(201).json({
      success: true,
      message: "Mensagem de marketing criada e ativada!",
      data: marketingMessage
    });
  } catch (error) {
    console.error("Erro ao criar mensagem:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao criar mensagem de marketing."
    });
  }
};

const getActiveMessage = async (req, res) => {
  try {
    const message = await MarketingMessage.findOne({
      where: { isActive: true }
    });

    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error("Erro ao buscar mensagem:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar mensagem ativa."
    });
  }
};

const toggleMessage = async (req, res) => {
  try {
    const { id, isActive } = req.body;

    const message = await MarketingMessage.findByPk(id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Mensagem não encontrada."
      });
    }

    // Se está ativando, desativa todas as outras
    if (isActive) {
      await MarketingMessage.update({ isActive: false }, { where: {} });
    }

    await message.update({ isActive });

    res.json({
      success: true,
      message: `Mensagem ${isActive ? 'ativada' : 'desativada'} com sucesso!`,
      data: message
    });
  } catch (error) {
    console.error("Erro ao alternar mensagem:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao alternar status da mensagem."
    });
  }
};

const getAllMessages = async (req, res) => {
  try {
    const messages = await MarketingMessage.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error("Erro ao listar mensagens:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao listar mensagens."
    });
  }
};

const updateMessage = async (req, res) => {
  try {
    const { id, message, backgroundColor, textColor, buttonText, buttonLink } = req.body;

    const marketingMessage = await MarketingMessage.findByPk(id);
    
    if (!marketingMessage) {
      return res.status(404).json({
        success: false,
        message: "Mensagem não encontrada."
      });
    }

    await marketingMessage.update({
      message,
      backgroundColor,
      textColor,
      buttonText,
      buttonLink
    });

    res.json({
      success: true,
      message: "Mensagem atualizada com sucesso!",
      data: marketingMessage
    });
  } catch (error) {
    console.error("Erro ao atualizar mensagem:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar mensagem."
    });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.body;

    const result = await MarketingMessage.destroy({ where: { id } });

    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: "Mensagem não encontrada."
      });
    }

    res.json({
      success: true,
      message: "Mensagem removida com sucesso!"
    });
  } catch (error) {
    console.error("Erro ao remover mensagem:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao remover mensagem."
    });
  }
};

export { 
  createMessage, 
  getActiveMessage, 
  toggleMessage, 
  getAllMessages, 
  updateMessage, 
  deleteMessage 
};