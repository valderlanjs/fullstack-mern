import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../api/axios.js"
import { backend_url } from "../App";
import { toast } from "react-toastify";
import {
  FaCircleExclamation,
  FaUpload,
  FaSpinner,
  FaImage,
  FaStore,
  FaFileImage,
   // NOVO ÍCONE
} from "react-icons/fa6";
import { 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaTimes, // NOVO ÍCONE
  FaInfoCircle,
  FaQuestionCircle,
} from "react-icons/fa";
import "../index.css";

const LogoManager = ({ token }) => {
  const [image, setImage] = useState(false);
  const [currentLogo, setCurrentLogo] = useState(null);
  const [altText, setAltText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState("");
  // NOVO STATE: Modal de instruções
  const [instructionsModal, setInstructionsModal] = useState(false);

  const fetchLogo = async () => {
    try {
      const response = await api.get(`${backend_url}/api/logo/active`);
      if (response.data.success && response.data.logo) {
        setCurrentLogo(response.data.logo);
        setAltText(response.data.logo.altText || "");
      }
    } catch (error) {
      console.error("Erro ao buscar logo:", error);
    }
  };

  useEffect(() => {
    fetchLogo();
  }, []);

  // NOVAS FUNÇÕES: Modal de instruções
  const openInstructionsModal = () => {
    setInstructionsModal(true);
  };

  const closeInstructionsModal = () => {
    setInstructionsModal(false);
  };

  // Função para calcular e formatar o tamanho
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Por favor, selecione uma imagem.");
      return;
    }

    // Verifica se há erro na imagem
    if (imageError) {
      toast.error("Por favor, corrija o erro na imagem antes de enviar.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      if (altText) {
        formData.append("altText", altText);
      }

      const response = await api.post(
        `${backend_url}/api/logo/admin/upload`,
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Logo atualizada com sucesso! 🎉");
        fetchLogo();
        setImage(false);
        setImageError("");
        document.getElementById("image").value = "";
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Erro ao atualizar logo");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Validação de imagem
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImageError("");

    if (selectedImage) {
      // Validação de tamanho (1MB)
      if (selectedImage.size > 1 * 1024 * 1024) {
        setImageError("A imagem deve ter no máximo 1MB");
        setImage(false);
        return;
      }

      // Validação do tipo de arquivo
      if (!selectedImage.type.startsWith("image/")) {
        setImageError("Por favor, selecione um arquivo de imagem válido");
        setImage(false);
        return;
      }

      setImage(selectedImage);
      setImageError("");
    }
  };

  const handleCancelUpload = () => {
    setImage(false);
    setImageError("");
    setAltText(currentLogo?.altText || "");
    document.getElementById("image").value = "";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto fade-in">
      {/* Header */}
      <div className="mb-8 slide-in-left">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <FaStore className="text-purple-600" />
              Gerenciar Logo do Site
            </h1>
            <p className="text-gray-600">
              Atualize a logo principal exibida em todo o site
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

      {/* MODAL DE INSTRUÇÕES - NOVO */}
      {instructionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 modal-enter-active">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto transform transition-all duration-300 scale-100">
            {/* Header do Modal de Instruções */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                  <FaQuestionCircle className="text-purple-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Instruções - Gerenciamento de Logo
                  </h3>
                  <p className="text-sm text-gray-500">
                    Guia completo para atualizar a logo do site
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
            <div className="p-6 space-y-4">
              {/* Seção 1: Importância da Logo */}
              <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FaInfoCircle className="text-blue-600" />
                  1. Importância da Logo
                </h4>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>A logo é a identidade visual da sua marca e aparece em:</p>
                  <ul className="list-disc list-inside ml-4">
                    <li>Header do site</li>
                    <li>Footer</li>
                    <li>Páginas internas</li>
                    <li>Materiais de marketing</li>
                  </ul>
                </div>
              </section>

              {/* Seção 2: Requisitos Técnicos */}
              <section className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <FaImage className="text-green-600" />
                  2. Requisitos Técnicos
                </h4>
                <div className="text-sm text-green-700 space-y-1">
                  <ul className="list-disc list-inside ml-4">
                    <li><strong>Tamanho máximo:</strong> 1MB</li>
                    <li><strong>Formatos:</strong> PNG, SVG, JPG, WebP</li>
                    <li><strong>Dimensões:</strong> Quadrado (1:1) recomendado</li>
                    <li><strong>Tamanho ideal:</strong> 200x200px a 500x500px</li>
                    <li><strong>Fundo transparente:</strong> PNG recomendado</li>
                  </ul>
                </div>
              </section>

              {/* Seção 3: Texto Alternativo */}
              <section className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                  <FaFileImage className="text-orange-600" />
                  3. Texto Alternativo (SEO)
                </h4>
                <div className="text-sm text-orange-700">
                  <p>Descreva sua logo para:</p>
                  <ul className="list-disc list-inside ml-4">
                    <li>Melhorar acessibilidade</li>
                    <li>Otimizar SEO</li>
                    <li>Exemplo: "Logo Madeira Nobre - Madeiras de Qualidade"</li>
                  </ul>
                </div>
              </section>
            </div>

            {/* Rodapé do Modal */}
            <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logo Atual - COMPACTADO */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm border border-gray-200 p-5 scale-in hover:shadow-md transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaImage className="text-blue-600" />
            Logo Atual
          </h2>

          {currentLogo ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img
                  src={currentLogo.imageUrl}
                  alt={currentLogo.altText}
                  className="w-32 h-32 object-contain ring-2 ring-gray-100 rounded-lg bg-white p-3 card-hover"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <FaCalendarAlt className="text-gray-400" />
                  <span>
                    Atualizada em:{" "}
                    {new Date(currentLogo.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>

                {currentLogo.altText && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Texto Alternativo:
                    </label>
                    <p className="text-gray-600 text-sm bg-gray-100 p-2 rounded-lg border border-gray-200 text-center">
                      {currentLogo.altText}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border-2 border-dashed border-gray-300 gentle-pulse">
              <FaImage className="text-gray-400 text-3xl mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Nenhuma logo cadastrada</p>
              <p className="text-gray-400 text-xs mt-1">
                Faça o upload da primeira logo
              </p>
            </div>
          )}
        </div>

        {/* Upload da Nova Logo - COMPACTADO */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm border border-gray-200 p-5 scale-in hover:shadow-md transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaUpload className="text-green-500" />
            Atualizar Logo
          </h2>

          <form onSubmit={onSubmitHandler} className="space-y-4">
            {/* Texto Alternativo */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Texto Alternativo (SEO)
              </label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Ex: Logo Madeira Nobre - Madeiras de Qualidade"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              />
              <p className="text-xs text-gray-500 mt-1">
                Descreva a logo para acessibilidade e SEO
              </p>
            </div>

            {/* Área de Upload - COMPACTADA */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Nova Imagem da Logo *
              </label>

              <label htmlFor="image" className="cursor-pointer block">
                <div
                  className={`border-2 border-dashed rounded-lg overflow-hidden transition-all duration-300 flex items-center justify-center card-hover transform hover:scale-[1.02] ${
                    imageError
                      ? "border-red-300 bg-red-50"
                      : image
                      ? "border-green-300 bg-green-50"
                      : "border-gray-300 hover:border-purple-400 bg-gray-50"
                  }`}
                >
                  {image ? (
                    <div className="w-full h-40 flex items-center justify-center p-3 relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Preview da nova logo"
                        className="max-w-full max-h-32 object-contain fade-in"
                      />
                      {/* Indicador de sucesso */}
                      <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 shadow-md">
                        <FaCheckCircle size={14} />
                      </div>
                    </div>
                  ) : imageError ? (
                    <div className="text-center p-4">
                      <FaTimesCircle className="text-red-400 text-2xl mx-auto mb-2" />
                      <p className="text-red-600 text-sm font-medium">Erro na Imagem</p>
                      <p className="text-red-500 text-xs mt-1">{imageError}</p>
                    </div>
                  ) : (
                    <div className="text-center p-6 gentle-pulse">
                      <FaUpload className="text-gray-400 text-2xl mx-auto mb-2" />
                      <p className="text-gray-600 font-medium text-sm">
                        Clique para selecionar
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        ou arraste uma imagem
                      </p>
                    </div>
                  )}
                </div>
                <input
                  onChange={handleImageChange}
                  type="file"
                  name="image"
                  id="image"
                  accept="image/*"
                  className="hidden"
                />
              </label>
            </div>

            {/* Informações da Nova Logo - COMPACTADO */}
            {image && !imageError && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 fade-in">
                <div className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-600 text-sm mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-800 text-sm mb-1">
                      Logo Válida ✓
                    </h4>
                    <div className="text-green-700 text-xs space-y-0.5">
                      <p><strong>Arquivo:</strong> {image.name.length > 20 ? image.name.substring(0, 20) + "..." : image.name}</p>
                      <p><strong>Tamanho:</strong> {formatFileSize(image.size)}</p>
                      <p><strong>Status:</strong> <span className="text-green-600">Pronta para upload</span></p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mensagem de Erro - COMPACTADO */}
            {imageError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 fade-in">
                <div className="flex items-start gap-2">
                  <FaTimesCircle className="text-red-600 text-sm mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-800 text-sm mb-1">
                      Problema na Imagem
                    </h4>
                    <div className="text-red-700 text-xs">
                      <p>{imageError}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Informações Técnicas - COMPACTADO */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <FaCircleExclamation className="text-purple-600 text-sm mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">
                    Recomendações Técnicas
                  </h4>
                  <ul className="text-gray-700 text-xs space-y-0.5">
                    <li>• <strong>Tamanho máximo: 1MB</strong></li>
                    <li>• Formatos: PNG, SVG, JPG, WebP</li>
                    <li>• Dimensões: Quadrado (1:1) recomendado</li>
                    <li>• PNG com fundo transparente é ideal</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Botões de Ação - COMPACTADO */}
            <div className="flex gap-2 pt-3">
              <button
                type="submit"
                disabled={!image || isLoading || imageError}
                className="flex-1 btn-hover-lift bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm shadow-md"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  <>
                    <FaUpload />
                    Atualizar Logo
                  </>
                )}
              </button>

              {image && (
                <button
                  type="button"
                  onClick={handleCancelUpload}
                  disabled={isLoading}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-medium btn-hover-lift text-sm"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Estatísticas - COMPACTADO */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 fade-in">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200 card-hover text-center">
          <div className="text-xl font-bold text-blue-600">
            {currentLogo ? "1" : "0"}
          </div>
          <div className="text-xs text-blue-800 font-medium">Logo Ativa</div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg border border-green-200 card-hover text-center">
          <div className="text-xl font-bold text-green-600">1MB</div>
          <div className="text-xs text-green-800 font-medium">Tamanho Máx.</div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200 card-hover text-center">
          <div className="text-xl font-bold text-purple-600">1</div>
          <div className="text-xs text-purple-800 font-medium">Logo por Vez</div>
        </div>
      </div>
    </div>
  );
};

export default LogoManager;