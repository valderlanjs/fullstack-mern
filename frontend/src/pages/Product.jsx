import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { FaStar, FaTruckFast, FaWhatsapp } from "react-icons/fa6";
import Footer from "../components/Footer";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  const { productId } = useParams();
  const { products, currency } = useContext(ShopContext);

  const [product, setProduct] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

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

  if (!product) {
    return <div>...Carregando</div>;
  }

  return (
    <section>
      <div className="max-padd-container mt-8 xl:mt-6">
        <div className="max-padd-container flex gap-12 flex-col xl:flex-row bg-white py-16 rounded-2xl">
          <div className="flex flex-1 gap-x-2 xl:flex-1">
            <div className="flexCenter flex-col gap-[7px] flex-wrap">
              {product.image.map((item, i) => (
                <img
                  src={item}
                  onClick={() => setImage(item)}
                  key={i}
                  alt="productImg"
                  className="max-h-[89px] w-full rounded-lg"
                />
              ))}
            </div>
            <div className="max-h-[377px] w-[350px] flex">
              <img
                src={image || "fallback-image-url"}
                alt="productImg"
                className="rounded-xl bg-gray-10"
              />
            </div>
          </div>
          {/* Informações do produto */}
          <div className="flex-[1.5] rounded-2xl px-7 ">
            <h3 className="h3 !my-2.5">{product.name}</h3>
            {/* Avaliação e Preço */}
            <div className="flex items-baseline gap-x-5">
              {/*<h3 className="h3">{currency}{product.price}</h3>*/}
              <div className="flex items-center gap-x-2 text-secondary mb-2">
                <div className="flex gap-x-2 text-secondary text-xl">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
                {/*  <span className="">(122)</span>*/}
              </div>
            </div>
            <p>{product.description}</p>
            <div className="flex flex-col gap-4 my-4 mb-5">
              <div className="flex gap-2">
                {/*{[...product.sizes]
                  .sort((a, b) => {
                    const order = ["P", "M", "G", "GG"];
                    return order.indexOf(a) - order.indexOf(b);
                  })
                  .map((item, i) => (
                    <button
                      onClick={() => setSize(item)}
                      key={i}
                      className={`${
                        item === size
                          ? "bg-tertiary text-white"
                          : "border-slate-900/5"
                      } border-[1.5px] border-tertiary h-8 w-10 bg-primary rounded-md`}
                    >
                      {item}
                    </button>
                  ))}*/}
              </div>
            </div>
            <div className="flex items-center gap-x-4">
              <a href="/contact" className="btn-secondary w-1/2 flexCenter gap-x-2 capitalize">Faça um Orçamento</a>
              <a href='/contact' className="btn-light"><FaWhatsapp className="text-secondary" size={24}/></a>
            </div>
            <div className="flex items-center gap-x-2 mt-2">
              <FaTruckFast className="text-lg" />
              <span className="medium-14">Frete grátis!!</span>
            </div>
            <hr className="my-4 w-2/3" />
            <div className="mt-2 flex-col gap-1">
              <p>Garantia para que você possa confiar.</p>
              <p>
                Aproveite as diferentes formas de pagamento para sua
                conveniência.
              </p>
              <p>Entrega em qualquer lugar de Alagoas.</p>
            </div>
          </div>
        </div>
        <RelatedProducts category={product.category} />
      </div>
      <Footer />
    </section>
  );
};

export default Product;
