import axios from "axios";
import React, { useEffect, useState } from "react";
import { backend_url } from "../App";
import { toast } from "react-toastify";
import { TbTrash } from "react-icons/tb";

const ListVendor = ({ token }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/vendor/list`);

      if (response.data.success) {
        setList(response.data.vendors);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    
  };

  const removeVendor = async (id) => {
    try {
      const response = await axios.post(
        `${backend_url}/api/vendor/remove`,
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
      <h3 className="h3">Todos os Vendedores</h3>
      <div className="flex flex-col gap-2 pt-4">
        <div className="hidden md:grid grid-cols-[1fr_2fr_2fr_1fr_1fr] items-center py-1 px-2 border text-secondary bg-white bold-14 sm:bold-16 rounded-lg">
          <h5 className="h5">Imagem</h5>
          <h5 className="h5">Nome</h5>
          <h5 className="h5">Email</h5>
          <h5 className="h5">WhatsApp</h5>
          <h5 className="h5">Deletar</h5>
        </div>
        {/*Lista de Vendedores*/}
        {list.map((vendor) => (
          <div
            key={vendor.id}
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_2fr_2fr_1fr_1fr] items-center gap-2 p-1 bg-white rounded-xl hover:shadow-md"
          >
            <img src={vendor.image} alt="" className="w-24 rounded-lg" />
            <h5 className="h5">{vendor.name}</h5>
            <p className="text-sm font-semibold">{vendor.email}</p>
            <p className="text-sm font-semibold">
              {vendor.whatsapp || "N/A"}
            </p>
            <div>
              <TbTrash
                onClick={() => removeVendor(vendor.id)}
                className="text-right md:text-center cursor-pointer text-lg"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListVendor;