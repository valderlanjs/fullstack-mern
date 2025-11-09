import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { animationVariants } from "../constants/animationVariants";
import TreeCard from "./TreeCard";
import api from "../services/api";

const CardsSection = () => {
  const [cards, setCards] = useState([]);
  const [sectionTitle, setSectionTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/cards").then((res) => {
      if (Array.isArray(res.data.cards)) {
        setCards(res.data.cards);
        setSectionTitle(res.data.sectionTitle || "");
      } else {
        console.warn("Formato inesperado:", res.data);
      }
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <section className="min-h-[50vh] flex items-center justify-center bg-white py-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 w-full relative z-10">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-1/4 mb-8"></div>
            <div className="h-16 bg-gray-200 rounded-lg animate-pulse w-3/4 mb-6"></div>
            <div className="h-2 bg-gray-200 rounded animate-pulse w-20 mb-8"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-6 rounded-2xl bg-white shadow-lg border border-gray-100 h-80 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[50vh] flex items-center justify-center bg-gray py-20 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 w-full relative z-10">
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
              {sectionTitle ? "Destaques" : "Nossos Produtos"}
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
            {sectionTitle ? (
              sectionTitle.split(" ").map((word, index, array) => {
                const shouldHighlight = index === array.length - 1; // Destaca última palavra
                
                return (
                  <span
                    key={index}
                    className={shouldHighlight ? "font-bold" : ""}
                    style={shouldHighlight ? {
                      background: "linear-gradient(135deg, #206E34, #70BD44)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    } : {}}
                  >
                    {word}{" "}
                  </span>
                );
              })
            ) : (
              <>
                Nossos{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #206E34, #70BD44)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                  className="font-bold"
                >
                  Produtos
                </span>
              </>
            )}
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

          {/* Descrição opcional */}
          {sectionTitle && (
            <motion.div
              initial="initial"
              whileInView="animate"
              variants={animationVariants.fadeUp}
              viewport={{ once: true, amount: 0.2 }}
              className="max-w-3xl mx-auto"
            >
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
                Conheça nossa linha completa de produtos em madeira de alta qualidade
              </p>
            </motion.div>
          )}
        </div>

        {/* Grid de Cards */}
        {cards.length > 0 ? (
          <motion.div
            initial="initial"
            whileInView="animate"
            variants={animationVariants.stagger}
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                variants={animationVariants.fadeUp}
                className="group"
              >
                <TreeCard
                  image={card.image}
                  title={card.title}
                  subtitle={card.subtitle}
                  link={card.link}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial="initial"
            whileInView="animate"
            variants={animationVariants.fadeUp}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4 text-gray-300">📦</div>
            <h3 className="text-2xl font-semibold text-gray-500 mb-2">
              Nenhum card disponível
            </h3>
            <p className="text-gray-400">
              Os cards aparecerão aqui quando estiverem configurados
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

export default CardsSection;