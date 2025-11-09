import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { animationVariants } from "../constants/animationVariants";
import { MdForest, MdNature, MdEco } from "react-icons/md";
import axios from "axios";

const backend_url = import.meta.env.VITE_BACKEND_URL;

const Features = () => {
  const [featuresData, setFeaturesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturesData = async () => {
      try {
        console.log("Buscando dados da features...");
        const response = await axios.get(`${backend_url}/api/features`);
        console.log("Resposta da features:", response.data);
        
        if (response.data.success) {
          setFeaturesData(response.data.features);
        }
      } catch (error) {
        console.error("Erro ao carregar features:", error);
        console.error("Detalhes do erro:", error.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturesData();
  }, []);

  if (loading) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center bg-white py-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 w-full relative z-10">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-1/4 mb-8"></div>
            <div className="h-16 bg-gray-200 rounded-lg animate-pulse w-3/4 mb-6"></div>
            <div className="h-2 bg-gray-200 rounded animate-pulse w-20 mb-8"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-2/3 mb-8"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-white shadow-lg border border-gray-100 h-80 animate-pulse"></div>
            <div className="p-8 rounded-2xl bg-white shadow-lg border border-gray-100 h-80 animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[60vh] flex items-center justify-center bg-gray py-20 relative overflow-hidden">
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
              {featuresData?.badgeText || "Certificações"}
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
            {featuresData?.title?.split(" ").map((word, index, array) => {
              const shouldHighlight = featuresData?.highlightedText 
                ? featuresData.highlightedText.toLowerCase().includes(word.toLowerCase())
                : index === array.length - 2; // Destaca "qualidade"
              
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
            }) || "Sustentabilidade e Qualidade"}
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
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
              {featuresData?.subtitle || "Madeira sustentável, certificada pelo FSC garantindo qualidade, preservação ambiental e benefícios sociais para comunidades florestais."}
            </p>
          </motion.div>
        </div>

        {/* Grid de Cards */}
        <motion.div
          initial="initial"
          whileInView="animate"
          variants={animationVariants.stagger}
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Card 1 - FSC */}
          <motion.div
            variants={animationVariants.fadeUp}
            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden"
          >
            {/* Efeito de fundo gradiente no hover */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500"
              style={{
                background: "linear-gradient(135deg, #206E34, #70BD44)",
              }}
            ></div>

            {/* Ícone */}
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 group-hover:scale-110 transition-transform duration-500">
                <MdForest 
                  className="text-4xl"
                  style={{
                    color: "#206E34",
                  }}
                />
              </div>
            </div>

            {/* Título do Card */}
            <h3 
              className="text-2xl font-bold text-center mb-6"
              style={{
                background: "linear-gradient(135deg, #206E34, #70BD44)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {featuresData?.card1Title || "FSC"}
            </h3>

            {/* Conteúdo do Card */}
            <div className="space-y-4 text-center">
              {featuresData?.card1Content?.split('\n\n').map((paragraph, index) => (
                <p 
                  key={index}
                  className="text-gray-600 leading-relaxed text-lg"
                >
                  {paragraph}
                </p>
              )) || (
                <>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Certificado internacional que assegura a procedência, qualidade e 
                    respeito ao meio ambiente.
                  </p>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Com nossas práticas a exploração predatória é eliminada e a 
                    biodiversidade e os recursos hídricos e do solo são preservados.
                  </p>
                </>
              )}
            </div>
          </motion.div>

          {/* Card 2 - DOF */}
          <motion.div
            variants={animationVariants.fadeUp}
            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden"
          >
            {/* Efeito de fundo gradiente no hover */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500"
              style={{
                background: "linear-gradient(135deg, #206E34, #70BD44)",
              }}
            ></div>

            {/* Ícone */}
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 group-hover:scale-110 transition-transform duration-500">
                <MdEco 
                  className="text-4xl"
                  style={{
                    color: "#206E34",
                  }}
                />
              </div>
            </div>

            {/* Título do Card */}
            <h3 
              className="text-2xl font-bold text-center mb-6"
              style={{
                background: "linear-gradient(135deg, #206E34, #70BD44)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {featuresData?.card2Title || "DOF"}
            </h3>

            {/* Conteúdo do Card */}
            <div className="space-y-4 text-center">
              {featuresData?.card2Content?.split('\n\n').map((paragraph, index) => (
                <p 
                  key={index}
                  className="text-gray-600 leading-relaxed text-lg"
                >
                  {paragraph}
                </p>
              )) || (
                <>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Comercializamos madeira nativa com o Documento de Origem Florestal 
                    (DOF) emitido pelo Ibama, garantindo a rastreabilidade e a 
                    legalidade da madeira.
                  </p>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Escolha nossos produtos e faça parte de um consumo consciente que 
                    promove o desenvolvimento social e econômico das comunidades florestais.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
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
    </section>
  );
};

export default Features;