import React, { useEffect, useState } from "react";
import upload_icon from "../assets/upload_icon.png";
import axios from "axios";
import { backend_url } from "../App";
import { toast } from "react-toastify";
import { 
  FaCircleExclamation, 
  FaTrash, 
  FaPlus,
  FaImage,
  FaUpload,
  FaSpinner,
  
} from "react-icons/fa6";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";
import "../index.css";

const UpdateHero = ({ token }) => {
  const [banners, setBanners] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    banner: null
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

      const response = await axios.post(`${backend_url}/api/hero/add`, formData, {
        headers: { token },
      });

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
      banner: banner
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      banner: null
    });
  };

  const handleDeleteBanner = async () => {
    if (!deleteModal.banner) return;

    setIsDeleting(deleteModal.banner.id);
    try {
      const response = await axios.delete(`${backend_url}/api/hero/${deleteModal.banner.id}`, {
        headers: { token },
      });

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

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto fade-in">
        {/* Header */}
        <div className="mb-8 slide-in-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <FaImage className="text-secondary" />
            Gerenciar Banners da Home
          </h1>
          <p className="text-gray-600">
            Adicione e gerencie os banners exibidos na página inicial
          </p>
        </div>

        {/* Banners Existentes */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 slide-in-right">
            Banners Atuais ({banners.length})
          </h2>
          
          {banners.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 gentle-pulse">
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
                  
                  {/* Overlay com ações */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => openDeleteModal(banner)}
                      className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors transform scale-90 group-hover:scale-100 gentle-bounce"
                    >
                      <FaTrash />
                    </button>
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

        {/* Adicionar Novo Banner */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 scale-in">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FaPlus className="text-green-600" />
            Adicionar Novo Banner
          </h2>

          <form onSubmit={handleAddBanner} className="space-y-6">
            {/* Área de Upload */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Preview da Imagem */}
              <div className="flex-shrink-0">
                <label htmlFor="image" className="cursor-pointer block">
                  <div className="w-80 h-48 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-secondary transition-colors duration-300 bg-gray-50 flex items-center justify-center card-hover">
                    {newImage ? (
                      <img
                        src={URL.createObjectURL(newImage)}
                        alt="Preview"
                        className="w-full h-full object-cover fade-in"
                      />
                    ) : (
                      <div className="text-center p-6 gentle-pulse">
                        <FaUpload className="text-gray-400 text-3xl mx-auto mb-3" />
                        <p className="text-gray-600 font-medium">Clique para selecionar</p>
                        <p className="text-gray-400 text-sm mt-1">ou arraste uma imagem</p>
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

              {/* Informações e Dicas */}
              <div className="flex-1 space-y-4 slide-in-right">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 card-hover">
                  <div className="flex items-start gap-3">
                    <FaCircleExclamation className="text-blue-600 text-lg mt-0.5 flex-shrink-0 gentle-bounce" />
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">Recomendações Técnicas</h4>
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

            {/* Botão de Submit */}
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
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 font-medium btn-hover-lift"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Estatísticas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 fade-in">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 card-hover">
            <div className="text-2xl font-bold text-blue-600">{banners.length}</div>
            <div className="text-sm text-blue-800">Total de Banners</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 card-hover">
            <div className="text-2xl font-bold text-green-600">
              {banners.length > 0 ? "Ativo" : "Inativo"}
            </div>
            <div className="text-sm text-green-800">Status</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 card-hover">
            <div className="text-2xl font-bold text-purple-600">
              {banners.length}/10
            </div>
            <div className="text-sm text-purple-800">Limite de Banners</div>
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

            {/* Conteúdo do Modal */}
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Tem certeza que deseja excluir este banner?
              </p>
              <p className="text-sm text-gray-500">
                Esta ação não pode ser desfeita. O banner será removido permanentemente do sistema.
              </p>
              
              {/* Preview do banner que será excluído */}
              {deleteModal.banner && (
                <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <img
                      src={deleteModal.banner.imageUrl}
                      alt="Banner a ser excluído"
                      className="w-16 h-12 object-cover rounded"
                    />
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">Banner #{banners.findIndex(b => b.id === deleteModal.banner.id) + 1}</p>
                      <p className="text-xs text-red-500">Será removido permanentemente</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Ações do Modal */}
            <div className="flex gap-3 p-6 border-t border-green-200 bg-gray-50 rounded-b-xl">
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