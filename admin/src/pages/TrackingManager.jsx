import React, { useState, useEffect } from "react";
import api from "../api/axios.js"
import { backend_url } from "../App";
import { toast } from "react-toastify";
import {
  FaCode,
  FaToggleOn,
  FaToggleOff,
  FaEdit,
  FaTrash,
  FaPlus,
  FaFacebook,
  FaGoogle,
  FaHeadSideVirus,
  FaCodeBranch
} from "react-icons/fa";

const TrackingManager = ({ token, currentUser }) => {
  const [trackingCodes, setTrackingCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCode, setEditingCode] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    platform: "meta",
    codeType: "pixel",
    code: "",
    position: "head",
    description: ""
  });

  const platformOptions = [
    { value: "meta", label: "Meta (Facebook)", icon: FaFacebook },
    { value: "google", label: "Google", icon: FaGoogle },
    { value: "other", label: "Outro", icon: FaCodeBranch }
  ];

  const codeTypeOptions = {
    meta: [
      { value: "pixel", label: "Meta Pixel" },
      { value: "conversion", label: "Conversão" }
    ],
    google: [
      { value: "tag_manager", label: "Google Tag Manager" },
      { value: "analytics", label: "Google Analytics" },
      { value: "ads", label: "Google Ads" },
      { value: "conversion", label: "Conversão" }
    ],
    other: [
      { value: "custom", label: "Código Personalizado" }
    ]
  };

  useEffect(() => {
    fetchTrackingCodes();
  }, []);

  const fetchTrackingCodes = async () => {
    try {
      const response = await api.get(`${backend_url}/api/tracking/all`, {
        headers: { token }
      });
      
      if (response.data.success) {
        setTrackingCodes(response.data.data);
      }
    } catch (error) {
      console.error("Erro ao buscar códigos:", error);
      toast.error("Erro ao carregar códigos de tracking");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingCode 
        ? `${backend_url}/api/tracking/update`
        : `${backend_url}/api/tracking/create`;

      const payload = editingCode 
        ? { id: editingCode.id, ...formData }
        : formData;

      const response = await api.post(url, payload, { headers: { token } });

      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
        fetchTrackingCodes();
      }
    } catch (error) {
      console.error("Erro ao salvar código:", error);
      toast.error(error.response?.data?.message || "Erro ao salvar código");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (code) => {
    try {
      const response = await api.post(
        `${backend_url}/api/tracking/toggle`,
        { id: code.id, isActive: !code.isActive },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchTrackingCodes();
      }
    } catch (error) {
      console.error("Erro ao alternar código:", error);
      toast.error("Erro ao alternar status");
    }
  };

  const handleEdit = (code) => {
    setEditingCode(code);
    setFormData({
      name: code.name,
      platform: code.platform,
      codeType: code.codeType,
      code: code.code,
      position: code.position,
      description: code.description || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (code) => {
    if (!window.confirm("Tem certeza que deseja excluir este código?")) {
      return;
    }

    try {
      const response = await api.post(
        `${backend_url}/api/tracking/delete`,
        { id: code.id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchTrackingCodes();
      }
    } catch (error) {
      console.error("Erro ao excluir código:", error);
      toast.error("Erro ao excluir código");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      platform: "meta",
      codeType: "pixel",
      code: "",
      position: "head",
      description: ""
    });
    setEditingCode(null);
    setShowForm(false);
  };

  const getPlatformIcon = (platform) => {
    const platformObj = platformOptions.find(p => p.value === platform);
    const Icon = platformObj ? platformObj.icon : FaCode;
    return <Icon className="inline mr-2" />;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto fade-in">
      {/* Header */}
      <div className="mb-8 slide-in-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <FaCode className="text-purple-600" />
          Gerenciar Códigos de Tracking
        </h1>
        <p className="text-gray-600">
          Adicione e gerencie pixels do Meta e tags do Google
        </p>
      </div>

      {/* Botão Adicionar */}
      <div className="mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="btn-hover-lift bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-300 font-medium flex items-center gap-2"
        >
          <FaPlus />
          Novo Código
        </button>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-8 scale-in">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaCode className="text-purple-600" />
            {editingCode ? 'Editar Código' : 'Adicionar Novo Código'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Código *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Meta Pixel Principal"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plataforma *
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({
                    ...formData, 
                    platform: e.target.value,
                    codeType: codeTypeOptions[e.target.value][0].value
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  {platformOptions.map(platform => (
                    <option key={platform.value} value={platform.value}>
                      {platform.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Código *
                </label>
                <select
                  value={formData.codeType}
                  onChange={(e) => setFormData({...formData, codeType: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  {codeTypeOptions[formData.platform].map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posição *
                </label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="head">Head (Recomendado)</option>
                  <option value="body">Body</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código (HTML/JavaScript) *
              </label>
              <textarea
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                placeholder="Cole aqui o código completo..."
                rows="8"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição (Opcional)
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Ex: Pixel para campanhas de tráfego"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading || !formData.name || !formData.code}
                className="btn-hover-lift bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? 'Salvando...' : (editingCode ? 'Atualizar' : 'Criar Código')}
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

      {/* Lista de Códigos */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Códigos Configurados
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {trackingCodes.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              Nenhum código de tracking configurado.
            </div>
          ) : (
            trackingCodes.map((code) => (
              <div key={code.id} className="px-6 py-4 hover:bg-gray-200 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getPlatformIcon(code.platform)}
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        code.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {code.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {code.codeType}
                      </span>
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                        {code.position}
                      </span>
                    </div>
                    
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      {code.name}
                    </h4>
                    
                    {code.description && (
                      <p className="text-gray-600 text-sm mb-2">
                        {code.description}
                      </p>
                    )}
                    
                    <div className="text-xs text-gray-500">
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        {code.code.substring(0, 100)}...
                      </code>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(code)}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        code.isActive 
                          ? 'text-green-600 hover:bg-green-100' 
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={code.isActive ? 'Desativar' : 'Ativar'}
                    >
                      {code.isActive ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                    </button>

                    <button
                      onClick={() => handleEdit(code)}
                      className="p-2 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                      title="Editar"
                    >
                      <FaEdit size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(code)}
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

export default TrackingManager;