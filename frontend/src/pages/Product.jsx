import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Product = () => {
  const { productId } = useParams();
  const { products, currency } = useContext(ShopContext);

  const [product, setProduct] = useState(null);
  const [image, setImage] = useState("");

  const fetchProductData = () => {
    const item = products.find((item) => item._id === productId);
    if (item) {
      setProduct(item);
      setImage(item.image[0]);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  return (
    <section>
      <div className="max-padd-container">
        <div className="max-padd-container flex gap-12 flex-col xl:flow-row bg-white py-16 rounded-2xl">
          <div className="flex flex-1 gap-x-2 xl:flex-1">
            <div className="flexCenter flex-col gap-[7px] flex-wrap">
              {product?.image?.map((item, i) => (
                <img src={item} onClick={() => setImage(item)} key={item} alt="productImg" className="max-h-[89px] w-full rounded-lg" />
              ))}
            </div>
            <div className="max-h-[377px] w-[350px] flex">
            <img src={image || "fallback-image-url"} alt="productImg" className="rounded-xl bg-gray-10" />
          </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Product;