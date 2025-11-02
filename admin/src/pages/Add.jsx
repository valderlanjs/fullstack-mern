import React, { useState } from "react";
import upload_icon from "../assets/upload_icon.png";
import axios from "axios";
import { backend_url } from "../App";
import { toast } from "react-toastify";
import { 
  FaUpload, 
  FaSpinner, 
  FaPlus,
  FaBox,
  FaImage,
  FaStar,
  FaCircleExclamation
} from "react-icons/fa6";
import "../index.css";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Madeira Bruta");
  const [subCategory, setSubCategory] = useState("Jatobá");
  const [popular, setPopular] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Função auxiliar para limpar o formulário
  const clearForm = () => {
    setName("");
    setCategory("Madeira Bruta");
    setSubCategory("Jatobá");
    setPopular(false);
    setImage1(false);
    setImage2(false);
    setImage3(false);
    setImage4(false);
    // Para remover a seleção de arquivos dos inputs
    document.getElementById("image1").value = "";
    document.getElementById("image2").value = "";
    document.getElementById("image3").value = "";
    document.getElementById("image4").value = "";
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    console.log("Botão clicado — tentativa de envio iniciada")

    if (!name || !image1) {
      toast.error("Por favor, preencha o nome e adicione a imagem principal.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("popular", popular);

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        `${backend_url}/api/product/add`,
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Produto adicionado com sucesso! 🎉");
        clearForm();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Ocorreu um erro ao adicionar o produto.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (setImageFunction, e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      if (selectedImage.size > 9 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 9MB");
        return;
      }
      setImageFunction(selectedImage);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto fade-in">
      {/* Header */}
      <div className="mb-8 slide-in-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <FaPlus className="text-secondary" />
          Adicionar Novo Produto
        </h1>
        <p className="text-gray-600">
          Cadastre novos produtos no catálogo com imagens e informações detalhadas
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 scale-in">
        <form onSubmit={onSubmitHandler} className="space-y-8">
          {/* Seção de Upload de Imagens */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaImage className="text-blue-600" />
              Imagens do Produto
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {[1, 2, 3, 4].map((num) => {
                const imageState = num === 1 ? image1 : num === 2 ? image2 : num === 3 ? image3 : image4;
                const setImageFunction = num === 1 ? setImage1 : num === 2 ? setImage2 : num === 3 ? setImage3 : setImage4;
                
                return (
                  <div key={num} className="text-center">
                    <label htmlFor={`image${num}`} className="cursor-pointer block">
                      <div className={`border-2 border-dashed rounded-xl p-4 transition-all duration-300 card-hover ${
                        imageState ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-300'
                      } ${num === 1 ? 'ring-2 ring-blue-200' : ''}`}>
                        {imageState ? (
                          <img
                            src={URL.createObjectURL(imageState)}
                            alt={`Preview ${num}`}
                            className="w-24 h-24 mx-auto object-cover rounded-lg fade-in"
                          />
                        ) : (
                          <div className="text-center gentle-pulse">
                            <FaUpload className="text-gray-400 text-2xl mx-auto mb-2" />
                            <p className="text-gray-600 text-sm font-medium">
                              {num === 1 ? 'Principal *' : `Opcional ${num}`}
                            </p>
                          </div>
                        )}
                      </div>
                      <input
                        onChange={(e) => handleImageChange(setImageFunction, e)}
                        type="file"
                        id={`image${num}`}
                        hidden
                        accept="image/*"
                      />
                    </label>
                    {imageState && (
                      <p className="text-xs text-gray-500 mt-2 truncate">
                        {(imageState.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Informações sobre imagens */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 card-hover">
              <div className="flex items-start gap-3">
                <FaCircleExclamation className="text-blue-600 text-lg mt-0.5 flex-shrink-0 gentle-bounce" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Recomendações de Imagens</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• <strong>Imagem 1 é obrigatória</strong> - será a imagem principal do produto</li>
                    <li>• Tamanho máximo por imagem: 9MB</li>
                    <li>• Formatos suportados: JPG, PNG, WebP</li>
                    <li>• Dimensões recomendadas: 800x600px ou quadrado</li>
                    <li>• Imagens 2, 3 e 4 são opcionais para galeria</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Informações do Produto */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaBox className="text-purple-600" />
              Informações do Produto
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Nome do Produto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Produto *
                </label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Ex: Tábua de Jatobá 2x30, Deck de Cumaru..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Categoria e Subcategoria */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <select
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200 bg-white"
                  >
                    <option value="Madeira Bruta">Madeira Bruta</option>
                    <option value="Pergolados">Pergolados</option>
                    <option value="Decks">Decks</option>
                    <option value="Cobertas">Cobertas</option>
                    <option value="Ripados">Ripados</option>
                    <option value="Esquadrias">Esquadrias</option>
                    <option value="Telhas">Telhas</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo do Produto *
                  </label>
                  <select
                    value={subCategory} 
                    onChange={(e) => setSubCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200 bg-white"
                  >
                    <option value="Jatobá">Jatobá</option>
                    <option value="Cumaru">Cumaru</option>
                    <option value="Ipê">Ipê</option>
                    <option value="Eucalípto">Eucalípto</option>
                    <option value="Eucalípto Tratado">Eucalípto Tratado</option>
                    <option value="Mista">Mista</option>
                    <option value="Pinus">Pinus</option>
                    <option value="Madeirite">Madeirite</option>
                    <option value="Maçaranduba">Maçaranduba</option>
                    <option value="Angelim Pedra">Angelim Pedra</option>
                    <option value="Brasilit">Brasilit</option>
                    <option value="PVC">PVC</option>
                    <option value="Pequí">Pequí</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Configurações Adicionais */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaStar className="text-yellow-600" />
              Configurações Adicionais
            </h2>
            
            <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg card-hover">
              <input
                onChange={() => setPopular((prev) => !prev)}
                type="checkbox"
                checked={popular}
                id="popular"
                className="w-5 h-5 text-secondary focus:ring-secondary rounded"
              />
              <label htmlFor="popular" className="cursor-pointer text-gray-700 font-medium flex items-center gap-2">
                <FaStar className="text-yellow-500" />
                Destacar como Produto Popular
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Produtos populares aparecem em destaque na página inicial e têm maior visibilidade.
            </p>
          </div>

          {/* Botão de Submit */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading || !name || !image1}
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
                  Adicionar Produto
                </>
              )}
            </button>

            {(name || image1 || image2 || image3 || image4) && (
              <button
                type="button"
                onClick={clearForm}
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
          <div className="text-2xl font-bold text-blue-600">1</div>
          <div className="text-sm text-blue-800">Imagem Obrigatória</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200 card-hover">
          <div className="text-2xl font-bold text-green-600">4</div>
          <div className="text-sm text-green-800">Imagens Máximas</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 card-hover">
          <div className="text-2xl font-bold text-purple-600">9MB</div>
          <div className="text-sm text-purple-800">Tamanho por Imagem</div>
        </div>
      </div>
    </div>
  );
};

export default Add;