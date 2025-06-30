import Title from "./Title";
import { MdForest } from "react-icons/md";

const Features = () => {
  return (
    <section className="max-padd-container py-16 bg-[##F3F4F6]">
      {/*Title */}
      <Title
        title={"Sustentabilidade e qualidade"}
        titleStyles={"text-center"}
      />
      <p className="text-center text-2xl capitalize text-tertiary max-w-2xl mx-auto">
        Madeira sustentável, certificada pelo FSC garantindo qualidade,
        preservação ambiental e benefícos sociais para comunidades florestais.
      </p>
      {/*Container flex flex-col items-center justify-center*/}
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
