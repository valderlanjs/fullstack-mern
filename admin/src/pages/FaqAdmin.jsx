import React, { useState, useEffect } from "react";
import api from "../api/axios.js"

const backend_url = import.meta.env.VITE_BACKEND_URL;

const FaqAdmin = ({ token }) => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFaq, setEditingFaq] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    question: "",
    answer: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchFaqs = async () => {
    try {
      const response = await api.get(`${backend_url}/api/faqs`);
      if (response.data.success) {
        setFaqs(response.data.faqs);
      }
    } catch (error) {
      console.error("Erro ao carregar FAQs:", error);
      showAlert("Erro ao carregar FAQs", "error");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type = "success") => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      if (editingFaq) {
        // Editar FAQ existente
        const response = await api.put(
          `${backend_url}/api/faqs/${editingFaq.id}`,
          formData,
          config
        );
        if (response.data.success) {
          setFaqs(faqs.map(faq => 
            faq.id === editingFaq.id ? response.data.faq : faq
          ));
          showAlert("FAQ atualizada com sucesso!");
        }
      } else {
        // Criar novo FAQ
        const response = await api.post(
          `${backend_url}/api/faqs`,
          formData,
          config
        );
        if (response.data.success) {
          setFaqs([...faqs, response.data.faq]);
          showAlert("FAQ criada com sucesso!");
        }
      }

      resetForm();
    } catch (error) {
      console.error("Erro ao salvar FAQ:", error);
      showAlert(error.response?.data?.message || "Erro ao salvar FAQ", "error");
    }
  };

  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (faqId) => {
    if (!confirm("Tem certeza que deseja excluir esta FAQ?")) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await api.delete(
        `${backend_url}/api/faqs/${faqId}`,
        config
      );

      if (response.data.success) {
        setFaqs(faqs.filter(faq => faq.id !== faqId));
        showAlert("FAQ excluída com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao excluir FAQ:", error);
      showAlert(error.response?.data?.message || "Erro ao excluir FAQ", "error");
    }
  };

  const resetForm = () => {
    setFormData({
      question: "",
      answer: ""
    });
    setEditingFaq(null);
    setShowForm(false);
  };

  const moveFaq = async (faqId, direction) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await api.put(
        `${backend_url}/api/faqs/${faqId}/move`,
        { direction },
        config
      );

      if (response.data.success) {
        fetchFaqs(); // Recarrega a lista para atualizar a ordem
        showAlert("Ordem atualizada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao mover FAQ:", error);
      showAlert(error.response?.data?.message || "Erro ao mover FAQ", "error");
    }
  };

  // Filtrar FAQs baseado no termo de busca
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchFaqs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Alert de sucesso */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {successMessage}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gerenciar FAQs
        </h1>
        <p className="text-gray-600">
          Adicione, edite ou remova perguntas frequentes
        </p>
      </div>

      {/* Barra de ações */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-6">
        <div className="flex gap-3">
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-br from-[#206E34] to-[#70BD44] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nova Pergunta
          </button>
        </div>

        {/* Barra de pesquisa */}
        <div className="relative w-full lg:w-64">
          <input
            type="text"
            placeholder="Buscar FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#206E34] focus:border-transparent"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {editingFaq ? "Editar FAQ" : "Nova FAQ"}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pergunta *
              </label>
              <input
                type="text"
                required
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#206E34] focus:border-transparent"
                placeholder="Digite a pergunta..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resposta *
              </label>
              <textarea
                required
                rows={6}
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#206E34] focus:border-transparent resize-vertical"
                placeholder="Digite a resposta..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-gradient-to-br from-[#206E34] to-[#70BD44] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
              >
                {editingFaq ? "Atualizar" : "Salvar"} FAQ
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de FAQs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">❓</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhuma FAQ cadastrada
            </h3>
            <p className="text-gray-600 mb-6">
              Clique em "Nova Pergunta" para adicionar a primeira FAQ
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-br from-[#206E34] to-[#70BD44] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
            >
              Criar Primeira FAQ
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {/* Cabeçalho da lista */}
            <div className="p-4 bg-gray-200 flex justify-between items-center">
              <div className="flex-1 font-semibold text-gray-900">Pergunta</div>
              <div className="w-32 text-center font-semibold text-gray-900">Ordem</div>
              <div className="w-24 text-center font-semibold text-gray-900">Ações</div>
            </div>

            {filteredFaqs.map((faq, index) => (
              <div key={faq.id} className="p-6 hover:bg-gray-300 transition-colors duration-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 break-words">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 line-clamp-2 break-words">
                      {faq.answer}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Controles de ordem */}
                    <div className="flex flex-col gap-1 mr-2">
                      <button
                        onClick={() => moveFaq(faq.id, 'up')}
                        disabled={index === 0}
                        className={`p-1 rounded ${
                          index === 0 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-gray-600 hover:bg-gray-200 hover:text-[#206E34]'
                        } transition-colors duration-200`}
                        title="Mover para cima"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => moveFaq(faq.id, 'down')}
                        disabled={index === faqs.length - 1}
                        className={`p-1 rounded ${
                          index === faqs.length - 1 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-gray-600 hover:bg-gray-200 hover:text-[#206E34]'
                        } transition-colors duration-200`}
                        title="Mover para baixo"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    {/* Botões de ação */}
                    <button
                      onClick={() => handleEdit(faq)}
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-200"
                      title="Editar FAQ"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors duration-200"
                      title="Excluir FAQ"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mensagem quando não há resultados na busca */}
        {searchTerm && filteredFaqs.length === 0 && faqs.length > 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhuma FAQ encontrada
            </h3>
            <p className="text-gray-600 mb-4">
              Não encontramos FAQs correspondentes a "{searchTerm}"
            </p>
            <button 
              onClick={() => setSearchTerm("")}
              className="text-[#206E34] hover:text-[#70BD44] font-medium transition-colors duration-200"
            >
              Limpar busca
            </button>
          </div>
        )}
      </div>

      {/* Estatísticas */}
      {!loading && faqs.length > 0 && (
        <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
          <div>
            {filteredFaqs.length} de {faqs.length} {faqs.length === 1 ? 'pergunta' : 'perguntas'} 
            {searchTerm && ` (filtradas)`}
          </div>
          <div>
            Ordenado por: <span className="font-medium">Posição</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaqAdmin;