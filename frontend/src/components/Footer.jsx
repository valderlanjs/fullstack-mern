/*import { Link } from "react-router-dom";
import { 
    BsEnvelopeFill, 
    BsFacebook, 
    BsGeoAltFill, 
    BsInstagram, 
    BsTelephoneFill, 
} from "react-icons/bs"

const Footer = () => {
    return (
        <footer className="max-padd-container mt-10">
            <div className="max-padd-container bg-black text-white py-10 rounded-tr-3xl rounded-tl-3xl">
                <div className="container max-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* LOGO*
                    <div>
                        <Link to='/'>
                            <img src="/logo.png" alt="" className="w-36 h-32"/>
                        </Link>
                        <p className="text-white mt-5">
                        Compromisso com a qualidade e sustentabilidade. Nossa madeira, sua confiança.
                        </p>
                        <p className="mt-4 text-white">
                            Copyright 2024 Madenobre. Todos os direitos reservados.
                        </p>
                    </div>
                    {/* LINKS RÁPIDOS *
                    <div>
                        <h4 className="h4 mb-4">
                            Links Rápidos
                        </h4>
                        <ul className="space-y-2 regular-15">
                            <li className="text-gray-10">
                                <a href="/about">Sobre Nos</a>
                            </li>
                            <li className="text-gray-10">
                                <a href="/properties">Produtos</a>
                            </li>
                            <li className="text-gray-10">
                                <a href="/services">Serviços</a>
                            </li>
                            <li className="text-gray-10">
                                <a href="/contact">Contato</a>
                            </li>
                            
                        </ul>
                    </div>
                    {/* CONTATO Info*
                    <div>
                        <h4 className="h4 mb-4">Contate-nos</h4>
                        <p className="text-gray-10 mb-2">
                            <BsTelephoneFill className="inline-block mr-2" /> +55 (82) 000-0000
                        </p>
                        <p className="text-gray-10 mb-2">
                            <BsEnvelopeFill className="inline-block mr-2" /> {" "} valderlanjosr15@gmail.com
                        </p>
                        <p className="text-gray-10 mb-2">
                            <BsGeoAltFill className="inline-block mr-2" /> {" "} Av. Juca Sampaio 2817 - Jacintinho, Maceió - AL, 57040-600
                        </p>
                    </div>
                    {/* SOCIAL MEDIA *
                    <div>
                        <h4 className="mb-4 h4">Nossas Redes Sociais</h4>
                        <div className="flex space-x-4">
                            <a href=""><BsFacebook className="text-socialFa"/></a>
                            <a href=""><BsInstagram className="text-socialIns"/></a>
                        </div>
                    </div>
                </div>
            
            </div>
        </footer>
    )
}

export default Footer;*/

import { Link } from "react-router-dom";
import {
  BsEnvelopeFill,
  BsFacebook,
  BsGeoAltFill,
  BsInstagram,
  BsTelephoneFill,
} from "react-icons/bs";
import { useState, useEffect } from "react";
import axios from "axios";

const backend_url = import.meta.env.VITE_BACKEND_URL;

const Footer = () => {
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <footer className="max-padd-container mt-10">
        <div className="max-padd-container bg-black text-white py-10 rounded-tr-3xl rounded-tl-3xl">
          <div className="container mx-auto text-center">
            <p>Carregando...</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="max-padd-container mt-10">
      <div className="max-padd-container bg-black text-white py-10 rounded-tr-3xl rounded-tl-3xl">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* LOGO E DESCRIÇÃO */}
          <div>
            <Link to="/">
              <img
                src={footerData?.logoUrl || "/logo.png"}
                alt="Logo Madenobre"
                className="w-36 h-32 object-contain"
              />
            </Link>
            <p className="text-white mt-5">
              {footerData?.description ||
                "Compromisso com a qualidade e sustentabilidade. Nossa madeira, sua confiança."}
            </p>
            <p className="mt-4 text-white text-sm">
              {footerData?.copyright ||
                "Copyright 2024 Madenobre. Todos os direitos reservados."}
            </p>
          </div>

          {/* LINKS RÁPIDOS */}
          <div>
            <h4 className="h4 mb-4">
              {footerData?.quickLinksTitle || "Links Rápidos"}
            </h4>
            <ul className="space-y-2 regular-15">
              <li className="text-gray-10 hover:text-white transition-colors">
                <a href={footerData?.aboutLink || "/about"}>Sobre Nós</a>
              </li>
              <li className="text-gray-10 hover:text-white transition-colors">
                <a href={footerData?.productsLink || "/properties"}>Produtos</a>
              </li>
              <li className="text-gray-10 hover:text-white transition-colors">
                <a href={footerData?.servicesLink || "/services"}>Serviços</a>
              </li>
              <li className="text-gray-10 hover:text-white transition-colors">
                <a href={footerData?.contactLink || "/contact"}>Contato</a>
              </li>
            </ul>
          </div>

          {/* CONTATO */}
          <div>
            <h4 className="h4 mb-4">
              {footerData?.contactTitle || "Contate-nos"}
            </h4>
            <p className="text-gray-10 mb-2 flex items-center">
              <BsTelephoneFill className="inline-block mr-2" />
              {footerData?.phone || "+55 (82) 000-0000"}
            </p>
            <p className="text-gray-10 mb-2 flex items-center">
              <BsEnvelopeFill className="inline-block mr-2" />
              {footerData?.email || "valderlanjosr15@gmail.com"}
            </p>
            <p className="text-gray-10 mb-2 flex items-center">
              <BsGeoAltFill className="inline-block mr-2" />
              {footerData?.address ||
                "Av. Juca Sampaio 2817 - Jacintinho, Maceió - AL, 57040-600"}
            </p>
          </div>

          {/* REDES SOCIAIS */}
          <div>
            <h4 className="mb-4 h4">
              {footerData?.socialTitle || "Nossas Redes Sociais"}
            </h4>
            <div className="flex space-x-4">
              <a
                href={footerData?.facebookUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
              >
                <BsFacebook className="text-socialFa text-2xl" />
              </a>
              <a
                href={footerData?.instagramUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
              >
                <BsInstagram className="text-socialIns text-2xl" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
