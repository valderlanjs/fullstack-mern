import { v2 as cloudinary } from "cloudinary";
import Vendor from "../models/vendorModel.js";

const addVendor = async (req, res) => {
  try {
    const { name, email, whatsapp } = req.body;
    const image = req.files.image && req.files.image[0];

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

    res.json({
      success: true,
      message: "Vendedor adicionado com sucesso!",
      vendor,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Erro ao adicionar vendedor." });
  }
};

const listVendors = async (req, res) => {
  try {
    const vendors = await Vendor.findAll();
    res.json({ success: true, vendors });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Erro ao listar vendedores." });
  }
};

const updateVendor = async (req, res) => {
  try {
    const { id, name, email, whatsapp } = req.body;
    const vendor = await Vendor.findByPk(id);

    if (!vendor) {
      return res.json({ success: false, message: "Vendedor não encontrado." });
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

    await vendor.update(updatedData);

    res.json({
      success: true,
      message: "Vendedor atualizado com sucesso!",
      vendor,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Erro ao atualizar vendedor." });
  }
};

const removeVendor = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.json({ success: false, message: "ID do vendedor não fornecido." });
    }

    const result = await Vendor.destroy({ where: { id } });

    if (result === 0) {
      return res.json({ success: false, message: "Vendedor não encontrado ou não foi possível removê-lo." });
    }

    res.json({ success: true, message: "Vendedor removido com sucesso!" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Erro ao remover vendedor." });
  }
};

export { addVendor, listVendors, updateVendor, removeVendor };
