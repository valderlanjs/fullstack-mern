// components/admin/CertificationAdmin.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const backend_url = import.meta.env.VITE_BACKEND_URL;

const CertificationAdmin = () => {
  // Dados padrão
  const defaultData = {
    fscTitle: "FSC",
    fscDescription1: "Certificação Forest Stewardship Council. Atribuída por certificadores independentes que estabelecem princípios e critérios para assegurar a origem da madeira.",
    fscDescription2: "Permitindo ao consumidor consciente a opção de um produto que não degrada o meio ambiente e contribui para o desenvolvimento social e econômico das comunidades florestais.",
    fscDescription3: "A prática predatória é eliminada, a biodiversidade é preservada, assim como os recursos hídricos e do solo. Além do benefício ambiental, o selo garante que os direitos dos trabalhadores sejam respeitados e que as comunidades locais se beneficiem da exploração florestal.",
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

  const fetchCertificationData = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/certification-section`);
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

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      
      if (type === 'fsc') {
        setFscImageFile(file);
        setFscImagePreview(previewUrl);
      } else {
        setDofImageFile(file);
        setDofImagePreview(previewUrl);
      }
    }
  };

  const handleRemoveImage = (type) => {
    if (type === 'fsc') {
      setFscImageFile(null);
      setFscImagePreview("");
      setCertificationData(prev => ({ ...prev, fscImage: "" }));
    } else {
      setDofImageFile(null);
      setDofImagePreview("");
      setCertificationData(prev => ({ ...prev, dofImage: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      const response = await axios.put(
        `${backend_url}/api/certification-section`,
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Editar Seção de Certificações
        </h1>
        <p className="text-gray-600">
          Gerencie o conteúdo das certificações FSC e DOF
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Seção FSC */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
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
                  Descrição 3 *
                </label>
                <textarea
                  name="fscDescription3"
                  value={data.fscDescription3 || ""}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Terceira descrição sobre FSC..."
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

            {/* Upload da Imagem FSC */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagem FSC
              </label>
              <div className="space-y-4">
                {fscImagePreview ? (
                  <div className="relative group">
                    <img
                      src={fscImagePreview}
                      alt="Preview FSC"
                      className="w-full max-w-[350px] h-64 object-contain rounded-lg border-2 border-gray-300 bg-gray-50"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage('fsc')}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center max-w-[350px]">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">Nenhuma imagem FSC selecionada</p>
                  </div>
                )}
                
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'fsc')}
                    className="block w-full max-w-[350px] text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recomendado: Logo FSC, formato PNG transparente
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção DOF */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
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

            {/* Upload da Imagem DOF */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagem DOF
              </label>
              <div className="space-y-4">
                {dofImagePreview ? (
                  <div className="relative group">
                    <img
                      src={dofImagePreview}
                      alt="Preview DOF"
                      className="w-full max-w-[500px] h-64 object-contain rounded-lg border-2 border-gray-300 bg-gray-50"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage('dof')}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center max-w-[500px]">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">Nenhuma imagem DOF selecionada</p>
                  </div>
                )}
                
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'dof')}
                    className="block w-full max-w-[500px] text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recomendado: Logo DOF, formato PNG transparente
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

export default CertificationAdmin;