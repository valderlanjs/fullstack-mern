// controllers/pageController.js
import { Page } from "../models/pageModel.js";

// GET /api/pages/:slug - Buscar página por slug (público)
export const getPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const page = await Page.findOne({
      where: { slug }
    });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Página não encontrada"
      });
    }

    res.json({
      success: true,
      page
    });
  } catch (error) {
    console.error("Erro ao buscar página:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
};

// GET /api/pages - Listar todas as páginas (admin)
export const getPages = async (req, res) => {
  try {
    const pages = await Page.findAll({
      order: [['title', 'ASC']]
    });

    res.json({
      success: true,
      pages
    });
  } catch (error) {
    console.error("Erro ao buscar páginas:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
};

// PUT /api/pages/:id - Atualizar página (admin)
export const updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const page = await Page.findByPk(id);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Página não encontrada"
      });
    }

    await page.update({
      title: title || page.title,
      content: content || page.content,
      lastUpdated: new Date()
    });

    res.json({
      success: true,
      page
    });
  } catch (error) {
    console.error("Erro ao atualizar página:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
};

// POST /api/pages/seed - Criar páginas iniciais (admin)
export const seedPages = async (req, res) => {
  try {
    const pagesData = [
      {
        title: "Política de Privacidade",
        slug: "politica-privacidade",
        content: "# Política de Privacidade\n\n## 1. Coleta de Informações\n\nColetamos informações que você nos fornece diretamente...\n\n## 2. Uso das Informações\n\nUtilizamos suas informações para...\n\n## 3. Compartilhamento de Dados\n\nNão compartilhamos seus dados com terceiros...\n\n## 4. Segurança\n\nImplementamos medidas de segurança...\n\n## 5. Seus Direitos\n\nVocê tem direito a acessar, corrigir e excluir seus dados..."
      },
      {
        title: "Termos de Uso",
        slug: "termos-uso",
        content: "# Termos de Uso\n\n## 1. Aceitação dos Termos\n\nAo acessar e usar nosso site, você concorda com estes termos...\n\n## 2. Uso do Site\n\nVocê concorda em usar o site apenas para fins legais...\n\n## 3. Propriedade Intelectual\n\nTodo o conteúdo do site é protegido por direitos autorais...\n\n## 4. Limitação de Responsabilidade\n\nNão nos responsabilizamos por...\n\n## 5. Alterações nos Termos\n\nPodemos alterar estes termos a qualquer momento..."
      }
    ];

    // Verificar se as páginas já existem
    for (const pageData of pagesData) {
      const existingPage = await Page.findOne({ where: { slug: pageData.slug } });
      if (!existingPage) {
        await Page.create(pageData);
      }
    }

    res.json({
      success: true,
      message: "Páginas criadas com sucesso"
    });
  } catch (error) {
    console.error("Erro ao criar páginas:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
};