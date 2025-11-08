// components/ServicesSection.jsx - DESIGN MODERNO E EDITÁVEL
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const backend_url = import.meta.env.VITE_BACKEND_URL;

const ServicesSection = () => {
  const [servicesData, setServicesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image1Loaded, setImage1Loaded] = useState(false);
  const [image2Loaded, setImage2Loaded] = useState(false);

  const fetchServicesData = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/services-section`);
      if (response.data.success) {
        setServicesData(response.data.servicesSection);
      }
    } catch (error) {
      console.error("Erro ao carregar seção de serviços:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicesData();
  }, []);

  if (loading) {
    return (
      <div className="max-padd-container">
        <div className="mx-auto bg-white py-28 max-md:py-16">
          {/* Loading para primeira seção */}
          <div className="flex w-full gap-10 max-md:flex-col max-md:items-center">
            <div className="flex-1 space-y-6">
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>
            <div className="flex-1 h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
          </div>
          
          {/* Loading para segunda seção */}
          <div className="flex gap-10 mt-20 max-md:flex-col-reverse">
            <div className="flex-1 h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
            <div className="flex-1 space-y-4">
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!servicesData) {
    return null;
  }

  return (
    <>
      {/* Primeira Seção - O que nós oferecemos */}
      <div className="max-padd-container">
        <div className="mx-auto bg-gray py-28 max-md:py-16">
          <div className="flex w-full gap-12 lg:gap-20 max-md:flex-col max-md:items-center">
            
            {/* Lado Esquerdo - Conteúdo */}
            <div className="flex-1 max-w-2xl">
              <div className="flex flex-col items-start justify-between max-md:items-center max-md:text-center">
                
                {/* Badge de categoria */}
                <div className="inline-flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-full mb-8">
                  <div 
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: '#206E34' }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                    Nossos Serviços
                  </span>
                </div>

                {/* Título principal */}
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-light text-gray-900 mb-6 leading-tight">
                  {servicesData.section1Title.split(' ').map((word, index) => (
                    <span
                      key={index}
                      className={index === servicesData.section1Title.split(' ').length - 1 ? "font-bold" : ""}
                      style={
                        index === servicesData.section1Title.split(' ').length - 1 
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
                </h1>

                {/* Linha decorativa */}
                <div 
                  className="w-20 h-0.5 rounded-full mb-8"
                  style={{
                    background: 'linear-gradient(135deg, #206E34, #70BD44)'
                  }}
                ></div>

                {/* Descrição */}
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  {servicesData.section1Description}
                </p>

                {/* Botão CTA */}
                <Link
                  to={servicesData.ctaLink || "/contact"}
                  className="px-8 py-3 text-white rounded-lg hover:opacity-90 transition-opacity duration-300 font-medium"
                  style={{
                    background: 'linear-gradient(135deg, #206E34, #70BD44)'
                  }}
                >
                  {servicesData.ctaText || "Faça um orçamento"}
                </Link>
              </div>
            </div>

            {/* Lado Direito - Imagem */}
            <div className="flex-1 relative">
              <div className="relative group">
                <div className="aspect-square relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100">
                  <img
                    src={servicesData.section1Image}
                    alt={servicesData.section1ImageAlt}
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      image1Loaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
                    }`}
                    onLoad={() => setImage1Loaded(true)}
                  />
                  
                  {/* Overlay gradiente sutil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
              </div>
            </div>
          </div>

          {/* Grid de Serviços */}
          <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {servicesData.services.map((service, index) => (
              <div key={index} className="group">
                <div className="flex items-start gap-6">
                  {/* Número decorativo */}
                  <div className="flex-shrink-0">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                      style={{
                        background: 'linear-gradient(135deg, #206E34, #70BD44)'
                      }}
                    >
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* Conteúdo do serviço */}
                  <div className="flex-1">
                    <h3 
                      className="text-2xl lg:text-3xl font-semibold mb-4 group-hover:translate-x-2 transition-transform duration-300"
                      style={{ color: '#206E34' }}
                    >
                      {service.title}
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                    
                    {/* Linha decorativa */}
                    <div 
                      className="w-12 h-0.5 rounded-full mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: 'linear-gradient(135deg, #206E34, #70BD44)'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Segunda Seção - Detalhes */}
      <div className="max-padd-container bg-gray rounded-3xl -mt-20 relative z-10">
        <div className="mx-auto py-28 max-md:py-16">
          <div className="flex w-full gap-12 lg:gap-20 max-md:flex-col-reverse max-md:items-center">
            
            {/* Lado Esquerdo - Imagem */}
            <div className="flex-1 relative">
              <div className="relative group">
                <div className="aspect-square relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100">
                  <img
                    src={servicesData.section2Image}
                    alt={servicesData.section2ImageAlt}
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      image2Loaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
                    }`}
                    onLoad={() => setImage2Loaded(true)}
                  />
                  
                  {/* Overlay gradiente sutil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                {/* Elemento decorativo */}
                <div className="absolute -inset-4 -z-10">
                  <div 
                    className="w-full h-full rounded-3xl transform -rotate-3 transition-transform duration-500 group-hover:-rotate-2"
                    style={{
                      background: 'linear-gradient(135deg, rgba(32, 110, 52, 0.1), rgba(112, 189, 68, 0.1))'
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Lado Direito - Conteúdo */}
            <div className="flex-1 max-w-2xl">
              <div className="flex flex-col items-start justify-between max-md:items-center max-md:text-center">
                
                {/* Badge de categoria */}
                <div className="inline-flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-full mb-8 shadow-sm">
                  <div 
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: '#206E34' }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                    Nossa Filosofia
                  </span>
                </div>

                {/* Título principal */}
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-light text-gray-900 mb-6 leading-tight">
                  {servicesData.section2Title.split(' ').map((word, index, array) => (
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
                </h1>

                {/* Linha decorativa */}
                <div 
                  className="w-20 h-0.5 rounded-full mb-12"
                  style={{
                    background: 'linear-gradient(135deg, #206E34, #70BD44)'
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Grid de Diferenciais */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {servicesData.features.map((feature, index) => (
              <div key={index} className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex flex-col h-full">
                  {/* Número */}
                  <div className="flex items-center gap-3 mb-6">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{
                        background: 'linear-gradient(135deg, #206E34, #70BD44)'
                      }}
                    >
                      {index + 1}
                    </div>
                    <div className="w-8 h-0.5 bg-gray-200 rounded-full"></div>
                  </div>
                  
                  {/* Título */}
                  <h3 
                    className="text-xl font-semibold mb-4 group-hover:translate-x-2 transition-transform duration-300"
                    style={{ color: '#206E34' }}
                  >
                    {feature.title}
                  </h3>
                  
                  {/* Descrição */}
                  <p className="text-gray-600 leading-relaxed flex-1">
                    {feature.description}
                  </p>
                  
                  {/* Linha decorativa no hover */}
                  <div 
                    className="w-12 h-0.5 rounded-full mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #206E34, #70BD44)'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Elementos decorativos de fundo - ADICIONE O SEGUNDO CÍRCULO AQUI */}
        <div 
          className="absolute top-1/4 right-10 w-72 h-72 rounded-full blur-3xl -z-10 opacity-20"
          style={{
            background: 'linear-gradient(135deg, #206E34, #70BD44)'
          }}
        ></div>
        <div 
          className="absolute bottom-1/4 left-10 w-96 h-96 rounded-full blur-3xl -z-10 opacity-10"
          style={{
            background: 'linear-gradient(135deg, #206E34, #70BD44)'
          }}
        ></div>
        
      </div>
    </>
  );
};

export default ServicesSection;