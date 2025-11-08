// components/ImageTextSectionsPage.jsx - COM CÍRCULO EXTRA NO TÍTULO
import React, { useState, useEffect } from "react";
import axios from "axios";
import ImageTextSection from "../components/sectionAboutOne";

const backend_url = import.meta.env.VITE_BACKEND_URL;

const ImageTextSectionsPage = ({ token }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState({});

  const fetchSections = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/sections`);
      if (response.data.success) {
        setSections(response.data.sections);
      }
    } catch (error) {
      console.error("Erro ao carregar seções:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageLoad = (sectionId) => {
    setImagesLoaded(prev => ({ ...prev, [sectionId]: true }));
  };

  useEffect(() => {
    fetchSections();
  }, []);

  if (loading) {
    return (
      <div className="max-padd-container">
        <div className="mx-auto py-24">
          {/* Loading para header */}
          <div className="text-center mb-20">
            <div className="h-16 bg-gray-200 rounded-lg animate-pulse w-80 mx-auto mb-6"></div>
            <div className="h-5 bg-gray-200 rounded animate-pulse w-[500px] mx-auto"></div>
          </div>
          
          {/* Loading para seções */}
          <div className="space-y-24">
            {[1, 2].map((item) => (
              <div key={item} className={`flex flex-col lg:flex-row ${item % 2 === 0 ? 'lg:flex-row-reverse' : ''} items-center gap-16`}>
                <div className="w-full lg:w-3/5">
                  <div className="h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
                </div>
                <div className="w-full lg:w-2/5 space-y-5">
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-padd-container relative">
      <div className="mx-auto py-24">
        
        {/* Header moderno */}
        <div className="text-center mb-24 relative z-10">
          {/* Badge de categoria */}
          <div className="inline-flex items-center gap-2 bg-gray-200 px-6 py-3 rounded-full mb-8">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: '#206E34' }}
            ></div>
            <span className="text-base font-medium text-gray-700 uppercase tracking-wide">
              Nossa História
            </span>
          </div>

          {/* Título principal com gradiente - MAIOR */}
          <h1 className="text-5xl lg:text-6xl xl:text-7xl font-light text-gray-900 mb-8 leading-tight relative">
            Nossa
            <span 
              className="font-bold ml-4"
              style={{
                background: 'linear-gradient(135deg, #206E34, #70BD44)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Empresa
            </span>
            
            {/* NOVO CÍRCULO NO LADO DIREITO DO TÍTULO */}
            <div 
              className="absolute -right-20 -top-10 w-40 h-40 rounded-full blur-3xl -z-10 opacity-25"
              style={{
                background: 'linear-gradient(135deg, #206E34, #70BD44)'
              }}
            ></div>
          </h1>

          {/* Linha decorativa - MAIOR */}
          <div 
            className="w-24 h-1 rounded-full mx-auto mb-8"
            style={{
              background: 'linear-gradient(135deg, #206E34, #70BD44)'
            }}
          ></div>

          {/* Subtítulo - MAIOR */}
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Conheça mais sobre nossa história, valores e o que nos torna únicos no mercado
          </p>
        </div>

        {/* Container principal com fundo sutil */}
        <div className="bg-gray rounded-3xl p-10 lg:p-16 relative z-10">
          {/* Seções */}
          <div className="space-y-24">
            {sections.map((section, index) => (
              <ImageTextSection
                key={section.id || index}
                section={section}
                index={index}
                onImageLoad={() => handleImageLoad(section.id || index)}
                imageLoaded={imagesLoaded[section.id || index]}
              />
            ))}
          </div>

          {/* Mensagem quando não há seções */}
          {sections.length === 0 && (
            <div className="text-center py-24">
              <div className="bg-white rounded-2xl p-16 border-2 border-dashed border-gray-300">
                <div className="text-7xl mb-8">📄</div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-4">
                  Nenhuma seção cadastrada
                </h3>
                <p className="text-gray-600 text-xl">
                  Adicione seções através do painel administrativo
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Elementos decorativos de fundo - CÍRCULOS VERDES ADICIONADOS */}
        <div 
          className="absolute top-1/4 left-10 w-80 h-80 rounded-full blur-3xl -z-10 opacity-20"
          style={{
            background: 'linear-gradient(135deg, #206E34, #70BD44)'
          }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-10 w-[500px] h-[500px] rounded-full blur-3xl -z-10 opacity-10"
          style={{
            background: 'linear-gradient(135deg, #206E34, #70BD44)'
          }}
        ></div>
        
        {/* NOVOS CÍRCULOS ADICIONADOS */}
        <div 
          className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full blur-3xl -z-10 opacity-15"
          style={{
            background: 'linear-gradient(135deg, #206E34, #70BD44)'
          }}
        ></div>
        <div 
          className="absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full blur-3xl -z-10 opacity-10"
          style={{
            background: 'linear-gradient(135deg, #206E34, #70BD44)'
          }}
        ></div>
        <div 
          className="absolute top-3/4 left-1/3 w-72 h-72 rounded-full blur-3xl -z-10 opacity-12"
          style={{
            background: 'linear-gradient(135deg, #206E34, #70BD44)'
          }}
        ></div>
      </div>
    </div>
  );
};

export default ImageTextSectionsPage;