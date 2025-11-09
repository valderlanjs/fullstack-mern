import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { animationVariants } from "../constants/animationVariants";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import {
  FaStar,
  
  FaWhatsapp,
  FaArrowLeft,
  FaShieldAlt,
  FaCreditCard,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { FaTruckFast } from "react-icons/fa6";
import Footer from "../components/Footer";
import RelatedProducts from "../components/RelatedProducts";
import { Link } from "react-router-dom";

const Product = () => {
  const { productId } = useParams();
  const { backendUrl } = useContext(ShopContext);

  const [product, setProduct] = useState(null);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSingleProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${backendUrl}/api/product/${productId}`
        );

        if (response.data.success) {
          setProduct(response.data.product);
          if (
            response.data.product.image &&
            response.data.product.image.length > 0
          ) {
            setImage(response.data.product.image[0]);
          }
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError(
          "Não foi possível carregar os dados do produto. Tente novamente mais tarde."
        );
        console.error("Erro ao buscar produto específico:", err);
      } finally {
        setLoading(false);
      }
    };

    if (productId && backendUrl) {
      fetchSingleProduct();
    }
  }, [productId, backendUrl]);

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-white py-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 w-full relative z-10">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/2">
              <div className="h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
            </div>
            <div className="lg:w-1/2 space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded animate-pulse w-48"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="text-6xl mb-4 text-red-500">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Erro ao carregar produto
          </h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link to="/collection" className="btn-secondary">
            Voltar aos Produtos
          </Link>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="text-6xl mb-4 text-gray-400">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Produto não encontrado
          </h2>
          <p className="text-gray-600 mb-8">
            O produto que você está procurando não existe ou foi removido.
          </p>
          <Link to="/collection" className="btn-secondary">
            Ver Todos os Produtos
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray relative overflow-hidden">
      {/* Botão Voltar */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 pt-8">
        <motion.div
          initial="initial"
          animate="animate"
          variants={animationVariants.fadeLeft}
        >
          <Link
            to="/collection"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-green-700 transition-colors duration-300 mb-8 group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Voltar para Produtos</span>
          </Link>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-8">
        <motion.div
          initial="initial"
          animate="animate"
          variants={animationVariants.stagger}
          className="flex flex-col lg:flex-row gap-12 lg:gap-16"
        >
          {/* Galeria de Imagens */}
          <motion.div variants={animationVariants.fadeUp} className="lg:w-1/2">
            <div className="flex flex-col-reverse lg:flex-row gap-4">
              {/* Miniaturas */}
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
                {product.image.map((item, i) => (
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    src={item}
                    onClick={() => setImage(item)}
                    key={i}
                    alt={`${product.name} - vista ${i + 1}`}
                    className={`h-20 w-20 lg:h-24 lg:w-24 object-cover rounded-xl cursor-pointer border-2 transition-all duration-300 ${
                      image === item
                        ? "border-green-500 shadow-md"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  />
                ))}
              </div>

              {/* Imagem Principal - CORRIGIDA */}
              <div className="flex-1">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative bg-gradient-to-br from-gray-100 to-gray-100 rounded-2xl p-4 shadow-lg border border-gray-200 overflow-hidden h-96"
                >
                  <img
                    src={image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-xl" // Alterado para object-cover
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Informações do Produto */}
          <motion.div
            variants={animationVariants.fadeUp}
            className="lg:w-1/2 lg:pl-8"
          >
            {/* Categoria */}
            <div className="mb-6">
              <span
                className="inline-block px-4 py-2 text-sm font-medium rounded-full uppercase tracking-wide"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(32, 110, 52, 0.1), rgba(112, 189, 68, 0.1))",
                  color: "#206E34",
                  border: "1px solid rgba(32, 110, 52, 0.2)",
                }}
              >
                {product.category}
              </span>
            </div>

            {/* Nome do Produto */}
            <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Linha Decorativa */}
            <div
              className="w-16 h-1 rounded-full mb-6"
              style={{
                background: "linear-gradient(135deg, #206E34, #70BD44)",
              }}
            ></div>

            {/* Avaliação */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-1 text-yellow-400 text-xl">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <span className="text-gray-600">(5.0)</span>
            </div>

            {/* Descrição */}
            <div className="mb-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                {product.description || "Descrição do produto não disponível."}
              </p>
            </div>

            {/* Botões de Ação */}
            <motion.div
              variants={animationVariants.fadeUp}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <a
                href="/contact"
                className="flex-1 px-8 py-4 text-white rounded-xl hover:opacity-90 transition-opacity duration-300 font-semibold text-center flex items-center justify-center gap-3"
                style={{
                  background: "linear-gradient(135deg, #206E34, #70BD44)",
                }}
              >
                <FaWhatsapp className="text-lg" />
                Faça um Orçamento
              </a>
              <a
                href="/contact"
                className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-green-700 hover:text-white hover:border-green-700 transition-colors duration-300 font-semibold flex items-center justify-center gap-3"
              >
                <FaWhatsapp className="text-lg" />
                WhatsApp
              </a>
            </motion.div>

            {/* Benefícios */}
            <motion.div
              variants={animationVariants.fadeUp}
              className="space-y-4 p-6 rounded-2xl border border-gray-200 bg-gray-200"
            >
              <div className="flex items-center gap-3">
                <FaTruckFast className="text-green-600 text-xl" />
                <span className="font-medium text-gray-900">
                  Frete grátis para todo Alagoas
                </span>
              </div>

              <div className="flex items-center gap-3">
                <FaShieldAlt className="text-green-600 text-xl" />
                <span className="font-medium text-gray-900">
                  Garantia de qualidade
                </span>
              </div>

              <div className="flex items-center gap-3">
                <FaCreditCard className="text-green-600 text-xl" />
                <span className="font-medium text-gray-900">
                  Diversas formas de pagamento
                </span>
              </div>

              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-green-600 text-xl" />
                <span className="font-medium text-gray-900">
                  Entrega em toda Alagoas
                </span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Produtos Relacionados */}
      <div className="mt-16">
        <RelatedProducts category={product.category} />
      </div>

      <Footer />

      {/* Elementos decorativos de fundo */}
      <div
        className="absolute top-1/4 -right-20 w-72 h-72 rounded-full blur-3xl -z-10 opacity-30"
        style={{
          background: "linear-gradient(135deg, #206E34, #70BD44)",
        }}
      ></div>
      <div
        className="absolute bottom-1/4 -left-20 w-96 h-96 rounded-full blur-3xl -z-10 opacity-20"
        style={{
          background: "linear-gradient(135deg, #206E34, #70BD44)",
        }}
      ></div>
    </section>
  );
};

export default Product;
