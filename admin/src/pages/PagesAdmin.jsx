import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import SafeMarkdown from "./SafeMarkdown"

const backend_url = import.meta.env.VITE_BACKEND_URL;

const PagesAdmin = ({ token }) => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: ""
  });
  const [successMessage, setSuccessMessage] = useState("");

  const fetchPages = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/pages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setPages(response.data.pages);
      }
    } catch (error) {
      console.error("Erro ao carregar páginas:", error);
      showAlert("Erro ao carregar páginas", "error");
    } finally {
      setLoading(false);
    }
  };

  const seedPages = async () => {
    try {
      const response = await axios.post(`${backend_url}/api/pages/seed`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        showAlert("Páginas criadas com sucesso!");
        fetchPages();
      }
    } catch (error) {
      console.error("Erro ao criar páginas:", error);
      showAlert("Erro ao criar páginas", "error");
    }
  };

  const showAlert = (message, type = "success") => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${backend_url}/api/pages/${editingPage.id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setPages(pages.map(page => 
          page.id === editingPage.id ? response.data.page : page
        ));
        showAlert("Página atualizada com sucesso!");
        setEditingPage(null);
        setFormData({ title: "", content: "" });
      }
    } catch (error) {
      console.error("Erro ao atualizar página:", error);
      showAlert(error.response?.data?.message || "Erro ao atualizar página", "error");
    }
  };

  const handleEdit = (page) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      content: page.content || "" // ✅ Garante que content nunca seja undefined
    });
  };

  const cancelEdit = () => {
    setEditingPage(null);
    setFormData({ title: "", content: "" });
  };

  useEffect(() => {
    fetchPages();
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
          Gerenciar Páginas Legais
        </h1>
        <p className="text-gray-600">
          Edite Política de Privacidade e Termos de Uso
        </p>
      </div>

      {/* Botão para criar páginas iniciais */}
      {pages.length === 0 && (
        <div className="mb-6">
          <button
            onClick={seedPages}
            className="bg-gradient-to-br from-[#206E34] to-[#70BD44] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
          >
            Criar Páginas Iniciais
          </button>
        </div>
      )}

      {/* Formulário de edição */}
      {editingPage && (
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Editando: {editingPage.title}
            </h2>
            <button
              onClick={cancelEdit}
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
                Título *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#206E34] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conteúdo (Markdown) *
              </label>
              <textarea
                required
                rows={15}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#206E34] focus:border-transparent resize-vertical font-mono text-sm"
                placeholder="Digite o conteúdo em Markdown..."
              />
              <p className="text-sm text-gray-500 mt-2">
                Use Markdown para formatação: # Título, ## Subtítulo, **negrito**, etc.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-gradient-to-br from-[#206E34] to-[#70BD44] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
              >
                Atualizar Página
              </button>
              
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de páginas */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-6">
            {[1, 2].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : pages.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhuma página legal cadastrada
            </h3>
            <p className="text-gray-600 mb-6">
              Clique em "Criar Páginas Iniciais" para começar
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {pages.map((page) => (
              <div key={page.id} className="p-6 hover:bg-gray-200 transition-colors duration-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {page.title}
                      </h3>
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
                        /{page.slug}
                      </span>
                    </div>
                    
                    <div className="prose prose-sm max-w-none mb-4">
                      {/* ✅ CORREÇÃO: Verificação de conteúdo antes de renderizar */}
                      {page.content ? (
                        <SafeMarkdown
                          components={{
                            p: ({node, ...props}) => <p className="text-gray-600 line-clamp-2" {...props} />,
                          }}
                        >
                          {page.content.substring(0, 200)}...
                        </SafeMarkdown>
                      ) : (
                        <p className="text-gray-400 italic">Nenhum conteúdo definido</p>
                      )}
                    </div>

                    <div className="text-sm text-gray-500">
                      Última atualização: {page.lastUpdated ? new Date(page.lastUpdated).toLocaleDateString('pt-BR') : 'Nunca'}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(page)}
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-200"
                      title="Editar página"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* URLs de acesso */}
      {!loading && pages.length > 0 && (
        <div className="mt-6 p-4 bg-gray-200 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">URLs de Acesso:</h4>
          <div className="space-y-2 text-sm">
            {pages.map(page => (
              <div key={page.id} className="flex items-center gap-2">
                <span className="text-gray-600">{page.title}:</span>
                <code className="bg-white px-2 py-1 rounded border">
                  {window.location.origin}/{page.slug}
                </code>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PagesAdmin;