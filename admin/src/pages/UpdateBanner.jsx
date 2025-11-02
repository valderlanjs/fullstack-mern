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
} from "react-icons/fa";
import "../index.css";

const UpdateBanner = ({ token }) => {
  const [image, setImage] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBannerImage = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/banner/image`);
      if (response.data.success && response.data.banner) {
        setCurrentBanner(response.data.banner);
        setImage(response.data.banner.imageUrl);
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
        document.getElementById("image").value = "";
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Erro ao atualizar banner.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      if (selectedImage.size > 9 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 9MB");
        return;
      }
      setImage(selectedImage);
    }
  };

  const handleCancelUpload = () => {
    setImage(currentBanner?.imageUrl || false);
    document.getElementById("image").value = "";
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
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 gentle-pulse">
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
                <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-secondary transition-colors duration-300 bg-gray-50 flex items-center justify-center card-hover">
                  {image && typeof image !== "string" ? (
                    <div className="w-full h-64 flex items-center justify-center p-4">
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Preview do novo banner"
                        className="max-w-full max-h-48 object-cover fade-in"
                      />
                    </div>
                  ) : image && typeof image === "string" ? (
                    <div className="text-center p-6">
                      <FaImage className="text-gray-400 text-4xl mx-auto mb-3" />
                      <p className="text-gray-600 font-medium">Banner atual carregado</p>
                      <p className="text-gray-400 text-sm mt-1">Selecione uma nova imagem para atualizar</p>
                    </div>
                  ) : (
                    <div className="text-center p-8 gentle-pulse">
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
            {image && typeof image !== "string" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 fade-in">
                <div className="flex items-start gap-3">
                  <FaFileImage className="text-green-600 text-lg mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-800 mb-2">
                      Nova Imagem Selecionada
                    </h4>
                    <div className="text-green-700 text-sm space-y-1">
                      <p><strong>Arquivo:</strong> {image.name}</p>
                      <p><strong>Tamanho:</strong> {(image.size / 1024 / 1024).toFixed(2)} MB</p>
                      <p><strong>Dimensões:</strong> Recomendado 3150x3000px</p>
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
                    <li>• Tamanho máximo: 9MB</li>
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
                disabled={isLoading || !image || typeof image === "string"}
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
          <div className="text-2xl font-bold text-purple-600">9MB</div>
          <div className="text-sm text-purple-800">Tamanho Máximo</div>
        </div>
      </div>
    </div>
  );
};

export default UpdateBanner;