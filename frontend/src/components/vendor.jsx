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


import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const Vendor = ({ vendor }) => {
  return (
    <div className="bg-[#299D45] rounded-xl p-4 w-full max-w-xs mx-auto shadow-md">
      <div className="bg-white rounded-xl overflow-hidden flex flex-col items-center p-4 relative">
        
        {/* Imagem centralizada */}
        <img
          src={vendor.image}
          alt={`Foto de ${vendor.name}`}
          className="w-40 h-48 object-cover rounded-lg shadow-md mb-4"
        />

        {/* Nome do vendedor */}
        <h2 className="text-lg font-semibold text-gray-800">{vendor.name}</h2>

        {/* Email */}
        <p className="text-sm text-gray-500 mt-1">{vendor.email}</p>

        {/* Botão WhatsApp */}
        {vendor.whatsapp && (
          <a
            href={`https://wa.me/${vendor.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 bg-[#71BC45] text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium hover:bg-[#299D45] transition duration-300"
          >
            <FaWhatsapp className="text-lg" />
            WhatsApp
          </a>
        )}
      </div>
    </div>
  );
};

export default Vendor;
