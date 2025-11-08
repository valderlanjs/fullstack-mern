// controllers/sectionController.js
import Section from "../models/sectionModel.js";
import { v2 as cloudinary } from "cloudinary";

// Upload helper para imagens
const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "sections", resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

// Buscar todas as seções ativas
export const getSections = async (req, res) => {
  try {
    const sections = await Section.findAll({
      where: { isActive: true },
      order: [['order', 'ASC'], ['createdAt', 'ASC']]
    });

    res.json({
      success: true,
      sections
    });
  } catch (error) {
    console.error("Erro ao buscar seções:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao carregar seções."
    });
  }
};

// Buscar todas as seções (admin - inclui inativas)
export const getAllSections = async (req, res) => {
  try {
    const sections = await Section.findAll({
      order: [['order', 'ASC'], ['createdAt', 'ASC']]
    });

    res.json({
      success: true,
      sections
    });
  } catch (error) {
    console.error("Erro ao buscar seções:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao carregar seções."
    });
  }
};

// Buscar seção por ID
export const getSectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const section = await Section.findByPk(id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Seção não encontrada."
      });
    }

    res.json({
      success: true,
      section
    });
  } catch (error) {
    console.error("Erro ao buscar seção:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao carregar seção."
    });
  }
};

// Criar nova seção
export const createSection = async (req, res) => {
  try {
    const {
      title,
      content,
      buttonText,
      buttonLink,
      imagePosition,
      imageAlt,
      order
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

    const section = await Section.create({
      title,
      content,
      buttonText: buttonText || null,
      buttonLink: buttonLink || null,
      imagePosition: imagePosition || 'left',
      imageUrl,
      imageAlt: imageAlt || title,
      order: order || 0
    });

    res.status(201).json({
      success: true,
      message: "Seção criada com sucesso!",
      section
    });
  } catch (error) {
    console.error("Erro ao criar seção:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao criar seção."
    });
  }
};

// Atualizar seção
export const updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      buttonText,
      buttonLink,
      imagePosition,
      imageAlt,
      order,
      isActive
    } = req.body;

    const section = await Section.findByPk(id);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Seção não encontrada."
      });
    }

    let imageUrl = req.body.imageUrl;

    // Upload de nova imagem se for fornecida
    if (req.files && req.files.image) {
      console.log("Atualizando imagem...");
      imageUrl = await streamUpload(req.files.image[0].buffer);
    }

    // Atualizar campos
    const updateData = {
      title: title || section.title,
      content: content || section.content,
      buttonText: buttonText !== undefined ? buttonText : section.buttonText,
      buttonLink: buttonLink !== undefined ? buttonLink : section.buttonLink,
      imagePosition: imagePosition || section.imagePosition,
      imageAlt: imageAlt || section.imageAlt,
      order: order !== undefined ? order : section.order,
      isActive: isActive !== undefined ? isActive : section.isActive
    };

    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    await Section.update(updateData, { where: { id } });

    const updatedSection = await Section.findByPk(id);

    res.json({
      success: true,
      message: "Seção atualizada com sucesso!",
      section: updatedSection
    });
  } catch (error) {
    console.error("Erro ao atualizar seção:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar seção."
    });
  }
};

// Deletar seção
export const deleteSection = async (req, res) => {
  try {
    const { id } = req.params;

    const section = await Section.findByPk(id);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Seção não encontrada."
      });
    }

    await Section.destroy({ where: { id } });

    res.json({
      success: true,
      message: "Seção excluída com sucesso!"
    });
  } catch (error) {
    console.error("Erro ao excluir seção:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao excluir seção."
    });
  }
};

// Reordenar seções
export const reorderSections = async (req, res) => {
  try {
    const { sectionsOrder } = req.body;

    if (!Array.isArray(sectionsOrder)) {
      return res.status(400).json({
        success: false,
        message: "Ordem das seções inválida."
      });
    }

    // Atualizar ordem de cada seção
    const updatePromises = sectionsOrder.map((sectionId, index) => 
      Section.update({ order: index }, { where: { id: sectionId } })
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: "Seções reordenadas com sucesso!"
    });
  } catch (error) {
    console.error("Erro ao reordenar seções:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao reordenar seções."
    });
  }
};