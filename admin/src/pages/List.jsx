import axios from "axios";
import React, { useEffect, useState } from "react";
import { backend_url } from "../App";
import { toast } from "react-toastify";
import { TbTrash } from "react-icons/tb";

const List = ({ token }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/product/list`);

      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    
  };

  const removeProduct = async (id) => {
    try {
      console.log("ID do produto:", id);
      const response = await axios.post(
        `${backend_url}/api/product/remove`,
        { id },
        { headers: { token, "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="pl-8">
      <h3 className="h3">Todos os Produtos</h3>
      <div className="flex flex-col gap-2 pt-4">
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border text-secondary bg-white bold-14 sm:bold-16 rounded-lg">
          <h5 className="h5">Imagem</h5>
          <h5 className="h5">Nome</h5>
          <h5 className="h5">Categoria</h5>
          <h5 className="h5">Tipo</h5>
          <h5 className="h5">Popular</h5>
          <h5 className="h5">Deletar</h5>
        </div>
        {/*Lista de Produtos*/}
        {list.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2 p-1 bg-white rounded-xl hover:shadow-md"
          >
            <img src={item.image[0]} alt="" className="w-24 rounded-lg" />
            <h5 className="h5">{item.name}</h5>
            <p className="text-sm font-semibold">{item.category}</p>
            <p className="text-sm font-semibold">{item.subCategory}</p>
            <p className="text-sm font-semibold">
              {item.popular ? "SIM" : "NÃO"}
            </p>
            <div>
              <TbTrash
                onClick={() => removeProduct(item.id)}
                className="text-right md:text-center cursor-pointer text-lg"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;