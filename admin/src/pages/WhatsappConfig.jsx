// WhatsAppConfig.jsx - Atualizar o exemplo
import React, { useState, useEffect } from "react";
import api from "../api/axios.js";
import { toast } from "react-toastify";
import { 
  FaWhatsapp,
  FaSave,
  FaSpinner,
  FaPhone,
  FaComment,
  FaToggleOn,
  FaToggleOff,
  FaInfoCircle
} from "react-icons/fa";

const WhatsAppConfig = ({ token }) => {
  const [config, setConfig] = useState({
    phone_number: "",
    default_message: "",
    is_active: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setIsFetching(true);
      const response = await api.get(`/api/whatsapp/config`);
      
      if (response.data.success) {
        setConfig(response.data.config);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Erro ao buscar configuração:", error);
      toast.error("Erro ao carregar configuração do WhatsApp.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!config.phone_number || !config.default_message) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Validar número (apenas números, mínimo 11 dígitos)
    const cleanNumber = config.phone_number.replace(/\D/g, '');
    if (cleanNumber.length < 11) {
      toast.error("Número de WhatsApp inválido. Deve ter pelo menos 11 dígitos.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post(
        `/api/whatsapp/update-config`,
        config,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Configuração do WhatsApp atualizada com sucesso! 🎉");
        setConfig(response.data.config);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Erro ao atualizar configuração do WhatsApp.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    const limitedNumbers = numbers.slice(0, 13);
    
    if (limitedNumbers.length <= 2) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 7) {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`;
    } else if (limitedNumbers.length <= 11) {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 3)}${limitedNumbers.slice(3, 7)}-${limitedNumbers.slice(7, 11)}`;
    } else {
      return `+${limitedNumbers.slice(0, 2)} (${limitedNumbers.slice(2, 4)}) ${limitedNumbers.slice(4, 5)}${limitedNumbers.slice(5, 9)}-${limitedNumbers.slice(9, 13)}`;
    }
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    handleChange('phone_number', formatted);
  };

  if (isFetching) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center py-12">
        <FaSpinner className="animate-spin text-4xl text-green-600 mx-auto mb-4" />
        <p className="text-gray-600">Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto fade-in">
      {/* Header */}
      <div className="mb-8 slide-in-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <FaWhatsapp className="text-green-600" />
          Configuração do WhatsApp
        </h1>
        <p className="text-gray-600">
          Configure o número do WhatsApp padrão e mensagem para todos os vendedores
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 scale-in">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Status Ativo/Inativo */}
          <div className="flex items-center justify-between p-4 bg-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${config.is_active ? 'bg-green-100' : 'bg-red-100'}`}>
                {config.is_active ? (
                  <FaToggleOn className="text-green-600 text-xl" />
                ) : (
                  <FaToggleOff className="text-red-600 text-xl" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  WhatsApp {config.is_active ? 'Ativo' : 'Inativo'}
                </h3>
                <p className="text-sm text-gray-500">
                  {config.is_active 
                    ? 'Os botões WhatsApp estarão visíveis para os clientes'
                    : 'Os botões WhatsApp estarão ocultos para os clientes'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleChange('is_active', !config.is_active)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                config.is_active
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {config.is_active ? 'Desativar' : 'Ativar'}
            </button>
          </div>

          {/* Número do WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaPhone className="inline mr-2 text-gray-400" />
              Número do WhatsApp *
            </label>
            <input
              type="text"
              value={config.phone_number}
              onChange={handlePhoneChange}
              placeholder="Ex: +55 (11) 99999-9999"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              required
              maxLength={20}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">
                Formato: +55 (DDD) 9XXXX-XXXX
              </p>
              {config.phone_number && (
                <span className="text-xs text-gray-400">
                  {config.phone_number.replace(/\D/g, '').length} dígitos
                </span>
              )}
            </div>
          </div>

          {/* Mensagem Padrão */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaComment className="inline mr-2 text-gray-400" />
              Mensagem Padrão *
            </label>
            <textarea
              value={config.default_message}
              onChange={(e) => handleChange('default_message', e.target.value)}
              placeholder="Digite a mensagem que aparecerá quando o cliente clicar no WhatsApp..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 h-32 resize-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Esta mensagem será enviada quando o cliente clicar no botão WhatsApp
            </p>
          </div>

          {/* Botão de Salvar */}
          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading || !config.phone_number || !config.default_message}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <FaSave />
                  Salvar Configurações
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Informações de Uso */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 fade-in">
        <div className="flex items-start gap-3 mb-3">
          <FaInfoCircle className="text-blue-600 text-xl mt-0.5 flex-shrink-0" />
          <h3 className="text-lg font-semibold text-blue-800">
            Como funciona?
          </h3>
        </div>
        <ul className="space-y-2 text-blue-700">
          <li className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
            <span>Todos os vendedores usarão o mesmo número de WhatsApp</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
            <span>A mensagem padrão será enviada quando o cliente clicar no botão</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
            <span>Não inclui informações do vendedor (apenas a mensagem personalizada)</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
            <span>Você pode ativar/desativar o WhatsApp para todos de uma vez</span>
          </li>
        </ul>
        
        <div className="mt-4 p-3 bg-white rounded-lg border border-blue-300">
          <p className="text-sm text-blue-800 font-medium mb-1">Exemplo de mensagem que será enviada:</p>
          <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
            {config.default_message || "Olá! Gostaria de mais informações sobre seus produtos."}
          </p>
          <p className="text-xs text-blue-500 mt-2">
            <strong>Nota:</strong> A mensagem será exatamente como configurada acima, sem adicionar informações do vendedor.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppConfig;