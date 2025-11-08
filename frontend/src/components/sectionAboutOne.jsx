// components/ImageTextSection.jsx - COM ELEMENTOS MAIORES
import React from "react";

const ImageTextSection = ({ 
  section, 
  index,
  onImageLoad,
  imageLoaded
}) => {
  const { 
    imageUrl, 
    imageAlt, 
    title, 
    content, 
    imagePosition = 'left' 
  } = section;

  const isReversed = imagePosition === 'right';

  return (
    <div className={`flex flex-col lg:flex-row ${isReversed ? 'lg:flex-row-reverse' : ''} items-center gap-16 lg:gap-20 group`}>
      
      {/* Container da Imagem - MAIS LARGA (60%) */}
      <div className="w-full lg:w-3/5 relative">
        <div className="relative">
          {/* Imagem principal - MAIOR */}
          <div className="aspect-[4/3] relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100">
            <img
              src={imageUrl}
              alt={imageAlt}
              className={`w-full h-full object-cover transition-all duration-700 ${
                imageLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
              } group-hover:scale-105`}
              onLoad={onImageLoad}
            />
            
            {/* Overlay gradiente sutil no hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          
          {/* Elemento decorativo - MAIOR */}
          <div className="absolute -inset-6 -z-10">
            <div 
              className={`w-full h-full rounded-2xl transform transition-transform duration-500 group-hover:rotate-2 ${
                isReversed ? '-rotate-3' : 'rotate-3'
              }`}
              style={{
                background: 'linear-gradient(135deg, rgba(32, 110, 52, 0.1), rgba(112, 189, 68, 0.1))'
              }}
            ></div>
          </div>

          {/* Badge numérico - MAIOR */}
          <div 
            className="absolute -top-6 -left-6 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #206E34, #70BD44)'
            }}
          >
            {index + 1}
          </div>
        </div>
      </div>
      
      {/* Container do Texto - MAIS LARGO (40%) */}
      <div className="w-full lg:w-2/5">
        <div className="max-w-lg mx-auto lg:mx-0">
          {/* Título com efeito hover - MAIOR */}
          <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-8 leading-tight group-hover:translate-x-2 transition-transform duration-300">
            {title.split(' ').map((word, wordIndex) => (
              <span
                key={wordIndex}
                className={wordIndex === title.split(' ').length - 1 ? "font-bold" : ""}
                style={
                  wordIndex === title.split(' ').length - 1 
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

          {/* Linha decorativa - MAIOR */}
          <div 
            className="w-20 h-1 rounded-full mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(135deg, #206E34, #70BD44)'
            }}
          ></div>

          {/* Conteúdo do texto - MAIOR */}
          <div className="space-y-6">
            {content.split('\n').map((paragraph, idx) => (
              <p 
                key={idx} 
                className="text-xl text-gray-600 leading-relaxed transition-colors duration-300 group-hover:text-gray-700"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Indicador visual sutil - MAIOR */}
          <div className="flex items-center gap-3 mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div 
              className="w-4 h-4 rounded-full animate-pulse"
              style={{ backgroundColor: '#206E34' }}
            ></div>
            <span className="text-base font-medium text-gray-500">
              {isReversed ? 'Inovação' : 'Qualidade'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageTextSection;