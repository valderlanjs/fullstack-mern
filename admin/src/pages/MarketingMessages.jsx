import React, { useState, useEffect } from "react";
import api from "../api/axios.js"
import { backend_url } from "../App";
import { toast } from "react-toastify";
import {
  FaBullhorn,
  FaToggleOn,
  FaToggleOff,
  FaEdit,
  FaTrash,
  FaPlus,
  FaPalette,
  FaSave
} from "react-icons/fa";

const MarketingMessages = ({ token, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    message: "",
    backgroundColor: "#22c55e",
    textColor: "#ffffff",
    buttonText: "",
    buttonLink: ""
  });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.get("/api/marketing-messages/all", {
        headers: { token }
      });
      
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
      toast.error("Erro ao carregar mensagens");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingMessage 
        ? `${backend_url}/api/marketing-messages/update`
        : `${backend_url}/api/marketing-messages/create`;

      const response = await api.post(url, 
        editingMessage ? { id: editingMessage.id, ...formData } : formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({
          message: "",
          backgroundColor: "#22c55e",
          textColor: "#ffffff",
          buttonText: "",
          buttonLink: ""
        });
        setShowForm(false);
        setEditingMessage(null);
        fetchMessages();
      }
    } catch (error) {
      console.error("Erro ao salvar mensagem:", error);
      toast.error(error.response?.data?.message || "Erro ao salvar mensagem");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (message) => {
    try {
      const response = await api.post(
        `${backend_url}/api/marketing-messages/toggle`,
        { id: message.id, isActive: !message.isActive },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchMessages();
      }
    } catch (error) {
      console.error("Erro ao alternar mensagem:", error);
      toast.error("Erro ao alternar status");
    }
  };

  const handleEdit = (message) => {
    setEditingMessage(message);
    setFormData({
      message: message.message,
      backgroundColor: message.backgroundColor,
      textColor: message.textColor,
      buttonText: message.buttonText || "",
      buttonLink: message.buttonLink || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (message) => {
    if (!window.confirm("Tem certeza que deseja excluir esta mensagem?")) {
      return;
    }

    try {
      const response = await api.post(
        `${backend_url}/api/marketing-messages/delete`,
        { id: message.id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchMessages();
      }
    } catch (error) {
      console.error("Erro ao excluir mensagem:", error);
      toast.error("Erro ao excluir mensagem");
    }
  };

  const resetForm = () => {
    setFormData({
      message: "",
      backgroundColor: "#22c55e",
      textColor: "#ffffff",
      buttonText: "",
      buttonLink: ""
    });
    setEditingMessage(null);
    setShowForm(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto fade-in">
      {/* Header */}
      <div className="mb-8 slide-in-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <FaBullhorn className="text-green-600" />
          Mensagens de Marketing
        </h1>
        <p className="text-gray-600">
          Gerencie as mensagens promocionais que aparecem acima do header
        </p>
      </div>

      {/* Botão Adicionar */}
      <div className="mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="btn-hover-lift bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-300 font-medium flex items-center gap-2"
        >
          <FaPlus />
          Nova Mensagem
        </button>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-8 scale-in">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaPalette className="text-green-600" />
            {editingMessage ? 'Editar Mensagem' : 'Criar Nova Mensagem'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensagem *
              </label>
              <input
                type="text"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Ex: Fretes grátis a partir de R$ 500!"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                required
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.message.length}/100 caracteres
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cor de Fundo
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={formData.backgroundColor}
                    onChange={(e) => setFormData({...formData, backgroundColor: e.target.value})}
                    className="w-12 h-12 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.backgroundColor}
                    onChange={(e) => setFormData({...formData, backgroundColor: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="#22c55e"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cor do Texto
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={formData.textColor}
                    onChange={(e) => setFormData({...formData, textColor: e.target.value})}
                    className="w-12 h-12 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.textColor}
                    onChange={(e) => setFormData({...formData, textColor: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texto do Botão (Opcional)
                </label>
                <input
                  type="text"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({...formData, buttonText: e.target.value})}
                  placeholder="Ex: Saiba mais"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  maxLength={20}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link do Botão (Opcional)
                </label>
                <input
                  type="url"
                  value={formData.buttonLink}
                  onChange={(e) => setFormData({...formData, buttonLink: e.target.value})}
                  placeholder="Ex: https://..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div 
                className="w-full py-2 px-4 text-center text-sm font-medium rounded-lg border"
                style={{
                  backgroundColor: formData.backgroundColor,
                  color: formData.textColor
                }}
              >
                <div className="flex items-center justify-center gap-4">
                  <span>{formData.message || "Sua mensagem aparecerá aqui..."}</span>
                  {formData.buttonText && (
                    <button className="px-3 py-1 rounded text-xs font-bold border border-current opacity-80">
                      {formData.buttonText}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading || !formData.message}
                className="btn-hover-lift bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FaSave />
                {loading ? 'Salvando...' : (editingMessage ? 'Atualizar' : 'Criar Mensagem')}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Mensagens */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Mensagens Cadastradas
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {messages.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              Nenhuma mensagem cadastrada ainda.
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="px-6 py-4 hover:bg-gray-200 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: message.backgroundColor }}
                      ></div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        message.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {message.isActive ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                    
                    <p className="text-gray-800 font-medium mb-1">{message.message}</p>
                    
                    {message.buttonText && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Botão:</span>
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {message.buttonText} → {message.buttonLink}
                        </span>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-2">
                      Criada em: {new Date(message.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(message)}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        message.isActive 
                          ? 'text-green-600 hover:bg-green-100' 
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={message.isActive ? 'Desativar' : 'Ativar'}
                    >
                      {message.isActive ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                    </button>

                    <button
                      onClick={() => handleEdit(message)}
                      className="p-2 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                      title="Editar"
                    >
                      <FaEdit size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(message)}
                      className="p-2 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
                      title="Excluir"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketingMessages;