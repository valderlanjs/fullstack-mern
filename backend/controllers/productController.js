/*import { v2 as cloudinary } from "cloudinary";
import Product from "../models/productModel.js";

const addProduct = async (req, res) => {
    try {
        const { name, category, subCategory, popular } = req.body; // Removi 'image' daqui, pois é um array de arquivos/URLs
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        // Certifique-se de que `req.files` está sendo populado corretamente pelo seu middleware de upload (ex: Multer)
        // E que os nomes dos campos no formulário (image1, image2, etc.) correspondem

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
            image: imagesUrl, // Armazena um array de URLs
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
        // CORREÇÃO: Use Product.find() para listar todos os produtos
        const products = await Product.find({});
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
        if (!id) {
            return res.json({
                success: false,
                message: "ID do produto não fornecido.",
            });
        }

        // CORREÇÃO: Use findByIdAndDelete para remover pelo _id do MongoDB
        // Ou findOneAndDelete se preferir, passando { _id: id }
        const result = await Product.findByIdAndDelete(id);

        if (!result) { // Se result for null, significa que o produto não foi encontrado
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
        const { productId } = req.body; // Se você está passando na rota como param, use req.params.productId
        // CORREÇÃO: Use findById para buscar um produto pelo _id
        const product = await Product.findById(productId);

        if (!product) {
            return res.json({ success: false, message: "Produto não encontrado." });
        }

        res.json({ success: true, product });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Erro ao buscar produto." });
    }
};

export { addProduct, listProduct, removeProduct, singleProduct };*/


import { v2 as cloudinary } from "cloudinary";
import Product from "../models/productModel.js";


const addProduct = async (req, res) => {
    try {
        const { name, category, subCategory, popular } = req.body;
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter(
            (item) => item !== undefined
        );

        if (images.length === 0) {
            return res.status(400).json({ success: false, message: "Pelo menos uma imagem é necessária." });
        }

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

        res.status(201).json({
            success: true,
            message: "Produto adicionado com sucesso!",
            product,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erro ao adicionar produto." });
    }
};

const listProduct = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json({ success: true, products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erro ao listar produtos." });
    }
};

const removeProduct = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "ID do produto não fornecido.",
            });
        }

        const result = await Product.destroy({
            where: {
                id: id
            }
        });

        if (result === 0) {
            return res.status(404).json({
                success: false,
                message: "Produto não encontrado.",
            });
        }

        res.json({ success: true, message: "Produto removido com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erro ao remover produto." });
    }
};

const singleProduct = async (req, res) => {
    try {
        
        const { productId } = req.params; 
        
        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: "Produto não encontrado." });
        }

        res.json({ success: true, product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erro ao buscar produto." });
    }
};

export { addProduct, listProduct, removeProduct, singleProduct };