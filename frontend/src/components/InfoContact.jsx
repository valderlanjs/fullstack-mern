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
      <div className="max-padd-container ">
        <div className="max-padd-container flex justify-between items-start p-10 py-28 max-md:py-16 gap-5 max-md:px-5 max-md:flex-col max-md:items-center max-md:text-center">
          <div className="w-2/4 max-md:w-full ">
            <motion.div
              initial="initial"
              whileInView="animate"
              variants={animationVariants.zoomOut}
              viewport={{ once: true, amount: 0.2 }}
            >
              <h2 className="text-5xl max-md:text-4xl font-bold">
                Fale com nossos{" "}
                <span className="text-secondary">vendedores</span> e solicite um{" "}
                <span className="text-secondary">orçamento</span>
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
                Nosso time é composto por especialistas dedicados, apaixonados e
                comprometidos em fornecer produtos e serviços de alta qualidade.
                Combinando experiência e entusiasmo, nossa equipe está aqui para
                atender às suas necessidades com excelência e profissionalismo.
              </p>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial="initial"
          whileInView="animate"
          variants={animationVariants.zoomOut}
          viewport={{ once: true, amount: 0.2 }}
          className="max-padd-container mt-10 mb-10 flexCenter"
          id="vendedores"
        >
          <h2 className="h1 absolute mt-5 mb-14 font-extralight text-center">
            Nossa equipe de vendedores
          </h2>
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
            <div className="grid grid-cols-2 sm500:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm500:gap-1 gap-2">
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

        <div className="mt-24">
          <h2 className="h2 flexCenter mb-10">Nossa localização</h2>
          <iframe
            style={{
              border: 0,
              borderRadius: "10px",
              display: "block",
              margin: "auto",
              marginBottom: "40px",
            }}
            width="80%"
            height="450"
            loading="lazy"
            allowfullscreen
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCgBrwojHqYHL6amXT5Qo9RNlpnhdbhoHM&q=Madenobre,Alagoas,AL"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default InfoContact;
