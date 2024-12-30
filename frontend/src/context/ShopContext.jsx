import { createContext, useState } from "react";
import { products } from "../assets/data.js";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "S";
  const delivery_charges = 10;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const contextValue = {
    products,
    currency,
    delivery_charges,
    search,
    setSearch,
    showSearch,
    setShowSearch,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
