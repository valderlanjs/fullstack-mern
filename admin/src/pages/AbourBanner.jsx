// components/admin/AboutBannerAdmin.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const backend_url = import.meta.env.VITE_BACKEND_URL;

const AboutBannerAdmin = () => {
  // Dados padrão para evitar undefined
  const defaultData = {
    heroTitle: "Nosso objetivo é agregar valor para lares e construções",
    heroBackgroundImage: "",
    contentBadge: "Sustentabilidade",
    contentTitle: "Promovemos a sustentabilidade e preservação do meio ambiente.",
    contentDescription: "",
    contentImage: "",
    contentImageAlt: "Imagem sobre sustentabilidade"
  };

  const [aboutData, setAboutData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroImagePreview, setHeroImagePreview] = useState("");
  const [contentImagePreview, setContentImagePreview] = useState("");
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [contentImageFile, setContentImageFile] = useState(null);

  const fetchAboutData = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/about-banner`);
      if (response.data.success) {
        const data = response.data.aboutBannerSection;
        // Mescla dados da API com dados padrão para garantir todas as propriedades
        setAboutData({
          ...defaultData,
          ...data
        });
        setHeroImagePreview(data.heroBackgroundImage || "");
        setContentImagePreview(data.contentImage || "");
      }
    } catch (error) {
      console.error("Erro ao carregar dados da seção about banner:", error);
      toast.error("Erro ao carregar dados da seção about banner");
      // Mantém os dados padrão em caso de erro
      setAboutData(defaultData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAboutData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      
      if (type === 'hero') {
        setHeroImageFile(file);
        setHeroImagePreview(previewUrl);
      } else {
        setContentImageFile(file);
        setContentImagePreview(previewUrl);
      }
    }
  };

  const handleRemoveImage = (type) => {
    if (type === 'hero') {
      setHeroImageFile(null);
      setHeroImagePreview("");
      setAboutData(prev => ({ ...prev, heroBackgroundImage: "" }));
    } else {
      setContentImageFile(null);
      setContentImagePreview("");
      setAboutData(prev => ({ ...prev, contentImage: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      
      // Adiciona campos de texto - usa valores atuais ou padrão
      Object.keys(aboutData).forEach(key => {
        const value = aboutData[key] !== null && aboutData[key] !== undefined 
          ? aboutData[key] 
          : defaultData[key] || "";
        formData.append(key, value);
      });

      // Adiciona arquivos de imagem se existirem
      if (heroImageFile) {
        formData.append('heroBackgroundImage', heroImageFile);
      }
      if (contentImageFile) {
        formData.append('contentImage', contentImageFile);
      }

      const response = await axios.put(
        `${backend_url}/api/about-banner`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success("Seção about banner atualizada com sucesso!");
        
        // Atualiza os previews com as URLs definitivas do Cloudinary
        if (response.data.aboutBannerSection.heroBackgroundImage) {
          setHeroImagePreview(response.data.aboutBannerSection.heroBackgroundImage);
        }
        if (response.data.aboutBannerSection.contentImage) {
          setContentImagePreview(response.data.aboutBannerSection.contentImage);
        }
        
        // Limpa os arquivos temporários
        setHeroImageFile(null);
        setContentImageFile(null);
        
        // Atualiza os dados locais
        setAboutData({
          ...defaultData,
          ...response.data.aboutBannerSection
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar seção about banner:", error);
      toast.error("Erro ao atualizar seção about banner");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    fetchAboutData();
    setHeroImageFile(null);
    setContentImageFile(null);
    toast.info("Alterações descartadas");
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Usa dados atuais ou padrão para evitar undefined
  const data = aboutData || defaultData;

  return (
    <div className="p-6">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Editar Seção About Banner
        </h1>
        <p className="text-gray-600">
          Gerencie o conteúdo da seção "About Banner" do site
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Seção Hero/Banner */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
            Banner Principal
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Campos de Texto */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título Principal *
                </label>
                <textarea
                  name="heroTitle"
                  value={data.heroTitle || ""}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Nosso objetivo é agregar valor para lares e construções..."
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  A última palavra será destacada automaticamente com gradiente
                </p>
              </div>
            </div>

            {/* Upload da Imagem do Banner */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagem de Fundo do Banner
              </label>
              <div className="space-y-4">
                {heroImagePreview ? (
                  <div className="relative group">
                    <img
                      src={heroImagePreview}
                      alt="Preview banner"
                      className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage('hero')}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">Nenhuma imagem selecionada</p>
                  </div>
                )}
                
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'hero')}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recomendado: Imagem com efeito parallax, alta qualidade (mín. 1920x600px)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Conteúdo */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
            Conteúdo de Sustentabilidade
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Campos de Texto */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Badge/Categoria
                </label>
                <input
                  type="text"
                  name="contentBadge"
                  value={data.contentBadge || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Ex: Sustentabilidade"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título do Conteúdo *
                </label>
                <textarea
                  name="contentTitle"
                  value={data.contentTitle || ""}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Promovemos a sustentabilidade e preservação do meio ambiente."
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  A última palavra será destacada automaticamente com gradiente
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  name="contentDescription"
                  value={data.contentDescription || ""}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Texto adicional explicativo sobre sustentabilidade..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texto Alternativo da Imagem
                </label>
                <input
                  type="text"
                  name="contentImageAlt"
                  value={data.contentImageAlt || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Ex: Imagem sobre sustentabilidade e preservação ambiental"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Importante para acessibilidade e SEO
                </p>
              </div>
            </div>

            {/* Upload da Imagem de Conteúdo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagem de Conteúdo
              </label>
              <div className="space-y-4">
                {contentImagePreview ? (
                  <div className="relative group">
                    <img
                      src={contentImagePreview}
                      alt="Preview conteúdo"
                      className="w-full h-64 object-cover rounded-lg border-2 border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage('content')}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center h-64 flex items-center justify-center">
                    <div>
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">Nenhuma imagem selecionada</p>
                    </div>
                  </div>
                )}
                
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'content')}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recomendado: Imagem quadrada ou retrato, alta qualidade (mín. 800x800px)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Descartar Alterações
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AboutBannerAdmin;