
import { v2 as cloudinary } from "cloudinary";
import Vendor from "../models/vendorModel.js";

// Função para upload via buffer (stream)
const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "vendors", resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

const addVendor = async (req, res) => {
  try {
    const { name, email } = req.body;
    const image = req.files?.image?.[0];

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "A imagem é obrigatória.",
      });
    }

    // Validação adicional do tamanho (backup)
    if (image.size > 1 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "A imagem deve ter no máximo 1MB.",
      });
    }

    const imageUrl = await streamUpload(image.buffer);

    const vendor = await Vendor.create({
      name,
      email,
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Vendedor adicionado com sucesso!",
      vendor,
    });
  } catch (error) {
    console.error("Erro ao adicionar vendedor:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: "Erro ao adicionar vendedor.",
    });
  }
};

const listVendors = async (req, res) => {
  try {
    const vendors = await Vendor.findAll();
    res.json({ success: true, vendors });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erro ao listar vendedores.",
    });
  }
};

const updateVendor = async (req, res) => {
  try {
    const { id, name, email } = req.body;

    const updatedData = {};
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;

    if (req.files?.image?.[0]) {
      const image = req.files.image[0];
      const imageUrl = await streamUpload(image.buffer);
      updatedData.image = imageUrl;
    }

    const [affectedRows] = await Vendor.update(updatedData, {
      where: { id },
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Vendedor não encontrado.",
      });
    }

    const updatedVendor = await Vendor.findByPk(id);

    res.json({
      success: true,
      message: "Vendedor atualizado com sucesso!",
      vendor: updatedVendor,
    });
  } catch (error) {
    console.error("Erro ao atualizar vendedor:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar vendedor.",
    });
  }
};

const removeVendor = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID do vendedor não fornecido.",
      });
    }

    const result = await Vendor.destroy({ where: { id } });

    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: "Vendedor não encontrado.",
      });
    }

    res.json({ success: true, message: "Vendedor removido com sucesso!" });
  } catch (error) {
    console.error("Erro ao remover vendedor:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: "Erro ao remover vendedor.",
    });
  }
};

export { addVendor, listVendors, updateVendor, removeVendor };
