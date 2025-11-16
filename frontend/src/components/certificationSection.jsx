// components/CertificationSection.jsx (versão completa corrigida)
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
  },
  slideInLeft: {
    initial: { x: -40, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.7 } }
  },
  slideInRight: {
    initial: { x: 40, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.7 } }
  }
};

const CertificationSection = () => {
  const [certificationData, setCertificationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fscImageLoaded, setFscImageLoaded] = useState(false);
  const [dofImageLoaded, setDofImageLoaded] = useState(false);

  const fetchCertificationData = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/certification-section`);
      if (response.data.success) {
        setCertificationData(response.data.certificationSection);
      }
    } catch (error) {
      console.error("Erro ao carregar seção de certificações:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificationData();
  }, []);

  // Valores padrão
  const defaultData = {
    fscTitle: "FSC",
    fscDescription1: "Certificação Forest Stewardship Council. Atribuída por certificadores independentes que estabelecem princípios e critérios para assegurar a origem da madeira.",
    fscDescription2: "Permitindo ao consumidor consciente a opção de um produto que não degrada o meio ambiente e contribui para o desenvolvimento social e econômico das comunidades florestais.",
    fscDescription3: "A prática predatória é eliminada, a biodiversidade é preservada, assim como os recursos hídricos e do solo. Além do benefício ambiental, o selo garante que os direitos dos trabalhadores sejam respeitados e que as comunidades locais se beneficiem da exploração florestal.",
    fscImage: "",
    fscImageAlt: "Certificação FSC",
    dofTitle: "DOF",
    dofDescription: "Documento de origem florestal, garantindo procedência, manejo responsável e qualidade do produto.",
    dofImage: "",
    dofImageAlt: "Certificação DOF"
  };

  const data = certificationData || defaultData;

  // Funções seguras para split
  const safeSplit = (text, separator = ' ') => {
    if (!text || typeof text !== 'string') return [''];
    return text.split(separator);
  };

  if (loading) {
    return (
      <div className="max-padd-container relative">
        <div className="mx-auto py-24">
          {/* Loading para header */}
          <div className="text-center mb-20">
            <div className="h-16 bg-gray-200 rounded-lg animate-pulse w-80 mx-auto mb-6"></div>
            <div className="h-5 bg-gray-200 rounded animate-pulse w-[500px] mx-auto"></div>
          </div>
          
          {/* Loading para FSC */}
          <div className="bg-gray rounded-3xl p-10 lg:p-16 mb-16">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="w-full lg:w-1/2">
                <div className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
              </div>
              <div className="w-full lg:w-1/2 space-y-5">
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded animate-pulse w-5/6"></div>
              </div>
            </div>
          </div>

          {/* Loading para DOF */}
          <div className="bg-gray rounded-3xl p-10 lg:p-16">
            <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">
              <div className="w-full lg:w-1/2">
                <div className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
              </div>
              <div className="w-full lg:w-1/2 space-y-5">
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-padd-container relative">
      <div className="mx-auto py-24">
        
        {/* Header moderno */}
        <div className="text-center mb-24 relative z-10 px-4">
          {/* Badge de categoria */}
          <div className="inline-flex items-center gap-2 bg-gray-200 px-6 py-3 rounded-full mb-8">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: '#206E34' }}
            ></div>
            <span className="text-base font-medium text-gray-700 uppercase tracking-wide">
              Certificações
            </span>
          </div>

          {/* Título principal com gradiente - CORRIGIDO */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light text-gray-900 mb-8 leading-tight relative">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
              <span>Nossas</span>
              <span 
                className="font-bold"
                style={{
                  background: 'linear-gradient(135deg, #206E34, #70BD44)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Certificações
              </span>
            </div>
            
            {/* Círculo decorativo no título - CORRIGIDO */}
            <div 
              className="absolute -right-10 sm:-right-20 -top-8 sm:-top-10 w-20 h-20 sm:w-40 sm:h-40 rounded-full blur-3xl -z-10 opacity-25"
              style={{
                background: 'linear-gradient(135deg, #206E34, #70BD44)'
              }}
            ></div>
          </h1>

          {/* Linha decorativa */}
          <div 
            className="w-24 h-1 rounded-full mx-auto mb-8"
            style={{
              background: 'linear-gradient(135deg, #206E34, #70BD44)'
            }}
          ></div>

          {/* Subtítulo */}
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Compromisso com a qualidade, sustentabilidade e procedência responsável
          </p>
        </div>

        {/* Seção FSC */}
        <div className="bg-gray rounded-3xl p-6 sm:p-10 lg:p-16 mb-16 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 sm:gap-16 items-center">
            
            {/* Imagem FSC - CORRIGIDA */}
            <motion.div 
              className="w-full lg:w-1/2"
              initial="initial"
              whileInView="animate"
              variants={animationVariants.slideInLeft}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="relative group">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100">
                  {data.fscImage ? (
                    <>
                      <img 
                        src={data.fscImage} 
                        alt={data.fscImageAlt}
                        className={`w-full max-w-[400px] sm:max-w-[600px] mx-auto h-auto object-contain transition-all duration-700 ${
                          fscImageLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
                        }`}
                        onLoad={() => setFscImageLoaded(true)}
                      />
                      
                      {/* Overlay gradiente sutil */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </>
                  ) : (
                    <div className="w-full max-w-[400px] sm:max-w-[600px] h-48 sm:h-64 mx-auto bg-gray-200 flex items-center justify-center rounded-3xl">
                      <span className="text-gray-400">Imagem FSC</span>
                    </div>
                  )}
                </div>
                
                {/* Elemento decorativo */}
                <div className="absolute -inset-2 sm:-inset-4 -z-10">
                  <div 
                    className="w-full h-full rounded-3xl transform rotate-3 transition-transform duration-500 group-hover:rotate-2"
                    style={{
                      background: 'linear-gradient(135deg, rgba(32, 110, 52, 0.1), rgba(112, 189, 68, 0.1))'
                    }}
                  ></div>
                </div>

                {/* Loading state */}
                {!fscImageLoaded && data.fscImage && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-3xl"></div>
                )}
              </div>
            </motion.div>
            
            {/* Texto FSC */}
            <motion.div 
              className="w-full lg:w-1/2"
              initial="initial"
              whileInView="animate"
              variants={animationVariants.slideInRight}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="flex flex-col items-start justify-between max-md:items-center max-md:text-center">
                
                {/* Badge FSC */}
                <div className="inline-flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-full mb-6 sm:mb-8 shadow-sm">
                  <div 
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: '#206E34' }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                    Certificação Internacional
                  </span>
                </div>

                {/* Título FSC */}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-gray-900 mb-6 leading-tight">
                  {safeSplit(data.fscTitle).map((word, index, array) => (
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
                          : {}
                      }
                    >
                      {word}{' '}
                    </span>
                  ))}
                </h2>

                {/* Linha decorativa */}
                <div 
                  className="w-20 h-0.5 rounded-full mb-6 sm:mb-8"
                  style={{
                    background: 'linear-gradient(135deg, #206E34, #70BD44)'
                  }}
                ></div>

                {/* Descrições FSC */}
                <div className="space-y-4 sm:space-y-6">
                  <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    {data.fscDescription1}
                  </p>
                  <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    {data.fscDescription2}
                  </p>
                  <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    {data.fscDescription3}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Seção DOF */}
        <div className="bg-gray rounded-3xl p-6 sm:p-10 lg:p-16 relative z-10">
          <div className="flex flex-col lg:flex-row-reverse gap-8 sm:gap-16 items-center">
            
            {/* Imagem DOF - CORRIGIDA */}
            <motion.div 
              className="w-full lg:w-1/2"
              initial="initial"
              whileInView="animate"
              variants={animationVariants.slideInRight}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="relative group">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100">
                  {data.dofImage ? (
                    <>
                      <img 
                        src={data.dofImage} 
                        alt={data.dofImageAlt}
                        className={`w-full max-w-[400px] sm:max-w-[600px] mx-auto h-auto object-contain transition-all duration-700 ${
                          dofImageLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
                        }`}
                        onLoad={() => setDofImageLoaded(true)}
                      />
                      
                      {/* Overlay gradiente sutil */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </>
                  ) : (
                    <div className="w-full max-w-[400px] sm:max-w-[600px] h-48 sm:h-64 mx-auto bg-gray-200 flex items-center justify-center rounded-3xl">
                      <span className="text-gray-400">Imagem DOF</span>
                    </div>
                  )}
                </div>
                
                {/* Elemento decorativo */}
                <div className="absolute -inset-2 sm:-inset-4 -z-10">
                  <div 
                    className="w-full h-full rounded-3xl transform -rotate-3 transition-transform duration-500 group-hover:-rotate-2"
                    style={{
                      background: 'linear-gradient(135deg, rgba(32, 110, 52, 0.1), rgba(112, 189, 68, 0.1))'
                    }}
                  ></div>
                </div>

                {/* Loading state */}
                {!dofImageLoaded && data.dofImage && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-3xl"></div>
                )}
              </div>
            </motion.div>
            
            {/* Texto DOF */}
            <motion.div 
              className="w-full lg:w-1/2"
              initial="initial"
              whileInView="animate"
              variants={animationVariants.slideInLeft}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="flex flex-col items-start justify-between max-md:items-center max-md:text-center">
                
                {/* Badge DOF */}
                <div className="inline-flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-full mb-6 sm:mb-8 shadow-sm">
                  <div 
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: '#206E34' }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                    Documentação Oficial
                  </span>
                </div>

                {/* Título DOF */}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-gray-900 mb-6 leading-tight">
                  {safeSplit(data.dofTitle).map((word, index, array) => (
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
                          : {}
                      }
                    >
                      {word}{' '}
                    </span>
                  ))}
                </h2>

                {/* Linha decorativa */}
                <div 
                  className="w-20 h-0.5 rounded-full mb-6 sm:mb-8"
                  style={{
                    background: 'linear-gradient(135deg, #206E34, #70BD44)'
                  }}
                ></div>

                {/* Descrição DOF */}
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  {data.dofDescription}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Elementos decorativos de fundo - MÚLTIPLOS CÍRCULOS */}
        <div 
          className="absolute top-1/4 left-4 sm:left-10 w-40 h-40 sm:w-80 sm:h-80 rounded-full blur-3xl -z-10 opacity-20"
          style={{
            background: 'linear-gradient(135deg, #206E34, #70BD44)'
          }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-4 sm:right-10 w-60 h-60 sm:w-[500px] sm:h-[500px] rounded-full blur-3xl -z-10 opacity-10"
          style={{
            background: 'linear-gradient(135deg, #206E34, #70BD44)'
          }}
        ></div>
        
        {/* Círculos adicionais */}
        <div 
          className="absolute top-1/2 right-1/4 w-32 h-32 sm:w-64 sm:h-64 rounded-full blur-3xl -z-10 opacity-15"
          style={{
            background: 'linear-gradient(135deg, #206E34, #70BD44)'
          }}
        ></div>
        <div 
          className="absolute bottom-1/3 left-1/4 w-48 h-48 sm:w-96 sm:h-96 rounded-full blur-3xl -z-10 opacity-10"
          style={{
            background: 'linear-gradient(135deg, #206E34, #70BD44)'
          }}
        ></div>
        <div 
          className="absolute top-3/4 left-1/3 w-36 h-36 sm:w-72 sm:h-72 rounded-full blur-3xl -z-10 opacity-12"
          style={{
            background: 'linear-gradient(135deg, #206E34, #70BD44)'
          }}
        ></div>

        {/* Círculos específicos para as seções */}
        <div 
          className="absolute top-[40%] left-[10%] sm:left-[15%] w-32 h-32 sm:w-60 sm:h-60 rounded-full blur-3xl -z-10 opacity-18"
          style={{
            background: 'linear-gradient(135deg, #206E34, #70BD44)'
          }}
        ></div>
        <div 
          className="absolute bottom-[30%] right-[15%] sm:right-[20%] w-28 h-28 sm:w-56 sm:h-56 rounded-full blur-3xl -z-10 opacity-14"
          style={{
            background: 'linear-gradient(135deg, #206E34, #70BD44)'
          }}
        ></div>
      </div>
    </div>
  );
};

export default CertificationSection;