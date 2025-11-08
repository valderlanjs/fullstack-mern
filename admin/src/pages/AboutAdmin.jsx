// pages/admin/ManageAboutSection.jsx - VERSÃO COMPLETA E CORRIGIDA
import React, { useState, useEffect } from "react";
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
  FaChartLine
} from "react-icons/fa";
import { FaCircleExclamation } from 'react-icons/fa6';

const ManageAboutSection = ({ token }) => {
  const [aboutSections, setAboutSections] = useState([]);
  const [editingSection, setEditingSection] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    imageAlt: "",
    button1Text: "Saiba Mais",
    button1Link: "/sobre",
    button2Text: "Contato",
    button2Link: "/contato",
    // Novos campos para estatísticas
    stat1Number: "25+",
    stat1Label: "Anos",
    stat2Number: "500+",
    stat2Label: "Projetos",
    stat3Number: "100%",
    stat3Label: "Qualidade"
  });
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    section: null
  });
  const [previewImage, setPreviewImage] = useState(null);

  // Buscar seções sobre
  const fetchAboutSections = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/about-section/admin/all`, {
        headers: { token }
      });
      if (response.data.success) {
        setAboutSections(response.data.aboutSections);
      }
    } catch (error) {
      toast.error("Erro ao carregar seções sobre");
    }
  };

  // Salvar/Atualizar seção
  const handleSaveSection = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      await axios.post(`${backend_url}/api/about-section`, formDataToSend, {
        headers: { 
          token,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success("Seção sobre atualizada com sucesso! 🎉");
      setShowForm(false);
      setEditingSection(null);
      setFormData({ 
        title: "", 
        content: "", 
        imageUrl: "", 
        imageAlt: "",
        button1Text: "Saiba Mais",
        button1Link: "/sobre",
        button2Text: "Contato",
        button2Link: "/contato",
        stat1Number: "25+",
        stat1Label: "Anos",
        stat2Number: "500+",
        stat2Label: "Projetos",
        stat3Number: "100%",
        stat3Label: "Qualidade"
      });
      setImageFile(null);
      setPreviewImage(null);
      fetchAboutSections();
    } catch (error) {
      toast.error("Erro ao salvar seção sobre");
    } finally {
      setIsLoading(false);
    }
  };

  // Abrir modal de exclusão
  const openDeleteModal = (section) => {
    setDeleteModal({
      isOpen: true,
      section: section
    });
  };

  // Fechar modal de exclusão
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      section: null
    });
  };

  // Deletar seção
  const handleDeleteSection = async () => {
    if (!deleteModal.section) return;

    setIsDeleting(deleteModal.section.id);
    try {
      await axios.delete(`${backend_url}/api/about-section/${deleteModal.section.id}`, {
        headers: { token }
      });
      toast.success("Seção excluída com sucesso!");
      fetchAboutSections();
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
      const response = await axios.get(`${backend_url}/api/about-section`);
      if (response.data.success) {
        const currentSection = response.data.aboutSection;
        setFormData({
          title: currentSection.title || "",
          content: currentSection.content || "",
          imageUrl: currentSection.imageUrl || "",
          imageAlt: currentSection.imageAlt || "",
          button1Text: currentSection.button1Text || "Saiba Mais",
          button1Link: currentSection.button1Link || "/sobre",
          button2Text: currentSection.button2Text || "Contato",
          button2Link: currentSection.button2Link || "/contato",
          stat1Number: currentSection.stat1Number || "25+",
          stat1Label: currentSection.stat1Label || "Anos",
          stat2Number: currentSection.stat2Number || "500+",
          stat2Label: currentSection.stat2Label || "Projetos",
          stat3Number: currentSection.stat3Number || "100%",
          stat3Label: currentSection.stat3Label || "Qualidade"
        });
        setEditingSection(currentSection);
        setPreviewImage(currentSection.imageUrl);
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

  // Handler para upload de imagem
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    fetchAboutSections();
    loadCurrentSection();
  }, []);

  const activeSection = aboutSections.find(section => section.isActive);

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto fade-in">
        {/* Header */}
        <div className="mb-8 slide-in-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <FaImage className="text-secondary" />
            Gerenciar Seção Sobre
          </h1>
          <p className="text-gray-600">
            Edite o conteúdo, imagem, botões e estatísticas da seção "Sobre" da empresa
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
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3">
                  <img 
                    src={activeSection.imageUrl} 
                    alt={activeSection.imageAlt}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600">ATIVO</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{activeSection.title}</h3>
                  <p className="text-gray-600 line-clamp-3">{activeSection.content}</p>
                  
                  {/* Preview das Estatísticas */}
                  <div className="flex gap-8 mt-4 pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <div 
                        className="text-2xl font-bold"
                        style={{ color: '#206E34' }}
                      >
                        {activeSection.stat1Number || "25+"}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {activeSection.stat1Label || "Anos"}
                      </div>
                    </div>
                    <div className="text-center">
                      <div 
                        className="text-2xl font-bold"
                        style={{ color: '#206E34' }}
                      >
                        {activeSection.stat2Number || "500+"}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {activeSection.stat2Label || "Projetos"}
                      </div>
                    </div>
                    <div className="text-center">
                      <div 
                        className="text-2xl font-bold"
                        style={{ color: '#206E34' }}
                      >
                        {activeSection.stat3Number || "100%"}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {activeSection.stat3Label || "Qualidade"}
                      </div>
                    </div>
                  </div>
                  
                  {/* Preview dos Botões */}
                  <div className="flex gap-3 mt-4">
                    <div className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg text-sm font-medium">
                      {activeSection.button1Text || "Saiba Mais"}
                    </div>
                    <div className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium">
                      {activeSection.button2Text || "Contato"}
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-500">
                    Atualizado em: {new Date(activeSection.updatedAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-200 rounded-xl border-2 border-dashed border-gray-300 gentle-pulse">
              <FaImage className="text-gray-400 text-4xl mx-auto mb-4" />
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
            <FaEdit /> {activeSection ? 'Editar Seção Atual' : 'Criar Seção Sobre'}
          </button>
        </div>
      </div>

      {/* Modal do Formulário */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-enter-active">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary rounded-lg">
                  <FaEdit className="text-white text-xl" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingSection ? 'Editar Seção Sobre' : 'Criar Seção Sobre'}
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingSection(null);
                  setPreviewImage(null);
                }}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={isLoading}
              >
                <FaTimes className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSaveSection} className="p-6 space-y-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Preview da Imagem */}
                <div className="lg:w-1/2">
                  <label className="block text-sm font-medium mb-3">Imagem da Seção</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-secondary transition-colors duration-300 bg-gray-200 aspect-video flex items-center justify-center card-hover">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover fade-in"
                      />
                    ) : (
                      <div className="text-center p-6 gentle-pulse">
                        <FaUpload className="text-gray-400 text-3xl mx-auto mb-3" />
                        <p className="text-gray-600 font-medium">Selecione uma imagem</p>
                        <p className="text-gray-400 text-sm mt-1">ou arraste aqui</p>
                      </div>
                    )}
                  </div>
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-2 border rounded-lg mt-3"
                  />
                  
                  {imageFile && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3 fade-in">
                      <p className="text-green-700 text-sm font-medium">
                        ✅ Nova imagem selecionada: {imageFile.name}
                      </p>
                      <p className="text-green-600 text-xs mt-1">
                        Tamanho: {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>

                {/* Campos do Formulário */}
                <div className="lg:w-1/2 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Título *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="Ex: Grupo Madenobre - Há 25 anos no mercado"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Conteúdo *</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent h-32"
                      placeholder="Descreva sobre a empresa, história, missão, valores..."
                      required
                    />
                  </div>

                  {/* Seção das Estatísticas */}
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FaChartLine className="text-green-600" />
                      Estatísticas da Empresa
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Número 1 *</label>
                        <input
                          type="text"
                          value={formData.stat1Number}
                          onChange={(e) => setFormData({...formData, stat1Number: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                          placeholder="Ex: 25+"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Rótulo 1 *</label>
                        <input
                          type="text"
                          value={formData.stat1Label}
                          onChange={(e) => setFormData({...formData, stat1Label: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                          placeholder="Ex: Anos"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Número 2 *</label>
                        <input
                          type="text"
                          value={formData.stat2Number}
                          onChange={(e) => setFormData({...formData, stat2Number: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                          placeholder="Ex: 500+"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Rótulo 2 *</label>
                        <input
                          type="text"
                          value={formData.stat2Label}
                          onChange={(e) => setFormData({...formData, stat2Label: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                          placeholder="Ex: Projetos"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Número 3 *</label>
                        <input
                          type="text"
                          value={formData.stat3Number}
                          onChange={(e) => setFormData({...formData, stat3Number: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                          placeholder="Ex: 100%"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Rótulo 3 *</label>
                        <input
                          type="text"
                          value={formData.stat3Label}
                          onChange={(e) => setFormData({...formData, stat3Label: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                          placeholder="Ex: Qualidade"
                          required
                        />
                      </div>
                    </div>

                    {/* Preview das estatísticas no formulário */}
                    <div className="mt-4 p-4 bg-gray-200 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">Preview das Estatísticas:</p>
                      <div className="flex gap-8 justify-center">
                        <div className="text-center">
                          <div 
                            className="text-2xl font-bold"
                            style={{ color: '#206E34' }}
                          >
                            {formData.stat1Number || "25+"}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {formData.stat1Label || "Anos"}
                          </div>
                        </div>
                        <div className="text-center">
                          <div 
                            className="text-2xl font-bold"
                            style={{ color: '#206E34' }}
                          >
                            {formData.stat2Number || "500+"}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {formData.stat2Label || "Projetos"}
                          </div>
                        </div>
                        <div className="text-center">
                          <div 
                            className="text-2xl font-bold"
                            style={{ color: '#206E34' }}
                          >
                            {formData.stat3Number || "100%"}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {formData.stat3Label || "Qualidade"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Seção dos Botões */}
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuração dos Botões</h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Texto do Botão 1 *</label>
                        <input
                          type="text"
                          value={formData.button1Text}
                          onChange={(e) => setFormData({...formData, button1Text: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                          placeholder="Ex: Saiba Mais"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Link do Botão 1 *</label>
                        <input
                          type="text"
                          value={formData.button1Link}
                          onChange={(e) => setFormData({...formData, button1Link: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                          placeholder="Ex: /sobre"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Texto do Botão 2 *</label>
                        <input
                          type="text"
                          value={formData.button2Text}
                          onChange={(e) => setFormData({...formData, button2Text: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                          placeholder="Ex: Contato"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Link do Botão 2 *</label>
                        <input
                          type="text"
                          value={formData.button2Link}
                          onChange={(e) => setFormData({...formData, button2Link: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                          placeholder="Ex: /contato"
                          required
                        />
                      </div>
                    </div>

                    {/* Preview dos botões no formulário */}
                    <div className="mt-4 p-4 bg-gray-200 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">Preview dos Botões:</p>
                      <div className="flex gap-3">
                        <button 
                          type="button"
                          className="px-4 py-2 text-white rounded-lg text-sm font-medium"
                          style={{
                            background: 'linear-gradient(135deg, #206E34, #70BD44)'
                          }}
                        >
                          {formData.button1Text || "Saiba Mais"}
                        </button>
                        <button 
                          type="button"
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                        >
                          {formData.button2Text || "Contato"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 card-hover">
                    <div className="flex items-start gap-3">
                      <FaCircleExclamation className="text-blue-600 text-lg mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">Informações Importantes</h4>
                        <ul className="text-blue-700 text-sm space-y-1">
                          <li>• Esta seção será exibida na página "Sobre"</li>
                          <li>• A imagem deve ter boa qualidade</li>
                          <li>• O conteúdo deve ser claro e objetivo</li>
                          <li>• Use "/rota" para links internos ou URL completa para externos</li>
                          <li>• As estatísticas ajudam a transmitir confiança</li>
                          <li>• Apenas uma seção pode estar ativa por vez</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
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
                    setPreviewImage(null);
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
                Tem certeza que deseja excluir esta seção?
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Esta ação não pode ser desfeita. A seção será removida permanentemente do sistema.
              </p>
              
              {/* Preview da seção que será excluída */}
              {deleteModal.section && (
                <div className="p-3 bg-gray-100 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <img
                      src={deleteModal.section.imageUrl}
                      alt="Seção a ser excluída"
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">{deleteModal.section.title}</p>
                      <p className="text-xs text-red-500 mt-1">Será removida permanentemente</p>
                    </div>
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

export default ManageAboutSection;