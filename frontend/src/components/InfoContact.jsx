import React from "react";
import { motion } from "framer-motion";
import { animationVariants } from "../constants/animationVariants";
import VendorList from "./vendorList";

const InfoContact = () => {
  return (
    <section className="max-padd-container relative">
      <div className="max-padd-container bg-gray rounded-3xl">
        
        {/* Header Principal - COMPACTADO */}
        <div className="max-padd-container p-4 sm:p-6 md:p-10 py-16 sm:py-20 md:py-28">
          <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-16 items-start max-lg:text-center">
            
            {/* Lado Esquerdo - Título - COMPACTADO */}
            <motion.div
              className="w-full lg:w-1/2"
              initial="initial"
              whileInView="animate"
              variants={animationVariants.slideInLeft}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="flex flex-col items-start max-lg:items-center">
                
                {/* Badge de categoria - REDUZIDO */}
                <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6 md:mb-8 shadow-sm">
                  <div 
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: '#206E34' }}
                  ></div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wide">
                    Contato
                  </span>
                </div>

                {/* Título principal com gradiente - REDUZIDO */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
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

                {/* Linha decorativa - REDUZIDA */}
                <div 
                  className="w-12 sm:w-16 md:w-20 h-0.5 rounded-full mb-4 sm:mb-6 md:mb-8"
                  style={{
                    background: 'linear-gradient(135deg, #206E34, #70BD44)'
                  }}
                ></div>
              </div>
            </motion.div>

            {/* Lado Direito - Descrição - COMPACTADO */}
            <motion.div
              className="w-full lg:w-1/2"
              initial="initial"
              whileInView="animate"
              variants={animationVariants.slideInRight}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="flex flex-col items-start max-lg:items-center">
                
                {/* Badge de destaque - REDUZIDO */}
                <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6 md:mb-8 shadow-sm">
                  <div 
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: '#206E34' }}
                  ></div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wide">
                    Nossa Equipe
                  </span>
                </div>

                {/* Descrição - TEXTO REDUZIDO */}
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed">
                  Nosso time é composto por especialistas dedicados, apaixonados e
                  comprometidos em fornecer produtos e serviços de alta qualidade.
                  Combinando experiência e entusiasmo, nossa equipe está aqui para
                  atender às suas necessidades com excelência e profissionalismo.
                </p>

                {/* Destaque adicional - REDUZIDO */}
                <div className="flex items-center gap-2 mt-4 sm:mt-6 text-gray-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <span className="text-xs sm:text-sm font-medium">Atendimento personalizado</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Seção de Vendedores - CONTAINER MAIS LARGO */}
        <motion.div
          initial="initial"
          whileInView="animate"
          variants={animationVariants.fadeUp}
          viewport={{ once: true, amount: 0.2 }}
          className="mt-8 sm:mt-12 md:mt-16 mb-12 sm:mb-16 md:mb-20"
        >
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            
            {/* Badge da seção - REDUZIDO */}
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 sm:px-6 sm:py-3 rounded-full mb-4 sm:mb-6 md:mb-8 shadow-sm">
              <div 
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                style={{ backgroundColor: '#206E34' }}
              ></div>
              <span className="text-xs sm:text-sm md:text-base font-medium text-gray-700 uppercase tracking-wide">
                Equipe Comercial
              </span>
            </div>

            {/* Título da seção - REDUZIDO */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 leading-tight">
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

            {/* Linha decorativa - REDUZIDA */}
            <div 
              className="w-16 sm:w-20 md:w-24 h-0.5 rounded-full mx-auto mb-4 sm:mb-6 md:mb-8"
              style={{
                background: 'linear-gradient(135deg, #206E34, #70BD44)'
              }}
            ></div>

            {/* Subtítulo - REDUZIDO */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Profissionais qualificados prontos para oferecer a melhor solução para suas necessidades
            </p>
          </div>

          {/* Lista de Vendedores - CONTAINER MAIS LARGO E COM MENOS PADDING */}
          <motion.div
            initial="initial"
            whileInView="animate"
            variants={animationVariants.fadeUp}
            viewport={{ once: true, amount: 0.2 }}
            className="w-full"
          >
            {/* Container com menos padding lateral no mobile */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 xl:p-12 shadow-sm border border-gray-100 mx-2 sm:mx-4 md:mx-6 lg:mx-8">
              <VendorList />
            </div>
          </motion.div>
        </motion.div>

        {/* Seção de Localização - APENAS O MAPS */}
        <motion.div
          initial="initial"
          whileInView="animate"
          variants={animationVariants.fadeUp}
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 sm:mt-16 md:mt-24 mb-12 sm:mb-16 md:mb-20"
        >
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            
            {/* Badge da localização - REDUZIDO */}
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 sm:px-6 sm:py-3 rounded-full mb-4 sm:mb-6 md:mb-8 shadow-sm">
              <div 
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                style={{ backgroundColor: '#206E34' }}
              ></div>
              <span className="text-xs sm:text-sm md:text-base font-medium text-gray-700 uppercase tracking-wide">
                Onde Estamos
              </span>
            </div>

            {/* Título da localização - REDUZIDO */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 leading-tight">
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

            {/* Linha decorativa - REDUZIDA */}
            <div 
              className="w-16 sm:w-20 md:w-24 h-0.5 rounded-full mx-auto mb-4 sm:mb-6 md:mb-8"
              style={{
                background: 'linear-gradient(135deg, #206E34, #70BD44)'
              }}
            ></div>

            {/* Subtítulo - REDUZIDO */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Visite nossa sede e conheça de perto nossa estrutura e qualidade
            </p>
          </div>

          {/* Mapa - APENAS O MAPS SEM INFORMAÇÕES ADICIONAIS */}
          <motion.div
            initial="initial"
            whileInView="animate"
            variants={animationVariants.zoomOut}
            viewport={{ once: true, amount: 0.2 }}
            className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8"
          >
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-gray-200">
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl">
                <iframe
                  style={{
                    border: 0,
                    borderRadius: "12px",
                    display: "block",
                    margin: "auto",
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    minHeight: '400px'
                  }}
                  width="100%"
                  height="400"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCgBrwojHqYHL6amXT5Qo9RNlpnhdbhoHM&q=Madenobre,Alagoas,AL&zoom=15&language=pt-BR"
                  title="Localização da Madenobre em Alagoas"
                ></iframe>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Elementos decorativos de fundo - REDUZIDOS NO MOBILE */}
      <div 
        className="absolute top-1/4 left-4 sm:left-6 md:left-10 w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 rounded-full blur-3xl -z-10 opacity-20"
        style={{
          background: 'linear-gradient(135deg, #206E34, #70BD44)'
        }}
      ></div>
      <div 
        className="absolute bottom-1/4 right-4 sm:right-6 md:right-10 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 rounded-full blur-3xl -z-10 opacity-10"
        style={{
          background: 'linear-gradient(135deg, #206E34, #70BD44)'
        }}
      ></div>
      
      {/* Círculos adicionais - REDUZIDOS NO MOBILE */}
      <div 
        className="absolute top-1/2 right-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full blur-3xl -z-10 opacity-15"
        style={{
          background: 'linear-gradient(135deg, #206E34, #70BD44)'
        }}
      ></div>
      <div 
        className="absolute bottom-1/3 left-1/4 w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full blur-3xl -z-10 opacity-12"
        style={{
          background: 'linear-gradient(135deg, #206E34, #70BD44)'
        }}
      ></div>
    </section>
  );
};

export default InfoContact;