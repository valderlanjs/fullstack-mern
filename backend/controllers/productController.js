import {v2 as cloudinary} from "cloudinary";
import productModel from "../models/productModel.js";


// adicionando produto
const addProduct =  async (req, res) => {
    try {
        const { name, category, subCategory, image, popular } = req.body;
        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)
        
        const imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, {resource_type: "image"});

                return result.secure_url
            })
        )

        const productData = {
            name,
            category,
            subCategory,
            image: imagesUrl,
            popular: popular === 'true' ? true : false,
        }

        console.log(productData)

        const product = new productModel(productData)
        await product.save()

        res.json({success: true, message: "Produto adicionado com sucesso!"})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: "Erro ao adicionar produto! Verifique os campos e tente novamente."})
    }
}

// listar produtos
const listProduct =  async (req, res) => {
    try {
        const products = await productModel.find({})
        res.json({success: true, products})
    } catch (error) {
        console.log({success: false, message: error.message})
    }
}

//remover produto
const removeProduct =  async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success: true, message: "Produto removido com sucesso!"})
    } catch (error) {
        console.log({success: false, message: error.message})
    }
}

// produto único
const singleProduct =  async (req, res) => {
    try {
        const {productId} = req.body
        const product = await productModel.findById(productId)
        res.json({success: true, product})
    } catch (error) {
        console.log(error)
        console.log({success: false, message: error.message})
    }
}


export { addProduct, listProduct, removeProduct, singleProduct }