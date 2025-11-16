import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import Vendor from "./vendor";

const VendorList = () => {
  const { backendUrl } = useContext(ShopContext);
  const [vendors, setVendors] = useState([]);

  const getVendorsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/vendor/list`);
      if (response.data.success) {
        setVendors(response.data.vendors);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getVendorsData();
  }, []);

  if (vendors.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum vendedor cadastrado no momento.</p>
      </div>
    );
  }

  return (
    // Container principal sempre centralizado
    <div className="flex justify-center w-full">
      {/* Grid responsivo que se adapta à quantidade de cards */}
      <div className={`
        grid gap-4 w-full
        // Mobile: sempre 2 colunas
        grid-cols-2
        // A partir de sm: se adapta à quantidade
        ${vendors.length === 1 
          ? 'sm:grid-cols-1 sm:max-w-xs' 
          : vendors.length === 2 
          ? 'sm:grid-cols-2 sm:max-w-md' 
          : vendors.length === 3
          ? 'sm:grid-cols-3 sm:max-w-2xl'
          : vendors.length === 4
          ? 'sm:grid-cols-2 md:grid-cols-4 sm:max-w-4xl'
          : 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:max-w-7xl'
        }
      `}>
        {vendors.map(vendor => (
          <div key={vendor.id} className="w-full">
            <Vendor vendor={vendor} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorList;