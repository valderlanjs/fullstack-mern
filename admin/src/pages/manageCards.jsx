import React, { useEffect, useState } from "react";
import api from "../api/axios.js"
import { backend_url } from "../App";
import { toast } from "react-toastify";
import {
  FaTrash,
  FaCircleExclamation,
  FaPlus,
  FaIdCard,
  FaUpload,
  FaSpinner,
  FaBox,
  FaLink,
} from "react-icons/fa6";

import {
  FaExclamationTriangle,
  FaTimes,
  FaQuestionCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaShoppingBag,
} from "react-icons/fa";
import "../index.css";

const ManageCards = ({ token }) => {
  const [cards, setCards] = useState([]);
  const [sectionTitle, setSectionTitle] = useState("");
  const [newCards, setNewCards] = useState([
    { title: "", subtitle: "", image: null, imageError: "" },
    { title: "", subtitle: "", image: null, imageError: "" },
    { title: "", subtitle: "", image: null, imageError: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    card: null,
  });
  const [instructionsModal, setInstructionsModal] = useState(false);

  // Buscar cards e título da seção
  const fetchCards = async () => {
    try {
      const response = await api.get(`${backend_url}/api/cards`);
      if (response.data.success) {
        setCards(response.data.cards);
        setSectionTitle(response.data.sectionTitle || "");
      }
    } catch (error) {
      toast.error("Erro ao buscar cards.");
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  // Funções do modal de instruções
  const openInstructionsModal = () => {
    setInstructionsModal(true);
  };

  const closeInstructionsModal = () => {
    setInstructionsModal(false);
  };

  // Modal de exclusão
  const openDeleteModal = (card) => {
    setDeleteModal({
      isOpen: true,
      card: card,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      card: null,
    });
  };

  // Excluir card individual
  const handleDeleteCard = async () => {
    if (!deleteModal.card) return;

    setIsDeleting(deleteModal.card.id);
    try {
      const response = await api.delete(
        `${backend_url}/api/cards/${deleteModal.card.id}`,
        {
          headers: { token },
        }
      );
      if (response.data.success) {
        toast.success("Card excluído com sucesso!");
        fetchCards();
        closeDeleteModal();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Erro ao excluir card.");
    } finally {
      setIsDeleting(null);
    }
  };

  // Função para calcular e formatar o tamanho
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Validação de imagem para cards
  const handleImageChange = (index, selectedImage) => {
    const updatedCards = [...newCards];
    updatedCards[index].imageError = "";

    if (selectedImage) {
      // Validação de tamanho (1MB)
      if (selectedImage.size > 1 * 1024 * 1024) {
        updatedCards[index].imageError = "A imagem deve ter no máximo 1MB";
        updatedCards[index].image = null;
        setNewCards(updatedCards);
        return;
      }

      // Validação do tipo de arquivo
      if (!selectedImage.type.startsWith("image/")) {
        updatedCards[index].imageError =
          "Por favor, selecione um arquivo de imagem válido";
        updatedCards[index].image = null;
        setNewCards(updatedCards);
        return;
      }

      updatedCards[index].image = selectedImage;
      updatedCards[index].imageError = "";
      setNewCards(updatedCards);
    }
  };

  // Atualizar campos dos novos cards
  const handleChange = (index, field, value) => {
    const updated = [...newCards];
    updated[index][field] = value;
    setNewCards(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const incomplete = newCards.some(
      (card) => !card.title || !card.subtitle || !card.image || card.imageError
    );

    if (!sectionTitle || incomplete) {
      toast.error(
        "Preencha todos os campos obrigatórios e corrija os erros nas imagens."
      );
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("sectionTitle", sectionTitle);
    newCards.forEach((card, i) => {
      formData.append(`title${i + 1}`, card.title);
      formData.append(`subtitle${i + 1}`, card.subtitle);
      formData.append(`link${i + 1}`, "/collection"); // LINK PADRÃO
      formData.append(`image${i + 1}`, card.image);
    });

    try {
      const response = await api.post(
        `${backend_url}/api/cards/group`,
        formData,
        {
          headers: { token },
        }
      );
      if (response.data.success) {
        toast.success("Cards adicionados com sucesso! 🎉");
        setNewCards([
          { title: "", subtitle: "", image: null, imageError: "" },
          { title: "", subtitle: "", image: null, imageError: "" },
          { title: "", subtitle: "", image: null, imageError: "" },
        ]);
        fetchCards();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Erro ao adicionar cards.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar apenas o título da seção
  const handleUpdateTitle = async () => {
    if (!sectionTitle.trim()) {
      toast.error("Digite um título válido.");
      return;
    }

    try {
      const response = await api.post(
        `${backend_url}/api/cards/title`,
        { title: sectionTitle },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Título atualizado com sucesso!");
        fetchCards();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Erro ao atualizar título.");
    }
  };

  // Componente para campo de upload de imagem COMPACTADO
  const ImageUploadField = ({ index, card }) => {
    return (
      <div className="flex-shrink-0">
        <label htmlFor={`image${index}`} className="cursor-pointer block">
          <div
            className={`w-40 h-32 border-2 border-dashed rounded-lg overflow-hidden transition-all duration-300 flex items-center justify-center card-hover transform hover:scale-[1.02] ${
              card.imageError
                ? "border-red-300 bg-red-50"
                : card.image
                ? "border-green-300 bg-green-50 shadow-sm"
                : "border-gray-300 hover:border-purple-400 bg-gray-200"
            }`}
          >
            {card.image ? (
              <div className="relative w-full h-full">
                <img
                  src={URL.createObjectURL(card.image)}
                  alt={`Preview Card ${index + 1}`}
                  className="w-full h-full object-cover fade-in"
                />
                {/* Indicador de sucesso */}
                <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-1 shadow-md">
                  <FaCheckCircle size={12} />
                </div>
              </div>
            ) : card.imageError ? (
              <div className="text-center p-2">
                <FaTimesCircle className="text-red-400 text-lg mx-auto mb-1" />
                <p className="text-red-600 text-xs font-medium">Erro</p>
                <p className="text-red-500 text-xs mt-1">{card.imageError}</p>
              </div>
            ) : (
              <div className="text-center p-3">
                <FaUpload className="text-gray-400 text-lg mx-auto mb-2" />
                <p className="text-gray-600 font-medium text-xs">Imagem {index + 1}</p>
              </div>
            )}
          </div>
          <input
            type="file"
            id={`image${index}`}
            hidden
            onChange={(e) => handleImageChange(index, e.target.files[0])}
            accept="image/*"
          />
        </label>

        {card.image && (
          <div className="mt-1 text-center">
            <p
              className="text-xs text-gray-500 truncate"
              title={card.image.name}
            >
              {card.image.name.length > 15
                ? card.image.name.substring(0, 15) + "..."
                : card.image.name}
            </p>
            <p className="text-xs text-gray-400">
              {formatFileSize(card.image.size)}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto fade-in">
        {/* Header */}
        <div className="mb-8 slide-in-left">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <FaIdCard className="text-purple-600" />
                Gerenciar Cards de Produtos
              </h1>
              <p className="text-gray-600">
                Gerencie os cards que direcionam para a seção de produtos
              </p>
            </div>
            {/* BOTÃO DE INSTRUÇÕES */}
            <button
              onClick={openInstructionsModal}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 btn-hover-lift shadow-md"
              title="Ver instruções de uso"
            >
              <FaQuestionCircle />
              Instruções
            </button>
          </div>
        </div>

        {/* MODAL DE INSTRUÇÕES */}
        {instructionsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 modal-enter-active">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
              {/* Header do Modal de Instruções */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                    <FaQuestionCircle className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Instruções - Cards de Produtos
                    </h3>
                    <p className="text-sm text-gray-500">
                      Guia completo para gerenciar os cards da seção de produtos
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeInstructionsModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              {/* Conteúdo das Instruções */}
              <div className="p-6 space-y-6">
                {/* Seção 1: Visão Geral */}
                <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaShoppingBag className="text-purple-600" />
                    1. Visão Geral dos Cards de Produtos
                  </h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>Esta seção gerencia os cards que direcionam os usuários para a página de produtos (<code className="bg-gray-200 px-1 rounded">/collection</code>).</p>
                    <p><strong>Características principais:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li><strong>3 cards obrigatórios:</strong> Sempre exibe exatamente 3 cards</li>
                      <li><strong>Link fixo:</strong> Todos os cards direcionam para a página de produtos</li>
                      <li><strong>Foco em produtos:</strong> Ideal para categorias ou produtos em destaque</li>
                    </ul>
                  </div>
                </section>

                {/* Seção 2: Título da Seção */}
                <section className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <FaEdit className="text-green-600" />
                    2. Configurando o Título da Seção
                  </h4>
                  <div className="space-y-2 text-sm text-green-700">
                    <p><strong>Exemplos de títulos eficazes:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>"Nossos Produtos"</li>
                      <li>"Categorias em Destaque"</li>
                      <li>"Explore Nossa Coleção"</li>
                      <li>"Produtos Populares"</li>
                    </ul>
                  </div>
                </section>

                {/* Seção 3: Dicas de Conteúdo */}
                <section className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                    <FaBox className="text-purple-600" />
                    3. Dicas para Conteúdo dos Cards
                  </h4>
                  <div className="space-y-2 text-sm text-purple-700">
                    <p><strong>Para títulos (exemplos):</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>"Madeiras Nobres"</li>
                      <li>"Acabamentos Premium"</li>
                      <li>"Projetos Especiais"</li>
                    </ul>
                    
                    <p><strong>Para subtítulos (exemplos):</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>"Qualidade e durabilidade incomparáveis"</li>
                      <li>"Acabamentos que transformam ambientes"</li>
                      <li>"Soluções personalizadas para seu projeto"</li>
                    </ul>
                  </div>
                </section>
              </div>

              {/* Rodapé do Modal */}
              <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-200 rounded-b-xl">
                <button
                  onClick={closeInstructionsModal}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium flex items-center justify-center gap-2 shadow-md"
                >
                  <FaCheckCircle />
                  Entendi, Obrigado!
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Título da Seção */}
        <div className="bg-gradient-to-r from-white to-gray-200 rounded-xl shadow-sm border border-gray-200 p-6 mb-8 scale-in hover:shadow-md transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaEdit className="text-purple-600" />
            Título da Seção de Produtos
          </h2>
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título Principal da Seção
              </label>
              <input
                type="text"
                placeholder="Ex: Nossos Produtos, Categorias em Destaque..."
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
              />
            </div>
            <button
              type="button"
              onClick={handleUpdateTitle}
              className="btn-hover-lift bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-medium whitespace-nowrap shadow-md"
            >
              <FaEdit className="inline mr-2" />
              Atualizar Título
            </button>
          </div>
        </div>

        {/* Cards Existentes */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 slide-in-right flex items-center gap-2">
              <FaBox className="text-purple-600" />
              Cards Existentes ({cards.length}/3)
            </h2>
            {cards.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaLink className="text-green-500" />
                <span>Todos os cards direcionam para Produtos</span>
              </div>
            )}
          </div>

          {cards.length === 0 ? (
            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-dashed border-gray-300 gentle-pulse">
              <FaShoppingBag className="text-gray-400 text-5xl mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">Nenhum card cadastrado</p>
              <p className="text-gray-400 text-sm mt-2">
                Adicione os cards para direcionar para a seção de produtos
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card, index) => (
                <div
                  key={card.id}
                  className="card-hover relative group bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-purple-200"
                >
                  {/* Imagem do Card */}
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Overlay com ações */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => openDeleteModal(card)}
                        className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors transform scale-90 group-hover:scale-100 gentle-bounce shadow-lg"
                        title="Excluir card"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  {/* Informações do Card */}
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-800 text-base mb-2 line-clamp-1">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {card.subtitle}
                    </p>
                    
                    {/* Link Info */}
                    <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full w-fit">
                      <FaLink className="text-xs" />
                      <span>Direciona para Produtos</span>
                    </div>
                  </div>

                  {/* Badge de número */}
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Adicionar Novos Cards - COMPACTADO */}
        <div className="bg-gradient-to-r from-blue-200 to-green-700 rounded-xl shadow-sm border border-gray-200 p-6 scale-in hover:shadow-md transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FaPlus className="text-green-500" />
            Adicionar Novos Cards
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {newCards.map((card, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-4 card-hover bg-white transition-all duration-300 hover:border-purple-300 hover:shadow-sm"
                >
                  {/* Header do Card */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <div className="p-1 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
                        <FaIdCard className="text-purple-600 text-sm" />
                      </div>
                      <span className="text-sm">Card {index + 1}</span>
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <FaLink className="text-xs" />
                      <span>/collection</span>
                    </div>
                  </div>

                  {/* Conteúdo Compactado */}
                  <div className="space-y-3">
                    {/* Upload de Imagem */}
                    <ImageUploadField index={index} card={card} />

                    {/* Campos de Texto */}
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Título *
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Madeiras Nobres..."
                          value={card.title}
                          onChange={(e) =>
                            handleChange(index, "title", e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Descrição *
                        </label>
                        <textarea
                          placeholder="Ex: Qualidade e durabilidade..."
                          value={card.subtitle}
                          onChange={(e) =>
                            handleChange(index, "subtitle", e.target.value)
                          }
                          rows={2}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Informações e Dicas - COMPACTADO */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <FaCircleExclamation className="text-purple-600 text-sm mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">
                    Informações Importantes
                  </h4>
                  <ul className="text-gray-700 text-xs space-y-0.5">
                    <li>• <strong>3 cards obrigatórios</strong> - preencha todos</li>
                    <li>• Campos com * são obrigatórios</li>
                    <li>• <strong>Imagens: máximo 1MB</strong> (JPG, PNG, WebP)</li>
                    <li>• Todos direcionam para página de produtos</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Botão de Submit */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={
                  isLoading ||
                  newCards.some(
                    (card) =>
                      !card.title ||
                      !card.subtitle ||
                      !card.image ||
                      card.imageError
                  )
                }
                className="btn-hover-lift bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md text-sm"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <FaUpload />
                    Adicionar Cards de Produtos
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Estatísticas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 fade-in">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 card-hover text-center">
            <div className="text-2xl font-bold text-blue-600">
              {cards.length}
            </div>
            <div className="text-sm text-blue-800 font-medium">Cards Ativos</div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200 card-hover text-center">
            <div className="text-2xl font-bold text-green-600">1MB</div>
            <div className="text-sm text-green-800 font-medium">Tamanho Máximo</div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200 card-hover text-center">
            <div className="text-2xl font-bold text-purple-600">3</div>
            <div className="text-sm text-purple-800 font-medium">Cards Necessários</div>
          </div>
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
                  Excluir Card
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
                Tem certeza que deseja excluir este card?
              </p>
              <p className="text-sm text-gray-500">
                Esta ação não pode ser desfeita. O card será removido
                permanentemente do sistema.
              </p>

              {/* Preview do card que será excluído */}
              {deleteModal.card && (
                <div className="mt-4 p-3 bg-gray-200 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <img
                      src={deleteModal.card.image}
                      alt="Card a ser excluído"
                      className="w-16 h-12 object-cover rounded"
                    />
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">{deleteModal.card.title}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {deleteModal.card.subtitle}
                      </p>
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
                className="flex-1 px-4 py-3 text-white bg-gradient-to-r from-green-600 to-blue-600 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteCard}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
              >
                {isDeleting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <FaTrash />
                    Excluir Card
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

export default ManageCards;