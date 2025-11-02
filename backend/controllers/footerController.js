// controllers/FooterController.js
import Footer from "../models/footerModel.js";
import { v2 as cloudinary } from "cloudinary";

// Upload helper para imagens
const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "footer", resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

// Criar ou atualizar footer
export const createOrUpdateFooter = async (req, res) => {
  try {
    console.log("Recebendo dados do footer:", req.body);
    console.log("Arquivos recebidos:", req.files);

    const {
      description,
      copyright,
      aboutLink,
      productsLink,
      servicesLink,
      contactLink,
      phone,
      email,
      address,
      facebookUrl,
      instagramUrl,
      quickLinksTitle,
      contactTitle,
      socialTitle
    } = req.body;

    // Verificar se já existe um footer
    let footer = await Footer.findOne();
    console.log("Footer existente:", footer?.id);
    
    const footerData = {
      description: description || null,
      copyright: copyright || null,
      aboutLink: aboutLink || null,
      productsLink: productsLink || null,
      servicesLink: servicesLink || null,
      contactLink: contactLink || null,
      phone: phone || null,
      email: email || null,
      address: address || null,
      facebookUrl: facebookUrl || null,
      instagramUrl: instagramUrl || null,
      quickLinksTitle: quickLinksTitle || "Links Rápidos",
      contactTitle: contactTitle || "Contate-nos",
      socialTitle: socialTitle || "Nossas Redes Sociais"
    };

    // Upload da logo se fornecida
    if (req.files && req.files.logo) {
      console.log("Fazendo upload da nova logo...");
      footerData.logoUrl = await streamUpload(req.files.logo[0].buffer);
      console.log("Nova logo URL:", footerData.logoUrl);
    }

    if (footer) {
      // Atualizar footer existente
      console.log("Atualizando footer existente...");
      await Footer.update(footerData, { where: { id: footer.id } });
      footer = await Footer.findByPk(footer.id);
      console.log("Footer atualizado:", footer);
      res.json({ success: true, message: "Footer atualizado com sucesso!", footer });
    } else {
      // Criar novo footer
      console.log("Criando novo footer...");
      footer = await Footer.create(footerData);
      console.log("Novo footer criado:", footer);
      res.status(201).json({ success: true, message: "Footer criado com sucesso!", footer });
    }
  } catch (error) {
    console.error("Erro ao salvar footer:", error.message);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ success: false, message: "Erro interno ao salvar footer." });
  }
};

// Obter dados do footer
export const getFooter = async (req, res) => {
  try {
    console.log("Buscando dados do footer...");
    const footer = await Footer.findOne();
    console.log("Footer encontrado:", footer);
    
    if (!footer) {
      console.log("Nenhum footer encontrado, retornando valores padrão");
      return res.json({ 
        success: true, 
        footer: {
          // Valores padrão
          quickLinksTitle: "Links Rápidos",
          contactTitle: "Contate-nos",
          socialTitle: "Nossas Redes Sociais"
        } 
      });
    }

    console.log("Retornando footer:", footer);
    res.json({ success: true, footer });
  } catch (error) {
    console.error("Erro ao buscar footer:", error.message);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ success: false, message: "Erro interno ao buscar footer." });
  }
};

// Resetar footer para valores padrão
export const resetFooter = async (req, res) => {
  try {
    console.log("Resetando footer...");
    await Footer.destroy({ where: {} });
    console.log("Footer resetado com sucesso");
    res.json({ success: true, message: "Footer resetado com sucesso!" });
  } catch (error) {
    console.error("Erro ao resetar footer:", error.message);
    res.status(500).json({ success: false, message: "Erro ao resetar footer." });
  }
};