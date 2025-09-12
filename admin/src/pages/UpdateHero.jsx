{/*import React, { useState, useEffect } from "react";
import upload_icon from "../assets/upload_icon.png";
import axios from "axios";
import { backend_url } from "../App";
import { toast } from "react-toastify";
import { FaCircleExclamation } from "react-icons/fa6";

const UpdateHero = ({ token }) => {
  const [image, setImage] = useState(null); // usar null em vez de false
  const [currentImage, setCurrentImage] = useState(""); // para exibir imagem atual

  const fetchHeroImage = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/hero/image`);
      if (response.data.success && response.data.hero) {
        setCurrentImage(response.data.hero.imageUrl);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHeroImage();
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Por favor, selecione uma nova imagem para atualizar.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await axios.post(
        `${backend_url}/api/hero/update`,
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setImage(null);
        document.getElementById("image").value = "";
        fetchHeroImage(); // atualizar a imagem exibida
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="pl-8">
      <div className="flex flex-col gap-y-2 medium-15">
        <h3 className="h3">Atualizar Imagem do Home da Página</h3>
        <div className="flex gap-2 pt-2">
          <label htmlFor="image" className="cursor-pointer">
            <img
              src={image ? URL.createObjectURL(image) : currentImage || upload_icon}
              alt=""
              className="w-64 h-40 aspect-square object-cover ring-1 ring-slate-900/5 rounded-lg"
            />
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              name="image"
              id="image"
              hidden
            />
          </label>
          <div className="tooltiph">
            <FaCircleExclamation className="w-10 h-6 text-yellow-600" />
            <span className="tooltiptexth">
              Adicione fotos com tamanho máximo de 9MB, largura adequada entre
              3150px e 3350px e altura entre 2000px e 2100px.
            </span>
          </div>
        </div>
        <button type="submit" className="btn-secondary mt-3">
          Atualizar imagem do Home
        </button>
      </div>
    </form>
  );
};

export default UpdateHero;
*/}

import React, { useEffect, useState } from "react";
import upload_icon from "../assets/upload_icon.png";
import axios from "axios";
import { backend_url } from "../App";
import { toast } from "react-toastify";
import { FaCircleExclamation, FaTrash } from "react-icons/fa6";

const UpdateHero = ({ token }) => {
  const [banners, setBanners] = useState([]); // banners existentes
  const [newImage, setNewImage] = useState(null); // imagem nova para upload

  // buscar banners do backend
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

  // adicionar novo banner
  const handleAddBanner = async (e) => {
    e.preventDefault();
    if (!newImage) {
      toast.error("Selecione uma imagem para adicionar.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("image", newImage);

      const response = await axios.post(`${backend_url}/api/hero/add`, formData, {
        headers: { token },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setNewImage(null);
        document.getElementById("image").value = "";
        fetchBanners(); // atualizar lista
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao adicionar o banner.");
    }
  };

  // excluir banner
  const handleDeleteBanner = async (id) => {
    try {
      const response = await axios.delete(`${backend_url}/api/hero/${id}`, {
        headers: { token },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchBanners();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao remover banner.");
    }
  };

  return (
    <div className="pl-8">
      <h3 className="h3 mb-4">Gerenciar Banners do Home</h3>

      {/* Lista de banners */}
      <div className="flex flex-wrap gap-4 mb-6">
        {banners.map((banner) => (
          <div key={banner.id} className="relative">
            <img
              src={banner.imageUrl}
              alt=""
              className="w-64 h-40 object-cover rounded-lg ring-1 ring-slate-900/5"
            />
            <button
              onClick={() => handleDeleteBanner(banner.id)}
              className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      {/* Adicionar novo banner */}
      <form onSubmit={handleAddBanner} className="flex flex-col gap-y-2 medium-15">
        <div className="flex gap-2 pt-2 items-center">
          <label htmlFor="image" className="cursor-pointer">
            <img
              src={newImage ? URL.createObjectURL(newImage) : upload_icon}
              alt=""
              className="w-64 h-40 object-cover ring-1 ring-slate-900/5 rounded-lg"
            />
            <input
              onChange={(e) => setNewImage(e.target.files[0])}
              type="file"
              name="image"
              id="image"
              hidden
            />
          </label>

          <div className="tooltiph">
            <FaCircleExclamation className="w-10 h-6 text-yellow-600" />
            <span className="tooltiptexth">
              Adicione fotos com tamanho máximo de 9MB, largura adequada entre 3150px e 3350px
              e altura entre 2000px e 2100px.
            </span>
          </div>
        </div>

        <button type="submit" className="btn-secondary mt-3 w-40">
          Adicionar Banner
        </button>
      </form>
    </div>
  );
};

export default UpdateHero;
