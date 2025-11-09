import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCoins, FaMobileAlt, FaHeadset, FaAward } from "react-icons/fa";
import { animationVariants } from "../constants/animationVariants";
import axios from "axios";
import { toast } from "react-toastify";

const backend_url = import.meta.env.VITE_BACKEND_URL;

const BannerContact = () => {
  const [bannerImage, setBannerImage] = useState('');
  const [bgImageLoaded, setBgImageLoaded] = useState(false);

  const fetchBannerImage = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/banner/image`);
      if (response.data.success && response.data.banner) {
        setBannerImage(response.data.banner.imageUrl);
      }
    } catch (error) {
      console.log("Erro ao obter a imagem do banner", error);
      toast.error("Erro ao obter a imagem do banner");
    }
  };

  useEffect(() => {
    fetchBannerImage();
  }, []);

  return (
    <section className="max-padd-container mt-10 relative">
      {/* Banner Principal */}
      <div className="max-padd-container pt-32 pb-28 max-sm:pt-40 rounded-tl-3xl rounded-tr-3xl relative overflow-hidden"
        style={{ 
          backgroundImage: `url(${bannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay para melhor legibilidade */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Loading state para imagem de fundo */}
        {!bgImageLoaded && bannerImage && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-tl-3xl rounded-tr-3xl"></div>
        )}
        
        {/* Imagem de fundo invisível para carregamento */}
        {bannerImage && (
          <img
            src={bannerImage}
            alt=""
            className="hidden"
            onLoad={() => setBgImageLoaded(true)}
            onError={() => setBgImageLoaded(true)}
          />
        )}

        <div className="max-padd-container relative z-10">
          <div className="mx-auto w-full text-white px-6 max-sm:px-4 flex flex-col max-lg:items-center max-lg:text-center gap-20">
            
            {/* Header Moderno */}
            <motion.div
              initial="initial"
              whileInView="animate"
              variants={animationVariants.zoomOut}
              viewport={{ once: true, amount: 0.2 }}
              className="text-center"
            >
              {/* Badge de categoria */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-white/30">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: '#70BD44' }}
                ></div>
                <span className="text-base font-medium text-white uppercase tracking-wide">
                  Contato
                </span>
              </div>

              {/* Título principal com gradiente CORRIGIDO */}
              <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-tight">
                <span 
                  style={{
                    background: 'linear-gradient(135deg, #206E34, #70BD44)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Contate-nos
                </span>
              </h1>

              {/* Linha decorativa COM GRADIENTE CORRIGIDO */}
              <div 
                className="w-24 h-1 rounded-full mx-auto mb-8"
                style={{
                  background: 'linear-gradient(135deg, #206E34, #70BD44)'
                }}
              ></div>

              {/* Subtítulo */}
              <p className="text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Estamos prontos para atender suas necessidades com qualidade e excelência
              </p>
            </motion.div>

            {/* Cards de Benefícios */}
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ staggerChildren: 0.3 }}
              className="grid gap-8 w-full max-w-6xl mx-auto grid-cols-1 lg:grid-cols-2"
            >
              
              {/* Card Qualidade e Preço */}
              <motion.div
                variants={animationVariants.fadeUp}
                className="group relative"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:transform hover:scale-105">
                  
                  {/* Elemento decorativo atrás do card */}
                  <div className="absolute -inset-4 -z-10">
                    <div 
                      className="w-full h-full rounded-2xl transform rotate-3 transition-transform duration-500 group-hover:rotate-2 opacity-0 group-hover:opacity-100"
                      style={{
                        background: 'linear-gradient(135deg, rgba(32, 110, 52, 0.2), rgba(112, 189, 68, 0.2))'
                      }}
                    ></div>
                  </div>

                  <div className="flex flex-col gap-6">
                    {/* Header do Card */}
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl transition-all duration-300 group-hover:scale-110"
                        style={{
                          background: 'linear-gradient(135deg, #206E34, #70BD44)'
                        }}
                      >
                        <FaAward />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          Qualidade e Preço
                        </h2>
                        <div className="w-12 h-0.5 rounded-full mt-2"
                          style={{
                            background: 'linear-gradient(135deg, #206E34, #70BD44)'
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Conteúdo */}
                    <p className="text-lg text-white/90 leading-relaxed">
                      Oferecemos madeira de alta qualidade que atende aos mais rigorosos 
                      padrões do mercado. Buscamos superar expectativas com produtos premium, 
                      entrega ágil, preços competitivos e atendimento excepcional.
                    </p>

                    {/* Destaque */}
                    <div className="flex items-center gap-2 text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: '#70BD44' }}
                      ></div>
                      <span className="text-sm font-medium">Compromisso com a excelência</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card Suporte */}
              <motion.div
                variants={animationVariants.fadeUp}
                className="group relative"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:transform hover:scale-105">
                  
                  {/* Elemento decorativo atrás do card */}
                  <div className="absolute -inset-4 -z-10">
                    <div 
                      className="w-full h-full rounded-2xl transform -rotate-3 transition-transform duration-500 group-hover:-rotate-2 opacity-0 group-hover:opacity-100"
                      style={{
                        background: 'linear-gradient(135deg, rgba(32, 110, 52, 0.2), rgba(112, 189, 68, 0.2))'
                      }}
                    ></div>
                  </div>

                  <div className="flex flex-col gap-6">
                    {/* Header do Card */}
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl transition-all duration-300 group-hover:scale-110"
                        style={{
                          background: 'linear-gradient(135deg, #206E34, #70BD44)'
                        }}
                      >
                        <FaHeadset />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          Suporte Dedicado
                        </h2>
                        <div className="w-12 h-0.5 rounded-full mt-2"
                          style={{
                            background: 'linear-gradient(135deg, #206E34, #70BD44)'
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Conteúdo */}
                    <p className="text-lg text-white/90 leading-relaxed">
                      Oferecemos a melhor experiência de compra com suporte dedicado 
                      em todas as etapas. Acreditamos na melhoria contínua, honestidade, 
                      eficiência e satisfação total dos nossos clientes.
                    </p>

                    {/* Destaque */}
                    <div className="flex items-center gap-2 text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: '#70BD44' }}
                      ></div>
                      <span className="text-sm font-medium">Atendimento personalizado</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Elementos decorativos de fundo COM GRADIENTE CORRIGIDO */}
      <div 
        className="absolute top-1/4 left-10 w-80 h-80 rounded-full blur-3xl -z-10 opacity-30"
        style={{
          background: 'linear-gradient(135deg, #206E34, #70BD44)'
        }}
      ></div>
      <div 
        className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full blur-3xl -z-10 opacity-20"
        style={{
          background: 'linear-gradient(135deg, #206E34, #70BD44)'
        }}
      ></div>
      
      {/* Círculos adicionais COM GRADIENTE CORRIGIDO */}
      <div 
        className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full blur-3xl -z-10 opacity-25"
        style={{
          background: 'linear-gradient(135deg, #206E34, #70BD44)'
        }}
      ></div>
      <div 
        className="absolute bottom-1/3 right-1/3 w-72 h-72 rounded-full blur-3xl -z-10 opacity-15"
        style={{
          background: 'linear-gradient(135deg, #206E34, #70BD44)'
        }}
      ></div>
    </section>
  );
};

export default BannerContact;