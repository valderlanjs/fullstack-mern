import React, { useState, useEffect } from "react";

const backend_url = import.meta.env.VITE_BACKEND_URL;

const MarketingBar = () => {
  const [marketingMessage, setMarketingMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveMessage = async () => {
      try {
        const response = await fetch(
          `${backend_url}/api/marketing-messages/active`
        );
        const data = await response.json();

        if (data.success && data.data) {
          setMarketingMessage(data.data);
        }
      } catch (error) {
        console.error("Erro ao buscar mensagem de marketing:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveMessage();
  }, []);

  if (loading || !marketingMessage || !marketingMessage.isActive) {
    return null;
  }

  // No MarketingBar.jsx - versão com 3 cópias
  return (
    <div className="w-full overflow-hidden relative">
      <div
        className="w-full py-3 text-center relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #206E34, #70BD44)",
          color: marketingMessage.textColor || "#ffffff",
        }}
      >
        {/* Container do scroll com conteúdo triplicado */}
        <div className="marquee-container">
          <div className="marquee-content">
            {/* Primeira cópia */}
            <div className="flex items-center justify-center min-w-full">
              <span className="text-lg font-bold whitespace-nowrap px-4">
                {marketingMessage.message}
              </span>
              {marketingMessage.buttonText && marketingMessage.buttonLink && (
                <a
                  href={marketingMessage.buttonLink}
                  className="ml-6 px-4 py-2 rounded text-sm font-bold border-2 border-white hover:bg-white hover:text-green-700 transition-colors duration-200 whitespace-nowrap"
                >
                  {marketingMessage.buttonText}
                </a>
              )}
            </div>

            {/* Segunda cópia */}
            <div className="flex items-center justify-center min-w-full">
              <span className="text-lg font-bold whitespace-nowrap px-4">
                {marketingMessage.message}
              </span>
              {marketingMessage.buttonText && marketingMessage.buttonLink && (
                <a
                  href={marketingMessage.buttonLink}
                  className="ml-6 px-4 py-2 rounded text-sm font-bold border-2 border-white hover:bg-white hover:text-green-700 transition-colors duration-200 whitespace-nowrap"
                >
                  {marketingMessage.buttonText}
                </a>
              )}
            </div>

            {/* Terceira cópia (opcional para transição mais suave) */}
            <div className="flex items-center justify-center min-w-full">
              <span className="text-lg font-bold whitespace-nowrap px-4">
                {marketingMessage.message}
              </span>
              {marketingMessage.buttonText && marketingMessage.buttonLink && (
                <a
                  href={marketingMessage.buttonLink}
                  className="ml-6 px-4 py-2 rounded text-sm font-bold border-2 border-white hover:bg-white hover:text-green-700 transition-colors duration-200 whitespace-nowrap"
                >
                  {marketingMessage.buttonText}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingBar;
