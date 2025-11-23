// pages/admin/ManageSections.jsx - VERSÃO MELHORADA COM VALIDAÇÃO 1MB
import React, { useState, useEffect } from "react";
import api from "../api/axios.js"
import { backend_url } from "../App";
import { toast } from "react-toastify";
import { 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaImage, 
  FaEye, 
  FaEyeSlash,
  FaSave,
  FaUpload,
  FaSpinner,
  FaExclamationTriangle,
  FaTimes,
  FaArrowsAltV,
  FaAlignLeft,
  FaAlignRight,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";

import {FaCircleExclamation} from "react-icons/fa6";

const ManageSections = ({ token }) => {
  const [sections, setSections] = useState([]);
  const [editingSection, setEditingSection] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imagePosition: "left",
    imageUrl: "",
    imageAlt: "",
    order: 0,
    isActive: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    section: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [imageError, setImageError] = useState(""); // NOVO: estado para erro de imagem

  // Buscar seções
  const fetchSections = async () => {
    try {
      const response = await api.get(`${backend_url}/api/sections/admin/all`, {
        headers: { token }
      });
      if (response.data.success) {
        setSections(response.data.sections);
      }
    } catch (error) {
      toast.error("Erro ao carregar seções");
    }
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
    
    // Verifica se há erro na imagem
    if (imageError) {
      toast.error("Por favor, corrija o erro na imagem antes de enviar.");
      return;
    }

    setIsLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Adicionar campos do formulário
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Adicionar arquivo de imagem se existir
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      if (editingSection) {
        // Atualizar
        await api.put(`${backend_url}/api/sections/${editingSection.id}`, formDataToSend, {
          headers: { 
            token,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success("Seção atualizada com sucesso! 🎉");
      } else {
        // Criar nova
        await api.post(`${backend_url}/api/sections`, formDataToSend, {
          headers: { 
            token,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success("Seção criada com sucesso! 🎉");
      }
      
      setShowForm(false);
      setEditingSection(null);
      setFormData({
        title: "", content: "", 
        imagePosition: "left", imageUrl: "", imageAlt: "", 
        order: 0, isActive: true
      });
      setImageFile(null);
      setPreviewImage(null);
      setImageError(""); // Limpa o erro
      fetchSections();
    } catch (error) {
      toast.error("Erro ao salvar seção");
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
      await api.delete(`${backend_url}/api/sections/${deleteModal.section.id}`, {
        headers: { token }
      });
      toast.success("Seção excluída com sucesso!");
      fetchSections();
      closeDeleteModal();
    } catch (error) {
      toast.error("Erro ao excluir seção");
    } finally {
      setIsDeleting(null);
    }
  };

  // Toggle ativo/inativo
  const toggleSectionActive = async (section) => {
    try {
      await api.put(`${backend_url}/api/sections/${section.id}`, {
        ...section,
        isActive: !section.isActive
      }, {
        headers: { token }
      });
      toast.success(`Seção ${!section.isActive ? 'ativada' : 'desativada'}!`);
      fetchSections();
    } catch (error) {
      toast.error("Erro ao alterar status da seção");
    }
  };

  // NOVA FUNÇÃO: Validação de imagem
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageError(""); // Limpa erros anteriores

    if (file) {
      // Validação de tamanho (1MB)
      if (file.size > 1 * 1024 * 1024) {
        setImageError("A imagem deve ter no máximo 1MB");
        setImageFile(null);
        setPreviewImage(null);
        return;
      }

      // Validação do tipo de arquivo
      if (!file.type.startsWith('image/')) {
        setImageError("Por favor, selecione um arquivo de imagem válido");
        setImageFile(null);
        setPreviewImage(null);
        return;
      }

      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setImageError("");
    }
  };

  // Abrir formulário para nova seção
  const openNewSectionForm = () => {
    setEditingSection(null);
    setFormData({
      title: "",
      content: "",
      imagePosition: "left",
      imageUrl: "",
      imageAlt: "",
      order: sections.length > 0 ? Math.max(...sections.map(s => s.order)) + 1 : 0,
      isActive: true
    });
    setPreviewImage(null);
    setImageFile(null);
    setImageError(""); // Limpa erros
    setShowForm(true);
  };

  // Abrir formulário para edição
  const openEditForm = (section) => {
    setEditingSection(section);
    setFormData(section);
    setPreviewImage(section.imageUrl);
    setImageError(""); // Limpa erros ao carregar seção existente
    setShowForm(true);
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const activeSections = sections.filter(section => section.isActive);
  const inactiveSections = sections.filter(section => !section.isActive);

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto fade-in">
        {/* Header */}
        <div className="mb-8 slide-in-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <FaImage className="text-secondary" />
            Gerenciar Seções da Página
          </h1>
          <p className="text-gray-600">
            Crie e gerencie seções de imagem e texto para a página "Nossa Empresa"
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 fade-in">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 card-hover">
            <div className="text-2xl font-bold text-blue-600">{sections.length}</div>
            <div className="text-sm text-blue-800">Total de Seções</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 card-hover">
            <div className="text-2xl font-bold text-green-600">{activeSections.length}</div>
            <div className="text-sm text-green-800">Seções Ativas</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 card-hover">
            <div className="text-2xl font-bold text-orange-600">{inactiveSections.length}</div>
            <div className="text-sm text-orange-800">Seções Inativas</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 card-hover">
            <div className="text-2xl font-bold text-purple-600">1MB</div>
            <div className="text-sm text-purple-800">Tamanho Máximo</div>
          </div>
        </div>

        {/* Botão de Ação Principal */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Todas as Seções ({sections.length})
          </h2>
          <button
            onClick={openNewSectionForm}
            className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-300 font-medium flex items-center gap-2 btn-hover-lift"
          >
            <FaPlus /> Nova Seção
          </button>
        </div>

        {/* Lista de Seções */}
        <div className="space-y-4">
          {sections.length === 0 ? (
            <div className="text-center py-12 bg-gray-200 rounded-xl border-2 border-dashed border-gray-300 gentle-pulse">
              <FaImage className="text-gray-400 text-4xl mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Nenhuma seção criada</p>
              <p className="text-gray-400 text-sm mt-1">
                Crie a primeira seção usando o botão acima
              </p>
            </div>
          ) : (
            sections.map((section) => (
              <div key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 card-hover">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Status e Imagem */}
                    <div className="flex flex-col items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${section.isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                      <img 
                        src={section.imageUrl} 
                        alt={section.imageAlt}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">{section.title}</h3>
                        {section.isActive ? (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Ativo
                          </span>
                        ) : (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                            Inativo
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {section.content}
                      </p>

                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <FaArrowsAltV />
                          <span>Ordem: {section.order}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {section.imagePosition === 'left' ? <FaAlignLeft /> : <FaAlignRight />}
                          <span>Imagem: {section.imagePosition === 'left' ? 'Esquerda' : 'Direita'}</span>
                        </div>
                        <div>
                          <span>Criado em: {new Date(section.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleSectionActive(section)}
                      className={`p-3 rounded-lg transition-colors ${
                        section.isActive 
                          ? 'text-yellow-600 hover:bg-yellow-50' 
                          : 'text-green-600 hover:bg-green-50'
                      } btn-hover-lift`}
                      title={section.isActive ? 'Desativar' : 'Ativar'}
                    >
                      {section.isActive ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    <button
                      onClick={() => openEditForm(section)}
                      className="p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors btn-hover-lift"
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => openDeleteModal(section)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors btn-hover-lift"
                      title="Excluir"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
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
                  <FaImage className="text-white text-xl" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingSection ? 'Editar Seção' : 'Nova Seção'}
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingSection(null);
                  setPreviewImage(null);
                  setImageError("");
                }}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={isLoading}
              >
                <FaTimes className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSaveSection} className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Coluna da Imagem ATUALIZADA */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-3">Imagem da Seção</label>
                    <div className={`border-2 border-dashed rounded-xl overflow-hidden transition-colors duration-300 bg-gray-200 aspect-video flex items-center justify-center card-hover ${
                      imageError 
                        ? 'border-red-300 bg-red-50' 
                        : previewImage 
                          ? 'border-green-300 bg-green-50' 
                          : 'border-gray-300 hover:border-secondary'
                    }`}>
                      {previewImage ? (
                        <div className="relative w-full h-full">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-full object-cover fade-in"
                          />
                          {/* Indicador de sucesso */}
                          <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                            <FaCheckCircle size={16} />
                          </div>
                        </div>
                      ) : imageError ? (
                        <div className="text-center p-6">
                          <FaTimesCircle className="text-red-400 text-3xl mx-auto mb-3" />
                          <p className="text-red-600 font-medium">Erro na Imagem</p>
                          <p className="text-red-500 text-sm mt-1">{imageError}</p>
                          <p className="text-red-400 text-xs mt-2">Clique para tentar novamente</p>
                        </div>
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
                    
                    {/* Informações da Imagem ATUALIZADA */}
                    {imageFile && !imageError && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3 fade-in">
                        <div className="flex items-start gap-3">
                          <FaCheckCircle className="text-green-600 text-lg mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-green-800 mb-2">
                              Imagem Válida ✓
                            </h4>
                            <div className="text-green-700 text-sm space-y-1">
                              <p><strong>Arquivo:</strong> {imageFile.name}</p>
                              <p><strong>Tamanho:</strong> {formatFileSize(imageFile.size)}</p>
                              <p><strong>Status:</strong> <span className="text-green-600">Pronta para upload</span></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Mensagem de Erro */}
                    {imageError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3 fade-in">
                        <div className="flex items-start gap-3">
                          <FaTimesCircle className="text-red-600 text-lg mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-red-800 mb-2">
                              Problema na Imagem
                            </h4>
                            <div className="text-red-700 text-sm">
                              <p>{imageError}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Configurações da Imagem */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Posição da Imagem</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, imagePosition: 'left'})}
                        className={`p-3 border rounded-lg flex items-center justify-center gap-2 transition-colors ${
                          formData.imagePosition === 'left' 
                            ? 'bg-blue-50 border-blue-300 text-blue-700' 
                            : 'border-gray-300 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <FaAlignLeft />
                        Esquerda
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, imagePosition: 'right'})}
                        className={`p-3 border rounded-lg flex items-center justify-center gap-2 transition-colors ${
                          formData.imagePosition === 'right' 
                            ? 'bg-blue-50 border-blue-300 text-blue-700' 
                            : 'border-gray-300 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <FaAlignRight />
                        Direita
                      </button>
                    </div>
                  </div>
                </div>

                {/* Coluna do Conteúdo */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Título *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="Ex: Nossa História"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Conteúdo *</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent h-32"
                      placeholder="Descreva o conteúdo desta seção..."
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Use Enter para criar novos parágrafos
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Ordem de Exibição</label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                        min="0"
                      />
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <label className="flex items-center cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                            className="sr-only"
                            id="isActive"
                          />
                          <div className={`block w-14 h-8 rounded-full transition-colors ${
                            formData.isActive ? 'bg-green-500' : 'bg-gray-300'
                          }`}></div>
                          <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                            formData.isActive ? 'transform translate-x-6' : ''
                          }`}></div>
                        </div>
                        <div className="ml-3 text-sm font-medium text-gray-900">
                          {formData.isActive ? 'Ativa' : 'Inativa'}
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Dicas ATUALIZADA */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 card-hover">
                    <div className="flex items-start gap-3">
                      <FaCircleExclamation className="text-blue-600 text-lg mt-0.5 flex-shrink-0 gentle-bounce" />
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">Recomendações Técnicas</h4>
                        <ul className="text-blue-700 text-sm space-y-1">
                          <li>• <strong>Tamanho máximo da imagem: 1MB</strong></li>
                          <li>• Formatos suportados: JPG, PNG, WebP</li>
                          <li>• Dimensões recomendadas: 600x400px</li>
                          <li>• Títulos curtos e objetivos</li>
                          <li>• Conteúdo bem estruturado em parágrafos</li>
                          <li>• Imagens de alta qualidade</li>
                          <li>• Ordem lógica de exibição</li>
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
                  disabled={isLoading || imageError}
                  className="flex-1 bg-secondary text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 btn-hover-lift"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      {editingSection ? 'Atualizando...' : 'Criando...'}
                    </>
                  ) : (
                    <>
                      <FaSave />
                      {editingSection ? 'Atualizar Seção' : 'Criar Seção'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingSection(null);
                    setPreviewImage(null);
                    setImageError("");
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

export default ManageSections;