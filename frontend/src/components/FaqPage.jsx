import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const backend_url = import.meta.env.VITE_BACKEND_URL;

const FaqPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate("/contact");
  };

  const fetchFaqs = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/faqs`);
      if (response.data.success) {
        setFaqs(response.data.faqs);
      }
    } catch (error) {
      console.error("Erro ao carregar FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Filtrar FAQs baseado no termo de busca
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchFaqs();
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

          {/* Loading para FAQs */}
          <div className="max-w-4xl mx-auto space-y-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl p-8 border border-gray-200"
              >
                <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
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
              style={{ backgroundColor: "#206E34" }}
            ></div>
            <span className="text-base font-medium text-gray-700 uppercase tracking-wide">
              Ajuda & Suporte
            </span>
          </div>

          {/* Título principal com gradiente */}
          <h1 className="text-5xl lg:text-6xl xl:text-7xl font-light text-gray-900 mb-8 leading-tight relative">
            Perguntas
            <span
              className="font-bold ml-4"
              style={{
                background: "linear-gradient(135deg, #206E34, #70BD44)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Frequentes
            </span>
            {/* Círculo decorativo */}
            <div
              className="absolute -right-20 -top-10 w-40 h-40 rounded-full blur-3xl -z-10 opacity-25"
              style={{
                background: "linear-gradient(135deg, #206E34, #70BD44)",
              }}
            ></div>
          </h1>

          {/* Linha decorativa */}
          <div
            className="w-24 h-1 rounded-full mx-auto mb-8"
            style={{
              background: "linear-gradient(135deg, #206E34, #70BD44)",
            }}
          ></div>

          {/* Subtítulo */}
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
            Encontre respostas para as dúvidas mais comuns sobre nossos produtos
            e serviços
          </p>

          {/* Barra de pesquisa */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar nas perguntas frequentes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 pl-14 bg-white border border-gray-300 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#206E34] focus:border-transparent text-lg placeholder-gray-500"
              />
              <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Container principal com fundo sutil */}
        <div className="bg-gray rounded-3xl p-8 lg:p-12 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Contador de resultados */}
            {searchTerm && (
              <div className="mb-8 text-center">
                <p className="text-gray-600 text-lg">
                  {filteredFaqs.length === 0 ? "Nenhum" : filteredFaqs.length}
                  resultado{filteredFaqs.length !== 1 ? "s" : ""} encontrado
                  {filteredFaqs.length !== 1 ? "s" : ""}
                  {searchTerm && ` para "${searchTerm}"`}
                </p>
              </div>
            )}

            {/* Lista de FAQs */}
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <button
                    className="w-full px-6 py-6 lg:px-8 lg:py-6 text-left flex justify-between items-start gap-4 hover:bg-green-500 transition-colors duration-200"
                    onClick={() => toggleFaq(index)}
                  >
                    <div className="flex-1 text-left">
                      <h3 className="text-lg lg:text-xl font-semibold text-gray-900 pr-4 leading-relaxed">
                        {faq.question}
                      </h3>
                    </div>
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        activeIndex === index
                          ? "bg-gradient-to-br from-[#206E34] to-[#70BD44] text-white rotate-180"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <svg
                        className="w-5 h-5 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>

                  <div
                    className={`px-6 lg:px-8 overflow-hidden transition-all duration-300 ${
                      activeIndex === index ? "max-h-96 pb-6" : "max-h-0"
                    }`}
                  >
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-gray-600 text-base lg:text-lg leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mensagem quando não há FAQs */}
            {faqs.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-white rounded-2xl p-12 border-2 border-dashed border-gray-300">
                  <div className="text-7xl mb-8">❓</div>
                  <h3 className="text-3xl font-semibold text-gray-900 mb-4">
                    Nenhuma pergunta frequente cadastrada
                  </h3>
                  <p className="text-gray-600 text-xl">
                    Em breve teremos perguntas frequentes disponíveis
                  </p>
                </div>
              </div>
            )}

            {/* Mensagem quando não há resultados na busca */}
            {searchTerm && filteredFaqs.length === 0 && faqs.length > 0 && (
              <div className="text-center py-16">
                <div className="bg-white rounded-2xl p-12 border-2 border-dashed border-gray-300">
                  <div className="text-7xl mb-8">🔍</div>
                  <h3 className="text-3xl font-semibold text-gray-900 mb-4">
                    Nenhum resultado encontrado
                  </h3>
                  <p className="text-gray-600 text-xl mb-6">
                    Não encontramos nenhuma pergunta correspondente a "
                    {searchTerm}"
                  </p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="bg-gradient-to-br from-[#206E34] to-[#70BD44] text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    Limpar busca
                  </button>
                </div>
              </div>
            )}

            {/* Seção de ajuda adicional */}
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-br from-[#206E34] to-[#70BD44] rounded-2xl p-8 lg:p-12 text-white">
                <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                  Não encontrou o que procurava?
                </h3>
                <p className="text-lg lg:text-xl mb-8 opacity-90 text-blue-200">
                  Entre em contato conosco para mais informações
                </p>
                <button
                  onClick={handleContactClick}
                  className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  Entrar em Contato
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Elementos decorativos de fundo */}
        <div
          className="absolute top-1/4 left-10 w-80 h-80 rounded-full blur-3xl -z-10 opacity-20"
          style={{
            background: "linear-gradient(135deg, #206E34, #70BD44)",
          }}
        ></div>
        <div
          className="absolute bottom-1/4 right-10 w-[500px] h-[500px] rounded-full blur-3xl -z-10 opacity-10"
          style={{
            background: "linear-gradient(135deg, #206E34, #70BD44)",
          }}
        ></div>

        {/* Círculos decorativos adicionais */}
        <div
          className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full blur-3xl -z-10 opacity-15"
          style={{
            background: "linear-gradient(135deg, #206E34, #70BD44)",
          }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full blur-3xl -z-10 opacity-10"
          style={{
            background: "linear-gradient(135deg, #206E34, #70BD44)",
          }}
        ></div>
      </div>
    </div>
  );
};

export default FaqPage;
