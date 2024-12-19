import React from "react";
import aboutImg from "../assets/about.png";
import { motion } from "framer-motion";
import { animationVariants } from "../constants/animationVariants";
import { Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa6";
const About = () => {
  {
    /*const statistics = [
    { 
        label: "Sua satisfação é nossa prioridade.",
        value: "Atendimento"
    },
    {
        label: "Qualidade incomparável em cada pedaço de madeira.",
        value: "Qualidade"
    },
    {
        label: "Pontualidade e cuidado em cada passo do trajeto.",
        value: "Entrega"
    }
  ];
*/
  }

  return (
    <>
      <section className="">
        <div className="max-padd-container">
          <div className="max-padd-container py-10 bg-white rounded-2xl my-6">
            {/* CONTAINER */}
            <div className="flex flex-col xl:flex-row gap-10">
              {/* lado esquerdo */}
              <div className="flex-1 relative">
                <div className="rounded-3xl rounded-tr-[155px] w-[530px]">
                  <img
                    src={aboutImg}
                    alt=""
                    className="w-full rounded-3xl rounded-tr-[155px] bg-cover bg-center bg-no-repeat h-96 max-w-[540px]"
                  />
                </div>
              </div>
              {/* lado direito */}
              <div className="flex-1 flex justify-center flex-col ">
                <h2 className="h1 max-w-[472px]">Grupo Madenobre</h2>
                <p className="text-xl py-5">
                  Há mais de 25 anos, o Grupo Madenobre se consolidou como
                  referência no mercado de madeiras em Maceió. Somos mais do que
                  uma empresa de materiais de construção, somos parceiros dos
                  seus sonhos e projetos. Acreditamos que cada obra é única, por
                  isso, oferecemos soluções personalizadas que transcendem o
                  simples fornecimento de produtos.
                </p>
                {/* Staitic container 
              <div className="flex flex-wrap gap-4">
                {statistics.map((statistics, index)=> (
                    <div key={index} className="bg-primary text-secondary p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                            <h3 className="h3">{statistics.value}</h3>
                        </div>
                        <p>{statistics.label}</p>
                    </div>
                ))}
              </div>*/}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/** Informações */}
      <div className="max-padd-container ">
        <div className="mx-auto bg-white rounded-t-xl p-10 py-28  max-sm:px-5 max-md:py-16 ">
          <div className="flex w-full gap-10 max-md:flex-col max-md:justify-center max-md:items-center max-md:text-center">
            <div className="flex flex-col items-start justify-between max-md:items-center">
              <h1 className="text-5xl font-bold title-font w-max">
                O que nós oferecemos
              </h1>
              <div className="flex gap-2 sm:gap-6 mt-14 max-[968px]:mt-2">
                <Link
                  className="flex items-center gap-2 btn-secondary max-sm:!p-3 hover:bg-wood"
                  to="/contact"
                >
                  Faça um orçamento
                </Link>
              
              </div>
            </div>
            <div className="h-[230px] bg-aboutImage2 w-full"></div>
          </div>
          <div className="mt-14 gap-8 max-md:grid-cols-1 max-md:grid-rows-2 grid grid-cols-2 grid-rows-1">
            <div>
              <h2
                className="text-2xl font-semibold"
                style={{ color: "#00801A" }}
              >
                Corte sob medida.
              </h2>
              <p className="text-xl mt-2">
                Seja para construção ou reforma, nossa equipe especializada te
                auxilia na escolha da madeira ideal para o seu projeto, com
                corte sob medida.
              </p>
            </div>
            <div>
              <h2
                className="text-2xl font-semibold"
                style={{ color: "#00801A" }}
              >
                Madeira da melhor qualidade.{" "}
              </h2>
              <p className="text-xl mt-2">
                Com a qualidade incontestável de nossos produtos. Tudo o que
                você precisa para transformar sua ideia em realidade, reunidos
                em um só lugar, com qualidade garantida e preços competitivos.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/**FIM */}

      <div className="max-padd-container  ">
        <div
          className=" bg-white  mx-auto  p-10 py-28  max-sm:px-5 max-md:py-16  "
        >
          <div className=" flex max-md:flex-wrap-reverse justify-center items-end max-md:text-center gap-10 max-md:gap-12  -mt-44 max-md:mt-0 ">
            <div className=" w-1/2 max-md:w-full flex flex-col text-white items-start justify-between max-md:items-center">
            <div className="h-[230px] bg-aboutImage3 w-full"></div>
            </div>

            <div className=" w-1/2 text-5xl max-lg:text-4xl max-md:w-full ">
              <h1 className="font-semibold ">Nós nos concentramos em todos</h1>
              <h1 className="font-semibold" style={{ color: "#00801A" }}>
                os detalhes.
              </h1>
            </div>
          </div>
          <div className="we-focus-cards grid grid-cols-3 max-md:grid-cols-1 grid-rows-1 max-md:grid-rows-3 gap-6 mt-10">
            <div className="border-t-2 text-xl border-black/20 pt-4">
              <h2 className="title-font font-semibold quality-2">-01</h2>
              <h2
                className="title-font mt-7  font-medium"
                style={{ color: "#00801A" }}
              >
                Atendimento
              </h2>
              <p className="mt-2">
                Atendimento excepcional do início ao fim. Sua satisfação é nossa
                prioridade.
              </p>
            </div>
            <div className="border-t-2 text-xl border-black/20 pt-4">
              <h2 className="title-font font-semibold quality-2">-02</h2>
              <h2
                className="title-font mt-7  font-medium"
                style={{ color: "#00801A" }}
              >
                Qualidade
              </h2>
              <p className="mt-2">
                Qualidade incomparável em cada pedaço de madeira que entregamos.
              </p>
            </div>
            <div className="border-t-2 text-xl border-black/20 pt-4">
              <h2 className="title-font font-semibold  quality-2">-03</h2>
              <h2
                className="title-font mt-7  font-medium"
                style={{ color: "#00801A" }}
              >
                Entrega
              </h2>
              <p className="mt-2">
                Entrega rápida e segura em cada canto. Pontualidade e cuidado em
                cada passo do trajeto.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/** Seção 3 */}
      <div className="max-padd-container">
        <div className="max-padd-container w-full max-xl:mt-8 mb-16 bg-[50%] bg-aboutImage bg-cover bg-no-repeat bg-fixed rounded-xl">
          <div className="py-28 flex justify-end">
            <motion.div
              initial="initial"
              whileInView="animate"
              variants={animationVariants.fadeUp}
              viewport={{ once: true, amount: 0.2 }}
              className="w-1/2 max-lg:w-2/3 max-md:w-full"
            >
              <h1 className="text-5xl text-white">
                Nosso objetivo é agregar valor para lares e construções
                <span style={{ color: "#6EBE45" }}>
                  {" "}
                  em todas as fases do processo.
                </span>
              </h1>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
