import axios from "axios";
import { backend_url } from "../App";
import { toast } from "react-toastify";
import { 
  FaCircleExclamation, 
  FaUpload,
  FaSpinner,
  FaPlus,
  FaUserTie,
  FaEnvelope,
  FaWhatsapp,
  FaUser
} from "react-icons/fa6";
import "../index.css";
import { useState } from "react";

const AddVendor = ({ token }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [image, setImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Função para formatar o telefone automaticamente
  const formatPhoneNumber = (value) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 11 caracteres (DDD + 9 dígitos)
    const limitedNumbers = numbers.slice(0, 11);
    
    // Aplica a formatação
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

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      
      // Envia apenas os números do WhatsApp (remove formatação)
      if (whatsapp) {
        const cleanWhatsapp = whatsapp.replace(/\D/g, '');
        formData.append("whatsapp", cleanWhatsapp);
      }
      
      formData.append("image", image);

      const response = await axios.post(
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
        document.getElementById("image").value = "";
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Erro ao adicionar vendedor.");
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

  const handleCancel = () => {
    setName("");
    setEmail("");
    setWhatsapp("");
    setImage(false);
    document.getElementById("image").value = "";
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
                  <div className="w-80 h-96 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-secondary transition-colors duration-300 bg-gray-50 flex items-center justify-center card-hover">
                    {image ? (
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Preview do vendedor"
                        className="w-full h-full object-cover fade-in"
                      />
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
                {image && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 fade-in">
                    <div className="flex items-start gap-3">
                      <FaUser className="text-green-600 text-lg mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-green-800 mb-2">
                          Foto Selecionada
                        </h4>
                        <div className="text-green-700 text-sm space-y-1">
                          <p><strong>Arquivo:</strong> {image.name}</p>
                          <p><strong>Tamanho:</strong> {(image.size / 1024 / 1024).toFixed(2)} MB</p>
                          <p><strong>Dimensões:</strong> Recomendado 1300x1800px</p>
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
                        <li>• Tamanho máximo: 9MB</li>
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
                  maxLength={15} // (11) 99999-9999 = 15 caracteres
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
              disabled={isLoading || !name || !email || !image}
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
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 font-medium btn-hover-lift"
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
          <div className="text-2xl font-bold text-green-600">9MB</div>
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