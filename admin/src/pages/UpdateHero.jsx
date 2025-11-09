import React, { useEffect, useState } from "react";
import upload_icon from "../assets/upload_icon.png";
import axios from "axios";
import { backend_url } from "../App";
import { toast } from "react-toastify";
import { FaCircleExclamation } from "react-icons/fa6";
import {
  FaExclamationTriangle,
  FaTrash,
  FaPlus,
  FaImage,
  FaUpload,
  FaSpinner,
  FaEdit,
  FaSave,
  FaTimes,
  FaLink,
  FaPalette,
} from "react-icons/fa";
import "../index.css";

const UpdateHero = ({ token }) => {
  const [banners, setBanners] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [editingBanner, setEditingBanner] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    banner: null,
  });

  const fetchBanners = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/hero/image`);
      if (response.data.success && response.data.images) {
        setBanners(response.data.images);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao obter banners.");
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleAddBanner = async (e) => {
    e.preventDefault();
    if (!newImage) {
      toast.error("Selecione uma imagem para adicionar.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", newImage);

      const response = await axios.post(
        `${backend_url}/api/hero/add`,
        formData,
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        toast.success("Banner adicionado com sucesso! 🎉");
        setNewImage(null);
        document.getElementById("image").value = "";
        fetchBanners();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao adicionar o banner.");
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = (banner) => {
    setDeleteModal({
      isOpen: true,
      banner: banner,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      banner: null,
    });
  };

  const handleDeleteBanner = async () => {
    if (!deleteModal.banner) return;

    setIsDeleting(deleteModal.banner.id);
    try {
      const response = await axios.delete(
        `${backend_url}/api/hero/${deleteModal.banner.id}`,
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        toast.success("Banner removido com sucesso!");
        fetchBanners();
        closeDeleteModal();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao remover banner.");
    } finally {
      setIsDeleting(null);
    }
  };

  // Funções para edição dos textos
  const startEditing = (banner) => {
    setEditingBanner({
      ...banner,
      badgeText: banner.badgeText || "",
      title: banner.title || "",
      description: banner.description || "",
      button1Text: banner.button1Text || "",
      button1Link: banner.button1Link || "/contact",
      button2Text: banner.button2Text || "",
      button2Link: banner.button2Link || "/collection",
      gradientWord: banner.gradientWord || "",
      gradientColor: banner.gradientColor || "#70BD44",
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditingBanner(null);
    setIsEditing(false);
  };

  const handleEditChange = (field, value) => {
    setEditingBanner((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Função para extrair palavras do título para seleção de gradiente
  const getTitleWords = (title) => {
    if (!title) return [];
    return title.split(" ").filter((word) => word.length > 2);
  };

  // Função para aplicar o gradiente no título
  const applyGradientToTitle = (title, gradientWord, gradientColor) => {
    if (!title || !gradientWord) return title;

    const words = title.split(" ");
    return words
      .map((word) =>
        word.toLowerCase() === gradientWord.toLowerCase()
          ? `<span style="background: linear-gradient(135deg, ${gradientColor}, #8CE563); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${word}</span>`
          : word
      )
      .join(" ");
  };

  const saveBannerTexts = async () => {
    if (!editingBanner) return;

    setIsLoading(true);
    try {
      const response = await axios.put(
        `${backend_url}/api/hero/${editingBanner.id}/texts`,
        {
          badgeText: editingBanner.badgeText,
          title: editingBanner.title,
          description: editingBanner.description,
          button1Text: editingBanner.button1Text,
          button1Link: editingBanner.button1Link,
          button2Text: editingBanner.button2Text,
          button2Link: editingBanner.button2Link,
          gradientWord: editingBanner.gradientWord,
          gradientColor: editingBanner.gradientColor,
        },
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        toast.success("Textos do banner atualizados com sucesso! 🎉");
        fetchBanners();
        cancelEditing();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar textos do banner.");
    } finally {
      setIsLoading(false);
    }
  };

  // Opções de cores para o gradiente
  const gradientColors = [
    { name: "Verde", value: "#70BD44" },
    { name: "Azul", value: "#3B82F6" },
    { name: "Roxo", value: "#8B5CF6" },
    { name: "Rosa", value: "#EC4899" },
    { name: "Laranja", value: "#F59E0B" },
    { name: "Vermelho", value: "#EF4444" },
  ];

  // Opções de links pré-definidos
  const commonLinks = [
    { label: "Página de Contato", value: "/contact" },
    { label: "Catálogo de Produtos", value: "/collection" },
    { label: "Sobre Nós", value: "/about" },
    { label: "Serviços", value: "/services" },
    { label: "Instagram", value: "https://www.instagram.com/grupomadenobre" },
    { label: "WhatsApp", value: "https://wa.me/5511999999999" },
  ];

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto fade-in">
        {/* Header */}
        <div className="mb-8 slide-in-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <FaImage className="text-secondary" />
            Gerenciar Banners da Home
          </h1>
          <p className="text-gray-600">
            Adicione, edite textos e gerencie os banners exibidos na página
            inicial
          </p>
        </div>

        {/* Modal de Edição */}
        {isEditing && editingBanner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 modal-enter-active">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
              {/* Header do Modal */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FaEdit className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Editar Textos do Banner
                    </h3>
                    <p className="text-sm text-gray-500">
                      Atualize os textos, links e efeitos visuais deste banner
                    </p>
                  </div>
                </div>
                <button
                  onClick={cancelEditing}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  disabled={isLoading}
                >
                  <FaTimes className="text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              {/* Conteúdo do Modal */}
              <div className="p-6">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Preview do Banner */}
                  <div className="xl:col-span-1 space-y-4">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                      <FaImage className="text-blue-600" />
                      Preview do Banner
                    </h4>
                    <div className="bg-gray-900 rounded-lg p-6 h-96 overflow-y-auto">
                      <div className="space-y-4">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: editingBanner.gradientColor,
                            }}
                          ></div>
                          <span className="text-sm font-medium text-white uppercase tracking-wide">
                            {editingBanner.badgeText || "Madeiras Premium"}
                          </span>
                        </div>

                        {/* Título com Gradiente */}
                        <h2
                          className="text-2xl font-bold text-white leading-tight"
                          dangerouslySetInnerHTML={{
                            __html: applyGradientToTitle(
                              editingBanner.title || "Título do Banner",
                              editingBanner.gradientWord,
                              editingBanner.gradientColor
                            ),
                          }}
                        />

                        {/* Descrição */}
                        <p className="text-white/80 text-sm leading-relaxed">
                          {editingBanner.description ||
                            "Descrição do banner será exibida aqui."}
                        </p>

                        {/* Botões */}
                        <div className="flex flex-wrap gap-2 pt-4">
                          <button
                            className="px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2"
                            style={{
                              background:
                                "linear-gradient(135deg, #206E34, #70BD44)",
                            }}
                          >
                            {editingBanner.button1Text || "Botão 1"}
                            <FaLink className="text-xs opacity-70" />
                          </button>
                          <button className="bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium border border-white/30 flex items-center gap-2">
                            {editingBanner.button2Text || "Botão 2"}
                            <FaLink className="text-xs opacity-70" />
                          </button>
                        </div>

                        {/* Info dos Links */}
                        <div className="pt-4 border-t border-white/20">
                          <p className="text-white/60 text-xs">
                            <strong>Link Botão 1:</strong>{" "}
                            {editingBanner.button1Link}
                          </p>
                          <p className="text-white/60 text-xs">
                            <strong>Link Botão 2:</strong>{" "}
                            {editingBanner.button2Link}
                          </p>
                          {editingBanner.gradientWord && (
                            <p className="text-white/60 text-xs">
                              <strong>Palavra com gradiente:</strong>{" "}
                              {editingBanner.gradientWord}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Formulário de Edição */}
                  <div className="xl:col-span-2 space-y-6">
                    <h4 className="font-semibold text-gray-800">
                      Editar Conteúdo
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Coluna 1 */}
                      <div className="space-y-4">
                        {/* Badge Text */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Texto do Badge
                          </label>
                          <input
                            type="text"
                            value={editingBanner.badgeText}
                            onChange={(e) =>
                              handleEditChange("badgeText", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ex: Madeiras Premium"
                            maxLength={30}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Texto pequeno que aparece no badge (máx. 30
                            caracteres)
                          </p>
                        </div>

                        {/* Título */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Título Principal
                          </label>
                          <textarea
                            value={editingBanner.title}
                            onChange={(e) =>
                              handleEditChange("title", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            placeholder="Ex: O melhor em madeiras você encontra aqui!"
                            rows={3}
                            maxLength={100}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Título principal do banner (máx. 100 caracteres)
                          </p>
                        </div>

                        {/* Seleção de Palavra para Gradiente */}
                        {editingBanner.title && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                              <FaPalette className="text-purple-600" />
                              Palavra com Efeito Gradiente
                            </label>
                            <select
                              value={editingBanner.gradientWord}
                              onChange={(e) =>
                                handleEditChange("gradientWord", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            >
                              <option value="">Selecione uma palavra</option>
                              {getTitleWords(editingBanner.title).map(
                                (word, index) => (
                                  <option key={index} value={word}>
                                    {word}
                                  </option>
                                )
                              )}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                              Escolha qual palavra do título terá o efeito
                              colorido
                            </p>

                            {/* Seleção de Cor */}
                            {editingBanner.gradientWord && (
                              <div className="mt-3">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Cor do Gradiente
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                  {gradientColors.map((color, index) => (
                                    <button
                                      key={index}
                                      type="button"
                                      onClick={() =>
                                        handleEditChange(
                                          "gradientColor",
                                          color.value
                                        )
                                      }
                                      className={`p-3 rounded-lg border-2 transition-all ${
                                        editingBanner.gradientColor ===
                                        color.value
                                          ? "border-gray-800 scale-105"
                                          : "border-gray-300"
                                      }`}
                                      style={{ backgroundColor: color.value }}
                                      title={color.name}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Coluna 2 */}
                      <div className="space-y-4">
                        {/* Descrição */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descrição
                          </label>
                          <textarea
                            value={editingBanner.description}
                            onChange={(e) =>
                              handleEditChange("description", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            placeholder="Ex: Qualidade, variedade e atendimento especializado..."
                            rows={3}
                            maxLength={200}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Descrição do banner (máx. 200 caracteres)
                          </p>
                        </div>

                        {/* Botão 1 */}
                        <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <FaLink className="text-blue-600" />
                            Botão Principal (Verde)
                          </label>
                          <input
                            type="text"
                            value={editingBanner.button1Text}
                            onChange={(e) =>
                              handleEditChange("button1Text", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                            placeholder="Ex: Faça um orçamento"
                            maxLength={25}
                          />

                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Link do Botão
                          </label>
                          <select
                            value={editingBanner.button1Link}
                            onChange={(e) =>
                              handleEditChange("button1Link", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                          >
                            {commonLinks.map((link, index) => (
                              <option key={index} value={link.value}>
                                {link.label}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            value={editingBanner.button1Link}
                            onChange={(e) =>
                              handleEditChange("button1Link", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder="Ou digite um link personalizado"
                          />
                        </div>

                        {/* Botão 2 */}
                        <div className="space-y-3 p-4 bg-gray-200 rounded-lg border border-gray-200">
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <FaLink className="text-gray-600" />
                            Botão Secundário (Transparente)
                          </label>
                          <input
                            type="text"
                            value={editingBanner.button2Text}
                            onChange={(e) =>
                              handleEditChange("button2Text", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                            placeholder="Ex: Ver Produtos"
                            maxLength={25}
                          />

                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Link do Botão
                          </label>
                          <select
                            value={editingBanner.button2Link}
                            onChange={(e) =>
                              handleEditChange("button2Link", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                          >
                            {commonLinks.map((link, index) => (
                              <option key={index} value={link.value}>
                                {link.label}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            value={editingBanner.button2Link}
                            onChange={(e) =>
                              handleEditChange("button2Link", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder="Ou digite um link personalizado"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ações do Modal */}
              <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-200 rounded-b-xl sticky bottom-0">
                <button
                  onClick={cancelEditing}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-500 transition-colors font-medium disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveBannerTexts}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
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

        {/* Banners Existentes */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 slide-in-right">
            Banners Atuais ({banners.length})
          </h2>

          {banners.length === 0 ? (
            <div className="text-center py-12 bg-gray-200 rounded-xl border-2 border-dashed border-gray-300 gentle-pulse">
              <FaImage className="text-gray-400 text-4xl mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Nenhum banner cadastrado</p>
              <p className="text-gray-400 text-sm mt-1">
                Adicione o primeiro banner usando o formulário abaixo
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map((banner, index) => (
                <div
                  key={banner.id}
                  className="card-hover relative group bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
                >
                  {/* Imagem do Banner */}
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={banner.imageUrl}
                      alt={`Banner ${index + 1}`}
                      className="w-full h-48 object-cover"
                    />
                  </div>

                  {/* Informações do Banner */}
                  <div className="p-4">
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">
                          Badge:
                        </span>
                        <span className="text-xs text-gray-700 truncate ml-2">
                          {banner.badgeText || "Não definido"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">
                          Botão 1:
                        </span>
                        <span className="text-xs text-gray-700 truncate ml-2">
                          {banner.button1Text || "Não definido"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">
                          Botão 2:
                        </span>
                        <span className="text-xs text-gray-700 truncate ml-2">
                          {banner.button2Text || "Não definido"}
                        </span>
                      </div>
                      {banner.gradientWord && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-500">
                            Gradiente:
                          </span>
                          <span className="text-xs text-gray-700 truncate ml-2">
                            {banner.gradientWord}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Overlay com ações */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => startEditing(banner)}
                      className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors transform scale-90 group-hover:scale-100 gentle-bounce"
                      title="Editar textos e links"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => openDeleteModal(banner)}
                      className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors transform scale-90 group-hover:scale-100 gentle-bounce"
                      title="Excluir banner"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  {/* Badge de número */}
                  <div className="absolute top-3 left-3 bg-secondary text-white text-xs font-bold px-2 py-1 rounded-full">
                    #{index + 1}
                  </div>

                  {/* Indicador de textos personalizados */}
                  {(banner.badgeText ||
                    banner.title ||
                    banner.description ||
                    banner.button1Text ||
                    banner.button2Text ||
                    banner.gradientWord) && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Personalizado
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resto do código permanece igual (Adicionar Novo Banner e Estatísticas) */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 scale-in">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FaPlus className="text-green-600" />
            Adicionar Novo Banner
          </h2>

          <form onSubmit={handleAddBanner} className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <div className="flex-shrink-0">
                <label htmlFor="image" className="cursor-pointer block">
                  <div className="w-80 h-48 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-secondary transition-colors duration-300 bg-gray-200 flex items-center justify-center card-hover">
                    {newImage ? (
                      <img
                        src={URL.createObjectURL(newImage)}
                        alt="Preview"
                        className="w-full h-full object-cover fade-in"
                      />
                    ) : (
                      <div className="text-center p-6 gentle-pulse">
                        <FaUpload className="text-gray-400 text-3xl mx-auto mb-3" />
                        <p className="text-gray-600 font-medium">
                          Clique para selecionar
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          ou arraste uma imagem
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    onChange={(e) => setNewImage(e.target.files[0])}
                    type="file"
                    name="image"
                    id="image"
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex-1 space-y-4 slide-in-right">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 card-hover">
                  <div className="flex items-start gap-3">
                    <FaCircleExclamation className="text-blue-600 text-lg mt-0.5 flex-shrink-0 gentle-bounce" />
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">
                        Recomendações Técnicas
                      </h4>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Tamanho máximo: 9MB</li>
                        <li>• Largura ideal: 3150px - 3350px</li>
                        <li>• Altura ideal: 2000px - 2100px</li>
                        <li>• Formatos: JPG, PNG, WebP</li>
                        <li>• Proporção: 16:9 recomendado</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {newImage && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 fade-in">
                    <p className="text-green-700 text-sm font-medium">
                      ✅ Imagem selecionada: {newImage.name}
                    </p>
                    <p className="text-green-600 text-xs mt-1">
                      Tamanho: {(newImage.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={!newImage || isLoading}
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
                    Adicionar Banner
                  </>
                )}
              </button>

              {newImage && (
                <button
                  type="button"
                  onClick={() => {
                    setNewImage(null);
                    document.getElementById("image").value = "";
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-medium btn-hover-lift"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Estatísticas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4 fade-in">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 card-hover">
            <div className="text-2xl font-bold text-blue-600">
              {banners.length}
            </div>
            <div className="text-sm text-blue-800">Total de Banners</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 card-hover">
            <div className="text-2xl font-bold text-green-600">
              {
                banners.filter(
                  (b) =>
                    b.badgeText ||
                    b.title ||
                    b.description ||
                    b.button1Text ||
                    b.button2Text
                ).length
              }
            </div>
            <div className="text-sm text-green-800">
              Com Textos Personalizados
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 card-hover">
            <div className="text-2xl font-bold text-purple-600">
              {banners.length > 0 ? "Ativo" : "Inativo"}
            </div>
            <div className="text-sm text-purple-800">Status</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 card-hover">
            <div className="text-2xl font-bold text-orange-600">
              {banners.length}/10
            </div>
            <div className="text-sm text-orange-800">Limite de Banners</div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão (permanece igual) */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 modal-enter-active">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FaExclamationTriangle className="text-red-600 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Excluir Banner
                </h3>
              </div>
              <button
                onClick={closeDeleteModal}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={isDeleting}
              >
                <FaTimes className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Tem certeza que deseja excluir este banner?
              </p>
              <p className="text-sm text-gray-500">
                Esta ação não pode ser desfeita. O banner será removido
                permanentemente do sistema.
              </p>

              {deleteModal.banner && (
                <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <img
                      src={deleteModal.banner.imageUrl}
                      alt="Banner a ser excluído"
                      className="w-16 h-12 object-cover rounded"
                    />
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">
                        Banner #
                        {banners.findIndex(
                          (b) => b.id === deleteModal.banner.id
                        ) + 1}
                      </p>
                      <p className="text-xs text-red-500">
                        Será removido permanentemente
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 p-6 border-t border-green-200 bg-gray-200 rounded-b-xl">
              <button
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 text-white bg-green-600 border border-green-500 rounded-lg hover:bg-green-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteBanner}
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
                    Excluir Banner
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

export default UpdateHero;
