import axios from "axios";
import api from "../api/axios.js"
import { backend_url } from "../App";
import { toast } from "react-toastify";
import { 
  FaUpload,
  FaSpinner,
  FaPlus,
  FaUserTie,
  FaEnvelope,
  FaWhatsapp,
  FaUser,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";

import { 
  FaCircleExclamation, 
} from "react-icons/fa6";
import "../index.css";
import { useState } from "react";

const AddVendor = ({ token }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [image, setImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState("");

  // Função para formatar o telefone automaticamente
  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    const limitedNumbers = numbers.slice(0, 11);
    
    if (limitedNumbers.length <= 2) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 7) {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`;
    } else {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 3)}${limitedNumbers.slice(3, 7)}-${limitedNumbers.slice(7, 11)}`;
    }
  };

  const handleWhatsappChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setWhatsapp(formatted);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!name || !email || !image) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (imageError) {
      toast.error("Por favor, corrija o erro na imagem antes de enviar.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      
      if (whatsapp) {
        const cleanWhatsapp = whatsapp.replace(/\D/g, '');
        formData.append("whatsapp", cleanWhatsapp);
      }
      
      formData.append("image", image);

      const response = await api.post(
        `${backend_url}/api/vendor/add`,
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Vendedor adicionado com sucesso! 🎉");
        setName("");
        setEmail("");
        setWhatsapp("");
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
        toast.error("Erro ao adicionar vendedor.");
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

  const handleCancel = () => {
    setName("");
    setEmail("");
    setWhatsapp("");
    setImage(false);
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
          <FaUserTie className="text-secondary" />
          Adicionar Novo Vendedor
        </h1>
        <p className="text-gray-600">
          Cadastre novos vendedores com informações de contato e foto
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 scale-in">
        <form onSubmit={onSubmitHandler} className="space-y-8">
          {/* Seção de Upload da Foto */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaUser className="text-blue-600" />
              Foto do Vendedor
            </h2>
            
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Área de Upload */}
              <div className="flex-shrink-0">
                <label htmlFor="image" className="cursor-pointer block">
                  <div className={`w-80 h-96 border-2 border-dashed rounded-xl overflow-hidden transition-all duration-300 bg-gray-200 flex items-center justify-center card-hover ${
                    imageError 
                      ? 'border-red-300 bg-red-50' 
                      : image 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-300 hover:border-secondary'
                  }`}>
                    {image ? (
                      <div className="relative w-full h-full">
                        <img
                          src={URL.createObjectURL(image)}
                          alt="Preview do vendedor"
                          className="w-full h-full object-cover fade-in"
                        />
                        {/* Indicador de sucesso */}
                        <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                          <FaCheckCircle size={20} />
                        </div>
                      </div>
                    ) : imageError ? (
                      <div className="text-center p-6">
                        <FaTimesCircle className="text-red-400 text-4xl mx-auto mb-4" />
                        <p className="text-red-600 font-medium">Erro na Imagem</p>
                        <p className="text-red-500 text-sm mt-1">{imageError}</p>
                        <p className="text-red-400 text-xs mt-2">Clique para tentar novamente</p>
                      </div>
                    ) : (
                      <div className="text-center p-6 gentle-pulse">
                        <FaUpload className="text-gray-400 text-4xl mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">Foto do Vendedor</p>
                        <p className="text-gray-400 text-sm mt-1">Clique para selecionar</p>
                        <p className="text-gray-400 text-xs mt-2">* Campo obrigatório</p>
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

              {/* Informações e Dicas */}
              <div className="flex-1 space-y-4 slide-in-right">
                {/* Informações da Imagem */}
                {image && !imageError && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 fade-in">
                    <div className="flex items-start gap-3">
                      <FaCheckCircle className="text-green-600 text-lg mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-green-800 mb-2">
                          Foto Válida ✓
                        </h4>
                        <div className="text-green-700 text-sm space-y-1">
                          <p><strong>Arquivo:</strong> {image.name}</p>
                          <p><strong>Tamanho:</strong> {formatFileSize(image.size)}</p>
                          <p><strong>Status:</strong> <span className="text-green-600">Pronta para upload</span></p>
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

                {/* Recomendações Técnicas */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 card-hover">
                  <div className="flex items-start gap-3">
                    <FaCircleExclamation className="text-blue-600 text-lg mt-0.5 flex-shrink-0 gentle-bounce" />
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">
                        Recomendações Técnicas
                      </h4>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• <strong>Tamanho máximo: 1MB</strong></li>
                        <li>• Largura ideal: 1300px - 1450px</li>
                        <li>• Altura ideal: 1800px - 1900px</li>
                        <li>• Formatos: JPG, PNG, WebP</li>
                        <li>• Proporção: Retrato recomendado</li>
                        <li>• Foto profissional com fundo neutro</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Informações do Vendedor */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaUserTie className="text-purple-600" />
              Informações do Vendedor
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="inline mr-2 text-gray-400" />
                  Nome Completo *
                </label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Ex: João Silva, Maria Santos..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaEnvelope className="inline mr-2 text-gray-400" />
                  Email *
                </label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder="Ex: vendedor@empresa.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaWhatsapp className="inline mr-2 text-gray-400" />
                  WhatsApp (Opcional)
                </label>
                <input
                  onChange={handleWhatsappChange}
                  value={whatsapp}
                  type="text"
                  placeholder="Ex: (11) 99999-9999"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                  maxLength={15}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">
                    Formato automático: (DDD) 9XXXX-XXXX
                  </p>
                  {whatsapp && (
                    <span className="text-xs text-gray-400">
                      {whatsapp.replace(/\D/g, '').length}/11 dígitos
                    </span>
                  )}
                </div>
              </div>

              {/* Espaço vazio para alinhamento */}
              <div></div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading || !name || !email || !image || imageError}
              className="btn-hover-lift bg-secondary text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Adicionando...
                </>
              ) : (
                <>
                  <FaPlus />
                  Adicionar Vendedor
                </>
              )}
            </button>

            {(name || email || whatsapp || image) && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-medium btn-hover-lift"
              >
                Limpar Formulário
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Estatísticas de Ajuda */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 fade-in">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 card-hover">
          <div className="text-2xl font-bold text-blue-600">3</div>
          <div className="text-sm text-blue-800">Campos Obrigatórios</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200 card-hover">
          <div className="text-2xl font-bold text-green-600">1MB</div>
          <div className="text-sm text-green-800">Tamanho Máximo</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 card-hover">
          <div className="text-2xl font-bold text-purple-600">11</div>
          <div className="text-sm text-purple-800">Dígitos WhatsApp</div>
        </div>
      </div>
    </div>
  );
};

export default AddVendor;