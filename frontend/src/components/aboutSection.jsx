// components/AboutSection.jsx - COM BOTÕES EDITÁVEIS
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const backend_url = import.meta.env.VITE_BACKEND_URL;

const AboutSection = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  const fetchAboutData = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/about-section`);
      if (response.data.success) {
        setAboutData(response.data.aboutSection);
      }
    } catch (error) {
      console.error("Erro ao carregar seção sobre:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-white pt-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 w-full">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            {/* Loading para imagem */}
            <div className="lg:w-1/2">
              <div className="h-[600px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl animate-pulse"></div>
            </div>
            {/* Loading para conteúdo */}
            <div className="lg:w-1/2 space-y-6 pt-16">
              <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-3/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!aboutData) {
    return null;
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          {/* Lado Esquerdo - Imagem */}
          <div className="lg:w-1/2 relative">
            <div className="relative group">
              <div className="h-[600px] relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100">
                <img
                  src={aboutData.imageUrl}
                  alt={aboutData.imageAlt}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    imageLoaded
                      ? "scale-100 opacity-100"
                      : "scale-110 opacity-0"
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              <div className="absolute -inset-4 -z-10">
                <div
                  className="w-full h-full rounded-3xl transform rotate-3 transition-transform duration-500 group-hover:rotate-2"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(32, 110, 52, 0.1), rgba(112, 189, 68, 0.1))",
                  }}
                ></div>
              </div>

              <div className="absolute -top-4 -left-4 bg-white px-4 py-2 rounded-full shadow-lg border border-gray-100">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: "#206E34" }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">
                    Desde 1999
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Lado Direito - Conteúdo */}
          <div className="lg:w-1/2 lg:pl-8 pt-16">
            <div className="max-w-lg">
              {/* Badge de categoria */}
              <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full mb-8">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "#206E34" }}
                ></div>
                <span className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                  Sobre Nós
                </span>
              </div>
              {/* Título principal */}
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-light text-gray-900 mb-6 leading-tight">
                {aboutData.title.split(" ").map((word, index) => (
                  <span
                    key={index}
                    className={
                      index === aboutData.title.split(" ").length - 1
                        ? "font-bold"
                        : ""
                    }
                    style={
                      index === aboutData.title.split(" ").length - 1
                        ? {
                            background:
                              "linear-gradient(135deg, #206E34, #70BD44)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }
                        : {}
                    }
                  >
                    {word}{" "}
                  </span>
                ))}
              </h1>
              {/* Linha decorativa */}
              <div
                className="w-20 h-0.5 rounded-full mb-8"
                style={{
                  background: "linear-gradient(135deg, #206E34, #70BD44)",
                }}
              ></div>
              {/* Conteúdo do texto */}
              <div className="space-y-6">
                {aboutData.content.split("\n").map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-lg text-gray-600 leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
             
              {/* Estatísticas EDITÁVEIS */}
              <div className="flex gap-8 mt-8 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "#206E34" }}
                  >
                    {aboutData.stat1Number || "25+"}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {aboutData.stat1Label || "Anos"}
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "#206E34" }}
                  >
                    {aboutData.stat2Number || "500+"}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {aboutData.stat2Label || "Projetos"}
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "#206E34" }}
                  >
                    {aboutData.stat3Number || "100%"}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {aboutData.stat3Label || "Qualidade"}
                  </div>
                </div>
              </div>
              {/* Call to Action - BOTÕES EDITÁVEIS */}
              <div className="flex gap-4 mt-8">
                <Link
                  to={aboutData.button1Link || "/sobre"}
                  className="px-8 py-3 text-white rounded-lg hover:opacity-90 transition-opacity duration-300 font-medium"
                  style={{
                    background: "linear-gradient(135deg, #206E34, #70BD44)",
                  }}
                >
                  {aboutData.button1Text || "Saiba Mais"}
                </Link>
                <Link
                  to={aboutData.button2Link || "/contato"}
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-green-700 hover:text-white hover:border-green-700 transition-colors duration-300 font-medium"
                >
                  {aboutData.button2Text || "Contato"}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Elementos decorativos de fundo */}
        <div
          className="absolute top-1/4 right-10 w-72 h-72 rounded-full blur-3xl -z-10 opacity-30"
          style={{
            background: "linear-gradient(135deg, #206E34, #70BD44)",
          }}
        ></div>
        <div
          className="absolute bottom-1/4 left-10 w-96 h-96 rounded-full blur-3xl -z-10 opacity-20"
          style={{
            background: "linear-gradient(135deg, #206E34, #70BD44)",
          }}
        ></div>
      </div>
    </section>
  );
};

export default AboutSection;
