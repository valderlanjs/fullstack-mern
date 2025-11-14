// components/Footer.jsx
import { Link } from "react-router-dom";
import {
  BsEnvelopeFill,
  BsFacebook,
  BsGeoAltFill,
  BsInstagram,
  BsTelephoneFill,
  BsWhatsapp,
  BsClock,
  BsArrowUpRight,
} from "react-icons/bs";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const backend_url = import.meta.env.VITE_BACKEND_URL;

const Footer = () => {
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handlePrivacyClick = () => {
    navigate("/politica-privacidade"); // Use o slug correto
  };

  const handleTermsClick = () => {
    navigate("/termos-uso"); // Use o slug correto
  };

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        console.log("Buscando dados do footer...");
        const response = await axios.get(`${backend_url}/api/footer`);
        console.log("Resposta do footer:", response.data);
        if (response.data.success) {
          setFooterData(response.data.footer);
        }
      } catch (error) {
        console.error("Erro ao carregar footer:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Por favor, insira um email válido");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(
        `${backend_url}/api/newsletter/subscribe`,
        {
          email,
        }
      );

      if (response.data.success) {
        toast.success("Inscrito na newsletter com sucesso!");
        setEmail("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Erro ao inscrever na newsletter:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Erro ao inscrever na newsletter");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  if (loading) {
    return (
      <footer className="max-padd-container mt-20">
        <div className="max-padd-container bg-black text-white py-16 rounded-tr-3xl rounded-tl-3xl">
          <div className="container mx-auto text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-800 rounded w-48 mx-auto"></div>
              <div className="h-4 bg-gray-800 rounded w-64 mx-auto"></div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="max-padd-container mt-20 relative">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 overflow-hidden rounded-tr-3xl rounded-tl-3xl">
        <div
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl opacity-10"
          style={{
            background: "linear-gradient(135deg, #206E34, #70BD44)",
          }}
        ></div>
        <div
          className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-5"
          style={{
            background: "linear-gradient(135deg, #206E34, #70BD44)",
          }}
        ></div>
      </div>

      <div className="max-padd-container bg-black text-white py-16 rounded-tr-3xl rounded-tl-3xl relative z-10 border-t border-gray-800">
        <motion.div
          className="container mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* LOGO E DESCRIÇÃO */}
          <motion.div variants={itemVariants} className="space-y-6">
            <Link to="/" className="block">
              <div className="flex items-center gap-3 group">
                {footerData?.logoUrl ? (
                  <img
                    src={footerData.logoUrl}
                    alt="Logo Madenobre"
                    className="w-14 h-14 object-contain rounded-xl group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-14 h-14 bg-gradient-to-br from-[#206E34] to-[#70BD44] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-lg">M</span>
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Grupo Madenobre
                  </h3>
                  <p className="text-sm text-gray-400">Desde 1998</p>
                </div>
              </div>
            </Link>

            <p className="text-gray-300 leading-relaxed text-sm">
              {footerData?.description ||
                "Compromisso com a qualidade e sustentabilidade. Nossa madeira, sua confiança. Há mais de 25 anos no mercado alagoano."}
            </p>

            {/* Horário de funcionamento */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <BsClock className="text-[#70BD44]" />
                <span className="text-sm font-medium">
                  Horário de Funcionamento
                </span>
              </div>
              <p className="text-gray-300 text-sm">
                {footerData?.businessHours ||
                  "Seg - Sex: 7:00 - 18:00 | Sáb: 7:00 - 12:00"}
              </p>
            </div>
          </motion.div>

          {/* LINKS RÁPIDOS */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-[#70BD44] to-[#206E34] rounded-full"></div>
              {footerData?.quickLinksTitle || "Links Rápidos"}
            </h4>
            <ul className="space-y-3">
              {[
                { href: footerData?.aboutLink || "/about", label: "Sobre Nós" },
                {
                  href: footerData?.productsLink || "/products",
                  label: "Nossos Produtos",
                },
                {
                  href: footerData?.faqLink || "/faq",
                  label: "Perguntas Frequentes",
                },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2 group text-sm"
                  >
                    <BsArrowUpRight className="text-[#70BD44] text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* CONTATO */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-[#70BD44] to-[#206E34] rounded-full"></div>
              {footerData?.contactTitle || "Contate-nos"}
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 group">
                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-[#206E34] transition-colors duration-300 mt-1">
                  <BsTelephoneFill className="text-[#70BD44] text-sm" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm font-medium">Telefone</p>
                  <a
                    href={`tel:${footerData?.phone || "+558200000000"}`}
                    className="text-white hover:text-[#70BD44] transition-colors duration-300 text-sm"
                  >
                    {footerData?.phone || "+55 (82) 0000-0000"}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-[#206E34] transition-colors duration-300 mt-1">
                  <BsWhatsapp className="text-[#70BD44] text-sm" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm font-medium">WhatsApp</p>
                  <a
                    href={`https://wa.me/${
                      footerData?.whatsapp || "+558200000000"
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#70BD44] transition-colors duration-300 text-sm"
                  >
                    {footerData?.whatsapp || "+55 (82) 0000-0000"}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-[#206E34] transition-colors duration-300 mt-1">
                  <BsEnvelopeFill className="text-[#70BD44] text-sm" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm font-medium">E-mail</p>
                  <a
                    href={`mailto:${
                      footerData?.email || "contato@madenobre.com"
                    }`}
                    className="text-white hover:text-[#70BD44] transition-colors duration-300 text-sm break-all"
                  >
                    {footerData?.email || "contato@madenobre.com"}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-[#206E34] transition-colors duration-300 mt-1">
                  <BsGeoAltFill className="text-[#70BD44] text-sm" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm font-medium">Endereço</p>
                  <p className="text-white text-sm">
                    {footerData?.address ||
                      "Av. Juca Sampaio 2817 - Jacintinho, Maceió - AL, 57040-600"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* REDES SOCIAIS E NEWSLETTER */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-[#70BD44] to-[#206E34] rounded-full"></div>
              {footerData?.socialTitle || "Conecte-se Conosco"}
            </h4>

            {/* Redes Sociais */}
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">
                Siga nossas redes sociais e fique por dentro das novidades
              </p>
              <div className="flex gap-3">
                {[
                  {
                    icon: BsFacebook,
                    href: footerData?.facebookUrl || "#",
                    color: "text-blue-500",
                    name: "Facebook",
                  },
                  {
                    icon: BsInstagram,
                    href: footerData?.instagramUrl || "#",
                    color: "text-pink-500",
                    name: "Instagram",
                  },
                  {
                    icon: BsWhatsapp,
                    href: `https://wa.me/${
                      footerData?.whatsapp || "+558200000000"
                    }`,
                    color: "text-green-500",
                    name: "WhatsApp",
                  },
                ].map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all duration-300 group relative"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon
                        className={`text-xl ${social.color} group-hover:scale-110 transition-transform duration-300`}
                      />
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                        {social.name}
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-3">
              <p className="text-gray-300 text-sm font-medium">
                Receba nossas novidades
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-[#70BD44] transition-colors duration-300"
                  required
                />
                <motion.button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-4 py-2 bg-gradient-to-r from-[#206E34] to-[#70BD44] text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: submitting ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {submitting ? "Inscrevendo..." : "Inscrever"}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>

        {/* Linha divisória */}
        <div className="container mx-auto mt-12 pt-8 border-t border-gray-800">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-400 text-sm text-center md:text-left">
              {footerData?.copyright ||
                "© 2024 Grupo Madenobre. Todos os direitos reservados."}
            </p>

            <div className="flex gap-6 text-gray-400 text-sm">
              <button
                onClick={handlePrivacyClick}
                className="hover:text-white transition-colors duration-300"
              >
                Política de Privacidade
              </button>
              <button
                onClick={handleTermsClick}
                className="hover:text-white transition-colors duration-300"
              >
                Termos de Uso
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
