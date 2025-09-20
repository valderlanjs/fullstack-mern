import React, { useEffect, useState } from "react";
import upload_icon from "../assets/upload_icon.png";
import axios from "axios";
import { backend_url } from "../App";
import { toast } from "react-toastify";
import { FaTrash, FaCircleExclamation } from "react-icons/fa6";

const ManageCards = ({ token }) => {
  const [cards, setCards] = useState([]);
  const [sectionTitle, setSectionTitle] = useState("");
  const [newCards, setNewCards] = useState([
    { title: "", subtitle: "", link: "", image: null },
    { title: "", subtitle: "", link: "", image: null },
    { title: "", subtitle: "", link: "", image: null },
  ]);

  // Buscar cards e título da seção
  const fetchCards = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/cards`);
      if (response.data.success) {
        setCards(response.data.cards);
        setSectionTitle(response.data.sectionTitle || "");
      }
    } catch (error) {
      toast.error("Erro ao buscar cards.");
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  // Excluir card individual
  const handleDeleteCard = async (id) => {
    try {
      const response = await axios.delete(`${backend_url}/api/cards/${id}`, {
        headers: { token },
      });
      if (response.data.success) {
        toast.success("Card excluído!");
        fetchCards();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Erro ao excluir card.");
    }
  };

  // Atualizar campos dos novos cards
  const handleChange = (index, field, value) => {
    const updated = [...newCards];
    updated[index][field] = value;
    setNewCards(updated);
  };

  // Enviar 3 novos cards
  const handleSubmit = async (e) => {
    e.preventDefault();

    const incomplete = newCards.some(
      (card) => !card.title || !card.subtitle || !card.image
    );
    if (!sectionTitle || incomplete) {
      toast.error("Preencha todos os campos.");
      return;
    }

    const formData = new FormData();
    formData.append("sectionTitle", sectionTitle);
    newCards.forEach((card, i) => {
      formData.append(`title${i + 1}`, card.title);
      formData.append(`subtitle${i + 1}`, card.subtitle);
      formData.append(`link${i + 1}`, card.link);
      formData.append(`image${i + 1}`, card.image);
    });

    try {
      const response = await axios.post(`${backend_url}/api/cards/group`, formData, {
        headers: { token },
      });
      if (response.data.success) {
        toast.success("Cards adicionados!");
        setNewCards([
          { title: "", subtitle: "", link: "", image: null },
          { title: "", subtitle: "", link: "", image: null },
          { title: "", subtitle: "", link: "", image: null },
        ]);
        fetchCards();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Erro ao adicionar cards.");
    }
  };

  // Atualizar apenas o título da seção
  const handleUpdateTitle = async () => {
    if (!sectionTitle.trim()) {
      toast.error("Digite um título válido.");
      return;
    }

    try {
      const response = await axios.post(
        `${backend_url}/api/cards/title`,
        { title: sectionTitle },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Título atualizado com sucesso!");
        fetchCards();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Erro ao atualizar título.");
    }
  };

  return (
    <div className="pl-8">
      <h3 className="h3 mb-4">Gerenciar Cards</h3>

      {/* Título da seção com botão de atualização */}
      <div className="flex items-end gap-4 mb-6">
        <div>
          <h4 className="h4 mb-2">Título da Seção</h4>
          <input
            type="text"
            placeholder="Ex: Nossos Serviços"
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
            className="px-3 py-2 ring-1 ring-slate-900/10 rounded bg-white w-[400px]"
          />
        </div>
        <button
          type="button"
          onClick={handleUpdateTitle}
          className="btn-secondary h-[42px]"
        >
          Atualizar Título
        </button>
      </div>

      {/* Lista de cards existentes */}
      <div className="flex flex-wrap gap-4 mb-6">
        {cards.map((card) => (
          <div key={card.id} className="relative">
            <img
              src={card.image}
              alt={card.title}
              className="w-64 h-40 object-cover rounded-lg ring-1 ring-slate-900/5"
            />
            <button
              onClick={() => handleDeleteCard(card.id)}
              className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
            >
              <FaTrash />
            </button>
            <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-1 rounded">
              {card.title}
            </div>
          </div>
        ))}
      </div>

      {/* Formulário para adicionar 3 novos cards */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
        {newCards.map((card, index) => (
          <div key={index} className="border p-4 rounded-lg bg-white shadow-sm">
            <h4 className="h4 mb-2">Imagem {index + 1}</h4>
            <div className="flex gap-4 items-center">
              <label htmlFor={`image${index}`} className="cursor-pointer">
                <img
                  src={card.image ? URL.createObjectURL(card.image) : upload_icon}
                  alt=""
                  className="w-32 h-32 object-cover ring-1 ring-slate-900/5 rounded-lg"
                />
                <input
                  type="file"
                  id={`image${index}`}
                  hidden
                  onChange={(e) => handleChange(index, "image", e.target.files[0])}
                />
              </label>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Título"
                  value={card.title}
                  onChange={(e) => handleChange(index, "title", e.target.value)}
                  className="px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white w-[300px]"
                />
                <input
                  type="text"
                  placeholder="Subtítulo"
                  value={card.subtitle}
                  onChange={(e) => handleChange(index, "subtitle", e.target.value)}
                  className="px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white w-[300px]"
                />
            
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-center gap-2 mt-4">
          <FaCircleExclamation className="w-6 h-6 text-yellow-600" />
          <span className="text-sm text-gray-600">
            Adicione exatamente 3 cards com imagens de até 9MB.
          </span>
        </div>

        <button type="submit" className="btn-secondary mt-4 w-40">
          Adicionar Cards
        </button>
      </form>
    </div>
  );
};

export default ManageCards;
