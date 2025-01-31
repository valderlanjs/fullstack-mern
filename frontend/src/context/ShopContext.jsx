import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "S";
  const delivery_charges = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate()

  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const getVendorsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/vendor/list`);
      if (response.data.success) {
        setVendors(response.data.vendors);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    getProductsData();
    getVendorsData();
  },[])

  const contextValue = {
    products,
    vendors,
    currency,
    delivery_charges,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    navigate,
    backendUrl
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
