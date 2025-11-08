import React, { useState, useEffect } from "react";
import axios from "axios";
import ImageTextSection from "../components/sectionAboutOne";

const backend_url = import.meta.env.VITE_BACKEND_URL;

const ImageTextSectionsPage = ({ token }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSections = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/sections`);
      if (response.data.success) {
        setSections(response.data.sections);
      }
    } catch (error) {
      console.error("Erro ao carregar seções:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center">Carregando seções...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 max-padd-container">
      {/* DIV PAI ÚNICA COM ESTILO COMPLETO */}
      <div className="bg-white rounded-2xl   overflow-hidden">
        
        {/* Header da seção (opcional) */}
        <div className="bg-gradient-to-r from-secondary to-green-400 p-6 text-center">
          <h1 className="text-3xl font-bold text-white">Nossa Empresa</h1>
          <p className="text-blue-100 mt-2">Conheça mais sobre nossa história e valores</p>
        </div>

        {/* Todas as seções dentro da mesma div */}
        <div className="divide-y divide-gray-100">
          {sections.map((section, index) => (
            <ImageTextSection
              key={section.id || index}
              section={section}
              index={index}
            />
          ))}
        </div>


        {/* Mensagem quando não há seções */}
        {sections.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-xl font-semibold mb-2">Nenhuma seção cadastrada</h3>
            <p>Adicione seções através do painel administrativo</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageTextSectionsPage;

