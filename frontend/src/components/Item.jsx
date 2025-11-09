import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { animationVariants } from "../constants/animationVariants";

const Item = ({ product }) => {
  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      variants={animationVariants.fadeUp}
      viewport={{ once: true, amount: 0.2 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
    >
      {/* Container da imagem com efeito hover */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden">
        <div className="h-64 w-full relative overflow-hidden">
          <img
            src={product.image[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          />
          
          {/* Overlay gradiente no hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Badge de popular */}
          {product.popular && (
            <div className="absolute top-3 left-3">
              <div className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: "#206E34" }}
                ></div>
                <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                  Popular
                </span>
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Conteúdo do card */}
      <div className="p-6">
        {/* Categoria */}
        <div className="mb-3">
          <span 
            className="inline-block px-3 py-1 text-xs font-medium rounded-full uppercase tracking-wide"
            style={{
              background: "linear-gradient(135deg, rgba(32, 110, 52, 0.1), rgba(112, 189, 68, 0.1))",
              color: "#206E34",
              border: "1px solid rgba(32, 110, 52, 0.2)"
            }}
          >
            {product.category}
          </span>
        </div>

        {/* Nome do produto */}
        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-green-700 transition-colors duration-300">
          {product.name}
        </h3>

        {/* Preço (se disponível) */}
        {product.price && (
          <div className="flex items-center gap-2 mb-4">
            <span 
              className="text-2xl font-bold"
              style={{
                background: "linear-gradient(135deg, #206E34, #70BD44)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(product.price)}
            </span>
          </div>
        )}

        {/* Botão de ação */}
        <Link 
          to={`/product/${product.id}`}
          className="w-full inline-flex items-center justify-center px-6 py-3 text-white rounded-lg hover:opacity-90 transition-all duration-300 font-medium group/btn overflow-hidden relative"
          style={{
            background: "linear-gradient(135deg, #206E34, #70BD44)",
          }}
        >
          <span className="relative z-10">Ver Detalhes</span>
          
          {/* Efeito de brilho no hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
        </Link>
      </div>

      {/* Efeito de borda gradiente no hover */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10">
        <div 
          className="w-full h-full rounded-2xl"
          style={{
            background: "linear-gradient(135deg, #206E34, #70BD44)",
            filter: "blur(8px)",
            transform: "scale(1.02)"
          }}
        ></div>
      </div>
    </motion.div>
  );
};

export default Item;