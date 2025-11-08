import React from "react";

import { motion } from "framer-motion";
import { animationVariants } from "../constants/animationVariants";
import { Link } from "react-router-dom";

import madeira3 from "../assets/imgAbout/madeira3.jpg";
import aboutImg from "../assets/about.png";
import dof from "../assets/imgAbout/dof.jpg";
import FSC from "../assets/imgAbout/FSC.jpg";
import Footer from "../components/Footer";
import ImageTextSectionsPage from "../components/sectionAboutOnePage"
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
                    className="w-full rounded-3xl rounded-tr-[155px] bg-cover bg-center bg-no-repeat h-96 max-w-[540px] max-sm500:w-[300px] max-sm500:h-[300px]"
                  />
                </div>
              </div>
              {/* lado direito */}
              <div className="flex-1 flex justify-center flex-col ">
                <h2 className="h1 max-w-[472px] max-sm600:text-center">
                  Grupo Madenobre
                </h2>
                <p className="text-xl py-5 max-sm600:text-center">
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
      {/* MISSÃO E VISÃO
      <div className="max-padd-container mt-20">
        <div className="bg-white rounded-t-xl max-padd-container">
          <div className="flex flex-col xl:flex-row gap-10">
            <div className="flex-1 flex justify-center flex-col max-sm600:text-center">
              <h4 className="text-xl py-5">
                Aqui, sabemos muito bem o que fazemos e onde queremos chegar.
                Colocamos sempre você em primeiro lugar, pois nossa missão e
                visão como empresa são guiadas por esse compromisso.
              </h4>
            </div>
            <div className="flex-1 flex justify-center flex-col ">
              <h2 className="h2 text-secondary max-w-[472px] max-sm600:text-center">
                Nossa Missão
              </h2>
              <p className="text-xl py-5 max-sm600:text-center">
                Oferecer o melhor aos nossos clientes para que alcancem a casa
                dos seus sonhos.
              </p>
            </div>
            <div className="flex-1 flex justify-center flex-col ">
              <h2 className="h2 text-secondary max-w-[472px] max-sm600:text-center">
                Nossa Visão
              </h2>
              <p className="text-xl py-5 max-sm600:text-center">
                Inovar em soluções, buscando a melhoria contínua e prezando pela
                responsabilidade socioambiental.
              </p>
            </div>
          </div>
        </div>
      </div>*/}
      <ImageTextSectionsPage />

      {/** Informações 1 */}
      <div className="max-padd-container ">
        <div className="mx-auto bg-white p-10 py-28  max-sm:px-5 max-md:py-16 ">
          <div className="flex w-full gap-10 max-md:flex-col max-md:justify-center max-md:items-center max-md:text-center">
            <div className="flex flex-col items-start justify-between max-md:items-center">
              <h1 className="text-5xl font-bold w-max max-sm500:text-3xl mb-5">
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
            <div className="h-[230px] bg-aboutImage2 w-full bg-cover bg-center"></div>
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

      {/**Informações 2 */}

      <div className="max-padd-container  ">
        <div className=" bg-white  mx-auto  p-10 py-28  max-sm:px-5 max-md:py-16  ">
          <div className=" flex max-md:flex-wrap-reverse justify-center items-end max-md:text-center gap-10 max-md:gap-12  -mt-44 max-md:mt-0 ">
            <div className=" w-1/2 max-md:w-full flex flex-col text-white items-start justify-between max-md:items-center">
              <div className="h-[230px] bg-cover bg-center bg-aboutImage3 w-full"></div>
            </div>

            <div className=" w-1/2 text-5xl max-lg:text-4xl max-md:w-full ">
              <h1 className="font-semibold ">Nós nos concentramos em todos</h1>
              <h1 className="font-semibold" style={{ color: "#00801A" }}>
                os detalhes.
              </h1>
            </div>
          </div>
          <div className="grid grid-cols-3 max-md:grid-cols-1 grid-rows-1 max-md:grid-rows-3 gap-6 mt-10">
            <div className="border-t-2 text-xl border-black/20 pt-4">
              <h2 className="font-semibold">-01</h2>
              <h2 className="mt-7  font-medium" style={{ color: "#00801A" }}>
                Atendimento
              </h2>
              <p className="mt-2">
                Atendimento excepcional do início ao fim. Sua satisfação é nossa
                prioridade.
              </p>
            </div>
            <div className="border-t-2 text-xl border-black/20 pt-4">
              <h2 className="font-semibold">-02</h2>
              <h2 className="mt-7  font-medium" style={{ color: "#00801A" }}>
                Qualidade
              </h2>
              <p className="mt-2">
                Qualidade incomparável em cada pedaço de madeira que entregamos.
              </p>
            </div>
            <div className="border-t-2 text-xl border-black/20 pt-4">
              <h2 className="font-semibold">-03</h2>
              <h2 className="mt-7  font-medium" style={{ color: "#00801A" }}>
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

      {/** Banner*/}
      <div className="max-padd-container">
        <div className="max-padd-container w-full max-xl:mt-8 mb-16 bg-[50%] bg-aboutImage bg-cover bg-no-repeat bg-fixed rounded-xl">
          <div className="py-28 flex justify-end">
            <motion.div
              initial="initial"
              whileInView="animate"
              variants={animationVariants.fadeUp}
              viewport={{ once: true, amount: 0.2 }}
              className=" w-1/2 max-lg:w-2/3 max-md:w-full"
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

      {/* Preservação imagem1*/}
      <div className="max-padd-container ">
        <div className="bg-white rounded-2xl max-padd-container flex flex-col xl:flex-row gap-10">
          {/* Texto */}
          <div className="flex-2 xl:max-w-[500px]">
            <h2 className="text-3xl sm:text-4xl xl:text-5xl text-secondary">
              Promovemos a sustentabilidade e preservação do meio ambiente.
            </h2>
          </div>
          {/* Imagem */}
          <div className="flex justify-center">
            <img
              src={madeira3}
              alt=""
              className="w-full max-w-[400px] sm:max-w-[700px]"
            />
          </div>
        </div>
      </div>

      {/** IMAGEM 2 */}
      <div className="max-padd-container mt-10">
        <div className="bg-white rounded-t-xl max-padd-container flex flex-col xl:flex-row gap-10">
          {/* Imagem */}
          <div className="flex justify-start xl:w-1/2">
            <img src={FSC} alt="" className="w-full max-w-[350px] h-auto" />
          </div>
          {/* Texto */}
          <div className="flex-2 xl:w-1/2">
            <h2 className="text-center text-3xl sm:text-4xl xl:text-5xl text-secondary max-w-[500px] mx-auto">
              FSC
            </h2>
            <p className="text-lg sm:text-xl xl:text-2xl text-tertiary mt-4">
              Certificação Forest Stewardship Council. Atribuída por
              certificadores independentes que estabelecem princípios e
              critérios para assegurar a origem da madeira.
            </p>
            <p className="text-lg sm:text-xl xl:text-2xl text-tertiary mt-4">
              Permitindo ao consumidor consciente a opção de um produto que não
              degrada o meio ambiente e contribui para o desenvolvimento social
              e econômico das comunidades florestais.
            </p>
            <p className="text-lg sm:text-xl xl:text-2xl text-tertiary mt-4">
              A prática predatória é eliminada, a biodiversidade é preservada,
              assim como os recursos hídricos e do solo. Além do benefício
              ambiental, o selo garante que os direitos dos trabalhadores sejam
              respeitados e que as comunidades locais se beneficiem da
              exploração florestal.
            </p>
          </div>
        </div>
      </div>

      {/* Preservação imagem3 */}
      <div className="max-padd-container mt-22 max-sm600:mt-[50px]">
        <div className="bg-white rounded-b-md max-padd-container flex flex-col xl:flex-row gap-10">
          {/* Texto */}
          <div className="flex-1 flex justify-center flex-col">
            <h2 className="text-3xl sm:text-4xl xl:text-5xl text-secondary">
              DOF
            </h2>
            <p className="text-lg sm:text-xl xl:text-2xl py-5 text-tertiary">
              Documento de origem florestal, garantindo procedência, manejo
              responsável e qualidade do produto.
            </p>
          </div>
          {/* Imagem */}
          <div className="w-full xl:w-1/2 flex justify-center">
            <img src={dof} alt="" className="w-full max-w-[500px] h-auto" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
