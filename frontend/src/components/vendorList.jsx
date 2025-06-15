/*import React, { useContext, useEffect, useState } from "react";
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
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getVendorsData();
  }, []);

  return (
    <section className="grid grid-cols-2 sm500:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm500:gap-1 gap-2">
      {vendors.map(vendor => (
        <Vendor key={vendor.id} vendor={vendor} />
      ))}
    </section>
  );
};

export default VendorList;
*/

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
        console.error(response.data.message); // Usando console.error para erros
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getVendorsData();
  }, []);

  return (
    // Trocamos o GRID por FLEXBOX para ter um layout dinâmico e centralizado.
    <section className="flex flex-wrap justify-center items-stretch -mx-2">
      {vendors.map(vendor => (
        // Cada card é envolvido por uma div que controla sua largura responsiva.
        <div key={vendor.id} className="w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/4 p-2 mb-16">
          <Vendor vendor={vendor} />
        </div>
      ))}
    </section>
  );
};

export default VendorList;