import React from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="max-padd-container max-xl:mt-8 mb-16">
      <div className="max-padd-container bg-hero bg-cover bg-center bg-no-repeat h-[550px] w-full rounded-tl-3xl rounded-tr-3xl mt-6">
        <div className="relative max-w-[777px] top-48 flex flex-col items-start max-[968px]:justify-center max-[968px]:items-center  max-[968px]:pt-20">
          {/*<h5 className="flex items-baseline gap-x-2 uppercase text-white medium-48">Grupo Madenobre</h5>*/}
          <h1 className="text-white mt-8 font-dancing medium-48 max-w-[411px] pl-2 mb-2 border-l-4 border-l-secondary max-[968px]:text-center max-[968px]:pl-0 max-[968px]:border-none">
            O melhor em madeiras você encontra aqui!
          </h1>
          <div className="flex gap-2 sm:gap-6 mt-14 max-[968px]:mt-2">
            <Link
              className="flex items-center gap-2 btn-secondary max-sm:!p-3 hover:bg-wood"
              to="/contact"
            >
              Faça um orçamento <FaWhatsapp />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;