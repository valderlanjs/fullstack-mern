import React, { useState } from "react";
import upload_icon from "../assets/upload_icon.png";
import axios from "axios";
import { backend_url } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Madeira Bruta");
  const [subCategory, setSubCategory] = useState("Jatobá");
  const [popular, setPopular] = useState(false);

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
    // Para remover a seleção de arquivos dos inputs (opcional mas recomendado)
    document.getElementById("image1").value = "";
    document.getElementById("image2").value = "";
    document.getElementById("image3").value = "";
    document.getElementById("image4").value = "";
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!name || !image1) {
      toast.error("Por favor, preencha o nome e adicione a imagem principal.");
      return;
    }
    
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

      // A resposta do backend provavelmente tem a propriedade 'success'
      if (response.data.success) {
        toast.success(response.data.message);
        clearForm(); // Chama a função para limpar o formulário
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Ocorreu um erro ao adicionar o produto.");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="pl-8">
      <div className="flex flex-col gap-y-2 medium-15">
        <h3 className="h3">Upload da Imagem</h3>
        <div className="flex gap-2 pt-2">
            {/* Input para Imagem 1 */}
            <label htmlFor="image1" className="cursor-pointer">
              <img
                src={image1 ? URL.createObjectURL(image1) : upload_icon}
                alt=""
                className="w-16 h-16 aspect-square object-cover ring-1 ring-slate-900/5 rounded-lg"
              />
              <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
            </label>
            {/* Input para Imagem 2 */}
            <label htmlFor="image2" className="cursor-pointer">
              <img
                src={image2 ? URL.createObjectURL(image2) : upload_icon}
                alt=""
                className="w-16 h-16 aspect-square object-cover ring-1 ring-slate-900/5 rounded-lg"
              />
              <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />
            </label>
            {/* Input para Imagem 3 */}
            <label htmlFor="image3" className="cursor-pointer">
              <img
                src={image3 ? URL.createObjectURL(image3) : upload_icon}
                alt=""
                className="w-16 h-16 aspect-square object-cover ring-1 ring-slate-900/5 rounded-lg"
              />
              <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />
            </label>
            {/* Input para Imagem 4 */}
            <label htmlFor="image4" className="cursor-pointer">
              <img
                src={image4 ? URL.createObjectURL(image4) : upload_icon}
                alt=""
                className="w-16 h-16 aspect-square object-cover ring-1 ring-slate-900/5 rounded-lg"
              />
              <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden />
            </label>
        </div>
        <div>
          <h5 className="h4">Nome do Produto</h5>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Digite aqui..."
            className="px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white mt-1 w-[333px] sm:w-full"
          />
        </div>
        <div className="flex felx-col sm:flex-row gap-4">
            <div>
              <h5 className="h5">Categoria</h5>
              <select
                value={category} // Adicione o 'value' para controlar o select
                onChange={(e) => setCategory(e.target.value)}
                className="max-w-30 px-3 py-2 text-gray-30ring-1 ring-slate-900/5 bg-white rounded"
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
              <h5 className="h5">Tipos de Madeira</h5>
              <select
                value={subCategory} // Adicione o 'value' para controlar o select
                onChange={(e) => setSubCategory(e.target.value)}
                className="max-w-30 px-3 py-2 text-gray-30ring-1 ring-slate-900/5 bg-white rounded"
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
        <div className="flexStart gap-2 my-2">
          <input
            onChange={() => setPopular((prev) => !prev)}
            type="checkbox"
            checked={popular}
            id="popular"
          />
          <label htmlFor="popular" className="cursor-pointer">
            Adicionar Produto aos Populares
          </label>
        </div>
        <button type="submit" className="btn-secondary mt-3">
          Adicionar Produto
        </button>
      </div>
    </form>
  );
};

export default Add;