import { v2 as cloudinary } from "cloudinary";
import Banner from "../models/bannerModel.js";

// Função auxiliar para upload via buffer
const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "banners", resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

const getBannerImage = async (req, res) => {
  try {
    const banner = await Banner.findOne();
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Imagem do banner não encontrada.",
      });
    }
    res.json({ success: true, banner });
  } catch (error) {
    console.error("Erro ao obter imagem do banner:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: "Erro ao obter a imagem do banner.",
    });
  }
};

const updateBannerImage = async (req, res) => {
  try {
    const image = req.files?.image?.[0];
    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Nenhuma imagem enviada.",
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

    let banner = await Banner.findOne();
    if (!banner) {
      banner = await Banner.create({ imageUrl });
    } else {
      banner.imageUrl = imageUrl;
      await banner.save();
    }

    res.json({
      success: true,
      message: "Imagem do banner atualizada com sucesso!",
      banner,
    });
  } catch (error) {
    console.error("Erro ao atualizar imagem do banner:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar a imagem do banner.",
    });
  }
};

export { getBannerImage, updateBannerImage };