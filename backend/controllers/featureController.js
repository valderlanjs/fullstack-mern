// controllers/FeaturesController.js
import Features from "../models/featureModel.js";

// Criar ou atualizar features
export const createOrUpdateFeatures = async (req, res) => {
  try {
    console.log("Recebendo dados da features:", req.body);

    const {
      title,
      subtitle,
      card1Title,
      card1Content,
      card2Title,
      card2Content,
      backgroundColor,
      titleColor,
      subtitleColor,
      cardBackgroundColor,
      cardTitleColor,
      cardTextColor,
      iconColor
    } = req.body;

    // Verificar se já existe features
    let features = await Features.findOne();
    console.log("Features existente:", features?.id);
    
    const featuresData = {
      title: title || null,
      subtitle: subtitle || null,
      card1Title: card1Title || null,
      card1Content: card1Content || null,
      card2Title: card2Title || null,
      card2Content: card2Content || null,
      backgroundColor: backgroundColor || "#f3f4f6",
      titleColor: titleColor || "#000000",
      subtitleColor: subtitleColor || "#6b7280",
      cardBackgroundColor: cardBackgroundColor || "#ffffff",
      cardTitleColor: cardTitleColor || "#16a34a",
      cardTextColor: cardTextColor || "#000000",
      iconColor: iconColor || "#16a34a"
    };

    if (features) {
      // Atualizar features existente
      console.log("Atualizando features existente...");
      await Features.update(featuresData, { where: { id: features.id } });
      features = await Features.findByPk(features.id);
      console.log("Features atualizada:", features);
      res.json({ success: true, message: "Features atualizada com sucesso!", features });
    } else {
      // Criar nova features
      console.log("Criando nova features...");
      features = await Features.create(featuresData);
      console.log("Nova features criada:", features);
      res.status(201).json({ success: true, message: "Features criada com sucesso!", features });
    }
  } catch (error) {
    console.error("Erro ao salvar features:", error.message);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ success: false, message: "Erro interno ao salvar features." });
  }
};

// Obter dados da features
export const getFeatures = async (req, res) => {
  try {
    console.log("Buscando dados da features...");
    const features = await Features.findOne();
    console.log("Features encontrada:", features);
    
    if (!features) {
      console.log("Nenhuma features encontrada, retornando valores padrão");
      return res.json({ 
        success: true, 
        features: {
          title: "Sustentabilidade e qualidade",
          subtitle: "Madeira sustentável, certificada pelo FSC garantindo qualidade, preservação ambiental e benefícios sociais para comunidades florestais.",
          card1Title: "FSC",
          card1Content: "Certificado internacional que assegura a procedência, qualidade e respeito ao meio ambiente.\n\nCom nossas práticas a exploração predatórias é eliminada e a biodiversidade e os recursos hídricos e do solo são preservados.",
          card2Title: "DOF",
          card2Content: "Comercializamos madeira nativa com o Documento de Origem Florestal (DOF) emitido pelo Ibama, garantindo a rastreabilidade e a legalidade da madeira.\n\nEscolha nossos produtos e faça parte de um consumo consciente que promove o desenvolvimento social e econômico das comunidades florestais.",
          backgroundColor: "#f3f4f6",
          titleColor: "#000000",
          subtitleColor: "#6b7280",
          cardBackgroundColor: "#ffffff",
          cardTitleColor: "#16a34a",
          cardTextColor: "#000000",
          iconColor: "#16a34a"
        } 
      });
    }

    console.log("Retornando features:", features);
    res.json({ success: true, features });
  } catch (error) {
    console.error("Erro ao buscar features:", error.message);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ success: false, message: "Erro interno ao buscar features." });
  }
};

// Resetar features para valores padrão
export const resetFeatures = async (req, res) => {
  try {
    console.log("Resetando features...");
    await Features.destroy({ where: {} });
    console.log("Features resetada com sucesso");
    res.json({ success: true, message: "Features resetada com sucesso!" });
  } catch (error) {
    console.error("Erro ao resetar features:", error.message);
    res.status(500).json({ success: false, message: "Erro ao resetar features." });
  }
};