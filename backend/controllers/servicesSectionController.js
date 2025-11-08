// controllers/servicesSectionController.js
import ServicesSection from "../models/servicesSectionModel.js";
import { v2 as cloudinary } from "cloudinary";

// Upload helper para imagens
const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "services", resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

// Buscar seção de serviços ativa
export const getServicesSection = async (req, res) => {
  try {
    const servicesSection = await ServicesSection.findOne({
      where: { isActive: true }
    });

    if (!servicesSection) {
      return res.json({
        success: true,
        servicesSection: {
          section1Title: "O que nós oferecemos",
          section1Description: "Descrição dos serviços oferecidos pela empresa",
          section1Image: "/default-services-1.jpg",
          section1ImageAlt: "Serviços oferecidos",
          section2Title: "Nós nos concentramos em todos os detalhes",
          section2Image: "/default-services-2.jpg", 
          section2ImageAlt: "Detalhes e qualidade",
          ctaText: "Faça um orçamento",
          ctaLink: "/contact",
          services: [
            {
              title: "Corte sob medida",
              description: "Seja para construção ou reforma, nossa equipe especializada te auxilia na escolha da madeira ideal para o seu projeto, com corte sob medida."
            },
            {
              title: "Madeira da melhor qualidade",
              description: "Com a qualidade incontestável de nossos produtos. Tudo o que você precisa para transformar sua ideia em realidade, reunidos em um só lugar, com qualidade garantida e preços competitivos."
            }
          ],
          features: [
            {
              title: "Atendimento",
              description: "Atendimento excepcional do início ao fim. Sua satisfação é nossa prioridade."
            },
            {
              title: "Qualidade", 
              description: "Qualidade incomparável em cada pedaço de madeira que entregamos."
            },
            {
              title: "Entrega",
              description: "Entrega rápida e segura em cada canto. Pontualidade e cuidado em cada passo do trajeto."
            }
          ]
        }
      });
    }

    res.json({
      success: true,
      servicesSection
    });
  } catch (error) {
    console.error("Erro ao buscar seção de serviços:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao carregar seção de serviços."
    });
  }
};

// Buscar todas as seções de serviços (admin)
export const getAllServicesSections = async (req, res) => {
  try {
    const servicesSections = await ServicesSection.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      servicesSections
    });
  } catch (error) {
    console.error("Erro ao buscar seções de serviços:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao carregar seções de serviços."
    });
  }
};

// Criar ou atualizar seção de serviços
export const createOrUpdateServicesSection = async (req, res) => {
  try {
    const {
      section1Title,
      section1Description,
      section1ImageAlt,
      section2Title,
      section2ImageAlt,
      ctaText,
      ctaLink,
      services,
      features
    } = req.body;

    let section1Image = req.body.section1Image;
    let section2Image = req.body.section2Image;

    // Upload das imagens se fornecidas
    if (req.files) {
      if (req.files.section1Image) {
        console.log("Fazendo upload da imagem da seção 1...");
        section1Image = await streamUpload(req.files.section1Image[0].buffer);
      }
      if (req.files.section2Image) {
        console.log("Fazendo upload da imagem da seção 2...");
        section2Image = await streamUpload(req.files.section2Image[0].buffer);
      }
    }

    if (!section1Image || !section2Image) {
      return res.status(400).json({
        success: false,
        message: "URLs das imagens são obrigatórias."
      });
    }

    // Parse dos arrays JSON
    let servicesArray = [];
    let featuresArray = [];

    try {
      servicesArray = services ? JSON.parse(services) : [];
      featuresArray = features ? JSON.parse(features) : [];
    } catch (parseError) {
      console.error("Erro ao fazer parse dos arrays:", parseError);
      return res.status(400).json({
        success: false,
        message: "Formato inválido para serviços ou diferenciais."
      });
    }

    // Desativar todas as seções existentes
    await ServicesSection.update({ isActive: false }, { where: {} });

    // Criar nova seção ativa
    const servicesSection = await ServicesSection.create({
      section1Title: section1Title || "O que nós oferecemos",
      section1Description: section1Description || "Descrição dos serviços oferecidos",
      section1Image,
      section1ImageAlt: section1ImageAlt || "Serviços oferecidos",
      section2Title: section2Title || "Nós nos concentramos em todos os detalhes",
      section2Image,
      section2ImageAlt: section2ImageAlt || "Detalhes e qualidade",
      ctaText: ctaText || "Faça um orçamento",
      ctaLink: ctaLink || "/contact",
      services: servicesArray,
      features: featuresArray,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: "Seção de serviços atualizada com sucesso!",
      servicesSection
    });
  } catch (error) {
    console.error("Erro ao salvar seção de serviços:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao salvar seção de serviços."
    });
  }
};

// Deletar seção de serviços
export const deleteServicesSection = async (req, res) => {
  try {
    const { id } = req.params;

    const servicesSection = await ServicesSection.findByPk(id);
    if (!servicesSection) {
      return res.status(404).json({
        success: false,
        message: "Seção de serviços não encontrada."
      });
    }

    await ServicesSection.destroy({ where: { id } });

    res.json({
      success: true,
      message: "Seção de serviços excluída com sucesso!"
    });
  } catch (error) {
    console.error("Erro ao excluir seção de serviços:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao excluir seção de serviços."
    });
  }
};