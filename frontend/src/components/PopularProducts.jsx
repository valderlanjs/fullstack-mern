import React, { useContext, useEffect, useState } from "react";
import Title from "./Title";
import { ShopContext } from "../context/ShopContext";
import Item from "./Item";

const PopularProducts = () => {
  const { products } = useContext(ShopContext);
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    const data = products.filter((item) => item.popular);
    setPopularProducts(data.slice(0, 4));
  }, [products]);

  return (
    <section className="max-padd-container">
      <div className="max-padd-container py-16 bg-white">
      <div className="max-padd-container bg-white">
        <Title title={"Produtos Populares"} titleStyles={"text-center "} />
        {/* container */}
        <div className="grid grid-cols-1 xs:grid-cold-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {popularProducts.map((product) => (
            <div key={product._id} className="">
              <Item product={product} className="" />
            </div>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
};

export default PopularProducts;
