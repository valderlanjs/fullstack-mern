// controllers/aboutSectionController.js
import AboutSection from "../models/aboutSection.js";
import { v2 as cloudinary } from "cloudinary";

// Upload helper para imagens
const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "about", resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

// Buscar seção sobre ativa
export const getAboutSection = async (req, res) => {
  try {
    const aboutSection = await AboutSection.findOne({
      where: { isActive: true }
    });

    if (!aboutSection) {
      return res.json({
        success: true,
        aboutSection: {
          title: "Grupo Madenobre",
          content: "Há mais de 25 anos, o Grupo Madenobre se consolidou como referência no mercado de madeiras em Maceió. Somos mais do que uma empresa de materiais de construção, somos parceiros dos seus sonhos e projetos. Acreditamos que cada obra é única, por isso, oferecemos soluções personalizadas que transcendem o simples fornecimento de produtos.",
          imageUrl: "/default-about.jpg",
          imageAlt: "Sobre o Grupo Madenobre",
          button1Text: "Saiba Mais",
          button1Link: "/sobre",
          button2Text: "Contato", 
          button2Link: "/contato"
        }
      });
    }

    res.json({
      success: true,
      aboutSection
    });
  } catch (error) {
    console.error("Erro ao buscar seção sobre:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao carregar seção sobre."
    });
  }
};

// Buscar todas as seções sobre (admin)
export const getAllAboutSections = async (req, res) => {
  try {
    const aboutSections = await AboutSection.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      aboutSections
    });
  } catch (error) {
    console.error("Erro ao buscar seções sobre:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao carregar seções sobre."
    });
  }
};

// Criar ou atualizar seção sobre
// controllers/aboutSectionController.js - atualize a função createOrUpdateAboutSection
export const createOrUpdateAboutSection = async (req, res) => {
  try {
    const {
      title,
      content,
      imageAlt,
      button1Text,
      button1Link,
      button2Text,
      button2Link,
      stat1Number,
      stat1Label,
      stat2Number,
      stat2Label,
      stat3Number,
      stat3Label
    } = req.body;

    let imageUrl = req.body.imageUrl;

    // Upload de imagem se for fornecida
    if (req.files && req.files.image) {
      console.log("Fazendo upload da imagem...");
      imageUrl = await streamUpload(req.files.image[0].buffer);
    }

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "URL da imagem é obrigatória."
      });
    }

    // Desativar todas as seções existentes
    await AboutSection.update({ isActive: false }, { where: {} });

    // Criar nova seção ativa
    const aboutSection = await AboutSection.create({
      title: title || "Grupo Madenobre",
      content,
      imageUrl,
      imageAlt: imageAlt || "Sobre o Grupo Madenobre",
      button1Text: button1Text || "Saiba Mais",
      button1Link: button1Link || "/sobre",
      button2Text: button2Text || "Contato",
      button2Link: button2Link || "/contato",
      stat1Number: stat1Number || "25+",
      stat1Label: stat1Label || "Anos",
      stat2Number: stat2Number || "500+",
      stat2Label: stat2Label || "Projetos",
      stat3Number: stat3Number || "100%",
      stat3Label: stat3Label || "Qualidade",
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: "Seção sobre atualizada com sucesso!",
      aboutSection
    });
  } catch (error) {
    console.error("Erro ao salvar seção sobre:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao salvar seção sobre."
    });
  }
};
// Deletar seção sobre
export const deleteAboutSection = async (req, res) => {
  try {
    const { id } = req.params;

    const aboutSection = await AboutSection.findByPk(id);
    if (!aboutSection) {
      return res.status(404).json({
        success: false,
        message: "Seção sobre não encontrada."
      });
    }

    await AboutSection.destroy({ where: { id } });

    res.json({
      success: true,
      message: "Seção sobre excluída com sucesso!"
    });
  } catch (error) {
    console.error("Erro ao excluir seção sobre:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao excluir seção sobre."
    });
  }
};

