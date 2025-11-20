import { useEffect, useState } from 'react';

const backend_url = import.meta.env.VITE_BACKEND_URL;

const TrackingCodes = () => {
  const [trackingCodes, setTrackingCodes] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const initializeTracking = async () => {
      try {
        console.log('🔄 Inicializando códigos de tracking...');
        
        const response = await fetch(`${backend_url}/api/tracking/active`);
        const data = await response.json();
        
        if (data.success && data.data) {
          setTrackingCodes(data.data);
          await injectAllCodes(data.data);
          setLoaded(true);
          console.log('✅ Todos os códigos de tracking foram carregados');
        }
      } catch (error) {
        console.error('❌ Erro ao carregar códigos de tracking:', error);
        setLoaded(true);
      }
    };

    initializeTracking();
  }, []);

  const injectAllCodes = async (codes) => {
    const promises = codes
      .filter(code => code.isActive && code.code.trim())
      .map((code, index) => injectCode(code, index));
    
    await Promise.allSettled(promises);
  };

  const injectCode = (code, index) => {
    return new Promise((resolve) => {
      try {
        // Para códigos Meta Pixel que usam função
        if (code.code.includes('fbq(') || code.code.includes('gtag(')) {
          // Executa o código diretamente
          eval(code.code);
          console.log(`✅ ${code.name} executado`);
          resolve();
          return;
        }

        // Para scripts HTML completos
        if (code.code.includes('<script')) {
          // Cria um elemento div temporário para parsear o HTML
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = code.code;
          
          const scripts = tempDiv.getElementsByTagName('script');
          Array.from(scripts).forEach((script) => {
            const newScript = document.createElement('script');
            
            // Copia todos os atributos
            Array.from(script.attributes).forEach(attr => {
              newScript.setAttribute(attr.name, attr.value);
            });
            
            // Copia o conteúdo
            if (script.src) {
              newScript.src = script.src;
            } else {
              newScript.textContent = script.textContent;
            }
            
            // Adiciona ao documento
            if (code.position === 'head') {
              document.head.appendChild(newScript);
            } else {
              document.body.appendChild(newScript);
            }
          });

          // Lida com noscript tags
          const noscripts = tempDiv.getElementsByTagName('noscript');
          Array.from(noscripts).forEach(noscript => {
            const noscriptDiv = document.createElement('div');
            noscriptDiv.style.display = 'none';
            noscriptDiv.innerHTML = noscript.innerHTML;
            document.body.appendChild(noscriptDiv);
          });
        } else {
          // Código JavaScript puro
          const script = document.createElement('script');
          script.textContent = code.code;
          script.type = 'text/javascript';
          
          if (code.position === 'head') {
            document.head.appendChild(script);
          } else {
            document.body.appendChild(script);
          }
        }
        
        console.log(`✅ ${code.name} injetado com sucesso`);
        resolve();
      } catch (error) {
        console.error(`❌ Erro ao injetar ${code.name}:`, error);
        resolve(); // Resolve mesmo com erro para não bloquear outros
      }
    });
  };

  // Renderização de fallback para códigos que precisam de HTML
  const renderFallbackCodes = () => {
    return trackingCodes
      .filter(code => code.isActive && code.code.includes('<noscript>'))
      .map((code, index) => (
        <div 
          key={`fallback-${code.id}-${index}`}
          style={{ display: 'none' }}
          dangerouslySetInnerHTML={{ __html: code.code }}
        />
      ));
  };

  if (!loaded) {
    // Pode mostrar um loading sutil ou nada
    return null;
  }

  return (
    <>
      {/* Fallback para códigos noscript */}
      {renderFallbackCodes()}
    </>
  );
};

export default TrackingCodes;