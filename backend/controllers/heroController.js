import { v2 as cloudinary } from "cloudinary";
import Hero from "../models/heroModel.js";

const getHeroImage = async (req, res) => {
  try {
    const hero = await Hero.findOne();
    if (!hero) {
      return res.json({ success: false, message: "Imagem do home não encontrada." });
    }
    res.json({ success: true, hero });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Erro ao obter a imagem do home." });
  }
};

const updateHeroImage = async (req, res) => {
  try {
    const image = req.files.image && req.files.image[0];
    const imageUrl = await cloudinary.uploader.upload(image.path, {
      resource_type: "image",
    });

    let hero = await Hero.findOne();
    if (!hero) {
      hero = await Hero.create({ imageUrl: imageUrl.secure_url });
    } else {
      hero.imageUrl = imageUrl.secure_url;
      await hero.save();
    }

    res.json({ success: true, message: "Imagem do home atualizada com sucesso!", hero });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Erro ao atualizar a imagem do home." });
  }
};

export { getHeroImage, updateHeroImage };
