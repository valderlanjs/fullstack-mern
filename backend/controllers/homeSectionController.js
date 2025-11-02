// controllers/HomeSectionController.js
import HomeSection from "../models/homeSectionModel.js";

// Criar ou atualizar home section
export const createOrUpdateHomeSection = async (req, res) => {
  try {
    console.log("Recebendo dados da home section:", req.body);

    const {
      title,
      highlightedText,
      description,
      buttonText,
      buttonLink,
      backgroundColor,
      textColor,
      highlightColor,
      buttonColor,
      buttonTextColor
    } = req.body;

    // Verificar se já existe uma home section
    let homeSection = await HomeSection.findOne();
    console.log("Home section existente:", homeSection?.id);
    
    const homeSectionData = {
      title: title || null,
      highlightedText: highlightedText || null,
      description: description || null,
      buttonText: buttonText || null,
      buttonLink: buttonLink || null,
      backgroundColor: backgroundColor || "#ffffff",
      textColor: textColor || "#000000",
      highlightColor: highlightColor || "#16a34a",
      buttonColor: buttonColor || "#16a34a",
      buttonTextColor: buttonTextColor || "#ffffff"
    };

    if (homeSection) {
      // Atualizar home section existente
      console.log("Atualizando home section existente...");
      await HomeSection.update(homeSectionData, { where: { id: homeSection.id } });
      homeSection = await HomeSection.findByPk(homeSection.id);
      console.log("Home section atualizada:", homeSection);
      res.json({ success: true, message: "Home section atualizada com sucesso!", homeSection });
    } else {
      // Criar nova home section
      console.log("Criando nova home section...");
      homeSection = await HomeSection.create(homeSectionData);
      console.log("Nova home section criada:", homeSection);
      res.status(201).json({ success: true, message: "Home section criada com sucesso!", homeSection });
    }
  } catch (error) {
    console.error("Erro ao salvar home section:", error.message);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ success: false, message: "Erro interno ao salvar home section." });
  }
};

// Obter dados da home section
export const getHomeSection = async (req, res) => {
  try {
    console.log("Buscando dados da home section...");
    const homeSection = await HomeSection.findOne();
    console.log("Home section encontrada:", homeSection);
    
    if (!homeSection) {
      console.log("Nenhuma home section encontrada, retornando valores padrão");
      return res.json({ 
        success: true, 
        homeSection: {
          title: "Bem-vindo ao Grupo Madenobre! No mercado",
          highlightedText: "desde 1998",
          description: "Há mais de 25 anos, somos referência no mercado de madeiras de alta qualidade em Maceió, somos a solução para seus projetos. Explore nosso site e descubra como podemos ajudar a transformar suas ideias em realidade.",
          buttonText: "Sobre Nós",
          buttonLink: "/about",
          backgroundColor: "bg-white",
          textColor: "text-black",
          highlightColor: "text-secondary"
        } 
      });
    }

    console.log("Retornando home section:", homeSection);
    res.json({ success: true, homeSection });
  } catch (error) {
    console.error("Erro ao buscar home section:", error.message);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ success: false, message: "Erro interno ao buscar home section." });
  }
};

// Resetar home section para valores padrão
export const resetHomeSection = async (req, res) => {
  try {
    console.log("Resetando home section...");
    await HomeSection.destroy({ where: {} });
    console.log("Home section resetada com sucesso");
    res.json({ success: true, message: "Home section resetada com sucesso!" });
  } catch (error) {
    console.error("Erro ao resetar home section:", error.message);
    res.status(500).json({ success: false, message: "Erro ao resetar home section." });
  }
};