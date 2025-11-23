import axios from "axios";
import api from "../api/axios.js"
import React, { useEffect, useState } from "react";
import { backend_url } from "../App";
import { toast } from "react-toastify";
import {  
  FaSpinner,
  FaUserTie,
  FaEnvelope,
  FaWhatsapp,
  FaPhone,
} from "react-icons/fa6";
import { FaExclamationTriangle, FaSearch, FaTimes } from "react-icons/fa";
import { TbTrash } from "react-icons/tb";

import "../index.css";

const ListVendor = ({ token }) => {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    vendor: null
  });

  const fetchList = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`${backend_url}/api/vendor/list`);

      if (response.data.success) {
        setList(response.data.vendors);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Erro ao carregar vendedores.");
    } finally {
      setIsLoading(false);
    }
  };

  // Modal de exclusão
  const openDeleteModal = (vendor) => {
    setDeleteModal({
      isOpen: true,
      vendor: vendor
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      vendor: null
    });
  };

  const removeVendor = async () => {
    if (!deleteModal.vendor) return;

    setIsDeleting(deleteModal.vendor.id);
    try {
      const response = await api.post(
        `${backend_url}/api/vendor/remove`,
        { id: deleteModal.vendor.id },
        { headers: { token, "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        toast.success("Vendedor excluído com sucesso!");
        await fetchList();
        closeDeleteModal();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Erro ao excluir vendedor.");
    } finally {
      setIsDeleting(null);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Função para formatar o WhatsApp
  const formatWhatsApp = (whatsapp) => {
    if (!whatsapp) return "N/A";
    
    const numbers = whatsapp.replace(/\D/g, '');
    if (numbers.length === 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 3)}${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
    return whatsapp;
  };

  // Filtro de busca
  const filteredList = list.filter(vendor => {
    return vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (vendor.whatsapp && vendor.whatsapp.includes(searchTerm));
  });

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto fade-in">
        {/* Header */}
        <div className="mb-8 slide-in-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <FaUserTie className="text-secondary" />
            Todos os Vendedores
          </h1>
          <p className="text-gray-600">
            Gerencie e visualize todos os vendedores cadastrados
          </p>
        </div>

        {/* Busca */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6 scale-in">
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaSearch className="inline mr-2 text-gray-400" />
              Buscar Vendedores
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome, email ou WhatsApp..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 fade-in">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 card-hover">
            <div className="text-2xl font-bold text-blue-600">{list.length}</div>
            <div className="text-sm text-blue-800">Total de Vendedores</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 card-hover">
            <div className="text-2xl font-bold text-green-600">
              {list.filter(vendor => vendor.whatsapp).length}
            </div>
            <div className="text-sm text-green-800">Com WhatsApp</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 card-hover">
            <div className="text-2xl font-bold text-purple-600">
              {list.length - list.filter(vendor => vendor.whatsapp).length}
            </div>
            <div className="text-sm text-purple-800">Sem WhatsApp</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 card-hover">
            <div className="text-2xl font-bold text-orange-600">{filteredList.length}</div>
            <div className="text-sm text-orange-800">Filtrados</div>
          </div>
        </div>

        {/* Lista de Vendedores */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden scale-in">
          {/* Cabeçalho da Tabela */}
          <div className="hidden md:grid grid-cols-12 gap-4 items-center py-4 px-6 bg-gray-200 border-b border-gray-200 text-gray-700 font-semibold text-sm">
            <div className="col-span-2">FOTO</div>
            <div className="col-span-3">NOME</div>
            <div className="col-span-3">EMAIL</div>
            <div className="col-span-2">WHATSAPP</div>
            <div className="col-span-2 text-center">AÇÕES</div>
          </div>

          {/* Conteúdo da Lista */}
          {isLoading ? (
            <div className="text-center py-12">
              <FaSpinner className="animate-spin text-4xl text-secondary mx-auto mb-4" />
              <p className="text-gray-600">Carregando vendedores...</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="text-center py-12">
              <FaUserTie className="text-gray-400 text-4xl mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm 
                  ? "Nenhum vendedor encontrado com os filtros aplicados." 
                  : "Nenhum vendedor cadastrado."}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {searchTerm 
                  ? "Tente ajustar os termos de busca." 
                  : "Adicione o primeiro vendedor no formulário de cadastro."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredList.map((vendor) => (
                <div
                  key={vendor.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-4 px-6 hover:bg-gray-400 transition-colors duration-200 group card-hover"
                >
                  {/* Foto */}
                  <div className="md:col-span-2 flex justify-center md:justify-start">
                    <img 
                      src={vendor.image} 
                      alt={vendor.name}
                      className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full ring-2 ring-gray-100 group-hover:ring-secondary transition-all duration-200"
                    />
                  </div>

                  {/* Nome */}
                  <div className="md:col-span-3">
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                      {vendor.name}
                    </h3>
                  </div>

                  {/* Email */}
                  <div className="md:col-span-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaEnvelope className="text-gray-400 text-sm flex-shrink-0" />
                      <span className="truncate">{vendor.email}</span>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="md:col-span-2">
                    {vendor.whatsapp ? (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <FaWhatsapp className="text-green-500 text-sm flex-shrink-0" />
                        <span className="font-medium">{formatWhatsApp(vendor.whatsapp)}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <FaPhone className="text-gray-300 text-sm flex-shrink-0" />
                        <span>Não informado</span>
                      </div>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="md:col-span-2 flex justify-center">
                    <button
                      onClick={() => openDeleteModal(vendor)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 group-hover:scale-110 gentle-bounce"
                      title="Excluir vendedor"
                    >
                      <TbTrash className="text-lg" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
                  Excluir Vendedor
                </h3>
              </div>
              <button
                onClick={closeDeleteModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isDeleting}
              >
                <FaTimes className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Tem certeza que deseja excluir este vendedor?
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Esta ação não pode ser desfeita. O vendedor será removido permanentemente do sistema.
              </p>
              
              {/* Preview do vendedor que será excluído */}
              {deleteModal.vendor && (
                <div className="mt-4 p-3 bg-gray-400 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <img
                      src={deleteModal.vendor.image}
                      alt="Vendedor a ser excluído"
                      className="w-16 h-16 object-cover rounded-full"
                    />
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">{deleteModal.vendor.name}</p>
                      <p className="text-xs text-gray-500 truncate">{deleteModal.vendor.email}</p>
                      {deleteModal.vendor.whatsapp && (
                        <p className="text-xs text-gray-500">
                          {formatWhatsApp(deleteModal.vendor.whatsapp)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Ações do Modal */}
            <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 text-white bg-green-700 border border-green-700 rounded-lg hover:bg-green-600 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                onClick={removeVendor}
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
                    <TbTrash />
                    Excluir Vendedor
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

export default ListVendor;