/*import React from "react";
import { motion } from "framer-motion";
import { animationVariants } from "../constants/animationVariants";
import { Link } from "react-router-dom";

const HomeSection = () => {
  return (
    <div className="max-padd-container">
      <div
        className="bg-white  rounded-t-lgnded- max-padd-container flex justify-between items-start p-10 py-28 max-md:py-16 gap-5 max-md:px-5 max-md:flex-col max-md:items-center max-md:text-center"
      >
        <div className="w-2/4 max-md:w-full ">
          <motion.div
            initial="initial"
            whileInView="animate"
            variants={animationVariants.zoomOut}
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 className="bem-vindo text-5xl max-md:text-4xl font-bold title-font">
              Bem-vindo ao Grupo Madenobre! No mercado
              <span
                className="text-secondary "
              >
                {" "}
                desde 1998
              </span>
            </h2>
          </motion.div>
        </div>
        <div className="w-2/4 max-md:w-full">
          <motion.div
            initial="initial"
            whileInView="animate"
            variants={animationVariants.fadeRight}
            viewport={{ once: true, amount: 0.2 }}
          >
            <p className="text-xl">
              Há mais de 25 anos, somos referência no mercado de madeiras de
              alta qualidade em Maceió, somos a solução para seus projetos.
              Explore nosso site e descubra como podemos ajudar a transformar
              suas ideias em realidade.
            </p>
            <Link  to={"/about"}>
                <button className="btn-secondary hover:btn-wood mt-5">Sobre Nós</button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};


export default HomeSection;*/
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
      <div className="max-padd-container">
        <div className="bg-white rounded-t-lg max-padd-container flex justify-between items-start p-10 py-28 max-md:py-16 gap-5 max-md:px-5 max-md:flex-col max-md:items-center max-md:text-center">
          <div className="w-2/4 max-md:w-full">
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
          </div>
          <div className="w-2/4 max-md:w-full">
            <div className="h-24 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  // Aplicar estilos inline baseados nas cores do banco
  const sectionStyle = {
    backgroundColor: homeData?.backgroundColor || '#ffffff'
  };

  const titleStyle = {
    color: homeData?.textColor || '#000000'
  };

  const highlightStyle = {
    color: homeData?.highlightColor || '#16a34a'
  };

  const descriptionStyle = {
    color: homeData?.textColor || '#000000'
  };

  const buttonStyle = {
    backgroundColor: homeData?.buttonColor || '#16a34a',
    color: homeData?.buttonTextColor || '#ffffff'
  };

  return (
    <div className="max-padd-container">
      <div
        style={sectionStyle}
        className="rounded-t-lg max-padd-container flex justify-between items-start p-10 py-28 max-md:py-16 gap-5 max-md:px-5 max-md:flex-col max-md:items-center max-md:text-center"
      >
        <div className="w-2/4 max-md:w-full">
          <motion.div
            initial="initial"
            whileInView="animate"
            variants={animationVariants.zoomOut}
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 style={titleStyle} className="bem-vindo text-5xl max-md:text-4xl font-bold title-font">
              {homeData?.title || "Bem-vindo ao Grupo Madenobre! No mercado"}
              <span style={highlightStyle}>
                {" "}
                {homeData?.highlightedText || "desde 1998"}
              </span>
            </h2>
          </motion.div>
        </div>
        <div className="w-2/4 max-md:w-full">
          <motion.div
            initial="initial"
            whileInView="animate"
            variants={animationVariants.fadeRight}
            viewport={{ once: true, amount: 0.2 }}
          >
            <p style={descriptionStyle} className="text-xl">
              {homeData?.description || "Há mais de 25 anos, somos referência no mercado de madeiras de alta qualidade em Maceió, somos a solução para seus projetos. Explore nosso site e descubra como podemos ajudar a transformar suas ideias em realidade."}
            </p>
            <Link to={homeData?.buttonLink || "/about"}>
              <button 
                style={buttonStyle}
                className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:opacity-90 mt-5"
              >
                {homeData?.buttonText || "Sobre Nós"}
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomeSection;