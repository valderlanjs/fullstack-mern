/*import Title from "./Title";
import { MdForest } from "react-icons/md";

const Features = () => {
  return (
    <section className="max-padd-container py-16 bg-[##F3F4F6]">
      {/*Title *
      <Title
        title={"Sustentabilidade e qualidade"}
        titleStyles={"text-center"}
      />
      <p className="text-center text-2xl capitalize text-tertiary max-w-2xl mx-auto">
        Madeira sustentável, certificada pelo FSC garantindo qualidade,
        preservação ambiental e benefícos sociais para comunidades florestais.
      </p>
      {/*Container flex flex-col items-center justify-center*
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-12 rounded-xl">
        <div className="p-4 rounded-3xl shadow-md bg-white">
          <MdForest className="bold-32 mb-3 text-secondary" />
          <h2 className="h2 capitalize text-secondary text-center">FSC</h2>
          <p className="text-black text-xl">
            Certificado internacional que assegura a procedência, qualidade e
            respeito ao meio ambiente.
            <br /> <br />
            Com nossas práticas a exploração predatórias é eliminada e a
            biodiversidade e os recursos hídricos e do solo são preservados.
          </p>
        </div>
        <div className="p-4 rounded-3xl shadow-md bg-white">
          <MdForest className="bold-32 mb-3 text-secondary" />
          <h2 className="h2 capitalize text-secondary text-center">DOF</h2>
          <p className="text-black text-xl">
            Comercializamos madeira nativa com o Documento de Origem Florestal
            (DOF) emitido pelo Ibama, garantindo a rastreabilidade e a
            legalidade da madeira.
            <br /><br />
            Escolha nossos produtos e faça parte de um consumo consciente que
            promove o desenvolvimento social e econômico das comunidades
            florestais.
          </p>
        </div>
        
      </div>
    </section>
  );
};

export default Features;
*/




import Title from "./Title";
import { MdForest } from "react-icons/md";
import { useState, useEffect } from "react";
import axios from "axios";


const backend_url = import.meta.env.VITE_BACKEND_URL;

const Features = () => {
  const [featuresData, setFeaturesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturesData = async () => {
      try {
        console.log("Buscando dados da features...");
        const response = await axios.get(`${backend_url}/api/features`);
        console.log("Resposta da features:", response.data);
        
        if (response.data.success) {
          setFeaturesData(response.data.features);
        }
      } catch (error) {
        console.error("Erro ao carregar features:", error);
        console.error("Detalhes do erro:", error.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturesData();
  }, []);

  if (loading) {
    return (
      <section className="max-padd-container py-16 bg-gray-100">
        <div className="text-center">
          <div className="h-8 bg-gray-300 rounded animate-pulse w-64 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-300 rounded animate-pulse w-96 mx-auto mb-4"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-12">
          <div className="p-4 rounded-3xl shadow-md bg-white h-64 animate-pulse"></div>
          <div className="p-4 rounded-3xl shadow-md bg-white h-64 animate-pulse"></div>
        </div>
      </section>
    );
  }

  // Aplicar estilos inline baseados nas cores do banco
  const sectionStyle = {
    backgroundColor: featuresData?.backgroundColor || '#f3f4f6'
  };

  const titleStyle = {
    color: featuresData?.titleColor || '#000000'
  };

  const subtitleStyle = {
    color: featuresData?.subtitleColor || '#6b7280'
  };

  const cardStyle = {
    backgroundColor: featuresData?.cardBackgroundColor || '#ffffff'
  };

  const cardTitleStyle = {
    color: featuresData?.cardTitleColor || '#16a34a'
  };

  const cardTextStyle = {
    color: featuresData?.cardTextColor || '#000000'
  };

  const iconStyle = {
    color: featuresData?.iconColor || '#16a34a'
  };

  return (
    <section className="max-padd-container py-16" style={sectionStyle}>
      {/*Title */}
      <Title
        title={featuresData?.title || "Sustentabilidade e qualidade"}
        titleStyles={"text-center"}
        customStyle={titleStyle}
      />
      <p 
        className="text-center text-2xl capitalize max-w-2xl mx-auto"
        style={subtitleStyle}
      >
        {featuresData?.subtitle || "Madeira sustentável, certificada pelo FSC garantindo qualidade, preservação ambiental e benefícios sociais para comunidades florestais."}
      </p>
      
      {/*Container flex flex-col items-center justify-center*/}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-12 rounded-xl">
        {/* Card 1 - FSC */}
        <div className="p-4 rounded-3xl shadow-md" style={cardStyle}>
          <MdForest className="bold-32 mb-3" style={iconStyle} />
          <h2 className="h2 capitalize text-center" style={cardTitleStyle}>
            {featuresData?.card1Title || "FSC"}
          </h2>
          <p className="text-xl" style={cardTextStyle}>
            {featuresData?.card1Content?.split('\n\n').map((paragraph, index) => (
              <span key={index}>
                {paragraph}
                {index < featuresData.card1Content.split('\n\n').length - 1 && <><br /><br /></>}
              </span>
            )) || "Certificado internacional que assegura a procedência, qualidade e respeito ao meio ambiente.\n\nCom nossas práticas a exploração predatórias é eliminada e a biodiversidade e os recursos hídricos e do solo são preservados."}
          </p>
        </div>

        {/* Card 2 - DOF */}
        <div className="p-4 rounded-3xl shadow-md" style={cardStyle}>
          <MdForest className="bold-32 mb-3" style={iconStyle} />
          <h2 className="h2 capitalize text-center" style={cardTitleStyle}>
            {featuresData?.card2Title || "DOF"}
          </h2>
          <p className="text-xl" style={cardTextStyle}>
            {featuresData?.card2Content?.split('\n\n').map((paragraph, index) => (
              <span key={index}>
                {paragraph}
                {index < featuresData.card2Content.split('\n\n').length - 1 && <><br /><br /></>}
              </span>
            )) || "Comercializamos madeira nativa com o Documento de Origem Florestal (DOF) emitido pelo Ibama, garantindo a rastreabilidade e a legalidade da madeira.\n\nEscolha nossos produtos e faça parte de um consumo consciente que promove o desenvolvimento social e econômico das comunidades florestais."}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;