import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"; // 1. Importamos o axios para fazer a chamada à API
import { ShopContext } from "../context/ShopContext";
import { FaStar, FaTruckFast, FaWhatsapp } from "react-icons/fa6";
import Footer from "../components/Footer";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  const { productId } = useParams();
  // Continuamos a usar o context para dados globais como a URL do backend
  const { backendUrl } = useContext(ShopContext);

  const [product, setProduct] = useState(null); // O estado inicial é nulo
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true); // Estado de carregamento explícito
  const [error, setError] = useState(null); // Estado para capturar erros

  // 2. O coração da melhoria: um useEffect que busca os dados deste produto específico
  useEffect(() => {
    const fetchSingleProduct = async () => {
      setLoading(true); // Inicia o carregamento
      setError(null);
      try {
        // Usamos o endpoint que busca um único produto pelo seu ID na URL
        const response = await axios.get(`${backendUrl}/api/product/${productId}`);

        if (response.data.success) {
          setProduct(response.data.product);
          // Define a imagem inicial de forma segura, verificando se o array de imagens existe
          if (response.data.product.image && response.data.product.image.length > 0) {
            setImage(response.data.product.image[0]);
          }
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError("Não foi possível carregar os dados do produto. Tente novamente mais tarde.");
        console.error("Erro ao buscar produto específico:", err);
      } finally {
        setLoading(false); // Finaliza o carregamento, com sucesso ou erro
      }
    };

    // Só executa a busca se tivermos o productId e a url do backend
    if (productId && backendUrl) {
      fetchSingleProduct();
    }
  }, [productId, backendUrl]); // A busca é refeita se o ID do produto na URL mudar

  // 3. Renderização condicional com base nos estados de carregamento e erro
  if (loading) {
    return <div className="text-center p-10">...Carregando</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-600">{error}</div>;
  }

  // Se o produto não for encontrado, mas não houve erro, exibe uma mensagem amigável
  if (!product) {
    return <div className="text-center p-10">Produto não encontrado.</div>;
  }

  // 4. Se tudo correu bem, o restante do seu código de renderização é executado normalmente
  return (
    <section>
      <div className="max-padd-container mt-8 xl:mt-6">
        <div className="max-padd-container flex gap-12 flex-col xl:flex-row bg-white py-16 rounded-2xl">
          <div className="flex flex-1 gap-x-2 xl:flex-1">
            <div className="flexCenter flex-col gap-[7px] flex-wrap">
              {product.image.map((item, i) => (
                <img
                  src={item}
                  onClick={() => setImage(item)}
                  key={i}
                  alt="productImg"
                  className="max-h-[89px] w-full rounded-lg cursor-pointer"
                />
              ))}
            </div>
            <div className="max-h-[377px] w-[350px] flex">
              <img
                src={image}
                alt="productImg"
                className="rounded-xl bg-gray-10 object-contain"
              />
            </div>
          </div>
          {/* Informações do produto */}
          <div className="flex-[1.5] rounded-2xl px-7 ">
            <h3 className="h3 !my-2.5">{product.name}</h3>
            {/* Avaliação e Preço */}
            <div className="flex items-baseline gap-x-5">
              <div className="flex items-center gap-x-2 text-secondary mb-2">
                <div className="flex gap-x-2 text-secondary text-xl">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
              </div>
            </div>
            <p>{product.description || "Descrição do produto não disponível."}</p>
            <div className="flex flex-col gap-4 my-4 mb-5">
              <div className="flex gap-2">
                {/* Lógica de tamanhos/variações, se aplicável */}
              </div>
            </div>
            <div className="flex items-center gap-x-4">
              <a href="/contact" className="btn-secondary w-1/2 flexCenter gap-x-2 capitalize">Faça um Orçamento</a>
              <a href='/contact' className="btn-light"><FaWhatsapp className="text-secondary" size={24}/></a>
            </div>
            <div className="flex items-center gap-x-2 mt-2">
              <FaTruckFast className="text-lg" />
              <span className="medium-14">Frete grátis!!</span>
            </div>
            <hr className="my-4 w-2/3" />
            <div className="mt-2 flex-col gap-1">
              <p>Garantia para que você possa confiar.</p>
              <p>
                Aproveite as diferentes formas de pagamento para sua
                conveniência.
              </p>
              <p>Entrega em qualquer lugar de Alagoas.</p>
            </div>
          </div>
        </div>
        <RelatedProducts category={product.category} />
      </div>
      <Footer />
    </section>
  );
};

export default Product;