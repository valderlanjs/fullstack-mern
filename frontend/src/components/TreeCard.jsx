import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const TreeCard = ({ image, title, subtitle, link = "/collection" }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
    >
      <Link
        to={link}
        className="block relative overflow-hidden w-full h-full"
      >
        {/* Container da imagem */}
        <div className="h-80 w-full relative overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          />
          
          {/* Overlay gradiente fixo */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          
          {/* Overlay adicional no hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* Conteúdo do card - SEMPRE visível */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          {/* Título */}
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 line-clamp-2 leading-tight group-hover:text-green-200 transition-colors duration-300">
            {title}
          </h3>

          {/* Subtítulo */}
          {subtitle && (
            <p 
              className="text-lg text-green-100 line-clamp-2 leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                textShadow: '0 1px 2px rgba(0,0,0,0.5)'
              }}
            >
              {subtitle}
            </p>
          )}

          {/* Botão de ação sutil */}
          <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
            <span className="text-green-200 text-sm font-medium uppercase tracking-wide">
              Ver Mais
            </span>
            <div className="w-4 h-px bg-green-200 transition-all duration-300 group-hover:w-8"></div>
          </div>
        </div>

        {/* Efeito de brilho DETRÁS da imagem */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>
      </Link>

      {/* Indicador de hover - FORA do link mas com pointer-events-none */}
      <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
          <svg 
            className="w-5 h-5 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M14 5l7 7m0 0l-7 7m7-7H3" 
            />
          </svg>
        </div>
      </div>

      {/* Efeito de borda gradiente - FORA e ATRÁS com pointer-events-none */}
      <div className="absolute -inset-0.5 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10">
        <div 
          className="w-full h-full rounded-2xl"
          style={{
            background: "linear-gradient(135deg, #206E34, #70BD44)",
            filter: "blur(8px)",
          }}
        ></div>
      </div>
    </motion.div>
  );
};

export default TreeCard;