// components/admin/CertificationAdmin.jsx
import React, { useState, useEffect } from "react";
import api from "../api/axios.js"
import { toast } from "react-toastify";
import { 
  FaSave, 
  FaSpinner, 
  FaCheckCircle, 
  FaTimesCircle,
  FaExclamationTriangle,
  FaImage,
  FaCertificate
} from "react-icons/fa";


const CertificationAdmin = () => {
  // Dados padrão
  const defaultData = {
    fscTitle: "FSC",
    fscDescription1: "Certificação Forest Stewardship Council. Atribuída por certificadores independentes que estabelecem princípios e critérios para assegurar a origem da madeira.",
    fscDescription2: "Permitindo ao consumidor consciente a opção de um produto que não degrada o meio ambiente e contribui para o desenvolvimento social e econômico das comunidades florestais.",
    fscImage: "",
    fscImageAlt: "Certificação FSC",
    dofTitle: "DOF",
    dofDescription: "Documento de origem florestal, garantindo procedência, manejo responsável e qualidade do produto.",
    dofImage: "",
    dofImageAlt: "Certificação DOF"
  };

  const [certificationData, setCertificationData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fscImagePreview, setFscImagePreview] = useState("");
  const [dofImagePreview, setDofImagePreview] = useState("");
  const [fscImageFile, setFscImageFile] = useState(null);
  const [dofImageFile, setDofImageFile] = useState(null);
  const [fscImageError, setFscImageError] = useState(""); // NOVO: erro para imagem FSC
  const [dofImageError, setDofImageError] = useState(""); // NOVO: erro para imagem DOF

  // Função para calcular e formatar o tamanho
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const fetchCertificationData = async () => {
    try {
      const response = await api.get(`/api/certification-section`);
      if (response.data.success) {
        const data = response.data.certificationSection;
        setCertificationData({
          ...defaultData,
          ...data
        });
        setFscImagePreview(data.fscImage || "");
        setDofImagePreview(data.dofImage || "");
      }
    } catch (error) {
      console.error("Erro ao carregar dados das certificações:", error);
      toast.error("Erro ao carregar dados das certificações");
      setCertificationData(defaultData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificationData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCertificationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // NOVA FUNÇÃO: Validação de imagem
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    
    // Limpa erros anteriores
    if (type === 'fsc') {
      setFscImageError("");
    } else {
      setDofImageError("");
    }

    if (file) {
      // Validação de tamanho (1MB)
      if (file.size > 1 * 1024 * 1024) {
        const errorMsg = "A imagem deve ter no máximo 1MB";
        if (type === 'fsc') {
          setFscImageError(errorMsg);
          setFscImageFile(null);
          setFscImagePreview("");
        } else {
          setDofImageError(errorMsg);
          setDofImageFile(null);
          setDofImagePreview("");
        }
        return;
      }

      // Validação do tipo de arquivo
      if (!file.type.startsWith('image/')) {
        const errorMsg = "Por favor, selecione um arquivo de imagem válido";
        if (type === 'fsc') {
          setFscImageError(errorMsg);
          setFscImageFile(null);
          setFscImagePreview("");
        } else {
          setDofImageError(errorMsg);
          setDofImageFile(null);
          setDofImagePreview("");
        }
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      
      if (type === 'fsc') {
        setFscImageFile(file);
        setFscImagePreview(previewUrl);
        setFscImageError("");
      } else {
        setDofImageFile(file);
        setDofImagePreview(previewUrl);
        setDofImageError("");
      }
    }
  };

  const handleRemoveImage = (type) => {
    if (type === 'fsc') {
      setFscImageFile(null);
      setFscImagePreview("");
      setFscImageError("");
      setCertificationData(prev => ({ ...prev, fscImage: "" }));
    } else {
      setDofImageFile(null);
      setDofImagePreview("");
      setDofImageError("");
      setCertificationData(prev => ({ ...prev, dofImage: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verifica se há erro nas imagens
    if (fscImageError || dofImageError) {
      toast.error("Por favor, corrija os erros nas imagens antes de enviar.");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      
      // Adiciona campos de texto
      Object.keys(certificationData).forEach(key => {
        const value = certificationData[key] !== null && certificationData[key] !== undefined 
          ? certificationData[key] 
          : defaultData[key] || "";
        formData.append(key, value);
      });

      // Adiciona arquivos de imagem se existirem
      if (fscImageFile) {
        formData.append('fscImage', fscImageFile);
      }
      if (dofImageFile) {
        formData.append('dofImage', dofImageFile);
      }

      const response = await api.put(
        `/api/certification-section`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success("Certificações atualizadas com sucesso!");
        
        // Atualiza os previews com as URLs definitivas do Cloudinary
        if (response.data.certificationSection.fscImage) {
          setFscImagePreview(response.data.certificationSection.fscImage);
        }
        if (response.data.certificationSection.dofImage) {
          setDofImagePreview(response.data.certificationSection.dofImage);
        }
        
        // Limpa os arquivos temporários
        setFscImageFile(null);
        setDofImageFile(null);
        
        // Atualiza os dados locais
        setCertificationData({
          ...defaultData,
          ...response.data.certificationSection
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar certificações:", error);
      toast.error("Erro ao atualizar certificações");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    fetchCertificationData();
    setFscImageFile(null);
    setDofImageFile(null);
    setFscImageError("");
    setDofImageError("");
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

  const data = certificationData || defaultData;

  return (
    <div className="p-6">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <FaCertificate className="text-green-600" />
          Editar Seção de Certificações
        </h1>
        <p className="text-gray-600">
          Gerencie o conteúdo das certificações FSC e DOF
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
          <div className="text-sm text-green-800">Certificações</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">PNG</div>
          <div className="text-sm text-purple-800">Formato Ideal</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Seção FSC */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200 flex items-center gap-2">
            <FaCertificate className="text-green-600" />
            Certificação FSC
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Campos de Texto FSC */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título FSC *
                </label>
                <input
                  type="text"
                  name="fscTitle"
                  value={data.fscTitle || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="FSC"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição 1 *
                </label>
                <textarea
                  name="fscDescription1"
                  value={data.fscDescription1 || ""}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Primeira descrição sobre FSC..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição 2 *
                </label>
                <textarea
                  name="fscDescription2"
                  value={data.fscDescription2 || ""}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Segunda descrição sobre FSC..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texto Alternativo da Imagem FSC
                </label>
                <input
                  type="text"
                  name="fscImageAlt"
                  value={data.fscImageAlt || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Ex: Certificação FSC - Forest Stewardship Council"
                />
              </div>
            </div>

            {/* Upload da Imagem FSC ATUALIZADO */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagem FSC
              </label>
              <div className="space-y-4">
                <div className={`border-2 border-dashed rounded-xl overflow-hidden transition-colors duration-300 bg-gray-50 flex items-center justify-center max-w-[350px] h-64 ${
                  fscImageError 
                    ? 'border-red-300 bg-red-50' 
                    : fscImagePreview 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-300 hover:border-green-500'
                }`}>
                  {fscImagePreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={fscImagePreview}
                        alt="Preview FSC"
                        className="w-full h-full object-contain p-4"
                      />
                      {/* Indicador de sucesso */}
                      <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                        <FaCheckCircle size={16} />
                      </div>
                      {/* Botão de remover */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage('fsc')}
                        className="absolute top-2 left-2 bg-red-500 text-white p-2 rounded-full opacity-90 hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : fscImageError ? (
                    <div className="text-center p-6">
                      <FaTimesCircle className="text-red-400 text-3xl mx-auto mb-3" />
                      <p className="text-red-600 font-medium">Erro na Imagem</p>
                      <p className="text-red-500 text-sm mt-1">{fscImageError}</p>
                      <p className="text-red-400 text-xs mt-2">Clique para tentar novamente</p>
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <FaImage className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-gray-600 font-medium">Logo FSC</p>
                      <p className="text-gray-400 text-sm mt-1">Clique para selecionar</p>
                      <p className="text-gray-400 text-xs mt-2">PNG transparente recomendado</p>
                    </div>
                  )}
                </div>
                
                <div className="max-w-[350px]">
                  {/* Botão de Upload Melhorado */}
                  <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaImage className="w-8 h-8 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Clique para upload</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, WebP (MAX. 1MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'fsc')}
                      className="hidden"
                    />
                  </label>
                  
                  {/* Informações da Imagem ATUALIZADA */}
                  {fscImageFile && !fscImageError && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                      <div className="flex items-start gap-3">
                        <FaCheckCircle className="text-green-600 text-lg mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-green-800 mb-2">
                            Imagem Válida ✓
                          </h4>
                          <div className="text-green-700 text-sm space-y-1">
                            <p><strong>Arquivo:</strong> {fscImageFile.name}</p>
                            <p><strong>Tamanho:</strong> {formatFileSize(fscImageFile.size)}</p>
                            <p><strong>Status:</strong> <span className="text-green-600">Pronta para upload</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mensagem de Erro */}
                  {fscImageError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                      <div className="flex items-start gap-3">
                        <FaTimesCircle className="text-red-600 text-lg mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-red-800 mb-2">
                            Problema na Imagem
                          </h4>
                          <div className="text-red-700 text-sm">
                            <p>{fscImageError}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    <FaExclamationTriangle className="inline w-3 h-3 mr-1" />
                    <strong>Tamanho máximo: 1MB</strong> • Formatos: PNG, JPG, WebP • Recomendado: Logo FSC em PNG transparente
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção DOF */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200 flex items-center gap-2">
            <FaCertificate className="text-blue-600" />
            Certificação DOF
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Campos de Texto DOF */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título DOF *
                </label>
                <input
                  type="text"
                  name="dofTitle"
                  value={data.dofTitle || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="DOF"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição DOF *
                </label>
                <textarea
                  name="dofDescription"
                  value={data.dofDescription || ""}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Descrição sobre a certificação DOF..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texto Alternativo da Imagem DOF
                </label>
                <input
                  type="text"
                  name="dofImageAlt"
                  value={data.dofImageAlt || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Ex: Certificação DOF - Documento de Origem Florestal"
                />
              </div>
            </div>

            {/* Upload da Imagem DOF ATUALIZADO */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagem DOF
              </label>
              <div className="space-y-4">
                <div className={`border-2 border-dashed rounded-xl overflow-hidden transition-colors duration-300 bg-gray-50 flex items-center justify-center max-w-[500px] h-64 ${
                  dofImageError 
                    ? 'border-red-300 bg-red-50' 
                    : dofImagePreview 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-300 hover:border-green-500'
                }`}>
                  {dofImagePreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={dofImagePreview}
                        alt="Preview DOF"
                        className="w-full h-full object-contain p-4"
                      />
                      {/* Indicador de sucesso */}
                      <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                        <FaCheckCircle size={16} />
                      </div>
                      {/* Botão de remover */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage('dof')}
                        className="absolute top-2 left-2 bg-red-500 text-white p-2 rounded-full opacity-90 hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : dofImageError ? (
                    <div className="text-center p-6">
                      <FaTimesCircle className="text-red-400 text-3xl mx-auto mb-3" />
                      <p className="text-red-600 font-medium">Erro na Imagem</p>
                      <p className="text-red-500 text-sm mt-1">{dofImageError}</p>
                      <p className="text-red-400 text-xs mt-2">Clique para tentar novamente</p>
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <FaImage className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-gray-600 font-medium">Logo DOF</p>
                      <p className="text-gray-400 text-sm mt-1">Clique para selecionar</p>
                      <p className="text-gray-400 text-xs mt-2">PNG transparente recomendado</p>
                    </div>
                  )}
                </div>
                
                <div className="max-w-[500px]">
                  {/* Botão de Upload Melhorado */}
                  <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaImage className="w-8 h-8 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Clique para upload</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, WebP (MAX. 1MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'dof')}
                      className="hidden"
                    />
                  </label>
                  
                  {/* Informações da Imagem ATUALIZADA */}
                  {dofImageFile && !dofImageError && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                      <div className="flex items-start gap-3">
                        <FaCheckCircle className="text-green-600 text-lg mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-green-800 mb-2">
                            Imagem Válida ✓
                          </h4>
                          <div className="text-green-700 text-sm space-y-1">
                            <p><strong>Arquivo:</strong> {dofImageFile.name}</p>
                            <p><strong>Tamanho:</strong> {formatFileSize(dofImageFile.size)}</p>
                            <p><strong>Status:</strong> <span className="text-green-600">Pronta para upload</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mensagem de Erro */}
                  {dofImageError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                      <div className="flex items-start gap-3">
                        <FaTimesCircle className="text-red-600 text-lg mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-red-800 mb-2">
                            Problema na Imagem
                          </h4>
                          <div className="text-red-700 text-sm">
                            <p>{dofImageError}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    <FaExclamationTriangle className="inline w-3 h-3 mr-1" />
                    <strong>Tamanho máximo: 1MB</strong> • Formatos: PNG, JPG, WebP • Recomendado: Logo DOF em PNG transparente
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
              disabled={saving || fscImageError || dofImageError}
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

export default CertificationAdmin;