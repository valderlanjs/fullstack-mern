// controllers/whatsappController.js
import WhatsAppConfig from "../models/whatsappConfig.js";

const getWhatsAppConfig = async (req, res) => {
  try {
    let config = await WhatsAppConfig.findOne();
    
    if (!config) {
      // Criar configuração padrão se não existir
      config = await WhatsAppConfig.create({
        phone_number: "5599999999999", // Número padrão
        default_message: "Olá! Gostaria de mais informações sobre seus produtos.",
        is_active: true
      });
    }

    res.json({ success: true, config });
  } catch (error) {
    console.error("Erro ao buscar configuração do WhatsApp:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar configuração do WhatsApp."
    });
  }
};

const updateWhatsAppConfig = async (req, res) => {
  try {
    const { phone_number, default_message, is_active } = req.body;

    let config = await WhatsAppConfig.findOne();

    if (!config) {
      config = await WhatsAppConfig.create({
        phone_number,
        default_message,
        is_active: is_active !== undefined ? is_active : true
      });
    } else {
      const updatedData = {};
      if (phone_number) updatedData.phone_number = phone_number;
      if (default_message) updatedData.default_message = default_message;
      if (is_active !== undefined) updatedData.is_active = is_active;

      await config.update(updatedData);
    }

    const updatedConfig = await WhatsAppConfig.findOne();
    
    res.json({
      success: true,
      message: "Configuração do WhatsApp atualizada com sucesso!",
      config: updatedConfig
    });
  } catch (error) {
    console.error("Erro ao atualizar configuração do WhatsApp:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar configuração do WhatsApp."
    });
  }
};

export { getWhatsAppConfig, updateWhatsAppConfig };