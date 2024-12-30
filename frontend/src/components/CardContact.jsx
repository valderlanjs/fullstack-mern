import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const TestCard = ({ image, email, name }) => {
  return (
    <div className="bg-white h-[340px] w-[200px] border border-gray-200 rounded-lg p-1 overflow-hidden hover:border-[#00801A] duration-200 cursor-pointer">
      <div className="w-full h-[70%] relative p-2 group">
        <img
          src={image}
          alt="Seller"
          className="w-full h-full rounded-md group-hover:scale-110 duration-300"
        />
        {/*navegação lateral */}
      </div>
      <div className="flexCenter flex flex-col gap-2 px-2 pb-2">
        <h3 className="text-[14px] mt-1 sm500:text-xl font-semibold">{name}</h3>
        <h4 className="text-[10px] sm500:text-[10px] font-bold">{email}</h4>
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
    </div>
  );
};

export default TestCard;
