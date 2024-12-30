import React from "react";
import { motion } from "framer-motion";
import { animationVariants } from "../constants/animationVariants";
import TestCard from "./CardContact";

const InfoContact = () => {
  const sellers = [
    {
      image: "/public/img/Vendedores/carlos.webp",
      name: "Carlos Tavares",
      email: "carlos@grupomadenobre.com.br",
    },
    {
      image: "/public/img/Vendedores/jaelson.png",
      name: "Jaelson Silva",
      email: "jaelson@grupomadenobre.com.br",
    },
    {
      image: "/public/img/Vendedores/jailson.webp",
      name: "Jailson Ferro",
      email: "jailson@grupomadenobre.com.br",
    },
    {
      image: "/public/img/Vendedores/jean.webp",
      name: "Jean Carlos",
      email: "jean@grupomadenobre.com.br",
    },
    {
      image: "/public/img/Vendedores/Luciana.png",
      name: "Luciana Freitas",
      email: "luciana@grupomadenobre.com.br",
    },
  ];

  return (
    <section>
      <div className="max-padd-container bg-gray-100">
        <motion.div
          initial="initial"
          whileInView="animate"
          variants={animationVariants.zoomOut}
          viewport={{ once: true, amount: 0.2 }}
          className="text-content-sell"
        >
          <h2 className="title-text-sell">
            Fale com nossos vendedores e solicite um orçamento
          </h2>
          <p className="description-text-sell">
            Nosso time é composto por especialistas dedicados, apaixonados e
            comprometidos em fornecer produtos e serviços de alta qualidade.
            Combinando experiência e entusiasmo, nossa equipe está aqui para
            atender às suas necessidades com excelência e profissionalismo.
          </p>
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          variants={animationVariants.zoomOut}
          viewport={{ once: true, amount: 0.2 }}
          className="title-seller"
          id="vendedores"
        >
          <h2 className="title-seller-h2">Nossa equipe de vendedores</h2>
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          variants={animationVariants.fadeUp}
          viewport={{ once: true, amount: 0.2 }}
          id="vendedores"
          className="card-seller"
        >
          <div className="sm600:max-padd-container">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm500:gap-2 gap-4">
              {sellers.map((seller, index) => (
                <TestCard 
                key={index}
                image={seller.image}
                name={seller.name}
                email={seller.email}
              />
              ))}   
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InfoContact;
