import React, { useEffect, useState } from "react";
import axios from "axios";
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
} from "react-icons/fa6";

import {
  FaExclamationTriangle,
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
} from "react-icons/fa";
import "../index.css";

const ManageCards = ({ token }) => {
  const [cards, setCards] = useState([]);
  const [sectionTitle, setSectionTitle] = useState("");
  const [newCards, setNewCards] = useState([
    { title: "", subtitle: "", link: "", image: null, imageError: "" },
    { title: "", subtitle: "", link: "", image: null, imageError: "" },
    { title: "", subtitle: "", link: "", image: null, imageError: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    card: null,
  });

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

  // NOVA FUNÇÃO: Validação de imagem para cards
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
      formData.append(`link${i + 1}`, card.link);
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
          { title: "", subtitle: "", link: "", image: null, imageError: "" },
          { title: "", subtitle: "", link: "", image: null, imageError: "" },
          { title: "", subtitle: "", link: "", image: null, imageError: "" },
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

  // Componente para campo de upload de imagem
  const ImageUploadField = ({ index, card }) => {
    return (
      <div className="flex-shrink-0">
        <label htmlFor={`image${index}`} className="cursor-pointer block">
          <div
            className={`w-64 h-48 border-2 border-dashed rounded-xl overflow-hidden transition-colors duration-300 flex items-center justify-center card-hover ${
              card.imageError
                ? "border-red-300 bg-red-50"
                : card.image
                ? "border-green-300 bg-green-50"
                : "border-gray-300 hover:border-secondary bg-gray-200"
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
                <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                  <FaCheckCircle size={14} />
                </div>
              </div>
            ) : card.imageError ? (
              <div className="text-center p-4">
                <FaTimesCircle className="text-red-400 text-xl mx-auto mb-2" />
                <p className="text-red-600 text-sm font-medium">Erro</p>
                <p className="text-red-500 text-xs mt-1">{card.imageError}</p>
              </div>
            ) : (
              <div className="text-center p-6 gentle-pulse">
                <FaUpload className="text-gray-400 text-2xl mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Imagem {index + 1}</p>
                <p className="text-gray-400 text-sm mt-1">
                  Clique para selecionar
                </p>
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
          <div className="mt-2 text-center">
            <p
              className="text-xs text-gray-500 truncate"
              title={card.image.name}
            >
              {card.image.name.length > 20
                ? card.image.name.substring(0, 20) + "..."
                : card.image.name}
            </p>
            <p className="text-xs text-gray-400">
              {formatFileSize(card.image.size)}
            </p>
          </div>
        )}

        {card.imageError && (
          <p className="text-xs text-red-500 mt-1 text-center">
            {card.imageError}
          </p>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto fade-in">
        {/* Header */}
        <div className="mb-8 slide-in-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <FaIdCard className="text-secondary" />
            Gerenciar Cards da Seção
          </h1>
          <p className="text-gray-600">
            Adicione e gerencie os cards exibidos na seção de serviços ou
            produtos
          </p>
        </div>

        {/* Título da Seção */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-8 scale-in">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaEdit className="text-blue-600" />
            Título da Seção
          </h2>
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título Principal
              </label>
              <input
                type="text"
                placeholder="Ex: Nossos Serviços, Conheça Nossos Produtos..."
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
              />
            </div>
            <button
              type="button"
              onClick={handleUpdateTitle}
              className="btn-hover-lift bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium whitespace-nowrap"
            >
              <FaEdit className="inline mr-2" />
              Atualizar Título
            </button>
          </div>
        </div>

        {/* Cards Existentes */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 slide-in-right">
            Cards Existentes ({cards.length})
          </h2>

          {cards.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 gentle-pulse">
              <FaIdCard className="text-gray-400 text-4xl mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Nenhum card cadastrado</p>
              <p className="text-gray-400 text-sm mt-1">
                Adicione os primeiros cards usando o formulário abaixo
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card, index) => (
                <div
                  key={card.id}
                  className="card-hover relative group bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
                >
                  {/* Imagem do Card */}
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>

                  {/* Overlay com ações */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => openDeleteModal(card)}
                      className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors transform scale-90 group-hover:scale-100 gentle-bounce"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  {/* Informações do Card */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 text-sm mb-1 truncate">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-xs line-clamp-2">
                      {card.subtitle}
                    </p>
                  </div>

                  {/* Badge de número */}
                  <div className="absolute top-3 left-3 bg-secondary text-white text-xs font-bold px-2 py-1 rounded-full">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Adicionar Novos Cards */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 scale-in">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FaPlus className="text-green-600" />
            Adicionar Novos Cards
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {newCards.map((card, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-6 card-hover"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaIdCard className="text-purple-600" />
                  Card {index + 1}
                </h3>

                <div className="flex flex-col lg:flex-row gap-6 items-start">
                  {/* Área de Upload da Imagem */}
                  <ImageUploadField index={index} card={card} />

                  {/* Campos do Card */}
                  <div className="flex-1 space-y-4 slide-in-right">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título do Card *
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Design Moderno, Suporte 24h..."
                        value={card.title}
                        onChange={(e) =>
                          handleChange(index, "title", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subtítulo *
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Soluções criativas e inovadoras..."
                        value={card.subtitle}
                        onChange={(e) =>
                          handleChange(index, "subtitle", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Link (Opcional)
                      </label>
                      <input
                        type="text"
                        placeholder="https://exemplo.com"
                        value={card.link}
                        onChange={(e) =>
                          handleChange(index, "link", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Informações e Dicas */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 card-hover">
              <div className="flex items-start gap-3">
                <FaCircleExclamation className="text-blue-600 text-lg mt-0.5 flex-shrink-0 gentle-bounce" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Recomendações Importantes
                  </h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• É necessário adicionar exatamente 3 cards</li>
                    <li>• Todos os campos com * são obrigatórios</li>
                    <li>
                      • <strong>Tamanho máximo por imagem: 1MB</strong>
                    </li>
                    <li>• Formatos suportados: JPG, PNG, WebP</li>
                    <li>• Dimensões recomendadas: 400x300px</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Botão de Submit */}
            <div className="flex gap-3 pt-4">
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
                className="btn-hover-lift bg-secondary text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <FaUpload />
                    Adicionar Cards
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Estatísticas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 fade-in">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 card-hover">
            <div className="text-2xl font-bold text-blue-600">
              {cards.length}
            </div>
            <div className="text-sm text-blue-800">Total de Cards</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 card-hover">
            <div className="text-2xl font-bold text-green-600">1MB</div>
            <div className="text-sm text-green-800">Tamanho Máximo</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 card-hover">
            <div className="text-2xl font-bold text-purple-600">3</div>
            <div className="text-sm text-purple-800">Cards Necessários</div>
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
            <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 text-white bg-green-700 border border-green-700 rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteCard}
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
