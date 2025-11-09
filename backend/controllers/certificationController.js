// controllers/certificationController.js
import { CertificationSection } from "../models/certificationSection.js";
import { v2 as cloudinary } from "cloudinary";

// Upload helper para imagens
const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "certifications", resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

// Buscar seção de certificações
export const getCertificationSection = async (req, res) => {
  try {
    let certificationSection = await CertificationSection.findOne();
    
    if (!certificationSection) {
      certificationSection = await CertificationSection.create({});
    }
    
    res.json({ 
      success: true, 
      certificationSection 
    });
  } catch (error) {
    console.error("Erro ao buscar seção de certificações:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Atualizar seção de certificações
export const updateCertificationSection = async (req, res) => {
  try {
    const {
      fscTitle,
      fscDescription1,
      fscDescription2,
      fscDescription3,
      fscImageAlt,
      dofTitle,
      dofDescription,
      dofImageAlt
    } = req.body;

    let fscImage = req.body.fscImage;
    let dofImage = req.body.dofImage;

    // Upload da imagem FSC se for fornecida
    if (req.files?.fscImage) {
      console.log("Fazendo upload da imagem FSC...");
      fscImage = await streamUpload(req.files.fscImage[0].buffer);
    }

    // Upload da imagem DOF se for fornecida
    if (req.files?.dofImage) {
      console.log("Fazendo upload da imagem DOF...");
      dofImage = await streamUpload(req.files.dofImage[0].buffer);
    }

    // Busca a seção atual
    let certificationSection = await CertificationSection.findOne();
    
    if (!certificationSection) {
      // Cria nova seção se não existir
      certificationSection = await CertificationSection.create({
        fscTitle,
        fscDescription1,
        fscDescription2,
        fscDescription3,
        fscImage,
        fscImageAlt,
        dofTitle,
        dofDescription,
        dofImage,
        dofImageAlt
      });
    } else {
      // Atualiza seção existente
      await certificationSection.update({
        fscTitle: fscTitle || certificationSection.fscTitle,
        fscDescription1: fscDescription1 || certificationSection.fscDescription1,
        fscDescription2: fscDescription2 || certificationSection.fscDescription2,
        fscDescription3: fscDescription3 || certificationSection.fscDescription3,
        fscImage: fscImage || certificationSection.fscImage,
        fscImageAlt: fscImageAlt || certificationSection.fscImageAlt,
        dofTitle: dofTitle || certificationSection.dofTitle,
        dofDescription: dofDescription || certificationSection.dofDescription,
        dofImage: dofImage || certificationSection.dofImage,
        dofImageAlt: dofImageAlt || certificationSection.dofImageAlt
      });
    }

    // Busca os dados atualizados
    const updatedCertificationSection = await CertificationSection.findOne();

    res.json({ 
      success: true, 
      message: "Seção de certificações atualizada com sucesso!",
      certificationSection: updatedCertificationSection 
    });

  } catch (error) {
    console.error("Erro ao atualizar seção de certificações:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};