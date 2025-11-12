import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";
import Product from "../models/productModel.js";

// Schema atualizado - removendo os enums fixos
const ProductCreateSchema = z.object({
  name: z.string()
    .min(1, "Nome é obrigatório")
    .max(255, "Nome deve ter no máximo 255 caracteres")
    .trim(),
  
  category: z.string()
    .min(1, "Categoria é obrigatória")
    .max(100, "Categoria deve ter no máximo 100 caracteres")
    .trim(),
  
  subCategory: z.string()
    .min(1, "Tipo do produto é obrigatório")
    .max(100, "Tipo do produto deve ter no máximo 100 caracteres")
    .trim(),
  
  popular: z.union([
    z.string().transform(val => val === "true"),
    z.boolean()
  ]).default(false),
});

// Resto do código permanece igual...
const ProductIdSchema = z.object({
  id: z.coerce.number()
    .int("ID deve ser um número inteiro")
    .positive("ID deve ser um número positivo")
});

const ProductParamsSchema = z.object({
  productId: z.coerce.number()
    .int("ID do produto deve ser um número inteiro")
    .positive("ID do produto deve ser um número positivo")
});

// Validação de arquivos (mantida igual)
const validateFiles = (files) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  const maxSize = 9 * 1024 * 1024;

  if (files.length === 0) {
    throw new Error("Pelo menos uma imagem é necessária");
  }

  const mainImage = files[0];
  if (!mainImage) {
    throw new Error("A imagem principal (image1) é obrigatória");
  }

  for (const file of files) {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error(`Tipo de arquivo não permitido: ${file.originalname}. Use apenas JPG, PNG ou WebP.`);
    }
    
    if (file.size > maxSize) {
      throw new Error(`Arquivo muito grande: ${file.originalname} (${(file.size / 1024 / 1024).toFixed(2)} MB). Máximo: 9MB.`);
    }
  }
};

const extractFiles = (files) => {
  const extractedFiles = [];
  if (files?.image1?.[0]) extractedFiles.push(files.image1[0]);
  if (files?.image2?.[0]) extractedFiles.push(files.image2[0]);
  if (files?.image3?.[0]) extractedFiles.push(files.image3[0]);
  if (files?.image4?.[0]) extractedFiles.push(files.image4[0]);
  return extractedFiles;
};

const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products", resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

// Novo endpoint para buscar categorias e tipos únicos
const getProductFilters = async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ['category', 'subCategory'],
      raw: true
    });

    // Extrair valores únicos
    const categories = [...new Set(products.map(p => p.category))].filter(Boolean).sort();
    const subCategories = [...new Set(products.map(p => p.subCategory))].filter(Boolean).sort();

    res.json({
      success: true,
      categories,
      subCategories
    });
  } catch (error) {
    console.error("Erro ao buscar filtros:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar categorias e tipos"
    });
  }
};

const addProduct = async (req, res) => {
  try {
    const validatedData = ProductCreateSchema.parse(req.body);
    const files = extractFiles(req.files);
    
    console.log("Dados validados:", validatedData);
    console.log("Arquivos recebidos:", files.length);

    validateFiles(files);

    const uploadPromises = files.map(async (file) => {
      try {
        return await streamUpload(file.buffer);
      } catch (uploadError) {
        throw new Error(`Falha no upload da imagem ${file.originalname}`);
      }
    });

    const imagesUrl = await Promise.all(uploadPromises);

    const productData = {
      ...validatedData,
      image: imagesUrl,
    };

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: "Produto adicionado com sucesso!",
      product: {
        id: product.id,
        name: product.name,
        category: product.category,
        subCategory: product.subCategory,
        image: product.image,
        popular: product.popular,
      },
    });
  } catch (error) {
    console.error("Erro ao adicionar produto:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Dados de entrada inválidos",
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    
    if (error.message.includes("imagem") || error.message.includes("arquivo")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Erro ao adicionar produto.",
    });
  }
};

// Resto das funções (listProduct, removeProduct, singleProduct) mantidas iguais...
const listProduct = async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erro ao listar produtos." });
  }
};

const removeProduct = async (req, res) => {
  try {
    const { id } = ProductIdSchema.parse(req.body);
    const result = await Product.destroy({ where: { id } });
    
    if (result === 0) {
      return res.status(404).json({ success: false, message: "Produto não encontrado." });
    }
    
    res.json({ success: true, message: "Produto removido com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erro ao remover produto." });
  }
};

const singleProduct = async (req, res) => {
  try {
    const { productId } = ProductParamsSchema.parse(req.params);
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

// Exportar a nova função
export { addProduct, listProduct, removeProduct, singleProduct, getProductFilters };