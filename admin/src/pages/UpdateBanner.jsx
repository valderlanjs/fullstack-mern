import React, { useState, useEffect } from "react";
import upload_icon from "../assets/upload_icon.png";
import axios from "axios";
import { backend_url } from "../App";
import { toast } from "react-toastify";
import { 
  FaUpload,
  FaSpinner,
  FaImage,
  FaFileImage
} from "react-icons/fa6";
import { 
  FaExclamationCircle,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";
import "../index.css";

const UpdateBanner = ({ token }) => {
  const [image, setImage] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState("");

  const fetchBannerImage = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/banner/image`);
      if (response.data.success && response.data.banner) {
        setCurrentBanner(response.data.banner);
        setImage(response.data.banner.imageUrl);
        setImageError(""); // Limpa erros ao carregar banner atual
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBannerImage();
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!image || typeof image === "string") {
      toast.error("Por favor, selecione uma nova imagem para atualizar.");
      return;
    }

    if (imageError) {
      toast.error("Por favor, corrija o erro na imagem antes de enviar.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await axios.post(
        `${backend_url}/api/banner/update`,
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Banner atualizado com sucesso! 🎉");
        fetchBannerImage();
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
        toast.error("Erro ao atualizar banner.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImageError(""); // Limpa erros anteriores

    if (selectedImage) {
      // Validação de tamanho (1MB)
      if (selectedImage.size > 1 * 1024 * 1024) {
        setImageError("A imagem deve ter no máximo 1MB");
        setImage(false);
        return;
      }

      // Validação do tipo de arquivo
      if (!selectedImage.type.startsWith('image/')) {
        setImageError("Por favor, selecione um arquivo de imagem válido");
        setImage(false);
        return;
      }

      setImage(selectedImage);
      setImageError("");
    }
  };

  const handleCancelUpload = () => {
    setImage(currentBanner?.imageUrl || false);
    setImageError("");
    document.getElementById("image").value = "";
  };

  // Função para calcular e formatar o tamanho
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6 max-w-4xl mx-auto fade-in">
      {/* Header */}
      <div className="mb-8 slide-in-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <FaImage className="text-secondary" />
          Gerenciar Banner de Contato
        </h1>
        <p className="text-gray-600">
          Atualize o banner exibido na seção de contato do site
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Banner Atual */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 scale-in">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaImage className="text-blue-600" />
            Banner Atual
          </h2>
          
          {currentBanner ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img
                  src={currentBanner.imageUrl}
                  alt="Banner de contato atual"
                  className="w-full max-w-md h-64 object-cover ring-2 ring-gray-100 rounded-lg bg-white card-hover"
                />
              </div>
              
              
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-200 rounded-lg border-2 border-dashed border-gray-300 gentle-pulse">
              <FaImage className="text-gray-400 text-4xl mx-auto mb-3" />
              <p className="text-gray-500">Nenhum banner cadastrado</p>
              <p className="text-gray-400 text-sm mt-1">
                Faça o upload do primeiro banner
              </p>
            </div>
          )}
        </div>

        {/* Atualizar Banner */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 scale-in">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FaUpload className="text-green-600" />
            Atualizar Banner
          </h2>

          <form onSubmit={onSubmitHandler} className="space-y-6">
            {/* Área de Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Nova Imagem do Banner *
              </label>
              
              <label htmlFor="image" className="cursor-pointer block">
                <div className={`border-2 border-dashed rounded-xl overflow-hidden transition-all duration-300 bg-gray-200 flex items-center justify-center card-hover ${
                  imageError 
                    ? 'border-red-300 bg-red-50' 
                    : image && typeof image !== "string"
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-300 hover:border-secondary'
                }`}>
                  {image && typeof image !== "string" ? (
                    <div className="w-full h-64 flex flex-col items-center justify-center p-4 relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Preview do novo banner"
                        className="max-w-full max-h-40 object-cover fade-in mb-2"
                      />
                      {/* Indicador de sucesso */}
                      <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                        <FaCheckCircle size={16} />
                      </div>
                      <p className="text-green-600 text-sm font-medium mt-2">
                        Imagem válida ✓
                      </p>
                    </div>
                  ) : imageError ? (
                    <div className="text-center p-6 w-full h-64 flex flex-col items-center justify-center">
                      <FaTimesCircle className="text-red-400 text-4xl mx-auto mb-3" />
                      <p className="text-red-600 font-medium">Erro na Imagem</p>
                      <p className="text-red-500 text-sm mt-1 text-center">{imageError}</p>
                      <p className="text-red-400 text-xs mt-2">Clique para tentar novamente</p>
                    </div>
                  ) : image && typeof image === "string" ? (
                    <div className="text-center p-6 w-full h-64 flex flex-col items-center justify-center">
                      <FaImage className="text-gray-400 text-4xl mx-auto mb-3" />
                      <p className="text-gray-600 font-medium">Banner atual carregado</p>
                      <p className="text-gray-400 text-sm mt-1">Selecione uma nova imagem para atualizar</p>
                    </div>
                  ) : (
                    <div className="text-center p-8 w-full h-64 flex flex-col items-center justify-center gentle-pulse">
                      <FaUpload className="text-gray-400 text-4xl mx-auto mb-4" />
                      <p className="text-gray-600 font-medium">Clique para selecionar o banner</p>
                      <p className="text-gray-400 text-sm mt-1">ou arraste uma imagem</p>
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

            {/* Informações da Nova Imagem */}
            {image && typeof image !== "string" && !imageError && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 fade-in">
                <div className="flex items-start gap-3">
                  <FaFileImage className="text-green-600 text-lg mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-800 mb-2">
                      Nova Imagem Selecionada ✓
                    </h4>
                    <div className="text-green-700 text-sm space-y-1">
                      <p><strong>Arquivo:</strong> {image.name}</p>
                      <p><strong>Tamanho:</strong> {formatFileSize(image.size)}</p>
                      <p><strong>Status:</strong> <span className="text-green-600">Pronta para upload</span></p>
                      <p><strong>Dimensões:</strong> Recomendado 3150x3000px</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mensagem de Erro */}
            {imageError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 fade-in">
                <div className="flex items-start gap-3">
                  <FaTimesCircle className="text-red-600 text-lg mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-800 mb-2">
                      Problema na Imagem
                    </h4>
                    <div className="text-red-700 text-sm">
                      <p>{imageError}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Informações Técnicas */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 card-hover">
              <div className="flex items-start gap-3">
                <FaExclamationCircle className="text-blue-600 text-lg mt-0.5 flex-shrink-0 gentle-bounce" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Recomendações Técnicas
                  </h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• <strong>Tamanho máximo: 1MB</strong></li>
                    <li>• Largura ideal: 3150px - 3350px</li>
                    <li>• Altura ideal: 3000px - 3100px</li>
                    <li>• Formatos: JPG, PNG, WebP</li>
                    <li>• Proporção: Retrato recomendado</li>
                    <li>• Alta qualidade para melhor visualização</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading || !image || typeof image === "string" || imageError}
                className="btn-hover-lift bg-secondary text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  <>
                    <FaUpload />
                    Atualizar Banner
                  </>
                )}
              </button>

              {image && typeof image !== "string" && (
                <button
                  type="button"
                  onClick={handleCancelUpload}
                  disabled={isLoading}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 font-medium btn-hover-lift"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 fade-in">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 card-hover">
          <div className="text-2xl font-bold text-blue-600">
            {currentBanner ? "1" : "0"}
          </div>
          <div className="text-sm text-blue-800">Banner Ativo</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200 card-hover">
          <div className="text-2xl font-bold text-green-600">
            {currentBanner ? "Ativo" : "Inativo"}
          </div>
          <div className="text-sm text-green-800">Status</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 card-hover">
          <div className="text-2xl font-bold text-purple-600">1MB</div>
          <div className="text-sm text-purple-800">Tamanho Máximo</div>
        </div>
      </div>
    </div>
  );
};

export default UpdateBanner;