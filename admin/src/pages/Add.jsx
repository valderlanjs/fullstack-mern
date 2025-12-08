import React, { useState } from "react";
import api from "../api/axios.js";
import { toast } from "react-toastify";
import {
  FaUpload,
  FaSpinner,
  FaPlus,
  FaBox,
  FaImage,
  FaStar,
  FaCircleExclamation,
} from "react-icons/fa6";

import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "../index.css";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [popular, setPopular] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");

  // Estados para erros de imagem
  const [image1Error, setImage1Error] = useState("");
  const [image2Error, setImage2Error] = useState("");
  const [image3Error, setImage3Error] = useState("");
  const [image4Error, setImage4Error] = useState("");

  const clearForm = () => {
    setName("");
    setDescription("");
    setCategory("");
    setSubCategory("");
    setPopular(false);
    setImage1(false);
    setImage2(false);
    setImage3(false);
    setImage4(false);
    setImage1Error("");
    setImage2Error("");
    setImage3Error("");
    setImage4Error("");
    document.getElementById("image1").value = "";
    document.getElementById("image2").value = "";
    document.getElementById("image3").value = "";
    document.getElementById("image4").value = "";
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!name || !category || !subCategory || !image1) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Verifica se há erros nas imagens
    if (image1Error || image2Error || image3Error || image4Error) {
      toast.error("Por favor, corrija os erros nas imagens antes de enviar.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("popular", popular);

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await api.post(`/api/product/add`, formData, {
        headers: { token },
      });

      if (response.data.success) {
        toast.success("Produto adicionado com sucesso! 🎉");
        clearForm();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => {
          toast.error(`${err.field}: ${err.message}`);
        });
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Ocorreu um erro ao adicionar o produto.");
      }
    } finally {
      setIsLoading(false);
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

  const handleImageChange = (
    setImageFunction,
    setErrorFunction,
    imageNumber,
    e
  ) => {
    const selectedImage = e.target.files[0];
    setErrorFunction(""); // Limpa erros anteriores

    if (selectedImage) {
      // Validação de tamanho (1MB) - IGUAL AO MODELO DE VENDEDORES
      if (selectedImage.size > 1 * 1024 * 1024) {
        setErrorFunction("A imagem deve ter no máximo 1MB");
        setImageFunction(false);
        return;
      }

      // Validação do tipo de arquivo
      if (!selectedImage.type.startsWith("image/")) {
        setErrorFunction("Por favor, selecione um arquivo de imagem válido");
        setImageFunction(false);
        return;
      }

      setImageFunction(selectedImage);
      setErrorFunction("");
    }
  };

  // Componente para exibir cada campo de imagem
  const ImageUploadField = ({
    number,
    image,
    setImage,
    error,
    setError,
    isRequired,
  }) => {
    const imageState =
      number === 1
        ? image1
        : number === 2
        ? image2
        : number === 3
        ? image3
        : image4;
    const setImageFunction =
      number === 1
        ? setImage1
        : number === 2
        ? setImage2
        : number === 3
        ? setImage3
        : setImage4;
    const setErrorFunction =
      number === 1
        ? setImage1Error
        : number === 2
        ? setImage2Error
        : number === 3
        ? setImage3Error
        : setImage4Error;

    return (
      <div className="text-center">
        <label htmlFor={`image${number}`} className="cursor-pointer block">
          <div
            className={`border-2 border-dashed rounded-xl p-4 transition-all duration-300 card-hover h-32 flex items-center justify-center ${
              error
                ? "border-red-300 bg-red-50"
                : imageState
                ? "border-green-300 bg-green-50"
                : "border-gray-300 hover:border-secondary"
            } ${isRequired ? "ring-2 ring-blue-200" : ""}`}
          >
            {imageState ? (
              <div className="relative w-full h-full">
                <img
                  src={URL.createObjectURL(imageState)}
                  alt={`Preview ${number}`}
                  className="w-full h-full object-cover rounded-lg fade-in"
                />
                {/* Indicador de sucesso */}
                <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-1">
                  <FaCheckCircle size={14} />
                </div>
              </div>
            ) : error ? (
              <div className="text-center p-2">
                <FaTimesCircle className="text-red-400 text-xl mx-auto mb-1" />
                <p className="text-red-600 text-xs font-medium">Erro</p>
                <p className="text-red-500 text-xs mt-1">{error}</p>
              </div>
            ) : (
              <div className="text-center gentle-pulse">
                <FaUpload className="text-gray-400 text-xl mx-auto mb-2" />
                <p className="text-gray-600 text-sm font-medium">
                  {isRequired ? "Principal *" : `Opcional ${number}`}
                </p>
              </div>
            )}
          </div>
          <input
            onChange={(e) =>
              handleImageChange(setImageFunction, setErrorFunction, number, e)
            }
            type="file"
            id={`image${number}`}
            hidden
            accept="image/*"
          />
        </label>
        {imageState && (
          <div className="mt-2 text-center">
            <p
              className="text-xs text-gray-500 truncate"
              title={imageState.name}
            >
              {imageState.name.length > 15
                ? imageState.name.substring(0, 15) + "..."
                : imageState.name}
            </p>
            <p className="text-xs text-gray-400">
              {formatFileSize(imageState.size)}
            </p>
          </div>
        )}
        {error && (
          <p className="text-xs text-red-500 mt-1 text-center">{error}</p>
        )}
      </div>
    );
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
          Cadastre novos produtos no catálogo com categorias e tipos
          personalizados
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 scale-in">
        <form onSubmit={onSubmitHandler} className="space-y-8">
          {/* Seção de Upload de Imagens - ATUALIZADA */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaImage className="text-blue-600" />
              Imagens do Produto
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <ImageUploadField
                number={1}
                image={image1}
                setImage={setImage1}
                error={image1Error}
                setError={setImage1Error}
                isRequired={true}
              />
              <ImageUploadField
                number={2}
                image={image2}
                setImage={setImage2}
                error={image2Error}
                setError={setImage2Error}
                isRequired={false}
              />
              <ImageUploadField
                number={3}
                image={image3}
                setImage={setImage3}
                error={image3Error}
                setError={setImage3Error}
                isRequired={false}
              />
              <ImageUploadField
                number={4}
                image={image4}
                setImage={setImage4}
                error={image4Error}
                setError={setImage4Error}
                isRequired={false}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 card-hover">
              <div className="flex items-start gap-3">
                <FaCircleExclamation className="text-blue-600 text-lg mt-0.5 flex-shrink-0 gentle-bounce" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Recomendações de Imagens
                  </h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>
                      • <strong>Imagem 1 é obrigatória</strong> - será a imagem
                      principal do produto
                    </li>
                    <li>
                      • <strong>Tamanho máximo por imagem: 1MB</strong>
                    </li>
                    <li>• Formatos suportados: JPG, PNG, WebP</li>
                    <li>• Imagens de alta qualidade com boa iluminação</li>
                    <li>• Diferentes ângulos do produto são recomendados</li>
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

              {/* Descrição do Produto */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição do Produto (Opcional)
                </label>
                <textarea
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  placeholder="Descreva o produto com detalhes, características técnicas, dimensões, etc. Deixe em branco para usar descrição padrão."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Máximo 2000 caracteres. Se não preencher, será usada uma
                  descrição padrão na página do produto.
                </p>
              </div>

              {/* Categoria e Subcategoria */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    type="text"
                    placeholder="Ex: Madeira Bruta, Decks, Telhas..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Esta categoria aparecerá para os clientes filtrarem
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo do Produto *
                  </label>
                  <input
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    type="text"
                    placeholder="Ex: Jatobá, Cumaru, Ipê, PVC..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Este tipo aparecerá para os clientes filtrarem
                  </p>
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
              <label
                htmlFor="popular"
                className="cursor-pointer text-gray-700 font-medium flex items-center gap-2"
              >
                <FaStar className="text-yellow-500" />
                Destacar como Produto Popular
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Produtos populares aparecem em destaque na página inicial.
            </p>
          </div>

          {/* Botão de Submit */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={
                isLoading ||
                !name ||
                !category ||
                !subCategory ||
                !image1 ||
                image1Error ||
                image2Error ||
                image3Error ||
                image4Error
              }
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

            {(name ||
              category ||
              subCategory ||
              image1 ||
              image2 ||
              image3 ||
              image4) && (
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

      {/* Informações atualizadas */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 fade-in">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 card-hover">
          <div className="text-2xl font-bold text-blue-600">4</div>
          <div className="text-sm text-blue-800">Campos Obrigatórios</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200 card-hover">
          <div className="text-2xl font-bold text-green-600">1MB</div>
          <div className="text-sm text-green-800">Tamanho Máximo</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 card-hover">
          <div className="text-2xl font-bold text-purple-600">4</div>
          <div className="text-sm text-purple-800">Imagens Máximas</div>
        </div>
      </div>
    </div>
  );
};

export default Add;
