/* USADO PARA MONGODB
import { v2 as cloudinary } from "cloudinary";
import Banner from "../models/bannerModel.js";

const getBannerImage = async (req, res) => {
  try {
    const banner = await Banner.findOne();
    if (!banner) {
      return res.json({ success: false, message: "Imagem do banner não encontrada." });
    }
    res.json({ success: true, banner });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Erro ao obter a imagem do banner." });
  }
};

const updateBannerImage = async (req, res) => {
  try {
    const image = req.files.image && req.files.image[0];
    const imageUrl = await cloudinary.uploader.upload(image.path, {
      resource_type: "image",
    });

    let banner = await Banner.findOne();
    if (!banner) {
      banner = await Banner.create({ imageUrl: imageUrl.secure_url });
    } else {
      banner.imageUrl = imageUrl.secure_url;
      await banner.save();
    }

    res.json({ success: true, message: "Imagem do banner atualizada com sucesso!", banner });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Erro ao atualizar a imagem do banner." });
  }
};

export { getBannerImage, updateBannerImage };*/

// Arquivo: bannerController.js
// Status: Correto e compatível. Nenhuma alteração crítica necessária.

import { v2 as cloudinary } from "cloudinary";
import Banner from "../models/bannerModel.js";

const getBannerImage = async (req, res) => {
    try {
        
        const banner = await Banner.findOne(); 
        if (!banner) {
            
            return res.status(404).json({ success: false, message: "Imagem do banner não encontrada." });
        }
        res.json({ success: true, banner });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erro ao obter a imagem do banner." });
    }
};

const updateBannerImage = async (req, res) => {
    try {
        
        const image = req.files.image && req.files.image[0];
        if (!image) {
            return res.status(400).json({ success: false, message: "Nenhuma imagem enviada." });
        }

        const imageUrl = await cloudinary.uploader.upload(image.path, {
            resource_type: "image",
        });

        
        let banner = await Banner.findOne();
        if (!banner) {
            banner = await Banner.create({ imageUrl: imageUrl.secure_url });
        } else {
            banner.imageUrl = imageUrl.secure_url;
            await banner.save(); 
        }

        res.json({ success: true, message: "Imagem do banner atualizada com sucesso!", banner });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erro ao atualizar a imagem do banner." });
    }
};

export { getBannerImage, updateBannerImage };