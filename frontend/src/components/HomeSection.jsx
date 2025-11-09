import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { animationVariants } from "../constants/animationVariants";
import { Link } from "react-router-dom";
import axios from "axios";

const backend_url = import.meta.env.VITE_BACKEND_URL;

const HomeSection = () => {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        console.log("Buscando dados da home section...");
        const response = await axios.get(`${backend_url}/api/home-section`);
        console.log("Resposta da home section:", response.data);
        
        if (response.data.success) {
          setHomeData(response.data.homeSection);
        }
      } catch (error) {
        console.error("Erro ao carregar home section:", error);
        console.error("Detalhes do erro:", error.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <section className="min-h-[50vh] flex items-center justify-center bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 w-full">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            {/* Loading para conteúdo */}
            <div className="w-full space-y-6">
              <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-1/4"></div>
              <div className="h-16 bg-gray-200 rounded-lg animate-pulse w-3/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
              </div>
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse w-48"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Aplicar estilos baseados nas cores do banco
  const highlightStyle = {
    background: "linear-gradient(135deg, #206E34, #70BD44)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  const buttonGradientStyle = {
    background: "linear-gradient(135deg, #206E34, #70BD44)",
  };

  return (
    <section className="min-h-[50vh] flex items-center justify-center bg-gray py-20 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 w-full relative z-10">
        <div className="flex flex-col items-center text-center">
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
              {homeData?.badgeText || "Bem-vindo"}
            </span>
          </motion.div>

          {/* Título principal */}
          <motion.h2
            initial="initial"
            whileInView="animate"
            variants={animationVariants.zoomOut}
            viewport={{ once: true, amount: 0.2 }}
            className="text-4xl lg:text-5xl xl:text-6xl font-light text-gray-900 mb-6 leading-tight max-w-4xl"
          >
            {homeData?.title?.split(" ").map((word, index, array) => {
              // Verifica se a palavra atual deve ser destacada
              const shouldHighlight = homeData?.highlightedText 
                ? homeData.highlightedText.toLowerCase().includes(word.toLowerCase())
                : index === array.length - 1; // Padrão: última palavra
              
              return (
                <span
                  key={index}
                  className={shouldHighlight ? "font-bold" : ""}
                  style={shouldHighlight ? highlightStyle : {}}
                >
                  {word}{" "}
                </span>
              );
            }) || "Bem-vindo ao Grupo Madenobre! No mercado desde 1998"}
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
            className="max-w-3xl mx-auto"
          >
            {homeData?.description ? (
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed mb-8">
                {homeData.description}
              </p>
            ) : (
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed mb-8">
                Há mais de 25 anos, somos referência no mercado de madeiras de
                alta qualidade em Maceió, somos a solução para seus projetos.
                Explore nosso site e descubra como podemos ajudar a transformar
                suas ideias em realidade.
              </p>
            )}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial="initial"
            whileInView="animate"
            variants={animationVariants.fadeUp}
            viewport={{ once: true, amount: 0.2 }}
            className="flex gap-4 mt-4 flex-wrap justify-center"
          >
            <Link
              to={homeData?.buttonLink || "/about"}
              className="px-8 py-3 text-white rounded-lg hover:opacity-90 transition-opacity duration-300 font-medium"
              style={buttonGradientStyle}
            >
              {homeData?.buttonText || "Sobre Nós"}
            </Link>
            
            {/* Botão secundário opcional */}
            {homeData?.button2Text && (
              <Link
                to={homeData?.button2Link || "/contact"}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-green-700 hover:text-white hover:border-green-700 transition-colors duration-300 font-medium"
              >
                {homeData.button2Text}
              </Link>
            )}
          </motion.div>

          {/* Estatísticas opcionais */}
          {(homeData?.stat1Number || homeData?.stat2Number || homeData?.stat3Number) && (
            <motion.div
              initial="initial"
              whileInView="animate"
              variants={animationVariants.fadeUp}
              viewport={{ once: true, amount: 0.2 }}
              className="flex gap-8 mt-12 pt-8 border-t border-gray-200 justify-center"
            >
              {homeData.stat1Number && (
                <div className="text-center">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "#206E34" }}
                  >
                    {homeData.stat1Number}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {homeData.stat1Label || "Anos"}
                  </div>
                </div>
              )}
              {homeData.stat2Number && (
                <div className="text-center">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "#206E34" }}
                  >
                    {homeData.stat2Number}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {homeData.stat2Label || "Projetos"}
                  </div>
                </div>
              )}
              {homeData.stat3Number && (
                <div className="text-center">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "#206E34" }}
                  >
                    {homeData.stat3Number}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {homeData.stat3Label || "Qualidade"}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
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
      
      {/* NOVO CÍRCULO VERDE ADICIONADO - Posicionado no centro-esquerda */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -left-10 w-64 h-64 rounded-full blur-3xl -z-10 opacity-25"
        style={{
          background: "linear-gradient(135deg, #206E34, #70BD44)",
        }}
      ></div>

      {/* Círculo adicional no canto inferior direito */}
      <div
        className="absolute bottom-10 -right-10 w-48 h-48 rounded-full blur-2xl -z-10 opacity-15"
        style={{
          background: "linear-gradient(135deg, #206E34, #70BD44)",
        }}
      ></div>

      {/* Círculo pequeno no topo esquerdo */}
      <div
        className="absolute top-20 left-10 w-32 h-32 rounded-full blur-xl -z-10 opacity-20"
        style={{
          background: "linear-gradient(135deg, #206E34, #70BD44)",
        }}
      ></div>
    </section>
  );
};

export default HomeSection;