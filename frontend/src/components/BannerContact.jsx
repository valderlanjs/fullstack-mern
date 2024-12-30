import React from "react";
import { motion } from "framer-motion";
import { FaCoins, FaMobileAlt } from "react-icons/fa";
import { animationVariants } from "../constants/animationVariants";


const BannerContact = () => {
  return (
    <section className=" bg-white">
      <div className="pt-24 pb-20 max-sm:pt-40 max-md:pb-2  flex bg-fixed bg-top bg-no-repeat bg-cover bg-ContactImage">
        <div className="max-padd-container">
          <div className="mx-auto w-full text-white px-10 max-sm:px-5 flex flex-col max-lg:items-center max-lg:text-center gap-16">
            <motion.h1
              initial="initial"
              whileInView="animate"
              variants={animationVariants.zoomOut}
              viewport={{ once: true, amount: 0.2 }}
              className="text-6xl max-lg:mx-auto font-semibold max-sm:text-5xl max-w-lg"
            >
              Contate-nos
            </motion.h1>
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ staggerChildren: 0.2 }}
              className="grid gap-4 w-full text-start grid-cols-2 grid-rows-1 max-md:grid-cols-1 max-md:grid-rows-3 max-md:mt-16"
            >
              <motion.div
                variants={animationVariants.fadeUp}
                className="bg-white text-black rounded-md gap-10  p-6 pb-10 max-lg:p-5 max-lg:pb-8 max-md:p-6 max-md:py-7 max-md:pb-10 flex flex-col gap text-xl "
              >
                <div className="text-2xl flex items-center gap-4">
                  <div className="bg-green-500 w-[60px] h-[58px] rounded-md text-xl flex gap-4 justify-center items-center">
                    <FaCoins className="text-white" />
                  </div>
                  <h2 className="font-semibold conatct-quality">
                    Qualidade e Preço
                  </h2>
                </div>
                <p className="medium-18">
                  Aqui, nos oferecemos madeira de alta qualidade que atende aos
                  mais rigorosos padrões do mercado. Buscamos superar as
                  expectativas com produtos de alta qualidade, entrega rápida,
                  preços justos e atendimento excepcional.{" "}
                </p>
              </motion.div>
              <motion.div
                variants={animationVariants.fadeUp}
                className=" bg-white text-black rounded-md gap-10 p-6 pb-10 max-lg:p-5 max-lg:pb-8 max-md:p-6 max-md:py-7 max-md:pb-10 flex flex-col gap text-xl"
              >
                <div className="card-header text-2xl flex items-center gap-4">
                  <div className="bg-green-500 w-[60px] h-[58px] rounded-md text-xl flex gap-4 justify-center items-center">
                    <FaMobileAlt className="text-white" />
                  </div>
                  <h2 className="title-font font-semibold conatct-quality">
                    Suporte
                  </h2>
                </div>
                <p className="medium-18">
                  Oferecemos a melhor experiência de compra aos nossos clientes.
                  Acreditamos na melhoria contínua, honestidade, eficiência e
                  satisfação total dos nossos clientes, oferecendo suporte
                  dedicado em todas as etapas da sua compra.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerContact;
