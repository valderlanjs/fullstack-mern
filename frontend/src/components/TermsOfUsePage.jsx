import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import { useNavigate } from "react-router-dom";

const backend_url = import.meta.env.VITE_BACKEND_URL;

const TermsOfUsePage = () => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPage = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/pages/termos-uso`);
      if (response.data.success) {
        setPage(response.data.page);
      }
    } catch (error) {
      console.error("Erro ao carregar termos de uso:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactClick = () => {
    navigate("/contact");
  };

  useEffect(() => {
    fetchPage();
  }, []);

  if (loading) {
    return (
      <div className="max-padd-container">
        <div className="mx-auto py-24">
          {/* Loading para header */}
          <div className="text-center mb-20">
            <div className="h-16 bg-gray-200 rounded-lg animate-pulse w-80 mx-auto mb-6"></div>
            <div className="h-5 bg-gray-200 rounded animate-pulse w-[500px] mx-auto"></div>
          </div>
          
          {/* Loading para conteúdo */}
          <div className="max-w-4xl mx-auto space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="bg-white rounded-2xl p-8 border border-gray-200">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-padd-container relative">
      <div className="mx-auto py-24">
        
        {/* Header moderno */}
        <div className="text-center mb-16 relative z-10">
          {/* Badge de categoria */}
          <div className="inline-flex items-center gap-2 bg-gray-200 px-6 py-3 rounded-full mb-8">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: '#206E34' }}
            ></div>
            <span className="text-base font-medium text-gray-700 uppercase tracking-wide">
              Legal & Compliance
            </span>
          </div>

          {/* Título principal com gradiente */}
          <h1 className="text-5xl lg:text-6xl xl:text-7xl font-light text-gray-900 mb-8 leading-tight relative">
            Termos de
            <span 
              className="font-bold ml-4"
              style={{
                background: 'linear-gradient(135deg, #206E34, #70BD44)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Uso
            </span>
            
            {/* Círculo decorativo */}
            <div 
              className="absolute -right-20 -top-10 w-40 h-40 rounded-full blur-3xl -z-10 opacity-25"
              style={{
                background: 'linear-gradient(135deg, #206E34, #70BD44)'
              }}
            ></div>
          </h1>

          {/* Linha decorativa */}
          <div 
            className="w-24 h-1 rounded-full mx-auto mb-8"
            style={{
              background: 'linear-gradient(135deg, #206E34, #70BD44)'
            }}
          ></div>

          {/* Subtítulo */}
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
            Conheça as regras e condições para uso do nosso site e serviços
          </p>

          {/* Data de atualização */}
          {page?.lastUpdated && (
            <div className="text-gray-500 text-lg">
              Última atualização: {new Date(page.lastUpdated).toLocaleDateString('pt-BR')}
            </div>
          )}
        </div>

        {/* Container principal com fundo sutil */}
        <div className="bg-gray rounded-3xl p-8 lg:p-12 relative z-10">
          <div className="max-w-4xl mx-auto">
            
            {/* Conteúdo da página */}
            {page ? (
              <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm border border-gray-200">
                <div className="prose prose-lg max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8 first:mt-0" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-8 border-b border-gray-200 pb-2" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-6" {...props} />,
                      p: ({node, ...props}) => <p className="text-gray-600 leading-relaxed mb-4 text-lg" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2 text-lg" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-inside text-gray-600 mb-4 space-y-2 text-lg" {...props} />,
                      li: ({node, ...props}) => <li className="text-gray-600 leading-relaxed" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-semibold text-gray-700" {...props} />,
                    }}
                  >
                    {page.content}
                  </ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-white rounded-2xl p-12 border-2 border-dashed border-gray-300">
                  <div className="text-7xl mb-8">📄</div>
                  <h3 className="text-3xl font-semibold text-gray-900 mb-4">
                    Termos de Uso não encontrados
                  </h3>
                  <p className="text-gray-600 text-xl">
                    Entre em contato conosco para mais informações
                  </p>
                </div>
              </div>
            )}

            {/* Seção de aceitação */}
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-br from-[#206E34] to-[#70BD44] rounded-2xl p-8 lg:p-12 text-white">
                <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                  Ao usar nosso site, você concorda com estes termos
                </h3>
                <p className="text-lg lg:text-xl mb-8 opacity-90 text-blue-200">
                  Se tiver dúvidas, entre em contato conosco
                </p>
                <button 
                  onClick={handleContactClick}
                  className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  Entrar em Contato
                </button>
              </div>
            </div>

            {/* Links para outras páginas legais */}
            <div className="mt-12 text-center">
              <div className="flex flex-wrap justify-center gap-6">
                <a 
                  href="/politica-privacidade" 
                  className="text-[#206E34] hover:text-[#70BD44] font-medium transition-colors duration-200 text-lg"
                >
                  Política de Privacidade
                </a>
                <span className="text-gray-400">•</span>
                <a 
                  href="/faqs" 
                  className="text-[#206E34] hover:text-[#70BD44] font-medium transition-colors duration-200 text-lg"
                >
                  Perguntas Frequentes
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Elementos decorativos de fundo */}
        <div 
          className="absolute top-1/4 left-10 w-80 h-80 rounded-full blur-3xl -z-10 opacity-20"
          style={{
            background: 'linear-gradient(135deg, #206E34, #70BD44)'
          }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-10 w-[500px] h-[500px] rounded-full blur-3xl -z-10 opacity-10"
          style={{
            background: 'linear-gradient(135deg, #206E34, #70BD44)'
          }}
        ></div>
      </div>
    </div>
  );
};

export default TermsOfUsePage;