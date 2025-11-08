// components/ImageTextSection.jsx
import React from "react";

const ImageTextSection = ({ 
  section, 
  index 
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
    /* Remove bordas, sombras e fundo - agora fica dentro da div pai */
    <div className={`flex flex-col lg:flex-row ${isReversed ? 'lg:flex-row-reverse' : ''} items-center gap-10 p-8 ${
      index > 0 ? 'border-t border-gray-100' : '' // Apenas borda entre seções
    }`}>
      
      {/* Imagem - 50% da largura */}
      <div className="w-full lg:w-1/2 flex justify-center items-center">
        <div className="w-full max-w-md">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-72 lg:h-80 object-cover rounded-xl shadow-md"
          />
        </div>
      </div>
      
      {/* Texto - 50% da largura, conteúdo centralizado e com largura limitada */}
      <div className="w-full lg:w-1/2 flex justify-center items-center">
        <div className="w-full max-w-sm text-center">
          {/* Título */}
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
            {title}
          </h2>
          
          {/* Texto com tamanho fixo de 20px */}
          <div className="space-y-4">
            {content.split('\n').map((paragraph, idx) => (
              <p 
                key={idx} 
                className="text-gray-500 leading-[1.7] text-[20px]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageTextSection;