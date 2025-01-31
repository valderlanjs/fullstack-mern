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
