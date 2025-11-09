import React from "react";
import { motion } from "framer-motion";
import { animationVariants } from "../constants/animationVariants";
import VendorList from "./vendorList";

const InfoContact = () => {
  return (
    <section className="max-padd-container relative">
      <div className="max-padd-container bg-gray rounded-3xl">
        
        {/* Header Principal */}
        <div className="max-padd-container p-10 py-28 max-md:py-16">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start max-lg:text-center">
            
            {/* Lado Esquerdo - Título */}
            <motion.div
              className="w-full lg:w-1/2"
              initial="initial"
              whileInView="animate"
              variants={animationVariants.slideInLeft}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="flex flex-col items-start max-lg:items-center">
                
                {/* Badge de categoria */}
                <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full mb-8 shadow-sm">
                  <div 
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: '#206E34' }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                    Contato
                  </span>
                </div>

                {/* Título principal com gradiente */}
                <h2 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                  Fale com nossos{" "}
                  <span 
                    style={{
                      background: 'linear-gradient(135deg, #206E34, #70BD44)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    vendedores
                  </span>{" "}
                  e solicite um{" "}
                  <span 
                    style={{
                      background: 'linear-gradient(135deg, #206E34, #70BD44)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    orçamento
                  </span>
                </h2>

                {/* Linha decorativa */}
                <div 
                  className="w-20 h-0.5 rounded-full mb-8"
                  style={{
                    background: 'linear-gradient(135deg, #206E34, #70BD44)'
                  }}
                ></div>
              </div>
            </motion.div>

            {/* Lado Direito - Descrição */}
            <motion.div
              className="w-full lg:w-1/2"
              initial="initial"
              whileInView="animate"
              variants={animationVariants.slideInRight}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="flex flex-col items-start max-lg:items-center">
                
                {/* Badge de destaque */}
                <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full mb-8 shadow-sm">
                  <div 
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: '#206E34' }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                    Nossa Equipe
                  </span>
                </div>

                {/* Descrição */}
                <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed">
                  Nosso time é composto por especialistas dedicados, apaixonados e
                  comprometidos em fornecer produtos e serviços de alta qualidade.
                  Combinando experiência e entusiasmo, nossa equipe está aqui para
                  atender às suas necessidades com excelência e profissionalismo.
                </p>

                {/* Destaque adicional */}
                <div className="flex items-center gap-2 mt-6 text-gray-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">Atendimento personalizado</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Seção de Vendedores */}
        <motion.div
          initial="initial"
          whileInView="animate"
          variants={animationVariants.fadeUp}
          viewport={{ once: true, amount: 0.2 }}
          className="max-padd-container mt-16 mb-20"
        >
          <div className="text-center mb-16">
            
            {/* Badge da seção */}
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full mb-8 shadow-sm">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: '#206E34' }}
              ></div>
              <span className="text-base font-medium text-gray-700 uppercase tracking-wide">
                Equipe Comercial
              </span>
            </div>

            {/* Título da seção */}
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              <span 
                style={{
                  background: 'linear-gradient(135deg, #206E34, #70BD44)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Nossa Equipe de Vendedores
              </span>
            </h2>

            {/* Linha decorativa */}
            <div 
              className="w-24 h-0.5 rounded-full mx-auto mb-8"
              style={{
                background: 'linear-gradient(135deg, #206E34, #70BD44)'
              }}
            ></div>

            {/* Subtítulo */}
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Profissionais qualificados prontos para oferecer a melhor solução para suas necessidades
            </p>
          </div>

          {/* Lista de Vendedores */}
          <motion.div
            initial="initial"
            whileInView="animate"
            variants={animationVariants.fadeUp}
            viewport={{ once: true, amount: 0.2 }}
            className="max-padd-container"
          >
            <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm border border-gray-100">
              <VendorList />
            </div>
          </motion.div>
        </motion.div>

        {/* Seção de Localização */}
        <motion.div
          initial="initial"
          whileInView="animate"
          variants={animationVariants.fadeUp}
          viewport={{ once: true, amount: 0.2 }}
          className="max-padd-container mt-24 mb-16"
        >
          <div className="text-center mb-12">
            
            {/* Badge da localização */}
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full mb-8 shadow-sm">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: '#206E34' }}
              ></div>
              <span className="text-base font-medium text-gray-700 uppercase tracking-wide">
                Onde Estamos
              </span>
            </div>

            {/* Título da localização */}
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              <span 
                style={{
                  background: 'linear-gradient(135deg, #206E34, #70BD44)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Nossa Localização
              </span>
            </h2>

            {/* Linha decorativa */}
            <div 
              className="w-24 h-0.5 rounded-full mx-auto mb-8"
              style={{
                background: 'linear-gradient(135deg, #206E34, #70BD44)'
              }}
            ></div>

            {/* Subtítulo */}
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Visite nossa sede e conheça de perto nossa estrutura e qualidade
            </p>
          </div>

          {/* Mapa */}
          <motion.div
            initial="initial"
            whileInView="animate"
            variants={animationVariants.zoomOut}
            viewport={{ once: true, amount: 0.2 }}
            className="max-w-6xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <iframe
                style={{
                  border: 0,
                  borderRadius: "12px",
                  display: "block",
                  margin: "auto",
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}
                width="100%"
                height="450"
                loading="lazy"
                allowFullScreen
                src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCgBrwojHqYHL6amXT5Qo9RNlpnhdbhoHM&q=Madenobre,Alagoas,AL"
              ></iframe>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Elementos decorativos de fundo */}
      <div 
        className="absolute top-1/4 left-10 w-72 h-72 rounded-full blur-3xl -z-10 opacity-20"
        style={{
          background: 'linear-gradient(135deg, #206E34, #70BD44)'
        }}
      ></div>
      <div 
        className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full blur-3xl -z-10 opacity-10"
        style={{
          background: 'linear-gradient(135deg, #206E34, #70BD44)'
        }}
      ></div>
      
      {/* Círculos adicionais */}
      <div 
        className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full blur-3xl -z-10 opacity-15"
        style={{
          background: 'linear-gradient(135deg, #206E34, #70BD44)'
        }}
      ></div>
      <div 
        className="absolute bottom-1/3 left-1/4 w-56 h-56 rounded-full blur-3xl -z-10 opacity-12"
        style={{
          background: 'linear-gradient(135deg, #206E34, #70BD44)'
        }}
      ></div>
    </section>
  );
};

export default InfoContact;