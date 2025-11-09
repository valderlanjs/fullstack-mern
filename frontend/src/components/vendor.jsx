/*import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const Vendor = ({ vendor }) => {
  return (
    <div className="flex-col flex items-center bg-white lg:h-[380px] lg:w-[210px] h-[300px] w-[160px] border border-gray-200 rounded-lg p-1 overflow-hidden hover:border-[#00801A] duration-200 cursor-pointer">
      <div className="w-full h-[80%] relative p-2 group">
        <img
          src={vendor.image}
          alt="Vendor"
          className="w-full h-full rounded-md group-hover:scale-110 duration-300"
        />
      </div>
      <h4 className="text-lg text-black font-semibold">{vendor.name}</h4>
      <p className="font-bold text-black lg:text-[11px] text-[9px] w-full flex mb-2 justify-center">
        {vendor.email}
      </p>
      {vendor.whatsapp && (
        <a
          href={`https://wa.me/${vendor.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-secondary text-white text-xs sm500:text-[14px] py-2 sm500:py-2 px-3 flexCenter gap-2 rounded-full font-semibold hover:bg-opacity-85 hover:scale-105 duration-300 cursor-pointer"
        >
          WhatsApp <FaWhatsapp />
        </a>
      )}
    </div>
  );
};

export default Vendor;

import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const Vendor = ({ vendor }) => {
  return (
    // 1. ALTURA DO CARD: Adicionada a classe 'min-h-[380px]' para forçar uma altura maior.
    <div className="relative flex flex-col justify-end bg-[#71BC45] text-white rounded-3xl w-full p-6 h-full min-h-[380px]">
      
       2. IMAGEM MAIOR: As dimensões foram aumentadas de 'w-24 h-36' para 'w-32 h-48'. 
      <img
        src={vendor.image}
        alt={`Foto de ${vendor.name}`}
        className="absolute left-1/2 bottom-1/2 w-50 h-56 -translate-x-1/2 transform rounded-2xl object-cover border-4 border-[#70BC44] shadow-lg"
      />

      /* --- Bloco de Conteúdo (sem alterações) --- 
      <div className="flex flex-col items-center text-center w-full">
        <h2 className="text-2xl font-normal">{vendor.name}</h2>
        
        <h3 className="text-sm font-normal text-white/75 mt-1">{vendor.email}</h3>
        
        {vendor.whatsapp && (
          <div className="mt-6">
            <a
              href={`https://wa.me/${vendor.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Contatar ${vendor.name} via WhatsApp`}
              className="grid place-items-center w-12 h-12 rounded-full bg-[#3f3b39] hover:bg-opacity-85 transition-transform duration-300 hover:scale-105"
            >
              <FaWhatsapp className="text-2xl" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vendor;*/
import React, { useState } from "react";
import { FaWhatsapp, FaEnvelope, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";

const Vendor = ({ vendor }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div 
      className="group relative"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Card Principal */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 group-hover:border-green-200 relative overflow-hidden">
        
        {/* Elemento decorativo de fundo */}
        <div className="absolute -inset-4 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div 
            className="w-full h-full rounded-2xl transform rotate-3 transition-transform duration-500 group-hover:rotate-2"
            style={{
              background: 'linear-gradient(135deg, rgba(32, 110, 52, 0.05), rgba(112, 189, 68, 0.05))'
            }}
          ></div>
        </div>

        {/* Header do Card */}
        <div className="text-center mb-6">
          
          {/* Container da Imagem - AUMENTADA */}
          <div className="relative inline-block mb-5">
            {/* Elemento decorativo atrás da imagem */}
            <div className="absolute -inset-4 -z-10">
              <div 
                className="w-full h-full rounded-2xl transform rotate-3 transition-transform duration-500 group-hover:rotate-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(32, 110, 52, 0.1), rgba(112, 189, 68, 0.1))'
                }}
              ></div>
            </div>

            {/* Imagem do vendedor - AUMENTADA */}
            <div className="relative">
              {vendor.image ? (
                <>
                  <img
                    src={vendor.image}
                    alt={`Foto de ${vendor.name}`}
                    className={`w-40 h-48 object-cover rounded-2xl shadow-md transition-all duration-700 ${
                      imageLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                  />
                  
                  {/* Overlay gradiente sutil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Loading state */}
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-200 rounded-2xl animate-pulse flex items-center justify-center">
                      <FaUser className="text-gray-400 text-2xl" />
                    </div>
                  )}
                </>
              ) : (
                <div className="w-40 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-md">
                  <FaUser className="text-gray-400 text-4xl" />
                </div>
              )}
            </div>
          </div>

          {/* Nome do vendedor */}
          <h2 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
            {vendor.name}
          </h2>

          {/* Linha decorativa */}
          <div 
            className="w-12 h-0.5 rounded-full mx-auto mb-3"
            style={{
              background: 'linear-gradient(135deg, #206E34, #70BD44)'
            }}
          ></div>
        </div>

        {/* Informações de Contato */}
        <div className="space-y-4">
          
          {/* Email - ALTURA DIMINUÍDA */}
          {vendor.email && (
            <div className="flex items-center gap-3 p-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors duration-300 min-h-[40px]">
              <div className="w-7 h-7 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                <FaEnvelope className="text-gray-600 text-xs" />
              </div>
              <p className="text-sm text-gray-600 break-all text-left flex-1 leading-tight">
                {vendor.email}
              </p>
            </div>
          )}

          {/* Botão WhatsApp - SÓ ICONE E "WhatsApp" */}
          {vendor.whatsapp && (
            <motion.a
              href={`https://wa.me/${vendor.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-[#206E34] to-[#70BD44] text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold hover:shadow-lg transition-all duration-300 group/btn relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              
              {/* Efeito de brilho no hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full"></div>
              
              <FaWhatsapp className="text-lg text-white z-10" />
              <span className="z-10">WhatsApp</span>
            </motion.a>
          )}
        </div>

        {/* Badge de disponibilidade */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded-full border border-green-200">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-medium text-green-700">Online</span>
          </div>
        </div>
      </div>

      {/* Efeito de brilho externo */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#206E34] to-[#70BD44] opacity-0 group-hover:opacity-5 blur-md -z-10 transition-opacity duration-500"></div>
    </motion.div>
  );
};

export default Vendor;