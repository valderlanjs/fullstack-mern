import { v2 as cloudinary } from "cloudinary";
import Vendor from "../models/vendorModel.js";

// Função para adicionar um novo vendedor (já estava correta)
const addVendor = async (req, res) => {
  try {
    const { name, email, whatsapp } = req.body;
    const image = req.files.image && req.files.image[0];

    if (!image) {
        return res.json({ success: false, message: "A imagem é obrigatória." });
    }

    const imageUrl = await cloudinary.uploader.upload(image.path, {
      resource_type: "image",
    });

    const vendorData = {
      name,
      email,
      image: imageUrl.secure_url,
      whatsapp,
    };

    const vendor = await Vendor.create(vendorData);

    res.status(201).json({
      success: true,
      message: "Vendedor adicionado com sucesso!",
      vendor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erro ao adicionar vendedor." });
  }
};

// Função para listar todos os vendedores (corrigida)
const listVendors = async (req, res) => {
  try {
    // CORREÇÃO: Usado o método find() do Mongoose
    const vendors = await Vendor.find();
    res.json({ success: true, vendors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erro ao listar vendedores." });
  }
};

// Função para atualizar um vendedor (corrigida)
const updateVendor = async (req, res) => {
  try {
    const { id, name, email, whatsapp } = req.body;

    // CORREÇÃO: Usado o método findById() do Mongoose
    const vendor = await Vendor.findById(id);

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendedor não encontrado." });
    }

    const updatedData = {
      name: name || vendor.name,
      email: email || vendor.email,
      whatsapp: whatsapp || vendor.whatsapp,
    };

    if (req.files && req.files.image) {
      const image = req.files.image[0];
      const imageUrl = await cloudinary.uploader.upload(image.path, {
        resource_type: "image",
      });
      updatedData.image = imageUrl.secure_url;
    }

    // CORREÇÃO: Usado findByIdAndUpdate() para uma atualização atômica
    const updatedVendor = await Vendor.findByIdAndUpdate(id, updatedData, {
      new: true, // Opção para retornar o documento já atualizado
    });

    res.json({
      success: true,
      message: "Vendedor atualizado com sucesso!",
      vendor: updatedVendor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erro ao atualizar vendedor." });
  }
};

// Função para remover um vendedor (corrigida)
const removeVendor = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "ID do vendedor não fornecido." });
    }

    // CORREÇÃO: Usado findByIdAndDelete() do Mongoose
    const deletedVendor = await Vendor.findByIdAndDelete(id);

    if (!deletedVendor) {
      return res.status(404).json({ success: false, message: "Vendedor não encontrado." });
    }

    res.json({ success: true, message: "Vendedor removido com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erro ao remover vendedor." });
  }
};

export { addVendor, listVendors, updateVendor, removeVendor };