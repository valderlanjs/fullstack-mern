import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const CardContact = ({ image, email, name }) => {
  return (
    <div className="bg-white shadow-md flex flex-col items-center justify-center h-[450px] w-auto rounded-md !md:h-auto">
      <div className="h-[70%] w-[80%] rounded-md ">
        <img
          src={image}
          alt="Imagem Vendedor"
          className="w-full h-full rounded-md"
        />
      </div>
      <div className="mt-4">
        <p className="medium-15">{name}</p>
      </div>
      <div className="mt-2 sm600:text-sm text-xs">{email}</div>
      <div className="flex items-center justify-center gap-3 mt-2">
        <a 
          href="https://wa.me/558233204720"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-black btn-whatsapp"
        >
          WhatsApp <FaWhatsapp size={18} />
        </a>
      </div>
    </div>
  );
};

export default CardContact;
