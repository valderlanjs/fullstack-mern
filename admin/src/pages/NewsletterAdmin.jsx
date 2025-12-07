// components/admin/NewsletterManager.jsx
import { useState, useEffect } from "react";
import api from "../api/axios.js"
import { backend_url } from "../App";
import { toast } from "react-toastify";
import { 
  FaSpinner,
  FaEnvelope,
  FaCalendar,
  FaTrash,
  FaDownload,
  FaSearch,
} from "react-icons/fa";

const NewsletterManager = ({ token }) => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${backend_url}/api/newsletter/subscribers`, {
        headers: { token }
      });

      if (response.data.success) {
        setSubscribers(response.data.subscribers);
      }
    } catch (error) {
      console.error("Erro ao buscar inscritos:", error);
      toast.error("Erro ao carregar lista de inscritos");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (id, email) => {
    if (window.confirm(`Tem certeza que deseja remover o email ${email} da newsletter?`)) {
      try {
        const response = await api.put(
          `${backend_url}/api/newsletter/unsubscribe/${id}`,
          {},
          { headers: { token } }
        );

        if (response.data.success) {
          toast.success("Inscrito removido com sucesso");
          fetchSubscribers(); // Recarregar a lista
        }
      } catch (error) {
        console.error("Erro ao remover inscrito:", error);
        toast.error("Erro ao remover inscrito");
      }
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ["Email", "Data de Inscrição", "Status"],
      ...subscribers.map(sub => [
        sub.email,
        new Date(sub.subscribedAt).toLocaleDateString('pt-BR'),
        sub.isActive ? "Ativo" : "Inativo"
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("Lista exportada com sucesso!");
  };

  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto fade-in">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 text-center">
          <FaSpinner className="animate-spin text-3xl text-secondary mx-auto mb-4" />
          <p className="text-gray-600">Carregando inscritos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto fade-in">
      {/* Header */}
      <div className="mb-8 slide-in-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <FaEnvelope className="text-secondary" />
          Gerenciar Newsletter
        </h1>
        <p className="text-gray-600">
          Gerencie os emails inscritos na newsletter do site
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 card-hover">
          <div className="text-2xl font-bold text-blue-600">
            {subscribers.length}
          </div>
          <div className="text-sm text-blue-800">Total de Inscritos</div>
        </div>
        <div className="bg-green-50 p-6 rounded-lg border border-green-200 card-hover">
          <div className="text-2xl font-bold text-green-600">
            {subscribers.filter(s => s.isActive).length}
          </div>
          <div className="text-sm text-green-800">Inscritos Ativos</div>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 card-hover">
          <div className="text-2xl font-bold text-purple-600">
            {subscribers.filter(s => !s.isActive).length}
          </div>
          <div className="text-sm text-purple-800">Inscritos Inativos</div>
        </div>
      </div>

      {/* Controles */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={exportToCSV}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <FaDownload />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Lista de Inscritos */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Inscrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? "Nenhum inscrito encontrado" : "Nenhum inscrito na newsletter"}
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-green-400 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaEnvelope className="text-gray-400 mr-3" />
                        <span className="text-sm font-medium text-gray-900">
                          {subscriber.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <FaCalendar className="mr-2" />
                        {new Date(subscriber.subscribedAt).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        subscriber.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {subscriber.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {subscriber.isActive && (
                        <button
                          onClick={() => handleUnsubscribe(subscriber.id, subscriber.email)}
                          className="text-red-600 hover:text-red-900 flex items-center gap-1 transition-colors"
                        >
                          <FaTrash />
                          Remover
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NewsletterManager;