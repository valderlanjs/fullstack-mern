import axios from "axios";
import api from "../api/axios.js"
import React, { useEffect, useState } from "react";
import { backend_url } from "../App";
import { toast } from "react-toastify";
import { 
  FaSpinner,
  FaBox,
  FaFilter,
  FaStar,
  FaImage,
  FaTags,
  FaLayerGroup
  
} from "react-icons/fa6";

import { 
  FaExclamationTriangle,
  FaCalendarAlt,
  FaExclamationTriangle as FaExclamationTriangleSolid,
  FaSearch, 
  FaTimes,
  FaEdit,
  FaSave,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaSortAmountDown,
  FaRegStar,
  FaFire,
  FaUpload,
  FaPlus,
  FaMinus,
  FaInfoCircle
} from "react-icons/fa";
import { TbTrash } from "react-icons/tb";

import "../index.css";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPopular, setFilterPopular] = useState("all");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    product: null
  });
  const [editModal, setEditModal] = useState({
    isOpen: false,
    product: null,
    formData: {},
    images: [],
    isLoading: false,
    imageErrors: [],
    maxPopularReached: false
  });
  const [viewMode, setViewMode] = useState("grid");
  const [sortOrder, setSortOrder] = useState("newest");

  const fetchList = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`${backend_url}/api/product/list`);

      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Erro ao carregar produtos.");
    } finally {
      setIsLoading(false);
    }
  };

  // Modal de exclusão
  const openDeleteModal = (product) => {
    setDeleteModal({
      isOpen: true,
      product: product
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      product: null
    });
  };

  // Modal de edição
  const openEditModal = (product) => {
    const popularCount = list.filter(p => p.popular && p.id !== product.id).length;
    const maxPopularReached = popularCount >= 4 && !product.popular;
    
    setEditModal({
      isOpen: true,
      product: product,
      formData: {
        name: product.name,
        category: product.category,
        subCategory: product.subCategory,
        popular: product.popular
      },
      images: product.image || [],
      newImages: [],
      isLoading: false,
      imageErrors: [],
      maxPopularReached: maxPopularReached
    });
  };

  const closeEditModal = () => {
    setEditModal({
      isOpen: false,
      product: null,
      formData: {},
      images: [],
      newImages: [],
      isLoading: false,
      imageErrors: [],
      maxPopularReached: false
    });
    // Limpar inputs de imagem
    for (let i = 1; i <= 4; i++) {
      const input = document.getElementById(`edit-image-${i}`);
      if (input) input.value = "";
    }
  };

  const removeProduct = async () => {
    if (!deleteModal.product) return;

    setIsDeleting(deleteModal.product.id);
    try {
      const response = await api.post(
        `${backend_url}/api/product/remove`,
        { id: deleteModal.product.id },
        { headers: { token, "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        toast.success("Produto excluído com sucesso!");
        await fetchList();
        closeDeleteModal();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Erro ao excluir produto.");
    } finally {
      setIsDeleting(null);
    }
  };

  // Função para atualizar o produto
  const updateProduct = async () => {
    if (!editModal.product) return;

    setEditModal(prev => ({ ...prev, isLoading: true }));

    try {
      const formData = new FormData();
      formData.append("id", editModal.product.id);
      formData.append("name", editModal.formData.name);
      formData.append("category", editModal.formData.category);
      formData.append("subCategory", editModal.formData.subCategory);
      formData.append("popular", editModal.formData.popular);

      // Adicionar novas imagens
      editModal.newImages.forEach((image, index) => {
        if (image) {
          formData.append(`image${index + 1}`, image);
        }
      });

      // Indicar quais imagens antigas manter
      editModal.images.forEach((image, index) => {
        formData.append(`keepImage${index + 1}`, image);
      });

      const response = await api.post(
        `${backend_url}/api/product/update`,
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Produto atualizado com sucesso! 🎉");
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
        toast.error("Erro ao atualizar produto.");
      }
    } finally {
      setEditModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Função para lidar com mudanças no formulário
  const handleEditFormChange = (field, value) => {
    setEditModal(prev => {
      const newPopular = field === 'popular' ? value : prev.formData.popular;
      const popularCount = list.filter(p => p.popular && p.id !== prev.product?.id).length;
      const maxPopularReached = popularCount >= 4 && newPopular && !prev.product?.popular;
      
      return {
        ...prev,
        formData: {
          ...prev.formData,
          [field]: value
        },
        maxPopularReached: field === 'popular' ? maxPopularReached : prev.maxPopularReached
      };
    });
  };

  // Função para lidar com upload de imagens
  const handleEditImageChange = (index, e) => {
    const selectedImage = e.target.files[0];
    setEditModal(prev => ({
      ...prev,
      imageErrors: prev.imageErrors.filter((_, i) => i !== index)
    }));

    if (selectedImage) {
      // Validação de tamanho (1MB)
      if (selectedImage.size > 1 * 1024 * 1024) {
        setEditModal(prev => ({
          ...prev,
          imageErrors: [...prev.imageErrors, { index, message: "A imagem deve ter no máximo 1MB" }]
        }));
        return;
      }

      // Validação do tipo de arquivo
      if (!selectedImage.type.startsWith('image/')) {
        setEditModal(prev => ({
          ...prev,
          imageErrors: [...prev.imageErrors, { index, message: "Por favor, selecione um arquivo de imagem válido" }]
        }));
        return;
      }

      const newImages = [...prev.newImages];
      newImages[index] = selectedImage;
      
      setEditModal(prev => ({
        ...prev,
        newImages: newImages,
        imageErrors: prev.imageErrors.filter(error => error.index !== index)
      }));
    }
  };

  // Função para remover imagem
  const handleRemoveImage = (index) => {
    setEditModal(prev => {
      const newImages = [...prev.images];
      const newNewImages = [...prev.newImages];
      
      if (index < newImages.length) {
        newImages.splice(index, 1);
      } else {
        newNewImages[index - newImages.length] = null;
        const input = document.getElementById(`edit-image-${index + 1}`);
        if (input) input.value = "";
      }
      
      return {
        ...prev,
        images: newImages,
        newImages: newNewImages
      };
    });
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Filtros e busca
  const filteredList = list.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.subCategory.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    const matchesPopular = filterPopular === "all" || 
                          (filterPopular === "popular" && product.popular) ||
                          (filterPopular === "not-popular" && !product.popular);
    
    return matchesSearch && matchesCategory && matchesPopular;
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
    } else if (sortOrder === "popular") {
      return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
    }
    return 0;
  });

  // Categorias únicas para o filtro
  const categories = [...new Set(list.map(item => item.category))];

  // Contador de produtos populares
  const popularCount = list.filter(item => item.popular).length;

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

  // Função para formatar o tamanho do arquivo
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto fade-in">
        {/* Header */}
        <div className="mb-8 slide-in-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
                  <FaBox className="text-white text-2xl" />
                </div>
                <span>Gerenciar Produtos</span>
              </h1>
              <p className="text-gray-600 text-lg">
                Visualize e gerencie todos os produtos do catálogo
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Visualização:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === "grid"
                      ? "bg-white text-amber-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === "list"
                      ? "bg-white text-amber-600 shadow-sm"
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
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl p-6 shadow-lg transform transition-transform hover:-translate-y-1 duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{list.length}</div>
                  <div className="text-sm opacity-90">Total de Produtos</div>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <FaBox className="text-2xl" />
                </div>
              </div>
              <div className="mt-3 text-xs opacity-80">
                {list.length === 0 ? "Nenhum produto cadastrado" : 
                 list.length === 1 ? "1 produto cadastrado" : 
                 `${list.length} produtos cadastrados`}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg transform transition-transform hover:-translate-y-1 duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{popularCount}</div>
                  <div className="text-sm opacity-90">Em Destaque</div>
                  <div className="text-xs opacity-80 mt-1">
                    {popularCount}/4 permitidos
                  </div>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <FaFire className="text-2xl" />
                </div>
              </div>
              {popularCount >= 4 && (
                <div className="mt-3 text-xs bg-white/20 px-2 py-1 rounded">
                  Limite atingido
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg transform transition-transform hover:-translate-y-1 duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{categories.length}</div>
                  <div className="text-sm opacity-90">Categorias</div>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <FaLayerGroup className="text-2xl" />
                </div>
              </div>
              <div className="mt-3 text-xs opacity-80">
                {categories.length === 0 ? "Nenhuma categoria" : 
                 categories.length === 1 ? "1 categoria" : 
                 `${categories.length} categorias diferentes`}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg transform transition-transform hover:-translate-y-1 duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{sortedList.length}</div>
                  <div className="text-sm opacity-90">Visíveis</div>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <FaEye className="text-2xl" />
                </div>
              </div>
              <div className="mt-3 text-xs opacity-80">
                {sortedList.length === list.length ? "Mostrando todos" : "Com filtros aplicados"}
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
                  placeholder="Buscar produto por nome, categoria ou tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-200 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-400"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    <FaTimes className="text-gray-400 hover:text-gray-600 transition-colors" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex gap-3">
                <div className="relative">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="appearance-none bg-gray-200 border border-gray-200 rounded-xl pl-4 pr-10 py-3.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 text-gray-700 cursor-pointer min-w-[180px]"
                  >
                    <option value="all">Todas as Categorias</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <FaFilter className="text-gray-400" />
                  </div>
                </div>

                <div className="relative">
                  <select
                    value={filterPopular}
                    onChange={(e) => setFilterPopular(e.target.value)}
                    className="appearance-none bg-gray-200 border border-gray-200 rounded-xl pl-4 pr-10 py-3.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 text-gray-700 cursor-pointer min-w-[180px]"
                  >
                    <option value="all">Todos os Produtos</option>
                    <option value="popular">Apenas Destaques</option>
                    <option value="not-popular">Sem Destaque</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <FaStar className="text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="appearance-none bg-gray-200 border border-gray-200 rounded-xl pl-4 pr-10 py-3.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 text-gray-700 cursor-pointer"
                >
                  <option value="newest">Mais recentes</option>
                  <option value="oldest">Mais antigos</option>
                  <option value="name-asc">A → Z</option>
                  <option value="name-desc">Z → A</option>
                  <option value="popular">Destaque primeiro</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <FaSortAmountDown className="text-gray-400" />
                </div>
              </div>

              <button
                onClick={fetchList}
                disabled={isLoading}
                className="px-5 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium hover:from-amber-600 hover:to-amber-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
            <div className="inline-block p-6 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl mb-6">
              <FaSpinner className="animate-spin text-4xl text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Carregando produtos...</h3>
            <p className="text-gray-500">Aguarde enquanto buscamos os dados</p>
          </div>
        ) : sortedList.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="inline-block p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-6">
              <FaBox className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {searchTerm || filterCategory !== "all" || filterPopular !== "all" 
                ? "Nenhum produto encontrado" 
                : "Nenhum produto cadastrado"}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm || filterCategory !== "all" || filterPopular !== "all" 
                ? "Tente ajustar os filtros de busca ou limpar os filtros."
                : "Comece adicionando o primeiro produto no sistema."}
            </p>
            {(searchTerm || filterCategory !== "all" || filterPopular !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterCategory("all");
                  setFilterPopular("all");
                }}
                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-300"
              >
                Limpar todos os filtros
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          /* Layout em Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedList.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* Banner superior com cor baseada no destaque */}
                <div className={`h-2 ${item.popular ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'}`}></div>
                
                <div className="p-6">
                  {/* Header do card */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={item.image?.[0] || "https://via.placeholder.com/150"}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-xl ring-4 ring-white shadow-lg"
                        />
                        {item.popular && (
                          <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full border-2 border-white flex items-center justify-center">
                            <FaStar className="text-white text-xs" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                            <FaTags className="text-xs" />
                            {item.category}
                          </div>
                          {item.popular && (
                            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-medium">
                              <FaFire className="text-xs" />
                              Destaque
                            </div>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                          {item.name}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 hover:scale-110"
                        title="Editar produto"
                      >
                        <FaEdit className="text-lg" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(item)}
                        className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 hover:scale-110"
                        title="Excluir produto"
                      >
                        <TbTrash className="text-lg" />
                      </button>
                    </div>
                  </div>

                  {/* Informações */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 p-3 bg-blue-100 rounded-xl">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <FaLayerGroup className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Tipo</p>
                          <p className="text-sm font-medium text-gray-900">
                            {item.subCategory}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-blue-100 rounded-xl">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <FaRegStar className="text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Status</p>
                          <p className={`text-sm font-medium ${item.popular ? 'text-amber-600' : 'text-gray-600'}`}>
                            {item.popular ? 'Em Destaque' : 'Normal'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-blue-100 rounded-xl">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FaCalendarAlt className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1">Cadastrado em</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(item.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Galeria de imagens */}
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Imagens:</p>
                      <div className="flex gap-2">
                        {item.image?.slice(0, 3).map((img, idx) => (
                          <div key={idx} className="relative">
                            <img
                              src={img}
                              alt={`${item.name} ${idx + 1}`}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            {idx === 2 && item.image?.length > 3 && (
                              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                  +{item.image.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer do card */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-400">
                        ID: {item.id}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => openDeleteModal(item)}
                          className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                          Excluir
                        </button>
                      </div>
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
              <div className="col-span-1">IMAGEM</div>
              <div className="col-span-2">PRODUTO</div>
              <div className="col-span-2">CATEGORIA</div>
              <div className="col-span-2">TIPO</div>
              <div className="col-span-2">STATUS</div>
              <div className="col-span-3 text-center">AÇÕES</div>
            </div>

            {/* Itens da lista */}
            <div className="divide-y divide-gray-100">
              {sortedList.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-4 items-center py-5 px-6 hover:bg-amber-50/50 transition-all duration-300 group"
                >
                  {/* Imagem */}
                  <div className="col-span-1">
                    <div className="relative">
                      <img
                        src={item.image?.[0] || "https://via.placeholder.com/150"}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-xl ring-2 ring-gray-100 group-hover:ring-amber-200 transition-all duration-300"
                      />
                      {item.popular && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full border-2 border-white flex items-center justify-center">
                          <FaStar className="text-white text-[8px]" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Produto */}
                  <div className="col-span-2">
                    <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-2">
                      {item.name}
                    </h3>
                    <div className="text-xs text-gray-500">
                      ID: {item.id}
                    </div>
                  </div>

                  {/* Categoria */}
                  <div className="col-span-2">
                    <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                      <FaTags className="text-xs" />
                      {item.category}
                    </div>
                  </div>

                  {/* Tipo */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaLayerGroup className="text-gray-400" />
                      <span className="font-medium">{item.subCategory}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                      item.popular 
                        ? 'bg-amber-50 text-amber-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.popular ? (
                        <>
                          <FaFire className="text-xs" />
                          <span>Destaque</span>
                        </>
                      ) : (
                        <>
                          <FaRegStar className="text-xs" />
                          <span>Normal</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="col-span-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2.5 text-blue-600 hover:bg-blue-100 rounded-xl transition-all duration-300 group-hover:scale-110"
                        title="Editar produto"
                      >
                        <FaEdit className="text-lg" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(item)}
                        className="p-2.5 text-red-600 hover:bg-red-100 rounded-xl transition-all duration-300 group-hover:scale-110"
                        title="Excluir produto"
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
                  <span className="font-semibold">{list.length}</span> produtos
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">{popularCount}/4</span> produtos em destaque
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ajuda e Dicas */}
        {sortedList.length > 0 && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <FaFilter className="text-amber-600" />
                Dicas de Gerenciamento
              </h4>
              <ul className="space-y-2 text-amber-700">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  Clique no ícone de edição para modificar qualquer produto
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  Máximo de 4 produtos podem ser marcados como "Destaque"
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  É possível alterar todas as imagens ao editar um produto
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <FaEye className="text-blue-600" />
                Informações Rápidas
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">
                    {popularCount}
                  </div>
                  <div className="text-sm text-blue-700">Em Destaque</div>
                  <div className="text-xs text-blue-600">
                    {popularCount >= 4 ? 'Limite atingido' : `${4 - popularCount} vagas`}
                  </div>
                </div>
                <div className="text-center p-3 bg-white/50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">
                    {categories.length}
                  </div>
                  <div className="text-sm text-blue-700">Categorias</div>
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
                  <FaExclamationTriangleSolid className="text-red-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Excluir Produto</h3>
                  <p className="text-sm text-gray-500">Ação irreversível</p>
                </div>
              </div>
              <button
                onClick={closeDeleteModal}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                disabled={isDeleting}
              >
                <FaTimes className="text-gray-400 hover:text-gray-600 text-lg" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Tem certeza que deseja excluir este produto permanentemente?
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Esta ação não pode ser desfeita. Todos os dados do produto serão removidos do catálogo.
              </p>

              {/* Preview do produto */}
              {deleteModal.product && (
                <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-4">
                    <img
                      src={deleteModal.product.image?.[0] || "https://via.placeholder.com/150"}
                      alt="Produto a ser excluído"
                      className="w-16 h-16 object-cover rounded-xl ring-2 ring-white shadow"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{deleteModal.product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                          {deleteModal.product.category}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                          {deleteModal.product.subCategory}
                        </span>
                        {deleteModal.product.popular && (
                          <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                            Destaque
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
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
                onClick={removeProduct}
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
                    Excluir Produto
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
            {/* Header do Modal */}
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                  <FaEdit className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Editar Produto</h3>
                  <p className="text-sm text-gray-500">Atualize as informações do produto</p>
                </div>
              </div>
              <button
                onClick={closeEditModal}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                disabled={editModal.isLoading}
              >
                <FaTimes className="text-gray-400 hover:text-gray-600 text-lg" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Coluna da Esquerda - Imagens */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Imagens do Produto
                    </h4>
                    <span className="text-xs text-gray-500">Máximo 4 imagens</span>
                  </div>
                  
                  {/* Área de Upload/Preview */}
                  <div className="mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Imagens existentes */}
                      {editModal.images.map((image, index) => (
                        <div key={index} className="relative">
                          <div className="border-2 border-dashed rounded-xl overflow-hidden bg-gray-100 h-40">
                            <img
                              src={image}
                              alt={`Imagem ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            title="Remover imagem"
                          >
                            <FaTimes className="text-xs" />
                          </button>
                          <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Existente
                          </div>
                        </div>
                      ))}

                      {/* Campos para novas imagens */}
                      {[...Array(4 - editModal.images.length)].map((_, index) => {
                        const imageIndex = editModal.images.length + index;
                        const hasImage = editModal.newImages[imageIndex - editModal.images.length];
                        const error = editModal.imageErrors.find(e => e.index === imageIndex);
                        
                        return (
                          <div key={`new-${index}`}>
                            <label htmlFor={`edit-image-${imageIndex + 1}`} className="cursor-pointer block">
                              <div className={`border-2 border-dashed rounded-xl h-40 flex items-center justify-center transition-all duration-300 ${
                                error
                                  ? 'border-red-300 bg-red-50'
                                  : hasImage
                                  ? 'border-green-300 bg-green-50'
                                  : 'border-gray-300 hover:border-blue-300 hover:bg-gray-200'
                              }`}>
                                {hasImage ? (
                                  <div className="relative w-full h-full">
                                    <img
                                      src={URL.createObjectURL(hasImage)}
                                      alt="Nova imagem"
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                                      <FaCheckCircle size={14} />
                                    </div>
                                    <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                      Nova
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center p-4">
                                    <FaUpload className="text-gray-400 text-2xl mx-auto mb-2" />
                                    <p className="text-gray-600 text-sm">Adicionar imagem</p>
                                    <p className="text-gray-400 text-xs">Opcional</p>
                                  </div>
                                )}
                              </div>
                            </label>
                            <input
                              type="file"
                              id={`edit-image-${imageIndex + 1}`}
                              accept="image/*"
                              onChange={(e) => handleEditImageChange(imageIndex, e)}
                              className="hidden"
                            />
                            {hasImage && (
                              <div className="mt-2 text-center">
                                <p className="text-xs text-gray-500 truncate">{hasImage.name}</p>
                                <p className="text-xs text-gray-400">{formatFileSize(hasImage.size)}</p>
                              </div>
                            )}
                            {error && (
                              <p className="text-xs text-red-500 mt-1 text-center">{error.message}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Alerta de limite de imagens */}
                  {(editModal.images.length + editModal.newImages.filter(img => img).length) >= 4 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <FaExclamationTriangle className="text-yellow-600 text-lg mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-yellow-800 mb-1">Limite de Imagens</h4>
                          <p className="text-yellow-700 text-sm">
                            Você atingiu o limite máximo de 4 imagens por produto.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Informações sobre imagens */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <FaInfoCircle className="text-blue-600 text-lg mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-1">Instruções de Imagens</h4>
                        <ul className="text-blue-700 text-sm space-y-1">
                          <li>• Clique nas imagens existentes para removê-las</li>
                          <li>• Adicione novas imagens clicando nos campos vazios</li>
                          <li>• Tamanho máximo por imagem: 1MB</li>
                          <li>• Formatos suportados: JPG, PNG, WebP</li>
                          <li>• Pelo menos 1 imagem é necessária</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coluna da Direita - Formulário */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Informações do Produto
                    </h4>
                    <span className="text-xs text-gray-500">* Campos obrigatórios</span>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Nome */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Produto *
                      </label>
                      <input
                        type="text"
                        value={editModal.formData.name || ""}
                        onChange={(e) => handleEditFormChange("name", e.target.value)}
                        className="w-full px-4 py-3.5 bg-gray-200 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-700"
                        required
                        placeholder="Digite o nome do produto"
                      />
                    </div>

                    {/* Categoria */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoria *
                      </label>
                      <input
                        type="text"
                        value={editModal.formData.category || ""}
                        onChange={(e) => handleEditFormChange("category", e.target.value)}
                        className="w-full px-4 py-3.5 bg-gray-200 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-700"
                        required
                        placeholder="Ex: Madeira Bruta, Decks, Telhas..."
                      />
                    </div>

                    {/* Tipo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo do Produto *
                      </label>
                      <input
                        type="text"
                        value={editModal.formData.subCategory || ""}
                        onChange={(e) => handleEditFormChange("subCategory", e.target.value)}
                        className="w-full px-4 py-3.5 bg-gray-200 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-700"
                        required
                        placeholder="Ex: Jatobá, Cumaru, Ipê, PVC..."
                      />
                    </div>

                    {/* Destaque */}
                    <div className={`p-4 rounded-xl border transition-all duration-300 ${
                      editModal.maxPopularReached && !editModal.formData.popular
                        ? 'bg-red-50 border-red-200'
                        : 'bg-gray-200 border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={editModal.formData.popular}
                            onChange={(e) => handleEditFormChange("popular", e.target.checked)}
                            id="edit-popular"
                            disabled={editModal.maxPopularReached && !editModal.formData.popular}
                            className={`w-5 h-5 rounded focus:ring-2 focus:ring-offset-2 ${
                              editModal.maxPopularReached && !editModal.formData.popular
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-amber-500 focus:ring-amber-500'
                            }`}
                          />
                          <label
                            htmlFor="edit-popular"
                            className={`cursor-pointer font-medium flex items-center gap-2 ${
                              editModal.maxPopularReached && !editModal.formData.popular
                                ? 'text-gray-500'
                                : 'text-gray-700'
                            }`}
                          >
                            <FaStar className="text-amber-500" />
                            Destacar como Produto Popular
                          </label>
                        </div>
                        <div className="text-sm font-medium">
                          <span className={`px-2 py-1 rounded-full ${
                            editModal.maxPopularReached && !editModal.formData.popular
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {popularCount}/4
                          </span>
                        </div>
                      </div>
                      
                      {editModal.maxPopularReached && !editModal.formData.popular ? (
                        <div className="mt-3 flex items-start gap-2">
                          <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-red-600">
                            Limite máximo de 4 produtos em destaque atingido. 
                            Desmarque outro produto como destaque para habilitar esta opção.
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 mt-2">
                          Produtos populares aparecem em destaque na página inicial. 
                          Máximo de 4 produtos podem ser destacados simultaneamente.
                        </p>
                      )}
                    </div>

                    {/* Informações do Produto */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-5">
                      <h5 className="font-semibold text-gray-800 mb-3 text-sm flex items-center gap-2">
                        <FaInfoCircle className="text-gray-600" />
                        Informações do Produto
                      </h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">ID</p>
                          <p className="text-sm font-medium text-gray-900 bg-white px-3 py-1.5 rounded-lg">
                            {editModal.product?.id}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Total de Imagens</p>
                          <p className="text-sm font-medium text-gray-900 bg-white px-3 py-1.5 rounded-lg">
                            {editModal.images.length} existente(s) + {editModal.newImages.filter(img => img).length} nova(s)
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Cadastrado em</p>
                          <p className="text-sm font-medium text-gray-900 bg-white px-3 py-1.5 rounded-lg">
                            {formatDate(editModal.product?.createdAt)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Última atualização</p>
                          <p className="text-sm font-medium text-gray-900 bg-white px-3 py-1.5 rounded-lg">
                            {formatDate(editModal.product?.updatedAt)}
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
                onClick={updateProduct}
                disabled={
                  editModal.isLoading ||
                  !editModal.formData.name ||
                  !editModal.formData.category ||
                  !editModal.formData.subCategory ||
                  (editModal.images.length === 0 && editModal.newImages.filter(img => img).length === 0) ||
                  (editModal.maxPopularReached && editModal.formData.popular && !editModal.product?.popular)
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

export default List;