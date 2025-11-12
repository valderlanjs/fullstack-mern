// Collection.jsx - CORRIGIDO E SIMPLIFICADO
import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import Item from "../components/Item";
import ShowSearch from "../components/ShowSearch";
import Footer from "../components/Footer";
import axios from "axios";

import { motion } from "framer-motion";
import { animationVariants } from "../constants/animationVariants";

const backend_url = import.meta.env.VITE_BACKEND_URL;

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [localSearch, setLocalSearch] = useState("");
  const [loadingFilters, setLoadingFilters] = useState(true);

  // Cores do tema verde
  const greenGradient = "linear-gradient(135deg, #206E34, #70BD44)";
  const primaryGreen = "#206E34";
  const secondaryGreen = "#70BD44";

  // Buscar categorias e tipos do backend
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await axios.get(`${backend_url}/api/product/filters`);
        if (response.data.success) {
          setCategories(response.data.categories);
          setSubCategories(response.data.subCategories);
        }
      } catch (error) {
        console.error("Erro ao buscar filtros:", error);
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchFilters();
  }, []);

  const toggleFilter = (value, filterState, setFilterState) => {
    setFilterState((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setLocalSearch("");
  };

  const clearSearch = () => {
    setLocalSearch("");
  };

  // CORREÇÃO: Lógica de filtragem simplificada
  const getFilteredProducts = () => {
    if (!products || !Array.isArray(products)) return [];

    let filtered = products;

    // Aplica busca local se existir
    if (localSearch.trim()) {
      const searchTerm = localSearch.toLowerCase().trim();
      filtered = filtered.filter(
        (product) =>
          product?.name?.toLowerCase().includes(searchTerm) ||
          product?.category?.toLowerCase().includes(searchTerm) ||
          product?.subCategory?.toLowerCase().includes(searchTerm)
      );
    }
    // Aplica busca do contexto se não houver busca local
    else if (search && showSearch && search.trim()) {
      const searchTerm = search.toLowerCase().trim();
      filtered = filtered.filter((product) =>
        product?.name?.toLowerCase().includes(searchTerm)
      );
    }

    // Aplica filtros de categoria
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(
        (product) =>
          product?.category && selectedCategories.includes(product.category)
      );
    }

    // Aplica filtros de subcategoria
    if (selectedSubCategories.length > 0) {
      filtered = filtered.filter(
        (product) =>
          product?.subCategory &&
          selectedSubCategories.includes(product.subCategory)
      );
    }

    return filtered;
  };

  // Produtos filtrados calculados em tempo real
  const filteredProducts = getFilteredProducts();

  return (
    <>
      <section className="min-h-screen bg-gray py-12 relative overflow-hidden">
        {/* Elementos decorativos de fundo - CÍRCULOS VERDES */}
        <div
          className="absolute top-1/4 -right-20 w-72 h-72 rounded-full blur-3xl -z-10 opacity-30"
          style={{ background: greenGradient }}
        ></div>
        <div
          className="absolute bottom-1/4 -left-20 w-96 h-96 rounded-full blur-3xl -z-10 opacity-20"
          style={{ background: greenGradient }}
        ></div>
        <div
          className="absolute top-1/2 -translate-y-1/2 -left-10 w-64 h-64 rounded-full blur-3xl -z-10 opacity-25"
          style={{ background: greenGradient }}
        ></div>
        <div
          className="absolute bottom-10 -right-10 w-48 h-48 rounded-full blur-2xl -z-10 opacity-15"
          style={{ background: greenGradient }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar de Filtros */}
            <div className="lg:w-72 xl:w-80 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
                {/* Badge de Categoria */}
                <div className="inline-flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-full mb-6 w-full justify-center">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: primaryGreen }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                    Filtros
                  </span>
                </div>

                {/* Barra de Busca Local */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    Buscar Produtos
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar por nome, categoria..."
                      value={localSearch}
                      onChange={(e) => setLocalSearch(e.target.value)}
                      className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    {localSearch && (
                      <button
                        onClick={clearSearch}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700 transition-colors"
                      >
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Seção de Categorias */}
                <div className="bg-gray-200 rounded-xl p-4 mb-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="font-semibold text-gray-800 flex items-center gap-2">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: primaryGreen }}
                      ></div>
                      Categoria
                    </h5>
                    {selectedCategories.length > 0 && (
                      <span
                        className="text-xs text-white px-2 py-1 rounded-full font-medium"
                        style={{ background: greenGradient }}
                      >
                        {selectedCategories.length}
                      </span>
                    )}
                  </div>
                  {loadingFilters ? (
                    <div className="text-sm text-gray-500">
                      Carregando categorias...
                    </div>
                  ) : categories.length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {categories.map((cat) => (
                        <label
                          key={cat}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white transition-colors duration-200 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            value={cat}
                            checked={selectedCategories.includes(cat)}
                            onChange={(e) =>
                              toggleFilter(
                                e.target.value,
                                selectedCategories,
                                setSelectedCategories
                              )
                            }
                            className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900 flex-1">
                            {cat}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 text-center py-4">
                      Nenhuma categoria disponível
                    </div>
                  )}
                </div>

                {/* Seção de Tipos de Produto */}
                <div className="bg-gray-200 rounded-xl p-4 mb-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="font-semibold text-gray-800 flex items-center gap-2">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: secondaryGreen }}
                      ></div>
                      Tipos de Produto
                    </h5>
                    {selectedSubCategories.length > 0 && (
                      <span
                        className="text-xs text-white px-2 py-1 rounded-full font-medium"
                        style={{ background: greenGradient }}
                      >
                        {selectedSubCategories.length}
                      </span>
                    )}
                  </div>
                  {loadingFilters ? (
                    <div className="text-sm text-gray-500">
                      Carregando tipos...
                    </div>
                  ) : subCategories.length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {subCategories.map((subCat) => (
                        <label
                          key={subCat}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white transition-colors duration-200 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            value={subCat}
                            checked={selectedSubCategories.includes(subCat)}
                            onChange={(e) =>
                              toggleFilter(
                                e.target.value,
                                selectedSubCategories,
                                setSelectedSubCategories
                              )
                            }
                            className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900 flex-1">
                            {subCat}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 text-center py-4">
                      Nenhum tipo disponível
                    </div>
                  )}
                </div>

                {/* Botão Limpar Filtros */}
                {(selectedCategories.length > 0 ||
                  selectedSubCategories.length > 0 ||
                  localSearch) && (
                  <button
                    onClick={clearAllFilters}
                    className="w-full px-4 py-3 text-white rounded-xl hover:opacity-90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                    style={{ background: greenGradient }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18-6M6 6l12 12"
                        />
                      </svg>
                      Limpar Todos os Filtros
                    </div>
                  </button>
                )}
              </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 lg:p-8">
                {/* Header com Título e Informações */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
                  <div className="flex-1">
                    <h1 className="text-3xl lg:text-4xl font-light text-gray-900 mb-2">
                      Nossos{" "}
                      <span
                        className="font-bold"
                        style={{
                          background: greenGradient,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        Produtos
                      </span>
                    </h1>

                    {/* Linha decorativa */}
                    <div
                      className="w-16 h-1 rounded-full mb-4"
                      style={{ background: greenGradient }}
                    ></div>
                  </div>

                  {/* Informações de resultados */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 flex-shrink-0">
                    {localSearch && (
                      <span
                        className="px-3 py-1 rounded-full text-white font-medium"
                        style={{ background: greenGradient }}
                      >
                        Busca: "{localSearch}"
                      </span>
                    )}
                    <span className="bg-gray-100 px-3 py-1 rounded-full border">
                      {filteredProducts.length}{" "}
                      {filteredProducts.length === 1 ? "produto" : "produtos"}
                    </span>
                  </div>
                </div>

                {/* Filtros Ativos */}
                {(selectedCategories.length > 0 ||
                  selectedSubCategories.length > 0 ||
                  localSearch) && (
                  <div className="mb-8 p-4 lg:p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="flex flex-wrap gap-3 items-center">
                      <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: primaryGreen }}
                        ></div>
                        Filtros ativos:
                      </span>

                      {localSearch && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-white text-green-800 text-sm rounded-full border border-green-200 shadow-sm">
                          🔍 "{localSearch}"
                          <button
                            onClick={clearSearch}
                            className="hover:text-green-900 focus:outline-none transition-colors ml-1"
                          >
                            ×
                          </button>
                        </span>
                      )}

                      {selectedCategories.map((cat) => (
                        <span
                          key={cat}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-white text-green-800 text-sm rounded-full border border-green-200 shadow-sm"
                        >
                          📁 {cat}
                          <button
                            onClick={() =>
                              toggleFilter(
                                cat,
                                selectedCategories,
                                setSelectedCategories
                              )
                            }
                            className="hover:text-green-900 focus:outline-none transition-colors ml-1"
                          >
                            ×
                          </button>
                        </span>
                      ))}

                      {selectedSubCategories.map((subCat) => (
                        <span
                          key={subCat}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-white text-green-800 text-sm rounded-full border border-green-200 shadow-sm"
                        >
                          🪵 {subCat}
                          <button
                            onClick={() =>
                              toggleFilter(
                                subCat,
                                selectedSubCategories,
                                setSelectedSubCategories
                              )
                            }
                            className="hover:text-green-900 focus:outline-none transition-colors ml-1"
                          >
                            ×
                          </button>
                        </span>
                      ))}

                      <button
                        onClick={clearAllFilters}
                        className="ml-auto text-sm text-white px-3 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center gap-2"
                        style={{ background: greenGradient }}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Limpar todos
                      </button>
                    </div>
                  </div>
                )}

                {/* Grid de Produtos - CORREÇÃO PRINCIPAL */}
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 lg:gap-6">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="w-full">
                        <Item product={product} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="col-span-full text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
                      <svg
                        className="w-12 h-12 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {products && products.length > 0
                        ? "Nenhum produto encontrado"
                        : "Carregando produtos..."}
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      {products && products.length > 0
                        ? "Não encontramos produtos que correspondam aos seus critérios de busca."
                        : "Aguarde enquanto carregamos nossos produtos."}
                    </p>
                    {(selectedCategories.length > 0 ||
                      selectedSubCategories.length > 0 ||
                      localSearch) && (
                      <button
                        onClick={clearAllFilters}
                        className="px-6 py-3 text-white rounded-lg hover:opacity-90 transition-opacity font-medium inline-flex items-center gap-2"
                        style={{ background: greenGradient }}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Limpar filtros e busca
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Collection;
