// controllers/logoController.js
import { v2 as cloudinary } from "cloudinary";
import Logo from "../models/logoModel.js";

// Função auxiliar para upload via buffer (igual ao banner)
const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "logos", resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

// Obter logo ativa
const getActiveLogo = async (req, res) => {
  try {
    const logo = await Logo.findOne({ where: { isActive: true } });
    
    if (!logo) {
      return res.status(404).json({
        success: false,
        message: "Logo não encontrada.",
      });
    }
    
    res.json({ 
      success: true, 
      logo 
    });
  } catch (error) {
    console.error("Erro ao obter logo:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: "Erro ao obter a logo.",
    });
  }
};

// Obter todas as logos (para admin)
const getAllLogos = async (req, res) => {
  try {
    const logos = await Logo.findAll({ 
      order: [['createdAt', 'DESC']] 
    });
    
    res.json({ 
      success: true, 
      logos 
    });
  } catch (error) {
    console.error("Erro ao obter logos:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: "Erro ao obter as logos.",
    });
  }
};

// Upload/atualizar logo
const uploadLogo = async (req, res) => {
  try {
    const image = req.files?.image?.[0];
    const { altText } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Nenhuma imagem enviada.",
      });
    }

    // Upload para Cloudinary
    const imageUrl = await streamUpload(image.buffer);

    // Desativar todas as logos existentes
    await Logo.update({ isActive: false }, { where: {} });

    // Criar nova logo ativa
    const newLogo = await Logo.create({
      imageUrl,
      altText: altText || "Logo da empresa",
      isActive: true
    });

    res.json({
      success: true,
      message: "Logo atualizada com sucesso!",
      logo: newLogo
    });
  } catch (error) {
    console.error("Erro ao atualizar logo:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar a logo.",
    });
  }
};

// Definir logo como ativa
const setActiveLogo = async (req, res) => {
  try {
    const { id } = req.params;

    // Desativar todas as logos
    await Logo.update({ isActive: false }, { where: {} });

    // Ativar a logo selecionada
    const [updated] = await Logo.update(
      { isActive: true }, 
      { where: { id } }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Logo não encontrada.",
      });
    }

    const activeLogo = await Logo.findByPk(id);

    res.json({
      success: true,
      message: "Logo definida como ativa!",
      logo: activeLogo
    });
  } catch (error) {
    console.error("Erro ao ativar logo:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: "Erro ao definir logo como ativa.",
    });
  }
};

// Deletar logo
const deleteLogo = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Logo.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Logo não encontrada.",
      });
    }

    res.json({
      success: true,
      message: "Logo deletada com sucesso!"
    });
  } catch (error) {
    console.error("Erro ao deletar logo:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: "Erro ao deletar a logo.",
    });
  }
};

export { 
  getActiveLogo, 
  getAllLogos, 
  uploadLogo, 
  setActiveLogo, 
  deleteLogo 
};