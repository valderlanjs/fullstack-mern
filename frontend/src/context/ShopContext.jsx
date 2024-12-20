import { createContext } from "react";
import { products } from "../assets/data.js";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    
    const currency = 'S';
    const delivery_charges = 10;
    
    const value = { products, currency, delivery_charges };
    
    return (
        <ShopContext.Provider>
            {props.children}
        </ShopContext.Provider>
    )
}