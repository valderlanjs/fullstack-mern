// controllers/AboutBannerController.js
import { AboutBannerSection } from "../models/AboutBannerModel.js";
import { v2 as cloudinary } from "cloudinary";

// Upload helper para imagens (mesmo padrão do exemplo)
const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "about-banner", resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

// Buscar seção about banner
export const getAboutBannerSection = async (req, res) => {
  try {
    let aboutBannerSection = await AboutBannerSection.findOne();
    
    if (!aboutBannerSection) {
      // Cria dados padrão se não existir
      aboutBannerSection = await AboutBannerSection.create({
        heroTitle: "Nosso objetivo é agregar valor para lares e construções",
        contentTitle: "Promovemos a sustentabilidade e preservação do meio ambiente.",
        contentBadge: "Sustentabilidade",
        contentImageAlt: "Imagem sobre sustentabilidade"
      });
    }
    
    res.json({ 
      success: true, 
      aboutBannerSection 
    });
  } catch (error) {
    console.error("Erro ao buscar seção about banner:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Atualizar seção about banner
export const updateAboutBannerSection = async (req, res) => {
  try {
    const {
      heroTitle,
      contentBadge,
      contentTitle,
      contentDescription,
      contentImageAlt
    } = req.body;

    let heroBackgroundImage = req.body.heroBackgroundImage;
    let contentImage = req.body.contentImage;

    // Upload da nova imagem do hero se for fornecida
    if (req.files?.heroBackgroundImage) {
      console.log("Fazendo upload da imagem do hero...");
      heroBackgroundImage = await streamUpload(req.files.heroBackgroundImage[0].buffer);
    }

    // Upload da nova imagem de conteúdo se for fornecida
    if (req.files?.contentImage) {
      console.log("Fazendo upload da imagem de conteúdo...");
      contentImage = await streamUpload(req.files.contentImage[0].buffer);
    }

    // Busca a seção atual
    let aboutBannerSection = await AboutBannerSection.findOne();
    
    if (!aboutBannerSection) {
      // Cria nova seção se não existir
      aboutBannerSection = await AboutBannerSection.create({
        heroTitle,
        heroBackgroundImage,
        contentBadge,
        contentTitle,
        contentDescription,
        contentImage,
        contentImageAlt
      });
    } else {
      // Atualiza seção existente
      await aboutBannerSection.update({
        heroTitle: heroTitle || aboutBannerSection.heroTitle,
        heroBackgroundImage: heroBackgroundImage || aboutBannerSection.heroBackgroundImage,
        contentBadge: contentBadge || aboutBannerSection.contentBadge,
        contentTitle: contentTitle || aboutBannerSection.contentTitle,
        contentDescription: contentDescription !== undefined ? contentDescription : aboutBannerSection.contentDescription,
        contentImage: contentImage || aboutBannerSection.contentImage,
        contentImageAlt: contentImageAlt || aboutBannerSection.contentImageAlt
      });
    }

    // Busca os dados atualizados
    const updatedAboutBannerSection = await AboutBannerSection.findOne();

    res.json({ 
      success: true, 
      message: "Seção about banner atualizada com sucesso!",
      aboutBannerSection: updatedAboutBannerSection 
    });

  } catch (error) {
    console.error("Erro ao atualizar seção about banner:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Reset para valores padrão
export const resetAboutBannerSection = async (req, res) => {
  try {
    let aboutBannerSection = await AboutBannerSection.findOne();
    
    const defaultData = {
      heroTitle: "Nosso objetivo é agregar valor para lares e construções",
      heroBackgroundImage: "",
      contentBadge: "Sustentabilidade",
      contentTitle: "Promovemos a sustentabilidade e preservação do meio ambiente.",
      contentDescription: "",
      contentImage: "",
      contentImageAlt: "Imagem sobre sustentabilidade"
    };

    if (!aboutBannerSection) {
      aboutBannerSection = await AboutBannerSection.create(defaultData);
    } else {
      await aboutBannerSection.update(defaultData);
    }

    res.json({
      success: true,
      message: "Seção about banner resetada para valores padrão!",
      aboutBannerSection
    });

  } catch (error) {
    console.error("Erro ao resetar seção about banner:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};