import { useState, useEffect } from "react";
import axios from "axios";
import api from "../api/axios.js"
import { backend_url } from "../App";
import { toast } from "react-toastify";
import {
  FaEdit,
  FaTrash,
  FaImage,
  FaSave,
  FaPlus,
  FaUpload,
  FaSpinner,
  FaExclamationTriangle,
  FaTimes,
  FaEye,
  FaChartLine,
  FaCog,
  FaCheckCircle,
  FaTimesCircle,
  FaQuestionCircle
} from "react-icons/fa";

import {
  FaCircleExclamation,

} from "react-icons/fa6";

const ManageServicesSection = ({ token }) => {
  const [servicesSections, setServicesSections] = useState([]);
  const [editingSection, setEditingSection] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    section1Title: "",
    section1Description: "",
    section1Image: "",
    section1ImageAlt: "",
    section2Title: "",
    section2Image: "",
    section2ImageAlt: "",
    ctaText: "Faça um orçamento",
    ctaLink: "/contact",
    services: [
      { title: "", description: "" },
      { title: "", description: "" },
    ],
    features: [
      { title: "", description: "" },
      { title: "", description: "" },
      { title: "", description: "" },
    ],
  });
  const [image1File, setImage1File] = useState(null);
  const [image2File, setImage2File] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    section: null,
  });
  const [previewImage1, setPreviewImage1] = useState(null);
  const [previewImage2, setPreviewImage2] = useState(null);
  const [image1Error, setImage1Error] = useState("");
  const [image2Error, setImage2Error] = useState("");
  // NOVO STATE: Modal de instruções
  const [instructionsModal, setInstructionsModal] = useState(false);

  // Buscar seções de serviços
  const fetchServicesSections = async () => {
    try {
      const response = await api.get(
        `${backend_url}/api/services-section/admin/all`,
        {
          headers: { token },
        }
      );
      if (response.data.success) {
        setServicesSections(response.data.servicesSections);
      }
    } catch (error) {
      toast.error("Erro ao carregar seções de serviços");
    }
  };

  // NOVAS FUNÇÕES: Modal de instruções
  const openInstructionsModal = () => {
    setInstructionsModal(true);
  };

  const closeInstructionsModal = () => {
    setInstructionsModal(false);
  };

  // Função para calcular e formatar o tamanho
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Salvar/Atualizar seção
  const handleSaveSection = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      // Adicionar campos básicos
      const basicFields = [
        "section1Title",
        "section1Description",
        "section1ImageAlt",
        "section2Title",
        "section2ImageAlt",
        "ctaText",
        "ctaLink",
      ];

      basicFields.forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Adicionar arrays como JSON
      const servicesJSON = JSON.stringify(formData.services);
      const featuresJSON = JSON.stringify(formData.features);

      formDataToSend.append("services", servicesJSON);
      formDataToSend.append("features", featuresJSON);

      // Adicionar arquivos de imagem
      if (image1File) {
        formDataToSend.append("section1Image", image1File);
      }
      if (image2File) {
        formDataToSend.append("section2Image", image2File);
      }

      const response = await api.post(
        `${backend_url}/api/services-section`,
        formDataToSend,
        {
          headers: {
            token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Seção de serviços atualizada com sucesso! 🎉");
      setShowForm(false);
      setEditingSection(null);
      resetForm();
      fetchServicesSections();
    } catch (error) {
      console.error("❌ Erro detalhado:", error);
      if (error.response?.data?.message) {
        toast.error(`Erro: ${error.response.data.message}`);
      } else {
        toast.error("Erro ao salvar seção de serviços");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setFormData({
      section1Title: "",
      section1Description: "",
      section1Image: "",
      section1ImageAlt: "",
      section2Title: "",
      section2Image: "",
      section2ImageAlt: "",
      ctaText: "Faça um orçamento",
      ctaLink: "/contact",
      services: [
        { title: "", description: "" },
        { title: "", description: "" },
      ],
      features: [
        { title: "", description: "" },
        { title: "", description: "" },
        { title: "", description: "" },
      ],
    });
    setImage1File(null);
    setImage2File(null);
    setPreviewImage1(null);
    setPreviewImage2(null);
    setImage1Error("");
    setImage2Error("");
  };

  // Abrir modal de exclusão
  const openDeleteModal = (section) => {
    setDeleteModal({
      isOpen: true,
      section: section,
    });
  };

  // Fechar modal de exclusão
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      section: null,
    });
  };

  // Deletar seção
  const handleDeleteSection = async () => {
    if (!deleteModal.section) return;

    setIsDeleting(deleteModal.section.id);
    try {
      await api.delete(
        `${backend_url}/api/services-section/${deleteModal.section.id}`,
        {
          headers: { token },
        }
      );
      toast.success("Seção excluída com sucesso!");
      fetchServicesSections();
      closeDeleteModal();
    } catch (error) {
      toast.error("Erro ao excluir seção");
    } finally {
      setIsDeleting(null);
    }
  };

  // Carregar dados atuais para edição
  const loadCurrentSection = async () => {
    try {
      const response = await api.get(`${backend_url}/api/services-section`);
      if (response.data.success) {
        const currentSection = response.data.servicesSection;
        setFormData({
          section1Title: currentSection.section1Title || "",
          section1Description: currentSection.section1Description || "",
          section1Image: currentSection.section1Image || "",
          section1ImageAlt: currentSection.section1ImageAlt || "",
          section2Title: currentSection.section2Title || "",
          section2Image: currentSection.section2Image || "",
          section2ImageAlt: currentSection.section2ImageAlt || "",
          ctaText: currentSection.ctaText || "Faça um orçamento",
          ctaLink: currentSection.ctaLink || "/contact",
          services: currentSection.services || [
            { title: "", description: "" },
            { title: "", description: "" },
          ],
          features: currentSection.features || [
            { title: "", description: "" },
            { title: "", description: "" },
            { title: "", description: "" },
          ],
        });
        setEditingSection(currentSection);
        setPreviewImage1(currentSection.section1Image);
        setPreviewImage2(currentSection.section2Image);
      }
    } catch (error) {
      console.error("Erro ao carregar seção atual:", error);
    }
  };

  // Abrir formulário de edição
  const openEditForm = () => {
    loadCurrentSection();
    setShowForm(true);
  };

  // Validação de imagens
  const handleImage1Change = (e) => {
    const file = e.target.files[0];
    setImage1Error("");

    if (file) {
      // Validação de tamanho (1MB)
      if (file.size > 1 * 1024 * 1024) {
        setImage1Error("A imagem deve ter no máximo 1MB");
        setImage1File(null);
        setPreviewImage1(null);
        return;
      }

      // Validação do tipo de arquivo
      if (!file.type.startsWith('image/')) {
        setImage1Error("Por favor, selecione um arquivo de imagem válido");
        setImage1File(null);
        setPreviewImage1(null);
        return;
      }

      setImage1File(file);
      setPreviewImage1(URL.createObjectURL(file));
      setImage1Error("");
    }
  };

  const handleImage2Change = (e) => {
    const file = e.target.files[0];
    setImage2Error("");

    if (file) {
      // Validação de tamanho (1MB)
      if (file.size > 1 * 1024 * 1024) {
        setImage2Error("A imagem deve ter no máximo 1MB");
        setImage2File(null);
        setPreviewImage2(null);
        return;
      }

      // Validação do tipo de arquivo
      if (!file.type.startsWith('image/')) {
        setImage2Error("Por favor, selecione um arquivo de imagem válido");
        setImage2File(null);
        setPreviewImage2(null);
        return;
      }

      setImage2File(file);
      setPreviewImage2(URL.createObjectURL(file));
      setImage2Error("");
    }
  };

  // Handlers para arrays dinâmicos
  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...formData.services];
    updatedServices[index][field] = value;
    setFormData({ ...formData, services: updatedServices });
  };

  const handleFeatureChange = (index, field, value) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index][field] = value;
    setFormData({ ...formData, features: updatedFeatures });
  };

  useEffect(() => {
    fetchServicesSections();
    loadCurrentSection();
  }, []);

  const activeSection = servicesSections.find((section) => section.isActive);

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto fade-in">
        {/* Header */}
        <div className="mb-8 slide-in-left">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <FaCog className="text-purple-600" />
                Gerenciar Seção de Serviços
              </h1>
              <p className="text-gray-600">
                Edite o conteúdo, imagens e informações da seção "Serviços" da empresa
              </p>
            </div>
            {/* BOTÃO DE INSTRUÇÕES */}
            <button
              onClick={openInstructionsModal}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 btn-hover-lift shadow-md"
              title="Ver instruções de uso"
            >
              <FaQuestionCircle />
              Instruções
            </button>
          </div>
        </div>

        {/* MODAL DE INSTRUÇÕES - NOVO */}
        {instructionsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 modal-enter-active">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
              {/* Header do Modal de Instruções */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                    <FaQuestionCircle className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Instruções - Seção de Serviços
                    </h3>
                    <p className="text-sm text-gray-500">
                      Guia completo para gerenciar a seção de serviços do site
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeInstructionsModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              {/* Conteúdo das Instruções */}
              <div className="p-6 space-y-6">
                {/* Seção 1: Visão Geral */}
                <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaCog className="text-purple-600" />
                    1. Visão Geral da Seção
                  </h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>Esta seção é dividida em duas partes principais com diferentes propósitos:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li><strong>Seção 1:</strong> Apresentação dos serviços principais</li>
                      <li><strong>Seção 2:</strong> Diferenciais e vantagens competitivas</li>
                      <li><strong>Serviços:</strong> 2 serviços principais com descrição</li>
                      <li><strong>Diferenciais:</strong> 3 características que destacam sua empresa</li>
                    </ul>
                  </div>
                </section>

                {/* Seção 2: Conteúdo das Seções */}
                <section className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <FaEdit className="text-green-600" />
                    2. Conteúdo Recomendado
                  </h4>
                  <div className="space-y-3 text-sm text-green-700">
                    <p><strong>Para Seção 1 (O que oferecemos):</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Título claro sobre seus serviços</li>
                      <li>Descrição geral dos benefícios</li>
                      <li>Imagem ilustrativa dos serviços</li>
                    </ul>
                    
                    <p><strong>Para Seção 2 (Diferenciais):</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Título sobre qualidade/experiência</li>
                      <li>Imagem de detalhes ou processo</li>
                      <li>Foque no que torna único</li>
                    </ul>
                  </div>
                </section>

                {/* Seção 3: Serviços e Diferenciais */}
                <section className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                    <FaChartLine className="text-purple-600" />
                    3. Serviços e Diferenciais
                  </h4>
                  <div className="space-y-2 text-sm text-purple-700">
                    <p><strong>Serviços (2 obrigatórios):</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Título curto e direto</li>
                      <li>Descrição com benefícios claros</li>
                      <li>Ex: "Corte sob medida" + "Precisão milimétrica..."</li>
                    </ul>
                    
                    <p><strong>Diferenciais (3 obrigatórios):</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Características únicas da empresa</li>
                      <li>Vantagens competitivas</li>
                      <li>Ex: "Atendimento Personalizado" + "Consultoria especializada..."</li>
                    </ul>
                  </div>
                </section>

                {/* Seção 4: Requisitos Técnicos */}
                <section className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                    <FaImage className="text-orange-600" />
                    4. Requisitos Técnicos
                  </h4>
                  <div className="space-y-2 text-sm text-orange-700">
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li><strong>Tamanho máximo:</strong> 1MB por imagem</li>
                      <li><strong>Formatos:</strong> JPG, PNG, WebP</li>
                      <li><strong>Seção 1:</strong> 600x400px (paisagem)</li>
                      <li><strong>Seção 2:</strong> 500x300px (paisagem)</li>
                      <li><strong>Textos alternativos:</strong> Descrevam as imagens para SEO</li>
                    </ul>
                  </div>
                </section>

                {/* Seção 5: Dicas de Conteúdo */}
                <section className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                    <FaCircleExclamation className="text-red-600" />
                    5. Dicas para Conteúdo Eficaz
                  </h4>
                  <div className="space-y-2 text-sm text-red-700">
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Use linguagem clara e direta</li>
                      <li>Destaque benefícios, não apenas características</li>
                      <li>Mantenha a consistência da marca</li>
                      <li>Use call-to-action persuasivo</li>
                      <li>Revise todos os textos antes de salvar</li>
                    </ul>
                  </div>
                </section>
              </div>

              {/* Rodapé do Modal */}
              <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <button
                  onClick={closeInstructionsModal}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium flex items-center justify-center gap-2 shadow-md"
                >
                  <FaCheckCircle />
                  Entendi, Obrigado!
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preview da Seção Atual - COMPACTADO */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 slide-in-right flex items-center gap-2">
            <FaEye className="text-blue-600" />
            Preview da Seção Atual
          </h2>

          {activeSection ? (
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm border border-gray-200 p-4 card-hover hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-600">
                  ATIVO
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                {activeSection.section1Title}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="font-medium text-gray-700 mb-1">Serviços:</p>
                  <div className="space-y-1">
                    {activeSection.services?.slice(0, 2).map((service, index) => (
                      <div key={index} className="text-gray-600">• {service.title}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">Diferenciais:</p>
                  <div className="space-y-1">
                    {activeSection.features?.slice(0, 2).map((feature, index) => (
                      <div key={index} className="text-gray-600">• {feature.title}</div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-2 text-xs text-gray-500">
                Atualizado em: {new Date(activeSection.updatedAt).toLocaleDateString("pt-BR")}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-dashed border-gray-300 gentle-pulse">
              <FaCog className="text-gray-400 text-3xl mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Nenhuma seção ativa</p>
              <p className="text-gray-400 text-xs mt-1">
                Crie a primeira seção usando o botão abaixo
              </p>
            </div>
          )}
        </div>

        {/* Botão de Ação Principal */}
        <div className="flex justify-center mb-6">
          <button
            onClick={openEditForm}
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 font-medium flex items-center gap-2 btn-hover-lift shadow-md text-sm"
          >
            <FaEdit />{" "}
            {activeSection ? "Editar Seção Atual" : "Criar Seção de Serviços"}
          </button>
        </div>
      </div>

      {/* Modal do Formulário - COMPACTADO */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-enter-active">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                  <FaCog className="text-white text-lg" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editingSection ? "Editar Seção" : "Criar Seção"}
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingSection(null);
                  resetForm();
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isLoading}
              >
                <FaTimes className="text-gray-400 hover:text-gray-600 text-sm" />
              </button>
            </div>

            <form onSubmit={handleSaveSection} className="p-4 space-y-6">
              {/* Seção 1 - COMPACTADO */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                  <FaImage className="text-green-500" />
                  Seção 1 - O que oferecemos
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Imagem da Seção 1 COMPACTADA */}
                  <div>
                    <label className="block text-xs font-medium mb-2">Imagem 1 *</label>
                    <div className={`border-2 border-dashed rounded-lg overflow-hidden transition-all duration-300 aspect-video flex items-center justify-center card-hover transform hover:scale-[1.02] ${
                      image1Error 
                        ? 'border-red-300 bg-red-50' 
                        : previewImage1 
                          ? 'border-green-300 bg-green-50' 
                          : 'border-gray-300 hover:border-purple-400 bg-gray-50'
                    }`}>
                      {previewImage1 ? (
                        <div className="relative w-full h-full">
                          <img
                            src={previewImage1}
                            alt="Preview Seção 1"
                            className="w-full h-full object-cover fade-in"
                          />
                          <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-1 shadow-md">
                            <FaCheckCircle size={12} />
                          </div>
                        </div>
                      ) : image1Error ? (
                        <div className="text-center p-3">
                          <FaTimesCircle className="text-red-400 text-xl mx-auto mb-1" />
                          <p className="text-red-600 text-xs font-medium">Erro</p>
                          <p className="text-red-500 text-xs mt-1">{image1Error}</p>
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          <FaUpload className="text-gray-400 text-xl mx-auto mb-1" />
                          <p className="text-gray-600 font-medium text-xs">Selecione imagem</p>
                        </div>
                      )}
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage1Change}
                      className="w-full p-1 border rounded-lg mt-2 text-xs"
                    />

                    {image1File && !image1Error && (
                      <div className="bg-green-50 border border-green-200 rounded p-2 mt-2 fade-in">
                        <p className="text-green-700 text-xs">
                          ✅ {image1File.name.length > 20 ? image1File.name.substring(0, 20) + "..." : image1File.name} ({formatFileSize(image1File.size)})
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Conteúdo da Seção 1 COMPACTADO */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">Título 1 *</label>
                      <input
                        type="text"
                        value={formData.section1Title}
                        onChange={(e) => setFormData({ ...formData, section1Title: e.target.value })}
                        className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Ex: O que nós oferecemos"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1">Descrição 1 *</label>
                      <textarea
                        value={formData.section1Description}
                        onChange={(e) => setFormData({ ...formData, section1Description: e.target.value })}
                        className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-16"
                        placeholder="Descreva os serviços..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1">Alt da Imagem 1 *</label>
                      <input
                        type="text"
                        value={formData.section1ImageAlt}
                        onChange={(e) => setFormData({ ...formData, section1ImageAlt: e.target.value })}
                        className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Ex: Serviços oferecidos"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção 2 - COMPACTADO */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                  <FaImage className="text-green-500" />
                  Seção 2 - Diferenciais
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Conteúdo da Seção 2 COMPACTADO */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">Título 2 *</label>
                      <input
                        type="text"
                        value={formData.section2Title}
                        onChange={(e) => setFormData({ ...formData, section2Title: e.target.value })}
                        className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Ex: Nossos diferenciais"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1">Alt da Imagem 2 *</label>
                      <input
                        type="text"
                        value={formData.section2ImageAlt}
                        onChange={(e) => setFormData({ ...formData, section2ImageAlt: e.target.value })}
                        className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Ex: Detalhes e qualidade"
                        required
                      />
                    </div>
                  </div>

                  {/* Imagem da Seção 2 COMPACTADA */}
                  <div>
                    <label className="block text-xs font-medium mb-2">Imagem 2 *</label>
                    <div className={`border-2 border-dashed rounded-lg overflow-hidden transition-all duration-300 aspect-video flex items-center justify-center card-hover transform hover:scale-[1.02] ${
                      image2Error 
                        ? 'border-red-300 bg-red-50' 
                        : previewImage2 
                          ? 'border-green-300 bg-green-50' 
                          : 'border-gray-300 hover:border-purple-400 bg-gray-50'
                    }`}>
                      {previewImage2 ? (
                        <div className="relative w-full h-full">
                          <img
                            src={previewImage2}
                            alt="Preview Seção 2"
                            className="w-full h-full object-cover fade-in"
                          />
                          <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-1 shadow-md">
                            <FaCheckCircle size={12} />
                          </div>
                        </div>
                      ) : image2Error ? (
                        <div className="text-center p-3">
                          <FaTimesCircle className="text-red-400 text-xl mx-auto mb-1" />
                          <p className="text-red-600 text-xs font-medium">Erro</p>
                          <p className="text-red-500 text-xs mt-1">{image2Error}</p>
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          <FaUpload className="text-gray-400 text-xl mx-auto mb-1" />
                          <p className="text-gray-600 font-medium text-xs">Selecione imagem</p>
                        </div>
                      )}
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage2Change}
                      className="w-full p-1 border rounded-lg mt-2 text-xs"
                    />

                    {image2File && !image2Error && (
                      <div className="bg-green-50 border border-green-200 rounded p-2 mt-2 fade-in">
                        <p className="text-green-700 text-xs">
                          ✅ {image2File.name.length > 20 ? image2File.name.substring(0, 20) + "..." : image2File.name} ({formatFileSize(image2File.size)})
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Serviços - COMPACTADO */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                  <FaCog className="text-green-500" />
                  Serviços (2)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {formData.services.map((service, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2 text-xs">Serviço {index + 1}</h4>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs font-medium mb-1">Título *</label>
                          <input
                            type="text"
                            value={service.title}
                            onChange={(e) => handleServiceChange(index, "title", e.target.value)}
                            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Ex: Corte sob medida"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Descrição *</label>
                          <textarea
                            value={service.description}
                            onChange={(e) => handleServiceChange(index, "description", e.target.value)}
                            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-12"
                            placeholder="Descreva o serviço..."
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Diferenciais - COMPACTADO */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                  <FaChartLine className="text-green-500" />
                  Diferenciais (3)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2 text-xs">Diferencial {index + 1}</h4>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs font-medium mb-1">Título *</label>
                          <input
                            type="text"
                            value={feature.title}
                            onChange={(e) => handleFeatureChange(index, "title", e.target.value)}
                            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Ex: Atendimento"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Descrição *</label>
                          <textarea
                            value={feature.description}
                            onChange={(e) => handleFeatureChange(index, "description", e.target.value)}
                            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-12"
                            placeholder="Descreva o diferencial..."
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA - COMPACTADO */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                  <FaPlus className="text-green-500" />
                  Botão de Ação
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Texto *</label>
                    <input
                      type="text"
                      value={formData.ctaText}
                      onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Ex: Faça um orçamento"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Link *</label>
                    <input
                      type="text"
                      value={formData.ctaLink}
                      onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Ex: /contato"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Informações de Imagens COMPACTADA */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <FaCircleExclamation className="text-purple-600 text-sm mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm mb-1">Recomendações</h4>
                    <ul className="text-gray-700 text-xs space-y-0.5">
                      <li>• <strong>Tamanho máximo: 1MB</strong> por imagem</li>
                      <li>• Formatos: JPG, PNG, WebP</li>
                      <li>• Dimensões: 600x400px (Seção 1) e 500x300px (Seção 2)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Botões de Ação COMPACTADOS */}
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={isLoading || image1Error || image2Error}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 btn-hover-lift shadow-md text-sm"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Salvar Alterações
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingSection(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-medium btn-hover-lift text-sm"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão COMPACTADO */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 modal-enter-active">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full transform transition-all duration-300 scale-100">
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-red-100 rounded-lg">
                  <FaExclamationTriangle className="text-red-600 text-lg" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">Excluir Seção</h3>
              </div>
              <button
                onClick={closeDeleteModal}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isDeleting}
              >
                <FaTimes className="text-gray-400 hover:text-gray-600 text-sm" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-4">
              <p className="text-gray-700 text-sm mb-3">Tem certeza que deseja excluir esta seção?</p>
              <p className="text-xs text-gray-500 mb-3">Esta ação não pode ser desfeita.</p>

              {deleteModal.section && (
                <div className="p-2 bg-gray-100 rounded border border-gray-200">
                  <div className="text-xs text-gray-600">
                    <p className="font-medium">{deleteModal.section.section1Title}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Ações do Modal */}
            <div className="flex gap-2 p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteSection}
                disabled={isDeleting}
                className="flex-1 px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm shadow-md"
              >
                {isDeleting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <FaTrash />
                    Excluir
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageServicesSection;