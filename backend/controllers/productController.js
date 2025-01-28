import { v2 as cloudinary } from "cloudinary";
import Product from "../models/productModel.js";

const addProduct = async (req, res) => {
  try {
    const { name, category, subCategory, image, popular } = req.body;
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });

        return result.secure_url;
      })
    );

    const productData = {
      name,
      category,
      subCategory,
      image: imagesUrl,
      popular: popular === "true",
    };
    const product = await Product.create(productData);

    res.json({
      success: true,
      message: "Produto adicionado com sucesso!",
      product,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Erro ao adicionar produto." });
  }
};

const listProduct = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json({ success: true, products });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Erro ao listar produtos." });
  }
};

const removeProduct = async (req, res) => {
  try {
    console.log("ID recebido:", req.body.id);

    const { id } = req.body; // Garantir que está vindo no corpo da requisição
    if (!id)
      return res.json({
        success: false,
        message: "ID do produto não fornecido.",
      });

    const result = await Product.destroy({ where: { id } });

    if (result === 0) {
      return res.json({
        success: false,
        message: "Produto não encontrado ou não foi possível removê-lo.",
      });
    }

    res.json({ success: true, message: "Produto removido com sucesso!" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Erro ao remover produto." });
  }
};

const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findByPk(productId);

    if (!product)
      return res.json({ success: false, message: "Produto não encontrado." });

    res.json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Erro ao buscar produto." });
  }
};

export { addProduct, listProduct, removeProduct, singleProduct };
