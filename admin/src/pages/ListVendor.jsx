// ListVendor.jsx - Design modernizado
import axios from "axios";
import api from "../api/axios.js";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { 
  FaSpinner, 
  FaUserTie, 
  FaEnvelope, 
  FaUpload,

  FaIdCard,
 
} from "react-icons/fa6";
import {
   FaUserCircle,
  FaEdit,
  FaTimesCircle,
  FaSave,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSearch,
  FaTimes as FaTimesIcon,
  FaFilter,
  FaSortAmountDown,
  FaEye,
    FaCalendarAlt,
  FaRegCalendarAlt
} from "react-icons/fa";
import { TbTrash } from "react-icons/tb";
import "../index.css";

const ListVendor = ({ token }) => {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    vendor: null,
  });
  const [editModal, setEditModal] = useState({
    isOpen: false,
    vendor: null,
    formData: {},
    isLoading: false,
    imageError: "",
  });
  const [sortOrder, setSortOrder] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // "grid" ou "list"

  const fetchList = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/vendor/list`);

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
      vendor: vendor,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      vendor: null,
    });
  };

  // Modal de edição
  const openEditModal = (vendor) => {
    setEditModal({
      isOpen: true,
      vendor: vendor,
      formData: {
        name: vendor.name,
        email: vendor.email,
        newImage: null,
      },
      isLoading: false,
      imageError: "",
    });
  };

  const closeEditModal = () => {
    setEditModal({
      isOpen: false,
      vendor: null,
      formData: {},
      isLoading: false,
      imageError: "",
    });
    if (document.getElementById("edit-image")) {
      document.getElementById("edit-image").value = "";
    }
  };

  const removeVendor = async () => {
    if (!deleteModal.vendor) return;

    setIsDeleting(deleteModal.vendor.id);
    try {
      const response = await api.post(
        `/api/vendor/remove`,
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

  // Função para atualizar o vendedor
  const updateVendor = async () => {
    if (!editModal.vendor) return;

    setEditModal((prev) => ({ ...prev, isLoading: true }));

    try {
      const formData = new FormData();
      formData.append("id", editModal.vendor.id);
      formData.append("name", editModal.formData.name);
      formData.append("email", editModal.formData.email);

      if (editModal.formData.newImage) {
        formData.append("image", editModal.formData.newImage);
      }

      const response = await api.post(`/api/vendor/update`, formData, {
        headers: { token },
      });

      if (response.data.success) {
        toast.success("Vendedor atualizado com sucesso! 🎉");
        await fetchList();
        closeEditModal();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Erro ao atualizar vendedor.");
      }
    } finally {
      setEditModal((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleEditFormChange = (field, value) => {
    setEditModal((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        [field]: value,
      },
    }));
  };

  const handleEditImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setEditModal((prev) => ({
      ...prev,
      imageError: "",
    }));

    if (selectedImage) {
      if (selectedImage.size > 1 * 1024 * 1024) {
        setEditModal((prev) => ({
          ...prev,
          imageError: "A imagem deve ter no máximo 1MB",
        }));
        return;
      }

      if (!selectedImage.type.startsWith("image/")) {
        setEditModal((prev) => ({
          ...prev,
          imageError: "Por favor, selecione um arquivo de imagem válido",
        }));
        return;
      }

      setEditModal((prev) => ({
        ...prev,
        formData: {
          ...prev.formData,
          newImage: selectedImage,
        },
        imageError: "",
      }));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Filtro de busca
  const filteredList = list.filter((vendor) => {
    return (
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Ordenação
  const sortedList = [...filteredList].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    } else if (sortOrder === "oldest") {
      return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    } else if (sortOrder === "name-asc") {
      return a.name.localeCompare(b.name);
    } else if (sortOrder === "name-desc") {
      return b.name.localeCompare(a.name);
    }
    return 0;
  });

  // Formatar data
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto fade-in">
        {/* Header */}
        <div className="mb-8 slide-in-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <FaUserTie className="text-white text-2xl" />
                </div>
                <span>Gerenciar Vendedores</span>
              </h1>
              <p className="text-gray-600 text-lg">
                Visualize e gerencie todos os vendedores cadastrados
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Visualização:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === "grid"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === "list"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Lista
                </button>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg transform transition-transform hover:-translate-y-1 duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{list.length}</div>
                  <div className="text-sm opacity-90">Total de Vendedores</div>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <FaUserTie className="text-2xl" />
                </div>
              </div>
              <div className="mt-3 text-xs opacity-80">
                {list.length === 0 ? "Nenhum vendedor cadastrado" : 
                 list.length === 1 ? "1 vendedor cadastrado" : 
                 `${list.length} vendedores cadastrados`}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg transform transition-transform hover:-translate-y-1 duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{filteredList.length}</div>
                  <div className="text-sm opacity-90">Filtrados</div>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <FaFilter className="text-2xl" />
                </div>
              </div>
              <div className="mt-3 text-xs opacity-80">
                {filteredList.length === list.length ? "Mostrando todos" : "Com filtro aplicado"}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg transform transition-transform hover:-translate-y-1 duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">
                    {list.filter(v => v.email).length}
                  </div>
                  <div className="text-sm opacity-90">Com Email</div>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <FaEnvelope className="text-2xl" />
                </div>
              </div>
              <div className="mt-3 text-xs opacity-80">
                {list.length > 0 && `${Math.round((list.filter(v => v.email).length / list.length) * 100)}% com email`}
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 shadow-lg transform transition-transform hover:-translate-y-1 duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">
                    {new Date().getDate()}
                  </div>
                  <div className="text-sm opacity-90">Hoje</div>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <FaCalendarAlt className="text-2xl" />
                </div>
              </div>
              <div className="mt-3 text-xs opacity-80">
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long' })}
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Controles */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 scale-in">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar vendedor por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-200 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-400"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    <FaTimesIcon className="text-gray-400 hover:text-gray-600 transition-colors" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="appearance-none bg-gray-200 border border-gray-200 rounded-xl pl-4 pr-10 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-700 cursor-pointer"
                >
                  <option value="newest">Mais recentes</option>
                  <option value="oldest">Mais antigos</option>
                  <option value="name-asc">A → Z</option>
                  <option value="name-desc">Z → A</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <FaSortAmountDown className="text-gray-400" />
                </div>
              </div>

              <button
                onClick={fetchList}
                disabled={isLoading}
                className="px-5 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaEye />
                )}
                Atualizar
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        {isLoading ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="inline-block p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6">
              <FaSpinner className="animate-spin text-4xl text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Carregando vendedores...</h3>
            <p className="text-gray-500">Aguarde enquanto buscamos os dados</p>
          </div>
        ) : sortedList.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="inline-block p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-6">
              <FaUserTie className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {searchTerm ? "Nenhum vendedor encontrado" : "Nenhum vendedor cadastrado"}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm
                ? "Tente ajustar os termos de busca ou limpar os filtros."
                : "Comece adicionando o primeiro vendedor no sistema."}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-300"
              >
                Limpar busca
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          /* Layout em Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedList.map((vendor) => (
              <div
                key={vendor.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* Banner superior */}
                <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                
                <div className="p-6">
                  {/* Header do card */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={vendor.image}
                          alt={vendor.name}
                          className="w-20 h-20 object-cover rounded-xl ring-4 ring-white shadow-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium mb-2">
                          <FaIdCard className="text-xs" />
                          ID: {vendor.id}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                          {vendor.name}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEditModal(vendor)}
                        className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 hover:scale-110"
                        title="Editar vendedor"
                      >
                        <FaEdit className="text-lg" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(vendor)}
                        className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 hover:scale-110"
                        title="Excluir vendedor"
                      >
                        <TbTrash className="text-lg" />
                      </button>
                    </div>
                  </div>

                  {/* Informações */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-200 rounded-xl">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FaEnvelope className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 mb-1">Email</p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {vendor.email}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 p-3 bg-blue-200 rounded-xl">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <FaRegCalendarAlt className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Cadastrado em</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatDate(vendor.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-blue-200 rounded-xl">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <FaUserCircle className="text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Status</p>
                          <p className="text-sm font-medium text-green-600">
                            Ativo
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer do card */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Última atualização: {formatDate(vendor.updatedAt)}
                      </span>
                      <button
                        onClick={() => openEditModal(vendor)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-0.5"
                      >
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Layout em Lista */
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Cabeçalho da lista */}
            <div className="grid grid-cols-12 gap-4 items-center py-5 px-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 text-gray-700 font-semibold text-sm">
              <div className="col-span-2">FOTO</div>
              <div className="col-span-3">NOME</div>
              <div className="col-span-3">EMAIL</div>
              <div className="col-span-2">CADASTRO</div>
              <div className="col-span-2 text-center">AÇÕES</div>
            </div>

            {/* Itens da lista */}
            <div className="divide-y divide-gray-100">
              {sortedList.map((vendor) => (
                <div
                  key={vendor.id}
                  className="grid grid-cols-12 gap-4 items-center py-5 px-6 hover:bg-blue-50/50 transition-all duration-300 group"
                >
                  {/* Foto */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-4">
                      <img
                        src={vendor.image}
                        alt={vendor.name}
                        className="w-14 h-14 object-cover rounded-xl ring-2 ring-gray-100 group-hover:ring-blue-200 transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Nome */}
                  <div className="col-span-3">
                    <h3 className="font-bold text-gray-900 text-base mb-1">
                      {vendor.name}
                    </h3>
                    <div className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                      <FaIdCard className="text-xs" />
                      ID: {vendor.id}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaEnvelope className="text-gray-400" />
                      <span className="truncate font-medium">{vendor.email}</span>
                    </div>
                  </div>

                  {/* Data de Cadastro */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FaRegCalendarAlt className="text-gray-400" />
                      <span>{formatDate(vendor.createdAt)}</span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="col-span-2">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(vendor)}
                        className="p-2.5 text-blue-600 hover:bg-blue-100 rounded-xl transition-all duration-300 group-hover:scale-110"
                        title="Editar vendedor"
                      >
                        <FaEdit className="text-lg" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(vendor)}
                        className="p-2.5 text-red-600 hover:bg-red-100 rounded-xl transition-all duration-300 group-hover:scale-110"
                        title="Excluir vendedor"
                      >
                        <TbTrash className="text-lg" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer da lista */}
            <div className="py-4 px-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Mostrando <span className="font-semibold">{sortedList.length}</span> de{" "}
                  <span className="font-semibold">{list.length}</span> vendedores
                </div>
                <div className="text-sm text-gray-600">
                  Ordenado por:{" "}
                  <span className="font-semibold">
                    {sortOrder === "newest" && "Mais recentes"}
                    {sortOrder === "oldest" && "Mais antigos"}
                    {sortOrder === "name-asc" && "A → Z"}
                    {sortOrder === "name-desc" && "Z → A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ajuda e Dicas */}
        {sortedList.length > 0 && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <FaEdit className="text-blue-600" />
                Dicas de Gerenciamento
              </h4>
              <ul className="space-y-2 text-blue-700">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Clique na foto para ver em tamanho maior
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Use os filtros para encontrar vendedores específicos
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Alterne entre visualização em grid e lista
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
                <FaEye className="text-green-600" />
                Informações Rápidas
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{sortedList.length}</div>
                  <div className="text-sm text-green-700">Visíveis</div>
                </div>
                <div className="text-center p-3 bg-white/50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">
                    {list.length - sortedList.length}
                  </div>
                  <div className="text-sm text-green-700">Filtrados</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 modal-enter-active">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-red-100 to-red-200 rounded-xl">
                  <FaExclamationTriangle className="text-red-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Excluir Vendedor</h3>
                  <p className="text-sm text-gray-500">Ação irreversível</p>
                </div>
              </div>
              <button
                onClick={closeDeleteModal}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                disabled={isDeleting}
              >
                <FaTimesIcon className="text-gray-400 hover:text-gray-600 text-lg" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Tem certeza que deseja excluir este vendedor permanentemente?
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Esta ação não pode ser desfeita. Todos os dados do vendedor serão removidos do sistema.
              </p>

              {/* Preview do vendedor */}
              {deleteModal.vendor && (
                <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-4">
                    <img
                      src={deleteModal.vendor.image}
                      alt="Vendedor a ser excluído"
                      className="w-16 h-16 object-cover rounded-xl ring-2 ring-white shadow"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{deleteModal.vendor.name}</p>
                      <p className="text-sm text-gray-600 truncate">{deleteModal.vendor.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                          Será excluído
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Ações do Modal */}
            <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-200 rounded-b-2xl">
              <button
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="flex-1 px-5 py-3.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                onClick={removeVendor}
                disabled={isDeleting}
                className="flex-1 px-5 py-3.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

      {/* Modal de Edição */}
      {editModal.isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 modal-enter-active">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
            {/* Header do Modal */}
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                  <FaEdit className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Editar Vendedor</h3>
                  <p className="text-sm text-gray-500">Atualize as informações do vendedor</p>
                </div>
              </div>
              <button
                onClick={closeEditModal}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                disabled={editModal.isLoading}
              >
                <FaTimesIcon className="text-gray-400 hover:text-gray-600 text-lg" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Coluna da Esquerda - Foto */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Foto do Vendedor
                    </h4>
                    <span className="text-xs text-gray-500">Opcional</span>
                  </div>
                  
                  {/* Área de Upload/Preview */}
                  <div className="mb-6">
                    <label
                      htmlFor="edit-image"
                      className="cursor-pointer block"
                    >
                      <div
                        className={`w-full h-80 border-3 border-dashed rounded-2xl overflow-hidden transition-all duration-300 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center group ${
                          editModal.imageError
                            ? "border-red-300 bg-red-50/50"
                            : editModal.formData.newImage
                            ? "border-green-300 bg-green-50/50"
                            : "border-gray-300 hover:border-blue-300 hover:from-blue-50 hover:to-blue-100"
                        }`}
                      >
                        {editModal.formData.newImage ? (
                          <div className="relative w-full h-full">
                            <img
                              src={URL.createObjectURL(
                                editModal.formData.newImage
                              )}
                              alt="Nova foto do vendedor"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 right-3 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full p-2 shadow-lg">
                              <FaCheckCircle size={20} />
                            </div>
                            <div className="absolute bottom-3 left-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs px-3 py-1.5 rounded-full shadow">
                              Nova foto
                            </div>
                          </div>
                        ) : editModal.vendor?.image ? (
                          <div className="relative w-full h-full">
                            <img
                              src={editModal.vendor.image}
                              alt="Foto atual do vendedor"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-3 right-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs px-3 py-1.5 rounded-full shadow">
                              Foto atual
                            </div>
                          </div>
                        ) : (
                          <div className="text-center p-6">
                            <div className="inline-block p-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl mb-4">
                              <FaUpload className="text-gray-400 text-3xl" />
                            </div>
                            <p className="text-gray-700 font-medium">Foto do Vendedor</p>
                            <p className="text-gray-500 text-sm mt-1">
                              Clique para selecionar uma nova foto
                            </p>
                            <p className="text-gray-400 text-xs mt-2">
                              Deixe em branco para manter a atual
                            </p>
                          </div>
                        )}
                      </div>
                    </label>
                    <input
                      type="file"
                      id="edit-image"
                      accept="image/*"
                      onChange={handleEditImageChange}
                      className="hidden"
                    />
                  </div>

                  {/* Informações da Nova Imagem */}
                  {editModal.formData.newImage && (
                    <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <FaCheckCircle className="text-green-600 text-lg" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-green-800 mb-2">
                            Nova Foto Selecionada ✓
                          </h4>
                          <div className="text-green-700 text-sm space-y-1">
                            <p><strong>Arquivo:</strong> {editModal.formData.newImage.name}</p>
                            <p><strong>Tamanho:</strong> {formatFileSize(editModal.formData.newImage.size)}</p>
                            <p><strong>Tipo:</strong> {editModal.formData.newImage.type}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mensagem de Erro */}
                  {editModal.imageError && (
                    <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <FaTimesCircle className="text-red-600 text-lg" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-red-800 mb-2">
                            Problema na Imagem
                          </h4>
                          <div className="text-red-700 text-sm">
                            <p>{editModal.imageError}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Botão para remover nova imagem */}
                  {editModal.formData.newImage && (
                    <button
                      type="button"
                      onClick={() => {
                        handleEditFormChange("newImage", null);
                        if (document.getElementById("edit-image")) {
                          document.getElementById("edit-image").value = "";
                        }
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium hover:border-gray-400"
                    >
                      Remover nova foto
                    </button>
                  )}
                </div>

                {/* Coluna da Direita - Formulário */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Informações do Vendedor
                    </h4>
                    <span className="text-xs text-gray-500">* Campos obrigatórios</span>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Nome */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={editModal.formData.name || ""}
                          onChange={(e) =>
                            handleEditFormChange("name", e.target.value)
                          }
                          className="w-full pl-4 pr-4 py-3.5 bg-gray-200 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-700"
                          required
                          placeholder="Digite o nome completo do vendedor"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaEnvelope className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          value={editModal.formData.email || ""}
                          onChange={(e) =>
                            handleEditFormChange("email", e.target.value)
                          }
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-200 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-700"
                          required
                          placeholder="exemplo@empresa.com"
                        />
                      </div>
                    </div>

                    {/* Informações do Vendedor */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-5 mt-4">
                      <h5 className="font-semibold text-gray-800 mb-3 text-sm flex items-center gap-2">
                        <FaIdCard className="text-gray-600" />
                        Informações do Vendedor
                      </h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">ID</p>
                          <p className="text-sm font-medium text-gray-900 bg-white px-3 py-1.5 rounded-lg">
                            {editModal.vendor?.id}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Status</p>
                          <p className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
                            Ativo
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Cadastrado em</p>
                          <p className="text-sm font-medium text-gray-900 bg-white px-3 py-1.5 rounded-lg">
                            {formatDate(editModal.vendor?.createdAt)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Última atualização</p>
                          <p className="text-sm font-medium text-gray-900 bg-white px-3 py-1.5 rounded-lg">
                            {formatDate(editModal.vendor?.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ações do Modal */}
            <div className="sticky bottom-0 bg-white flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={closeEditModal}
                disabled={editModal.isLoading}
                className="flex-1 px-5 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={updateVendor}
                disabled={
                  editModal.isLoading ||
                  !editModal.formData.name ||
                  !editModal.formData.email ||
                  editModal.imageError
                }
                className="flex-1 px-5 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
              >
                {editModal.isLoading ? (
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
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListVendor;