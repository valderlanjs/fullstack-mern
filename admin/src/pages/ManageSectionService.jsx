import { useState, useEffect } from "react";
import axios from "axios";
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
} from "react-icons/fa";

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

  // Buscar seções de serviços
  const fetchServicesSections = async () => {
    try {
      const response = await axios.get(
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
          console.log(`🔸 Campo ${key}:`, formData[key]); // DEBUG
        }
      });

      // Adicionar arrays como JSON
      const servicesJSON = JSON.stringify(formData.services);
      const featuresJSON = JSON.stringify(formData.features);

      formDataToSend.append("services", servicesJSON);
      formDataToSend.append("features", featuresJSON);

      console.log("🔸 Services:", servicesJSON); // DEBUG
      console.log("🔸 Features:", featuresJSON); // DEBUG

      // Adicionar arquivos de imagem
      if (image1File) {
        formDataToSend.append("section1Image", image1File);
        console.log("🔸 Image1 File:", image1File.name); // DEBUG
      }
      if (image2File) {
        formDataToSend.append("section2Image", image2File);
        console.log("🔸 Image2 File:", image2File.name); // DEBUG
      }

      // DEBUG: Verificar todos os campos do FormData
      console.log("📤 Dados sendo enviados:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`   ${key}:`, value);
      }

      const response = await axios.post(
        `${backend_url}/api/services-section`,
        formDataToSend,
        {
          headers: {
            token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ Resposta do servidor:", response.data); // DEBUG

      toast.success("Seção de serviços atualizada com sucesso! 🎉");
      setShowForm(false);
      setEditingSection(null);
      resetForm();
      fetchServicesSections();
    } catch (error) {
      console.error("❌ Erro detalhado:", error); // DEBUG
      console.error("❌ Resposta de erro:", error.response?.data); // DEBUG

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
      await axios.delete(
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
      const response = await axios.get(`${backend_url}/api/services-section`);
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

  // Handlers para upload de imagens
  const handleImage1Change = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage1File(file);
      setPreviewImage1(URL.createObjectURL(file));
    }
  };

  const handleImage2Change = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage2File(file);
      setPreviewImage2(URL.createObjectURL(file));
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <FaCog className="text-secondary" />
            Gerenciar Seção de Serviços
          </h1>
          <p className="text-gray-600">
            Edite o conteúdo, imagens e informações da seção "Serviços" da
            empresa
          </p>
        </div>

        {/* Preview da Seção Atual */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 slide-in-right flex items-center gap-2">
            <FaEye className="text-blue-600" />
            Preview da Seção Atual
          </h2>

          {activeSection ? (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden card-hover">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-600">
                    ATIVO
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {activeSection.section1Title}
                </h3>
                <p className="text-gray-600 line-clamp-2 mb-4">
                  {activeSection.section1Description}
                </p>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Serviços:
                    </p>
                    <div className="space-y-2">
                      {activeSection.services
                        ?.slice(0, 2)
                        .map((service, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            • {service.title}
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Diferenciais:
                    </p>
                    <div className="space-y-2">
                      {activeSection.features
                        ?.slice(0, 2)
                        .map((feature, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            • {feature.title}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  Atualizado em:{" "}
                  {new Date(activeSection.updatedAt).toLocaleDateString(
                    "pt-BR"
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-200 rounded-xl border-2 border-dashed border-gray-300 gentle-pulse">
              <FaCog className="text-gray-400 text-4xl mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Nenhuma seção ativa</p>
              <p className="text-gray-400 text-sm mt-1">
                Crie a primeira seção usando o botão abaixo
              </p>
            </div>
          )}
        </div>

        {/* Botão de Ação Principal */}
        <div className="flex justify-center">
          <button
            onClick={openEditForm}
            className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-300 font-medium flex items-center gap-2 btn-hover-lift"
          >
            <FaEdit />{" "}
            {activeSection ? "Editar Seção Atual" : "Criar Seção de Serviços"}
          </button>
        </div>
      </div>

      {/* Modal do Formulário - MUITO EXTENSO, VOU CONTINUAR NA PRÓXIMA RESPOSTA */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-enter-active">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary rounded-lg">
                  <FaCog className="text-white text-xl" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingSection
                    ? "Editar Seção de Serviços"
                    : "Criar Seção de Serviços"}
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingSection(null);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={isLoading}
              >
                <FaTimes className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            {/* Formulário - CONTINUA NA PRÓXIMA RESPOSTA */}
            <form onSubmit={handleSaveSection} className="p-6 space-y-8">
              {/* Seção 1 */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FaImage className="text-green-600" />
                  Seção 1 - O que oferecemos
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Imagem da Seção 1 */}
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Imagem da Seção 1
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-secondary transition-colors duration-300 bg-gray-200 aspect-video flex items-center justify-center card-hover">
                      {previewImage1 ? (
                        <img
                          src={previewImage1}
                          alt="Preview Seção 1"
                          className="w-full h-full object-cover fade-in"
                        />
                      ) : (
                        <div className="text-center p-6 gentle-pulse">
                          <FaUpload className="text-gray-400 text-3xl mx-auto mb-3" />
                          <p className="text-gray-600 font-medium">
                            Selecione uma imagem
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            ou arraste aqui
                          </p>
                        </div>
                      )}
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage1Change}
                      className="w-full p-2 border rounded-lg mt-3"
                    />

                    {image1File && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3 fade-in">
                        <p className="text-green-700 text-sm font-medium">
                          ✅ Nova imagem selecionada: {image1File.name}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Conteúdo da Seção 1 */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Título da Seção 1 *
                      </label>
                      <input
                        type="text"
                        value={formData.section1Title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            section1Title: e.target.value,
                          })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="Ex: O que nós oferecemos"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Descrição da Seção 1 *
                      </label>
                      <textarea
                        value={formData.section1Description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            section1Description: e.target.value,
                          })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent h-24"
                        placeholder="Descreva os serviços oferecidos..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Alt da Imagem 1 *
                      </label>
                      <input
                        type="text"
                        value={formData.section1ImageAlt}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            section1ImageAlt: e.target.value,
                          })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="Ex: Serviços oferecidos"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção 2 */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FaImage className="text-green-600" />
                  Seção 2 - Nossos diferenciais
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Conteúdo da Seção 2 */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Título da Seção 2 *
                      </label>
                      <input
                        type="text"
                        value={formData.section2Title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            section2Title: e.target.value,
                          })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="Ex: Nós nos concentramos em todos os detalhes"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Alt da Imagem 2 *
                      </label>
                      <input
                        type="text"
                        value={formData.section2ImageAlt}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            section2ImageAlt: e.target.value,
                          })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="Ex: Detalhes e qualidade"
                        required
                      />
                    </div>
                  </div>

                  {/* Imagem da Seção 2 */}
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Imagem da Seção 2
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-secondary transition-colors duration-300 bg-gray-200 aspect-video flex items-center justify-center card-hover">
                      {previewImage2 ? (
                        <img
                          src={previewImage2}
                          alt="Preview Seção 2"
                          className="w-full h-full object-cover fade-in"
                        />
                      ) : (
                        <div className="text-center p-6 gentle-pulse">
                          <FaUpload className="text-gray-400 text-3xl mx-auto mb-3" />
                          <p className="text-gray-600 font-medium">
                            Selecione uma imagem
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            ou arraste aqui
                          </p>
                        </div>
                      )}
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage2Change}
                      className="w-full p-2 border rounded-lg mt-3"
                    />

                    {image2File && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3 fade-in">
                        <p className="text-green-700 text-sm font-medium">
                          ✅ Nova imagem selecionada: {image2File.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Serviços */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FaCog className="text-green-600" />
                  Serviços Oferecidos
                </h3>

                <div className="space-y-6">
                  {formData.services.map((service, index) => (
                    <div
                      key={index}
                      className="bg-gray-200 p-4 rounded-lg border border-gray-200"
                    >
                      <h4 className="font-medium text-gray-900 mb-4">
                        Serviço {index + 1}
                      </h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Título do Serviço *
                          </label>
                          <input
                            type="text"
                            value={service.title}
                            onChange={(e) =>
                              handleServiceChange(
                                index,
                                "title",
                                e.target.value
                              )
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                            placeholder="Ex: Corte sob medida"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Descrição do Serviço *
                          </label>
                          <textarea
                            value={service.description}
                            onChange={(e) =>
                              handleServiceChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent h-20"
                            placeholder="Descreva o serviço..."
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Diferenciais */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FaChartLine className="text-green-600" />
                  Nossos Diferenciais
                </h3>

                <div className="space-y-6">
                  {formData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="bg-gray-200 p-4 rounded-lg border border-gray-200"
                    >
                      <h4 className="font-medium text-gray-900 mb-4">
                        Diferencial {index + 1}
                      </h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Título do Diferencial *
                          </label>
                          <input
                            type="text"
                            value={feature.title}
                            onChange={(e) =>
                              handleFeatureChange(
                                index,
                                "title",
                                e.target.value
                              )
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                            placeholder="Ex: Atendimento"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Descrição do Diferencial *
                          </label>
                          <textarea
                            value={feature.description}
                            onChange={(e) =>
                              handleFeatureChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent h-20"
                            placeholder="Descreva o diferencial..."
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FaPlus className="text-green-600" />
                  Botão de Ação (CTA)
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Texto do Botão *
                    </label>
                    <input
                      type="text"
                      value={formData.ctaText}
                      onChange={(e) =>
                        setFormData({ ...formData, ctaText: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="Ex: Faça um orçamento"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Link do Botão *
                    </label>
                    <input
                      type="text"
                      value={formData.ctaLink}
                      onChange={(e) =>
                        setFormData({ ...formData, ctaLink: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="Ex: /contato"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-secondary text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 btn-hover-lift"
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
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-medium btn-hover-lift"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 modal-enter-active">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FaExclamationTriangle className="text-red-600 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Excluir Seção
                </h3>
              </div>
              <button
                onClick={closeDeleteModal}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={isDeleting}
              >
                <FaTimes className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Tem certeza que deseja excluir esta seção de serviços?
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Esta ação não pode ser desfeita. A seção será removida
                permanentemente do sistema.
              </p>

              {deleteModal.section && (
                <div className="p-3 bg-gray-100 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">
                      {deleteModal.section.section1Title}
                    </p>
                    <p className="text-xs text-red-500 mt-1">
                      Será removida permanentemente
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Ações do Modal */}
            <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-200 rounded-b-xl">
              <button
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteSection}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <FaTrash />
                    Excluir Seção
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
