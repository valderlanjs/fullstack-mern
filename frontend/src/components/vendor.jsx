import React, { useState, useRef, useContext } from "react";
import { FaWhatsapp, FaEnvelope, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import { ShopContext } from "../context/ShopContext";

const Vendor = ({ vendor }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showEmailTooltip, setShowEmailTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const emailRef = useRef(null);
  
  const { whatsappConfig } = useContext(ShopContext);

  const handleMouseMove = (e) => {
    if (emailRef.current) {
      const rect = emailRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  // Função para gerar link do WhatsApp com APENAS a mensagem padrão
  const getWhatsAppLink = () => {
    if (!whatsappConfig || !whatsappConfig.is_active) return "#";
    
    const cleanNumber = whatsappConfig.phone_number.replace(/\D/g, '');
    // APENAS a mensagem padrão, sem nome e email do vendedor
    const encodedMessage = encodeURIComponent(whatsappConfig.default_message);
    
    return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
  };

  return (
    <motion.div 
      className="group relative w-full"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Card Principal */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 lg:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 group-hover:border-green-200 relative overflow-hidden min-h-0 w-full">
        
        {/* Elemento decorativo de fundo */}
        <div className="absolute -inset-1 sm:-inset-2 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div 
            className="w-full h-full rounded-xl sm:rounded-2xl transform rotate-3 transition-transform duration-500 group-hover:rotate-2"
            style={{
              background: 'linear-gradient(135deg, rgba(32, 110, 52, 0.05), rgba(112, 189, 68, 0.05))'
            }}
          ></div>
        </div>

        {/* Header do Card */}
        <div className="text-center mb-2 sm:mb-3 md:mb-4">
          
          {/* Container da Imagem */}
          <div className="relative inline-block mb-2 sm:mb-3 md:mb-4">
            <div className="absolute -inset-1 sm:-inset-2 -z-10">
              <div 
                className="w-full h-full rounded-xl sm:rounded-2xl transform rotate-3 transition-transform duration-500 group-hover:rotate-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(32, 110, 52, 0.1), rgba(112, 189, 68, 0.1))'
                }}
              ></div>
            </div>

            {/* Imagem do vendedor */}
            <div className="relative">
              {vendor.image ? (
                <>
                  <img
                    src={vendor.image}
                    alt={`Foto de ${vendor.name}`}
                    className={`w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 lg:w-32 lg:h-36 object-cover rounded-xl sm:rounded-2xl shadow-md transition-all duration-700 ${
                      imageLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-200 rounded-xl sm:rounded-2xl animate-pulse flex items-center justify-center">
                      <FaUser className="text-gray-400 text-sm sm:text-base md:text-lg" />
                    </div>
                  )}
                </>
              ) : (
                <div className="w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 lg:w-32 lg:h-36 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md">
                  <FaUser className="text-gray-400 text-lg sm:text-xl md:text-2xl" />
                </div>
              )}
            </div>
          </div>

          {/* Nome do vendedor */}
          <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1 leading-tight line-clamp-2 px-1">
            {vendor.name}
          </h2>

          {/* Linha decorativa */}
          <div 
            className="w-6 sm:w-8 md:w-10 h-0.5 rounded-full mx-auto mb-1 sm:mb-2"
            style={{
              background: 'linear-gradient(135deg, #206E34, #70BD44)'
            }}
          ></div>
        </div>

        {/* Informações de Contato */}
        <div className="space-y-1 sm:space-y-2 md:space-y-3">
          
          {/* Email - COM TOOLTIP MELHORADO */}
          {vendor.email && (
            <div 
              ref={emailRef}
              className="relative"
              onMouseEnter={() => setShowEmailTooltip(true)}
              onMouseLeave={() => setShowEmailTooltip(false)}
              onMouseMove={handleMouseMove}
            >
              <div className="flex items-center gap-1 p-1 bg-blue-100 rounded-lg hover:bg-gray-100 transition-colors duration-300 min-h-[28px] sm:min-h-[32px] cursor-help">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="text-gray-600 text-[10px] sm:text-xs" />
                </div>
                <p className="text-[10px] sm:text-xs text-gray-600 break-all text-left flex-1 leading-tight line-clamp-1">
                  {vendor.email}
                </p>
              </div>
              
              {/* Tooltip do email - POSICIONAMENTO DINÂMICO */}
              {showEmailTooltip && (
                <div 
                  className="fixed z-50 bg-gray-900 text-white text-xs py-2 px-3 rounded-lg shadow-xl max-w-xs break-words"
                  style={{
                    left: `${tooltipPosition.x + 10}px`,
                    top: `${tooltipPosition.y - 40}px`,
                    transform: 'translateX(-50%)'
                  }}
                >
                  {vendor.email}
                  {/* Seta do tooltip */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              )}
            </div>
          )}

          {/* Botão WhatsApp - USANDO APENAS MENSAGEM PADRÃO */}
          {whatsappConfig && whatsappConfig.is_active && (
            <motion.a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-[#206E34] to-[#70BD44] text-white px-2 py-1.5 sm:py-2 rounded-lg flex items-center justify-center gap-2 font-semibold hover:shadow-lg transition-all duration-300 group/btn relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              
              {/* Efeito de brilho no hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full"></div>
              
              {/* Container do ícone e texto para melhor alinhamento */}
              <div className="flex items-center justify-center gap-1.5 z-10">
                <FaWhatsapp className="text-base sm:text-lg text-white flex-shrink-0" />
                <span className="text-xs sm:text-sm truncate">WhatsApp</span>
              </div>
            </motion.a>
          )}

          {/* Mostrar mensagem se WhatsApp estiver desativado */}
          {whatsappConfig && !whatsappConfig.is_active && (
            <div className="w-full bg-gray-100 text-gray-400 px-2 py-1.5 sm:py-2 rounded-lg flex items-center justify-center gap-2 font-semibold text-xs sm:text-sm">
              <FaWhatsapp className="text-gray-400" />
              WhatsApp Indisponível
            </div>
          )}

          {/* Mostrar estado de carregamento */}
          {!whatsappConfig && (
            <div className="w-full bg-gray-100 text-gray-400 px-2 py-1.5 sm:py-2 rounded-lg flex items-center justify-center gap-2 font-semibold text-xs sm:text-sm">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
              Carregando...
            </div>
          )}
        </div>

        {/* Badge de disponibilidade */}
        <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
          <div className="flex items-center gap-1 bg-green-50 px-1 py-0.5 rounded-full border border-green-200">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-medium text-green-700">Online</span>
          </div>
        </div>
      </div>

      {/* Efeito de brilho externo */}
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#206E34] to-[#70BD44] opacity-0 group-hover:opacity-5 blur-md -z-10 transition-opacity duration-500"></div>
    </motion.div>
  );
};

export default Vendor;