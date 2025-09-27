import React, { useState, useEffect } from "react";
import upload_icon from "../assets/upload_icon.png";
import axios from "axios";
import { backend_url } from "../App";
import { toast } from "react-toastify";
import { FaCircleExclamation } from "react-icons/fa6";

const LogoManager = ({ token }) => {
  const [image, setImage] = useState(false);
  const [currentLogo, setCurrentLogo] = useState(null);
  const [altText, setAltText] = useState("");

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
        toast.success(response.data.message);
        fetchLogo();
        setImage(false); // Resetar o estado da imagem após upload
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Erro ao atualizar logo");
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

  return (
    <form onSubmit={onSubmitHandler} className="pl-8">
      <div className="flex flex-col gap-y-4 medium-15">
        <h3 className="h3">Atualizar Logo do Site</h3>
        
        {/* Logo Atual */}
        {currentLogo && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Logo Atual:</h4>
            <img
              src={currentLogo.imageUrl}
              alt={currentLogo.altText}
              className="w-40 h-40 object-contain ring-1 ring-slate-900/5 rounded-lg bg-white p-2"
            />
            <p className="text-sm text-gray-600 mt-1">
              Atualizada em: {new Date(currentLogo.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
        )}

        {/* Upload da Nova Logo */}
        <div className="flex flex-col gap-y-3">
          <label htmlFor="altText" className="font-medium">
            Texto Alternativo:
          </label>
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Ex: Logo da Minha Empresa"
            className="w-full max-w-md p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>

        <div className="flex gap-2 pt-2 items-start">
          <label htmlFor="image" className="cursor-pointer">
            <div className="relative">
              <img
                src={
                  image
                    ? typeof image === "string"
                      ? image
                      : URL.createObjectURL(image)
                    : upload_icon
                }
                alt="Pré-visualização da logo"
                className="w-64 h-40 aspect-square object-contain ring-1 ring-slate-900/5 rounded-lg bg-white p-4"
              />
              {!image && (
                <div className="absolute inset-0 flex items-end justify-center">
                  <span className="text-gray-500 text-sm">Clique para selecionar a logo</span>
                </div>
              )}
            </div>
            <input
              onChange={handleImageChange}
              type="file"
              name="image"
              id="image"
              accept="image/*"
              hidden
            />
          </label>
          
          <div className="tooltiph">
            <FaCircleExclamation className="w-10 h-6 text-yellow-600" />
            <span className="tooltiptexth">
              Adicione logos com tamanho máximo de 9MB. 
              Formatos recomendados: PNG, SVG ou JPG. 
              Dimensões ideais: quadrado (1:1) entre 200x200px e 500x500px.
            </span>
          </div>
        </div>

        {/* Preview da Nova Logo */}
        {image && typeof image !== "string" && (
          <div className="mt-2 p-3 border border-gray-100 rounded-md bg-gray-50">
            <h4 className="font-semibold mb-2">Pré-visualização da Nova Logo:</h4>
            <div className="flex items-center gap-4">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview da nova logo"
                className="w-20 h-20 object-contain"
              />
              <div>
                <p className="text-sm">
                  <strong>Arquivo:</strong> {image.name}
                </p>
                <p className="text-sm">
                  <strong>Tamanho:</strong> {(image.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <p className="text-sm">
                  <strong>Texto alternativo:</strong> {altText || "Não definido"}
                </p>
              </div>
            </div>
          </div>
        )}

        <button 
          type="submit" 
          className="btn-secondary mt-3 max-w-xs"
          disabled={!image}
        >
          {image ? "Atualizar Logo" : "Selecione uma imagem"}
        </button>
      </div>
    </form>
  );
};

export default LogoManager;