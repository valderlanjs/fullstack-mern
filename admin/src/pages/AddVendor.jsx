import React, { useState } from "react";
import upload_icon from "../assets/upload_icon.png";
import axios from "axios";
import { backend_url } from "../App";
import { toast } from "react-toastify";
import { FaCircleExclamation } from "react-icons/fa6";

const AddVendor = ({ token }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [image, setImage] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!name || !email || !image) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("whatsapp", whatsapp);
      formData.append("image", image);

      const response = await axios.post(
        `${backend_url}/api/vendor/add`,
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setEmail("");
        setWhatsapp("");
        setImage(false);
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
        <h3 className="h3">Adicionar Vendedor</h3>
        <div className="flex gap-2 pt-2">
          <label htmlFor="image" className="cursor-pointer">
            <img
              src={image ? URL.createObjectURL(image) : upload_icon}
              alt=""
              className="w-56 h-64 aspect-square object-cover ring-1  ring-slate-900/5 rounded-lg"
            />
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              name="image"
              id="image"
              hidden
            />
          </label>
          <div className="tooltip">
            <FaCircleExclamation className="w-10 h-6 text-yellow-600" />
            <span className="tooltiptext">Adicione fotos com tamanho máximo de 9MB, largura adequada entre 1300px e 1450px e altura entre 1800px e 1900px.</span>
          </div>
        </div>
        <div className="">
          <h5 className="h5">Nome do Vendedor</h5>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Digite aqui..."
            className="px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white mt-1 w-[333px] sm:w-full"
          />
        </div>
        <div className="">
          <h5 className="h5">Email</h5>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Digite aqui..."
            className="px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white mt-1 w-[333px] sm:w-full"
          />
        </div>
        <div className="">
          <h5 className="h5">WhatsApp</h5>
          <input
            onChange={(e) => setWhatsapp(e.target.value)}
            value={whatsapp}
            type="text"
            placeholder="Digite aqui..."
            className="px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white mt-1 w-[333px] sm:w-full"
          />
        </div>
        <button type="submit" className="btn-secondary mt-3">
          Adicionar Vendedor
        </button>
      </div>
    </form>
  );
};

export default AddVendor;
