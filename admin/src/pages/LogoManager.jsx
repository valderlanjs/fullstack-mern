import React, { useState, useEffect } from "react";
import upload_icon from "../assets/upload_icon.png";
import axios from "axios";
import { backend_url } from "../App";
import { toast } from "react-toastify";
import { 
  FaCircleExclamation, 
  FaUpload,
  FaSpinner,
  FaImage,
  FaStore,
  FaFileImage
} from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import "../index.css";

const LogoManager = ({ token }) => {
  const [image, setImage] = useState(false);
  const [currentLogo, setCurrentLogo] = useState(null);
  const [altText, setAltText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogo = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/logo/active`);
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

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Por favor, selecione uma imagem.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      if (altText) {
        formData.append("altText", altText);
      }

      const response = await axios.post(
        `${backend_url}/api/logo/admin/upload`,
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Logo atualizada com sucesso! 🎉");
        fetchLogo();
        setImage(false);
        document.getElementById("image").value = "";
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Erro ao atualizar logo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      // Validar tamanho do arquivo (9MB máximo)
      if (selectedImage.size > 9 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 9MB");
        return;
      }
      setImage(selectedImage);
    }
  };

  const handleCancelUpload = () => {
    setImage(false);
    setAltText(currentLogo?.altText || "");
    document.getElementById("image").value = "";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto fade-in">
      {/* Header */}
      <div className="mb-8 slide-in-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <FaStore className="text-secondary" />
          Gerenciar Logo do Site
        </h1>
        <p className="text-gray-600">
          Atualize a logo principal exibida em todo o site
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Logo Atual */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 scale-in">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaImage className="text-blue-600" />
            Logo Atual
          </h2>
          
          {currentLogo ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img
                  src={currentLogo.imageUrl}
                  alt={currentLogo.altText}
                  className="w-48 h-48 object-contain ring-2 ring-gray-100 rounded-lg bg-white p-4 card-hover"
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCalendarAlt className="text-gray-400" />
                  <span>
                    Atualizada em: {new Date(currentLogo.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                
                {currentLogo.altText && (
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1">
                      Texto Alternativo:
                    </label>
                    <p className="text-gray-600 font-bold bg-gray-200 p-3 rounded-lg border border-gray-200 text-center">
                      {currentLogo.altText}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 gentle-pulse">
              <FaImage className="text-gray-400 text-4xl mx-auto mb-3" />
              <p className="text-gray-500">Nenhuma logo cadastrada</p>
              <p className="text-gray-400 text-sm mt-1">
                Faça o upload da primeira logo
              </p>
            </div>
          )}
        </div>

        {/* Upload da Nova Logo */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 scale-in">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FaUpload className="text-green-600" />
            Atualizar Logo
          </h2>

          <form onSubmit={onSubmitHandler} className="space-y-6">
            {/* Texto Alternativo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto Alternativo (SEO)
              </label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Ex: Logo da Minha Empresa - Soluções em Tecnologia"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
              />
              <p className="text-xs text-gray-500 mt-1">
                Descreva brevemente a logo para acessibilidade e SEO
              </p>
            </div>

            {/* Área de Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Nova Imagem da Logo *
              </label>
              
              <label htmlFor="image" className="cursor-pointer block">
                <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-secondary transition-colors duration-300 bg-gray-50 flex items-center justify-center card-hover">
                  {image ? (
                    <div className="w-full h-64 flex items-center justify-center p-4">
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Preview da nova logo"
                        className="max-w-full max-h-48 object-contain fade-in"
                      />
                    </div>
                  ) : (
                    <div className="text-center p-8 gentle-pulse">
                      <FaUpload className="text-gray-400 text-4xl mx-auto mb-4" />
                      <p className="text-gray-600 font-medium">Clique para selecionar a logo</p>
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

            {/* Informações da Nova Logo */}
            {image && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 fade-in">
                <div className="flex items-start gap-3">
                  <FaFileImage className="text-green-600 text-lg mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-800 mb-2">
                      Nova Logo Selecionada
                    </h4>
                    <div className="text-green-700 text-sm space-y-1">
                      <p><strong>Arquivo:</strong> {image.name}</p>
                      <p><strong>Tamanho:</strong> {(image.size / 1024 / 1024).toFixed(2)} MB</p>
                      <p><strong>Texto alternativo:</strong> {altText || "Não definido"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Informações Técnicas */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 card-hover">
              <div className="flex items-start gap-3">
                <FaCircleExclamation className="text-blue-600 text-lg mt-0.5 flex-shrink-0 gentle-bounce" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Recomendações Técnicas
                  </h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Tamanho máximo: 9MB</li>
                    <li>• Formatos recomendados: PNG, SVG, JPG</li>
                    <li>• Dimensões ideais: Quadrado (1:1)</li>
                    <li>• Tamanho sugerido: 200x200px a 500x500px</li>
                    <li>• Fundo transparente (PNG) para melhor versatilidade</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={!image || isLoading}
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
                    Atualizar Logo
                  </>
                )}
              </button>

              {image && (
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
            {currentLogo ? "1" : "0"}
          </div>
          <div className="text-sm text-blue-800">Logo Ativa</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200 card-hover">
          <div className="text-2xl font-bold text-green-600">
            {currentLogo ? "Ativa" : "Inativa"}
          </div>
          <div className="text-sm text-green-800">Status</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 card-hover">
          <div className="text-2xl font-bold text-purple-600">1</div>
          <div className="text-sm text-purple-800">Logo por Vez</div>
        </div>
      </div>
    </div>
  );
};

export default LogoManager;