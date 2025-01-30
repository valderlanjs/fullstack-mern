import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const TestCard = ({ image, email, name }) => {
  return (
    <div className="flex-col flex items-center  bg-white  lg:h-[340px] lg:w-[210px] h-[280px] w-[160px] border border-gray-200 rounded-lg p-1 overflow-hidden hover:border-[#00801A] duration-200 cursor-pointer">
      <div className="w-full h-[70%] relative p-2 group">
        <img
          src={image}
          alt="Seller"
          className="w-full h-full rounded-md group-hover:scale-110 duration-300"
        />
       
      </div>
      
        <h3 className="text-lg text-black font-semibold">{name}</h3>
        <p className="font-bold text-black lg:text-[10px] text-[9px] w-full flex mb-2 justify-center">{email}</p>
        <div>
          <a
            href="https://wa.me/558233204720"
            rel="noopener noreferrer"
            target="_blank"
            className="bg-secondary text-white text-xs sm500:text-[14px] py-2 sm500:py-2 px-3 flexCenter gap-2 rounded-full font-semibold hover:bg-opacity-85 hover:scale-105 duration-300 cursor-pointer"
          >
            WhatsApp <FaWhatsapp />
          </a>
        </div>
      
    </div>
  );
};

export default TestCard;
