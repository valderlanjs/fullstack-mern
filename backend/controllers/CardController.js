import Card from "../models/CardModel.js";
import { v2 as cloudinary } from "cloudinary";
import CardSection from "../models/cardSection.js"; 

// Upload helper
const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "cards", resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

// Criar 3 cards
export const createCardGroup = async (req, res) => {
  try {
    const { sectionTitle, title1, subtitle1, link1, title2, subtitle2, link2, title3, subtitle3, link3 } = req.body;
    const files = req.files;

    if (!sectionTitle || !title1 || !subtitle1 || !files.image1 ||
        !title2 || !subtitle2 || !files.image2 ||
        !title3 || !subtitle3 || !files.image3) {
      return res.status(400).json({ success: false, message: "Preencha todos os campos." });
    }

    const imageUrls = await Promise.all([
      streamUpload(files.image1[0].buffer),
      streamUpload(files.image2[0].buffer),
      streamUpload(files.image3[0].buffer),
    ]);

    const section = await CardSection.create({ title: sectionTitle });

    const cards = await Promise.all([
      Card.create({ title: title1, subtitle: subtitle1, link: link1, image: imageUrls[0], sectionId: section.id }),
      Card.create({ title: title2, subtitle: subtitle2, link: link2, image: imageUrls[1], sectionId: section.id }),
      Card.create({ title: title3, subtitle: subtitle3, link: link3, image: imageUrls[2], sectionId: section.id }),
    ]);

    res.status(201).json({ success: true, message: "Cards e título criados com sucesso!", section, cards });
  } catch (error) {
    console.error("Erro ao criar cards:", error.message);
    res.status(500).json({ success: false, message: "Erro interno ao criar cards." });
  }
};

// Listar todos os cards
export const getCards = async (req, res) => {
  try {
    const section = await CardSection.findOne({ order: [["createdAt", "DESC"]] });
    const cards = await Card.findAll({
      where: { sectionId: section?.id || null },
      order: [["createdAt", "ASC"]],
    });

    res.json({
      success: true,
      sectionTitle: section?.title || "",
      cards,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSectionTitle = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || title.trim() === "") {
      return res.status(400).json({ success: false, message: "Título inválido." });
    }

    const section = await CardSection.findOne({ order: [["createdAt", "DESC"]] });

    if (section) {
      section.title = title;
      await section.save();
      return res.json({ success: true, message: "Título atualizado com sucesso!" });
    } else {
      const newSection = await CardSection.create({ title });
      return res.json({ success: true, message: "Título criado com sucesso!", section: newSection });
    }
  } catch (error) {
    console.error("Erro ao atualizar título:", error.message);
    res.status(500).json({ success: false, message: "Erro ao atualizar título." });
  }
};



// Excluir card individual
export const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;

    const card = await Card.findByPk(id);
    if (!card) {
      return res.status(404).json({ success: false, message: "Card não encontrado." });
    }

    await Card.destroy({ where: { id } });
    res.json({ success: true, message: "Card excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir card:", error.message);
    res.status(500).json({ success: false, message: "Erro ao excluir card." });
  }
};
