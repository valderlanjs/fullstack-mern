// components/Hero.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { FaWhatsapp, FaArrowRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const backend_url = import.meta.env.VITE_BACKEND_URL;

const Hero = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backend_url}/api/hero/image`);
      if (response.data.success && response.data.images) {
        setBanners(response.data.images);
      }
    } catch (error) {
      console.log("Erro ao obter banners", error);
      toast.error("Erro ao obter banners do hero");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Animations
  const textVariants = {
    initial: { y: 40, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: 0.3,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    }
  };

  // Função para aplicar o gradiente no título
  const applyGradientToTitle = (title, gradientWord, gradientColor) => {
    if (!title || !gradientWord) return title;

    const words = title.split(" ");
    return words
      .map((word) =>
        word.toLowerCase() === gradientWord.toLowerCase()
          ? `<span style="background: linear-gradient(135deg, ${gradientColor}, #8CE563); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${word}</span>`
          : word
      )
      .join(" ");
  };

  // Função para determinar a posição dos botões
  const getButtonsPositionClass = (position) => {
    switch (position) {
      case "bottom-center":
        return "left-1/2 transform -translate-x-1/2";
      case "bottom-right":
        return "right-6";
      case "bottom-left":
      default:
        return "left-6";
    }
  };

  if (loading) {
    return (
      <section className="max-padd-container max-xl:mt-8 mb-16">
        <div className="h-[600px] w-full rounded-tl-3xl rounded-tr-3xl mt-6 bg-gray-200 animate-pulse"></div>
      </section>
    );
  }

  return (
    <section className="max-padd-container max-xl:mt-8 mb-16 relative">
      {banners.length > 0 ? (
        <Swiper
          modules={[Autoplay, Navigation, EffectFade]}
          autoplay={{ 
            delay: 3000,
            disableOnInteraction: false 
          }}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop={true}
          speed={1000}
          className="h-[600px] w-full rounded-tl-3xl rounded-tr-3xl mt-6 shadow-2xl"
        >
          {banners.map((banner, index) => (
            <SwiperSlide key={index}>
              <div
                className="bg-cover bg-center bg-no-repeat h-[600px] w-full rounded-tl-3xl rounded-tr-3xl relative overflow-hidden"
                style={{ backgroundImage: `url(${banner.imageUrl})` }}
              >
                {/* Overlay gradiente para melhor legibilidade */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
                
                {/* Conteúdo do Hero - Textos (condicional) */}
                {banner.showTexts !== false && (
                  <div className="relative h-full flex items-center">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
                      <div className="max-w-2xl">
                        
                        {/* Badge de categoria (condicional) */}
                        {banner.badgeText && (
                          <motion.div
                            initial="initial"
                            animate="animate"
                            variants={textVariants}
                            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-white/30"
                          >
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: banner.gradientColor || '#70BD44' }}
                            ></div>
                            <span className="text-base font-medium text-white uppercase tracking-wide">
                              {banner.badgeText}
                            </span>
                          </motion.div>
                        )}

                        {/* Título principal (condicional) */}
                        {banner.title && (
                          <motion.h1
                            initial="initial"
                            animate="animate"
                            variants={textVariants}
                            className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight"
                            dangerouslySetInnerHTML={{ 
                              __html: applyGradientToTitle(
                                banner.title,
                                banner.gradientWord,
                                banner.gradientColor
                              ) || banner.title
                            }}
                          />
                        )}

                        {/* Linha decorativa (apenas se houver título) */}
                        {banner.title && (
                          <motion.div
                            initial="initial"
                            animate="animate"
                            variants={textVariants}
                            transition={{ delay: 0.2 }}
                            className="w-24 h-1 rounded-full mb-8"
                            style={{
                              background: `linear-gradient(135deg, ${banner.gradientColor || '#70BD44'}, #8CE563)`
                            }}
                          ></motion.div>
                        )}

                        {/* Descrição (condicional) */}
                        {banner.description && (
                          <motion.p
                            initial="initial"
                            animate="animate"
                            variants={textVariants}
                            transition={{ delay: 0.3 }}
                            className="text-xl lg:text-2xl text-white/90 mb-10 leading-relaxed max-w-lg"
                          >
                            {banner.description}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Botões de ação - SEMPRE no canto inferior esquerdo */}
                {banner.showButtons !== false && (banner.button1Text || banner.button2Text) && (
                  <motion.div
                    initial="initial"
                    animate="animate"
                    variants={buttonVariants}
                    transition={{ delay: 0.4 }}
                    className={`absolute bottom-6 ${getButtonsPositionClass(banner.buttonsPosition)} flex flex-col sm:flex-row gap-4`}
                  >
                    {/* Botão 1 */}
                    {banner.button1Text && (
                      <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                      >
                        <Link
                          className="inline-flex items-center gap-3 px-8 py-4 text-white rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 group"
                          style={{
                            background: 'linear-gradient(135deg, #206E34, #70BD44)'
                          }}
                          to={banner.button1Link || "/contact"}
                        >
                          <FaWhatsapp className="text-lg" />
                          {banner.button1Text}
                          <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-200" />
                        </Link>
                      </motion.div>
                    )}

                    {/* Botão 2 */}
                    {banner.button2Text && (
                      <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        transition={{ delay: 0.5 }}
                      >
                        <Link
                          className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                          to={banner.button2Link || "/collection"}
                        >
                          {banner.button2Text}
                          <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-200" />
                        </Link>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Indicadores de slide */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                  {banners.map((_, dotIndex) => (
                    <div
                      key={dotIndex}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        dotIndex === index ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="h-[600px] w-full rounded-tl-3xl rounded-tr-3xl mt-6 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🏗️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Banner em construção
            </h3>
            <p className="text-gray-600">
              Nossos banners estarão disponíveis em breve
            </p>
          </div>
        </div>
      )}

      {/* Elementos decorativos de fundo */}
      <div 
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl -z-10 opacity-30"
        style={{
          background: 'linear-gradient(135deg, #206E34, #70BD44)'
        }}
      ></div>
      <div 
        className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-3xl -z-10 opacity-20"
        style={{
          background: 'linear-gradient(135deg, #206E34, #70BD44)'
        }}
      ></div>
    </section>
  );
};

export default Hero;