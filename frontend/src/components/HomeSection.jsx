import React from "react";
import { motion } from "framer-motion";
import { animationVariants } from "../constants/animationVariants";
import { Link } from "react-router-dom";

const HomeSection = () => {
  return (
    <div className="max-padd-container">
      <div
        className="bg-white  rounded-t-lgnded- max-padd-container flex justify-between items-start p-10 py-28 max-md:py-16 gap-5 max-md:px-5 max-md:flex-col max-md:items-center max-md:text-center"
      >
        <div className="w-2/4 max-md:w-full ">
          <motion.div
            initial="initial"
            whileInView="animate"
            variants={animationVariants.zoomOut}
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 className="bem-vindo text-5xl max-md:text-4xl font-bold title-font">
              Bem-vindo ao Grupo Madenobre! No mercado
              <span
                className="text-secondary "
              >
                {" "}
                desde 1998
              </span>
            </h2>
          </motion.div>
        </div>
        <div className="w-2/4 max-md:w-full">
          <motion.div
            initial="initial"
            whileInView="animate"
            variants={animationVariants.fadeRight}
            viewport={{ once: true, amount: 0.2 }}
          >
            <p className="text-xl">
              Há mais de 25 anos, somos referência no mercado de madeiras de
              alta qualidade em Maceió, somos a solução para seus projetos.
              Explore nosso site e descubra como podemos ajudar a transformar
              suas ideias em realidade.
            </p>
            <Link  to={"/about"}>
                <button className="btn-secondary hover:btn-wood mt-5">Sobre Nós</button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};


export default HomeSection;