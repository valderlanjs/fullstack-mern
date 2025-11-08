// pages/admin/ManageSections.jsx - VERSÃO SIMPLIFICADA
import React, { useState, useEffect } from "react";
import axios from "axios";
import { backend_url } from "../App";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaPlus, FaImage, FaEye, FaEyeSlash } from "react-icons/fa";

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

  // Buscar seções
  const fetchSections = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/sections/admin/all`, {
        headers: { token }
      });
      if (response.data.success) {
        setSections(response.data.sections);
      }
    } catch (error) {
      toast.error("Erro ao carregar seções");
    }
  };

  // Salvar/Atualizar seção
  const handleSaveSection = async (e) => {
    e.preventDefault();
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
        await axios.put(`${backend_url}/api/sections/${editingSection.id}`, formDataToSend, {
          headers: { 
            token,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success("Seção atualizada com sucesso!");
      } else {
        // Criar nova
        await axios.post(`${backend_url}/api/sections`, formDataToSend, {
          headers: { 
            token,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success("Seção criada com sucesso!");
      }
      
      setShowForm(false);
      setEditingSection(null);
      setFormData({
        title: "", content: "", 
        imagePosition: "left", imageUrl: "", imageAlt: "", 
        order: 0, isActive: true
      });
      setImageFile(null);
      fetchSections();
    } catch (error) {
      toast.error("Erro ao salvar seção");
    }
  };

  // Deletar seção
  const handleDeleteSection = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta seção?")) {
      try {
        await axios.delete(`${backend_url}/api/sections/${id}`, {
          headers: { token }
        });
        toast.success("Seção excluída com sucesso!");
        fetchSections();
      } catch (error) {
        toast.error("Erro ao excluir seção");
      }
    }
  };

  // Toggle ativo/inativo
  const toggleSectionActive = async (section) => {
    try {
      await axios.put(`${backend_url}/api/sections/${section.id}`, {
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

  useEffect(() => {
    fetchSections();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Seções</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> Nova Seção
        </button>
      </div>

      {/* Lista de Seções */}
      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="bg-white p-4 rounded-lg border flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${section.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div>
                <h3 className="font-semibold">{section.title}</h3>
                <p className="text-sm text-gray-600">
                  Ordem: {section.order} • Imagem: {section.imagePosition === 'left' ? 'Esquerda' : 'Direita'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleSectionActive(section)}
                className={`p-2 rounded ${section.isActive ? 'text-yellow-600 hover:bg-yellow-50' : 'text-green-600 hover:bg-green-50'}`}
                title={section.isActive ? 'Desativar' : 'Ativar'}
              >
                {section.isActive ? <FaEyeSlash /> : <FaEye />}
              </button>
              <button
                onClick={() => {
                  setEditingSection(section);
                  setFormData(section);
                  setShowForm(true);
                }}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                title="Editar"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDeleteSection(section.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
                title="Excluir"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal do Formulário */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingSection ? 'Editar Seção' : 'Nova Seção'}
            </h2>
            
            <form onSubmit={handleSaveSection} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Título *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ordem</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Conteúdo *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full p-2 border rounded h-32"
                  placeholder="Use quebras de linha para separar parágrafos"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Use Enter para criar novos parágrafos
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Posição da Imagem</label>
                <select
                  value={formData.imagePosition}
                  onChange={(e) => setFormData({...formData, imagePosition: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="left">Esquerda</option>
                  <option value="right">Direita</option>
                </select>
              </div>

              {/*<div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">URL da Imagem *</label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="https://exemplo.com/imagem.jpg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Alt da Imagem *</label>
                  <input
                    type="text"
                    value={formData.imageAlt}
                    onChange={(e) => setFormData({...formData, imageAlt: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="Descrição da imagem"
                    required
                  />
                </div>
              </div>*/}

              <div>
                <label className="block text-sm font-medium mb-1">Ou faça upload de uma imagem</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full p-2 border rounded"
                />
                {imageFile && (
                  <p className="text-sm text-green-600 mt-1">
                    Imagem selecionada: {imageFile.name}
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="mr-2"
                  id="isActive"
                />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Seção ativa
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="bg-secondary text-white px-4 py-2 rounded-lg flex-1"
                >
                  {editingSection ? 'Atualizar' : 'Criar'} Seção
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingSection(null);
                    setFormData({
                      title: "", content: "", 
                      imagePosition: "left", imageUrl: "", imageAlt: "", 
                      order: 0, isActive: true
                    });
                    setImageFile(null);
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSections;