import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { animationVariants } from "../constants/animationVariants";
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
    <section className="min-h-[60vh] flex items-center justify-center bg-gray py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10">
        {/* Header da Seção */}
        <div className="flex flex-col items-center text-center mb-16">
          {/* Badge de categoria */}
          <motion.div
            initial="initial"
            whileInView="animate"
            variants={animationVariants.fadeUp}
            viewport={{ once: true, amount: 0.2 }}
            className="inline-flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-full mb-8"
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "#206E34" }}
            ></div>
            <span className="text-sm font-medium text-gray-700 uppercase tracking-wide">
              Destaques
            </span>
          </motion.div>

          {/* Título principal */}
          <motion.h2
            initial="initial"
            whileInView="animate"
            variants={animationVariants.zoomOut}
            viewport={{ once: true, amount: 0.2 }}
            className="text-4xl lg:text-5xl xl:text-6xl font-light text-gray-900 mb-6 leading-tight"
          >
            Produtos{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #206E34, #70BD44)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
              className="font-bold"
            >
              Populares
            </span>
          </motion.h2>

          {/* Linha decorativa */}
          <motion.div
            initial="initial"
            whileInView="animate"
            variants={animationVariants.fadeRight}
            viewport={{ once: true, amount: 0.2 }}
            className="w-20 h-0.5 rounded-full mb-8"
            style={{
              background: "linear-gradient(135deg, #206E34, #70BD44)",
            }}
          ></motion.div>

          {/* Descrição */}
          <motion.div
            initial="initial"
            whileInView="animate"
            variants={animationVariants.fadeUp}
            viewport={{ once: true, amount: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
              Confira nossos produtos mais vendidos e queridos pelos clientes
            </p>
          </motion.div>
        </div>

        {/* Grid de Produtos */}
        <motion.div
          initial="initial"
          whileInView="animate"
          variants={animationVariants.stagger}
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {popularProducts.map((product, index) => (
            <motion.div
              key={product._id}
              variants={animationVariants.fadeUp}
              className="group"
            >
              <Item product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* Mensagem quando não há produtos populares */}
        {popularProducts.length === 0 && (
          <motion.div
            initial="initial"
            whileInView="animate"
            variants={animationVariants.fadeUp}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4 text-gray-300">📦</div>
            <h3 className="text-2xl font-semibold text-gray-500 mb-2">
              Nenhum produto popular no momento
            </h3>
            <p className="text-gray-400">
              Nossos produtos populares aparecerão aqui em breve
            </p>
          </motion.div>
        )}
      </div>

      {/* Elementos decorativos de fundo - CÍRCULOS VERDES */}
      <div
        className="absolute top-1/4 -right-20 w-72 h-72 rounded-full blur-3xl -z-10 opacity-30"
        style={{
          background: "linear-gradient(135deg, #206E34, #70BD44)",
        }}
      ></div>
      <div
        className="absolute bottom-1/4 -left-20 w-96 h-96 rounded-full blur-3xl -z-10 opacity-20"
        style={{
          background: "linear-gradient(135deg, #206E34, #70BD44)",
        }}
      ></div>
      
      {/* Círculo adicional no centro-esquerda */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -left-10 w-64 h-64 rounded-full blur-3xl -z-10 opacity-25"
        style={{
          background: "linear-gradient(135deg, #206E34, #70BD44)",
        }}
      ></div>

      {/* Círculo pequeno no canto inferior direito */}
      <div
        className="absolute bottom-10 -right-10 w-48 h-48 rounded-full blur-2xl -z-10 opacity-15"
        style={{
          background: "linear-gradient(135deg, #206E34, #70BD44)",
        }}
      ></div>
    </section>
  );
};

export default PopularProducts;