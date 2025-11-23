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
  FaImage
} from "react-icons/fa6";

import { FaExclamationTriangle, FaSearch, FaTimes } from "react-icons/fa";
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

  // Categorias únicas para o filtro
  const categories = [...new Set(list.map(item => item.category))];

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto fade-in">
        {/* Header */}
        <div className="mb-8 slide-in-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <FaBox className="text-secondary" />
            Todos os Produtos
          </h1>
          <p className="text-gray-600">
            Gerencie e visualize todos os produtos do catálogo
          </p>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6 scale-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Busca */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaSearch className="inline mr-2 text-gray-400" />
                Buscar Produtos
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome, categoria ou tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Filtro por Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaFilter className="inline mr-2 text-gray-400" />
                Categoria
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="all">Todas as Categorias</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Filtro por Popularidade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaStar className="inline mr-2 text-gray-400" />
                Destaque
              </label>
              <select
                value={filterPopular}
                onChange={(e) => setFilterPopular(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="all">Todos</option>
                <option value="popular">Populares</option>
                <option value="not-popular">Não Populares</option>
              </select>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 fade-in">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 card-hover">
            <div className="text-2xl font-bold text-blue-600">{list.length}</div>
            <div className="text-sm text-blue-800">Total de Produtos</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 card-hover">
            <div className="text-2xl font-bold text-green-600">
              {list.filter(item => item.popular).length}
            </div>
            <div className="text-sm text-green-800">Produtos Populares</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 card-hover">
            <div className="text-2xl font-bold text-purple-600">{categories.length}</div>
            <div className="text-sm text-purple-800">Categorias</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 card-hover">
            <div className="text-2xl font-bold text-orange-600">{filteredList.length}</div>
            <div className="text-sm text-orange-800">Filtrados</div>
          </div>
        </div>

        {/* Lista de Produtos */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden scale-in">
          {/* Cabeçalho da Tabela */}
          <div className="hidden md:grid grid-cols-12 gap-4 items-center py-4 px-6 bg-gray-200 border-b border-gray-200 text-gray-700 font-semibold text-sm">
            <div className="col-span-2">IMAGEM</div>
            <div className="col-span-3">NOME</div>
            <div className="col-span-2">CATEGORIA</div>
            <div className="col-span-2">TIPO</div>
            <div className="col-span-1">DESTAQUE</div>
            <div className="col-span-2 text-center">AÇÕES</div>
          </div>

          {/* Conteúdo da Lista */}
          {isLoading ? (
            <div className="text-center py-12">
              <FaSpinner className="animate-spin text-4xl text-secondary mx-auto mb-4" />
              <p className="text-gray-600">Carregando produtos...</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="text-center py-12">
              <FaImage className="text-gray-400 text-4xl mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm || filterCategory !== "all" || filterPopular !== "all" 
                  ? "Nenhum produto encontrado com os filtros aplicados." 
                  : "Nenhum produto cadastrado."}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {searchTerm || filterCategory !== "all" || filterPopular !== "all" 
                  ? "Tente ajustar os filtros de busca." 
                  : "Adicione o primeiro produto no formulário de cadastro."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredList.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-4 px-6 hover:bg-green-700 transition-colors duration-200 group card-hover"
                >
                  {/* Imagem */}
                  <div className="md:col-span-2 flex justify-center md:justify-start">
                    <img 
                      src={item.image[0]} 
                      alt={item.name}
                      className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg ring-2 ring-gray-100 group-hover:ring-secondary transition-all duration-200"
                    />
                  </div>

                  {/* Nome */}
                  <div className="md:col-span-3">
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-2">
                      {item.name}
                    </h3>
                  </div>

                  {/* Categoria */}
                  <div className="md:col-span-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.category}
                    </span>
                  </div>

                  {/* Tipo */}
                  <div className="md:col-span-2">
                    <span className="text-sm text-gray-600 font-medium">
                      {item.subCategory}
                    </span>
                  </div>

                  {/* Popular */}
                  <div className="md:col-span-1">
                    {item.popular ? (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <FaStar className="text-sm" />
                        <span className="text-xs font-medium hidden md:inline">Sim</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500 font-medium">Não</span>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="md:col-span-2 flex justify-center">
                    <button
                      onClick={() => openDeleteModal(item)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 group-hover:scale-110 gentle-bounce"
                      title="Excluir produto"
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
                  Excluir Produto
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
                Tem certeza que deseja excluir este produto?
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Esta ação não pode ser desfeita. O produto será removido permanentemente do catálogo.
              </p>
              
              {/* Preview do produto que será excluído */}
              {deleteModal.product && (
                <div className="mt-4 p-3 bg-gray-300 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <img
                      src={deleteModal.product.image[0]}
                      alt="Produto a ser excluído"
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">{deleteModal.product.name}</p>
                      <p className="text-xs text-gray-500">
                        {deleteModal.product.category} • {deleteModal.product.subCategory}
                      </p>
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
                className="flex-1 px-4 py-3 text-white bg-green-700 border border-green-700 rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                onClick={removeProduct}
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
                    Excluir Produto
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