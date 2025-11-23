import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../api/axios.js"
import { 
  FaSave, 
  FaSpinner, 
  FaCheckCircle, 
  FaTimesCircle,
  FaExclamationTriangle,
  FaImage
} from "react-icons/fa";

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
  const [heroImageError, setHeroImageError] = useState(""); // NOVO: erro para imagem do hero
  const [contentImageError, setContentImageError] = useState(""); // NOVO: erro para imagem de conteúdo

  // Função para calcular e formatar o tamanho
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const fetchAboutData = async () => {
    try {
      const response = await api.get("/api/about-banner");
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

  // NOVA FUNÇÃO: Validação de imagem
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    
    // Limpa erros anteriores
    if (type === 'hero') {
      setHeroImageError("");
    } else {
      setContentImageError("");
    }

    if (file) {
      // Validação de tamanho (1MB)
      if (file.size > 1 * 1024 * 1024) {
        const errorMsg = "A imagem deve ter no máximo 1MB";
        if (type === 'hero') {
          setHeroImageError(errorMsg);
          setHeroImageFile(null);
          setHeroImagePreview("");
        } else {
          setContentImageError(errorMsg);
          setContentImageFile(null);
          setContentImagePreview("");
        }
        return;
      }

      // Validação do tipo de arquivo
      if (!file.type.startsWith('image/')) {
        const errorMsg = "Por favor, selecione um arquivo de imagem válido";
        if (type === 'hero') {
          setHeroImageError(errorMsg);
          setHeroImageFile(null);
          setHeroImagePreview("");
        } else {
          setContentImageError(errorMsg);
          setContentImageFile(null);
          setContentImagePreview("");
        }
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      
      if (type === 'hero') {
        setHeroImageFile(file);
        setHeroImagePreview(previewUrl);
        setHeroImageError("");
      } else {
        setContentImageFile(file);
        setContentImagePreview(previewUrl);
        setContentImageError("");
      }
    }
  };

  const handleRemoveImage = (type) => {
    if (type === 'hero') {
      setHeroImageFile(null);
      setHeroImagePreview("");
      setHeroImageError("");
      setAboutData(prev => ({ ...prev, heroBackgroundImage: "" }));
    } else {
      setContentImageFile(null);
      setContentImagePreview("");
      setContentImageError("");
      setAboutData(prev => ({ ...prev, contentImage: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verifica se há erro nas imagens
    if (heroImageError || contentImageError) {
      toast.error("Por favor, corrija os erros nas imagens antes de enviar.");
      return;
    }

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

      const response = await api.put(
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
    setHeroImageError("");
    setContentImageError("");
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <FaImage className="text-green-600" />
          Editar Seção About Banner
        </h1>
        <p className="text-gray-600">
          Gerencie o conteúdo da seção "About Banner" do site
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">1MB</div>
          <div className="text-sm text-blue-800">Tamanho Máximo</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">2</div>
          <div className="text-sm text-green-800">Imagens</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">JPG, PNG, WebP</div>
          <div className="text-sm text-purple-800">Formatos</div>
        </div>
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

            {/* Upload da Imagem do Banner ATUALIZADO */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagem de Fundo do Banner
              </label>
              <div className="space-y-4">
                <div className={`border-2 border-dashed rounded-xl overflow-hidden transition-colors duration-300 bg-gray-200 aspect-video flex items-center justify-center ${
                  heroImageError 
                    ? 'border-red-300 bg-red-50' 
                    : heroImagePreview 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-300 hover:border-green-500'
                }`}>
                  {heroImagePreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={heroImagePreview}
                        alt="Preview banner"
                        className="w-full h-full object-cover"
                      />
                      {/* Indicador de sucesso */}
                      <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                        <FaCheckCircle size={16} />
                      </div>
                      {/* Botão de remover */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage('hero')}
                        className="absolute top-2 left-2 bg-red-500 text-white p-2 rounded-full opacity-90 hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : heroImageError ? (
                    <div className="text-center p-6">
                      <FaTimesCircle className="text-red-400 text-3xl mx-auto mb-3" />
                      <p className="text-red-600 font-medium">Erro na Imagem</p>
                      <p className="text-red-500 text-sm mt-1">{heroImageError}</p>
                      <p className="text-red-400 text-xs mt-2">Clique para tentar novamente</p>
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">Nenhuma imagem selecionada</p>
                      <p className="text-gray-400 text-xs mt-1">Clique para selecionar</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'hero')}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  
                  {/* Informações da Imagem ATUALIZADA */}
                  {heroImageFile && !heroImageError && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                      <div className="flex items-start gap-3">
                        <FaCheckCircle className="text-green-600 text-lg mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-green-800 mb-2">
                            Imagem Válida ✓
                          </h4>
                          <div className="text-green-700 text-sm space-y-1">
                            <p><strong>Arquivo:</strong> {heroImageFile.name}</p>
                            <p><strong>Tamanho:</strong> {formatFileSize(heroImageFile.size)}</p>
                            <p><strong>Status:</strong> <span className="text-green-600">Pronta para upload</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mensagem de Erro */}
                  {heroImageError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                      <div className="flex items-start gap-3">
                        <FaTimesCircle className="text-red-600 text-lg mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-red-800 mb-2">
                            Problema na Imagem
                          </h4>
                          <div className="text-red-700 text-sm">
                            <p>{heroImageError}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    <FaExclamationTriangle className="inline w-3 h-3 mr-1" />
                    <strong>Tamanho máximo: 1MB</strong> • Formatos: JPG, PNG, WebP • Recomendado: Imagem com efeito parallax, alta qualidade (mín. 1920x600px)
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

            {/* Upload da Imagem de Conteúdo ATUALIZADO */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagem de Conteúdo
              </label>
              <div className="space-y-4">
                <div className={`border-2 border-dashed rounded-xl overflow-hidden transition-colors duration-300 bg-gray-200 aspect-square flex items-center justify-center ${
                  contentImageError 
                    ? 'border-red-300 bg-red-50' 
                    : contentImagePreview 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-300 hover:border-green-500'
                }`}>
                  {contentImagePreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={contentImagePreview}
                        alt="Preview conteúdo"
                        className="w-full h-full object-cover"
                      />
                      {/* Indicador de sucesso */}
                      <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                        <FaCheckCircle size={16} />
                      </div>
                      {/* Botão de remover */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage('content')}
                        className="absolute top-2 left-2 bg-red-500 text-white p-2 rounded-full opacity-90 hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : contentImageError ? (
                    <div className="text-center p-6">
                      <FaTimesCircle className="text-red-400 text-3xl mx-auto mb-3" />
                      <p className="text-red-600 font-medium">Erro na Imagem</p>
                      <p className="text-red-500 text-sm mt-1">{contentImageError}</p>
                      <p className="text-red-400 text-xs mt-2">Clique para tentar novamente</p>
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">Nenhuma imagem selecionada</p>
                      <p className="text-gray-400 text-xs mt-1">Clique para selecionar</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'content')}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  
                  {/* Informações da Imagem ATUALIZADA */}
                  {contentImageFile && !contentImageError && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                      <div className="flex items-start gap-3">
                        <FaCheckCircle className="text-green-600 text-lg mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-green-800 mb-2">
                            Imagem Válida ✓
                          </h4>
                          <div className="text-green-700 text-sm space-y-1">
                            <p><strong>Arquivo:</strong> {contentImageFile.name}</p>
                            <p><strong>Tamanho:</strong> {formatFileSize(contentImageFile.size)}</p>
                            <p><strong>Status:</strong> <span className="text-green-600">Pronta para upload</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mensagem de Erro */}
                  {contentImageError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                      <div className="flex items-start gap-3">
                        <FaTimesCircle className="text-red-600 text-lg mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-red-800 mb-2">
                            Problema na Imagem
                          </h4>
                          <div className="text-red-700 text-sm">
                            <p>{contentImageError}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    <FaExclamationTriangle className="inline w-3 h-3 mr-1" />
                    <strong>Tamanho máximo: 1MB</strong> • Formatos: JPG, PNG, WebP • Recomendado: Imagem quadrada ou retrato, alta qualidade (mín. 800x800px)
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
              disabled={saving || heroImageError || contentImageError}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <FaSpinner className="animate-spin h-5 w-5 text-white" />
                  Salvando...
                </>
              ) : (
                <>
                  <FaSave />
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