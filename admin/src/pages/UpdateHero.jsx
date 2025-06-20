import React, { useState, useEffect } from "react";
import upload_icon from "../assets/upload_icon.png";
import axios from "axios";
import { backend_url } from "../App";
import { toast } from "react-toastify";
import { FaCircleExclamation } from "react-icons/fa6";

const UpdateHero = ({ token }) => {
  const [image, setImage] = useState(false);

  // Esta função serve para buscar a imagem inicial quando o componente carrega
  const fetchHeroImage = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/hero/image`);
      if (response.data.success && response.data.hero) {
        setImage(response.data.hero.imageUrl);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao obter a imagem do home.");
    }
  };

  useEffect(() => {
    fetchHeroImage();
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!image || typeof image === 'string') {
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
        
        // Resetar o estado da imagem para 'false'
        setImage(false);
        
        // Limpar o input de arquivo
        document.getElementById("image").value = "";
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
              src={
                image
                  ? typeof image === "string"
                    ? image
                    : URL.createObjectURL(image)
                  : upload_icon
              }
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