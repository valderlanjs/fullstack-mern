// components/AboutBanner.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const backend_url = import.meta.env.VITE_BACKEND_URL;

// Animations
const animationVariants = {
  fadeUp: {
    initial: { y: 40, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.8 } }
  }
};

const AboutBannerSection = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bgImageLoaded, setBgImageLoaded] = useState(false);
  const [contentImageLoaded, setContentImageLoaded] = useState(false);

  const fetchAboutData = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/about-banner`);
      if (response.data.success) {
        setAboutData(response.data.aboutBannerSection);
      }
    } catch (error) {
      console.error("Erro ao carregar seção about banner:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  // Valores padrão para evitar erros
  const defaultData = {
    heroTitle: "Nosso objetivo é agregar valor para lares e construções",
    heroBackgroundImage: "",
    contentBadge: "Sustentabilidade",
    contentTitle: "Promovemos a sustentabilidade e preservação do meio ambiente.",
    contentDescription: "",
    contentImage: "",
    contentImageAlt: "Imagem sobre sustentabilidade"
  };

  // Usa dados reais ou padrão
  const data = aboutData || defaultData;

  // Funções seguras para split
  const safeSplit = (text, separator = ' ') => {
    if (!text || typeof text !== 'string') return [''];
    return text.split(separator);
  };

  if (loading) {
    return (
      <div className="max-padd-container">
        {/* Loading para banner hero */}
        <div className="w-full h-96 bg-gray-200 rounded-xl animate-pulse mb-16"></div>
        
        {/* Loading para seção de conteúdo */}
        <div className="bg-white rounded-2xl p-8 flex flex-col xl:flex-row gap-10">
          <div className="flex-2 xl:max-w-[500px] space-y-4">
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex-1 h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Seção Hero com Banner */}
      <div className="max-padd-container relative">
        <div 
          className="max-padd-container w-full max-xl:mt-8 mb-16 rounded-xl relative overflow-hidden"
          style={{
            backgroundImage: data.heroBackgroundImage ? `url(${data.heroBackgroundImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: '50%',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
          }}
        >
          {/* Overlay para melhor legibilidade */}
          <div className="absolute inset-0 bg-black/20"></div>
          
          <div className="py-28 flex justify-end relative z-10">
            <motion.div
              initial="initial"
              whileInView="animate"
              variants={animationVariants.fadeUp}
              viewport={{ once: true, amount: 0.2 }}
              className="w-1/2 max-lg:w-2/3 max-md:w-full"
            >
              <h1 className="text-4xl lg:text-5xl xl:text-6xl text-white leading-tight">
                {safeSplit(data.heroTitle).map((word, index, array) => (
                  <span
                    key={index}
                    className={index === array.length - 1 ? "font-bold" : ""}
                    style={
                      index === array.length - 1 
                        ? { 
                            background: 'linear-gradient(135deg, #6EBE45, #70BD44)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          }
                        : {}
                    }
                  >
                    {word}{' '}
                  </span>
                ))}
              </h1>
            </motion.div>
          </div>

          {/* Loading state para imagem de fundo */}
          {!bgImageLoaded && data.heroBackgroundImage && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl"></div>
          )}
          
          {/* Imagem de fundo invisível para carregamento */}
          {data.heroBackgroundImage && (
            <img
              src={data.heroBackgroundImage}
              alt=""
              className="hidden"
              onLoad={() => setBgImageLoaded(true)}
              onError={() => setBgImageLoaded(true)} // Em caso de erro, remove loading
            />
          )}
        </div>

        {/* Elementos decorativos de fundo para a seção hero */}
        <div
          className="absolute top-1/4 right-10 w-72 h-72 rounded-full blur-3xl -z-10 opacity-30"
          style={{
            background: "linear-gradient(135deg, #206E34, #70BD44)",
          }}
        ></div>
        <div
          className="absolute bottom-1/4 left-10 w-96 h-96 rounded-full blur-3xl -z-10 opacity-20"
          style={{
            background: "linear-gradient(135deg, #206E34, #70BD44)",
          }}
        ></div>
      </div>

      {/* Seção de Conteúdo - Preservação */}
      <div className="max-padd-container relative">
        <div className="bg-gray rounded-2xl max-padd-container flex flex-col xl:flex-row gap-12 lg:gap-20 items-center relative z-10">
          
          {/* Texto */}
          <div className="flex-1 max-w-2xl">
            <div className="flex flex-col items-start justify-between max-md:items-center max-md:text-center">
              
              {/* Badge de categoria */}
              <div className="inline-flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-full mb-8 shadow-sm">
                <div 
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: '#206E34' }}
                ></div>
                <span className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                  {data.contentBadge || "Sustentabilidade"}
                </span>
              </div>

              {/* Título */}
              <h2 className="text-3xl sm:text-4xl xl:text-5xl text-secondary mb-6 leading-tight">
                {safeSplit(data.contentTitle).map((word, index, array) => (
                  <span
                    key={index}
                    className={index === array.length - 1 ? "font-bold" : ""}
                    style={
                      index === array.length - 1 
                        ? { 
                            background: 'linear-gradient(135deg, #206E34, #70BD44)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          }
                        : { color: '#206E34' }
                    }
                  >
                    {word}{' '}
                  </span>
                ))}
              </h2>

              {/* Linha decorativa */}
              <div 
                className="w-20 h-0.5 rounded-full mb-8"
                style={{
                  background: 'linear-gradient(135deg, #206E34, #70BD44)'
                }}
              ></div>

              {/* Descrição (se houver) */}
              {data.contentDescription && (
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  {data.contentDescription}
                </p>
              )}
            </div>
          </div>

          {/* Imagem */}
          <div className="flex-1 relative">
            <div className="relative group">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100">
                {data.contentImage ? (
                  <>
                    <img
                      src={data.contentImage}
                      alt={data.contentImageAlt}
                      className={`w-full max-w-[400px] sm:max-w-[700px] object-cover transition-all duration-700 ${
                        contentImageLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
                      }`}
                      onLoad={() => setContentImageLoaded(true)}
                      onError={() => setContentImageLoaded(true)} // Em caso de erro, remove loading
                    />
                    
                    {/* Overlay gradiente sutil */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </>
                ) : (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-3xl">
                    <span className="text-gray-400">Imagem não disponível</span>
                  </div>
                )}
              </div>
              
              {/* Elemento decorativo */}
              <div className="absolute -inset-4 -z-10">
                <div 
                  className="w-full h-full rounded-3xl transform rotate-3 transition-transform duration-500 group-hover:rotate-2"
                  style={{
                    background: 'linear-gradient(135deg, rgba(32, 110, 52, 0.1), rgba(112, 189, 68, 0.1))'
                  }}
                ></div>
              </div>

              {/* Loading state */}
              {!contentImageLoaded && data.contentImage && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-3xl"></div>
              )}
            </div>
          </div>
        </div>

        {/* Elementos decorativos de fundo para a seção de conteúdo - ATRÁS DO TEXTO */}
        <div
          className="absolute top-1/4 left-10 w-72 h-72 rounded-full blur-3xl -z-10 opacity-30"
          style={{
            background: "linear-gradient(135deg, #206E34, #70BD44)",
          }}
        ></div>
        <div
          className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full blur-3xl -z-10 opacity-20"
          style={{
            background: "linear-gradient(135deg, #206E34, #70BD44)",
          }}
        ></div>
      </div>
    </>
  );
};

export default AboutBannerSection;