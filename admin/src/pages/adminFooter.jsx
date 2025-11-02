// components/admin/AdminFooter.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { backend_url } from "../App";
import { toast } from "react-toastify";
import { 
  FaSpinner,
  FaImage,
  FaLink,
  FaPhone,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa6";

import { FaInfoCircle, FaMapMarkerAlt, FaSave, FaUndo} from "react-icons/fa";

const AdminFooter = ({ token }) => {
    const [footerData, setFooterData] = useState({
        description: "",
        copyright: "",
        aboutLink: "",
        productsLink: "",
        servicesLink: "",
        contactLink: "",
        phone: "",
        email: "",
        address: "",
        facebookUrl: "",
        instagramUrl: "",
        quickLinksTitle: "",
        contactTitle: "",
        socialTitle: ""
    });
    const [logoFile, setLogoFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        fetchFooterData();
    }, []);

    const fetchFooterData = async () => {
        try {
            setIsFetching(true);
            const response = await axios.get(`${backend_url}/api/footer`);
            if (response.data.success && response.data.footer) {
                setFooterData(response.data.footer);
                toast.success("Dados do footer carregados com sucesso!");
            }
        } catch (error) {
            console.error("Erro ao carregar dados do footer:", error);
            toast.error("Erro ao carregar dados do footer.");
        } finally {
            setIsFetching(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFooterData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 9 * 1024 * 1024) {
                toast.error("A imagem deve ter no máximo 9MB");
                return;
            }
            setLogoFile(selectedFile);
            toast.info("Logo selecionada. Clique em salvar para aplicar as alterações.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData();
            
            // Adicionar dados do formulário
            Object.keys(footerData).forEach(key => {
                if (footerData[key] !== null && footerData[key] !== undefined) {
                    formData.append(key, footerData[key]);
                }
            });

            // Adicionar arquivo de logo se existir
            if (logoFile) {
                formData.append("logo", logoFile);
            }

            const response = await axios.post(
                `${backend_url}/api/footer`,
                formData,
                { 
                    headers: { 
                        'Content-Type': 'multipart/form-data',
                        token 
                    } 
                }
            );

            if (response.data.success) {
                toast.success("Footer salvo com sucesso! 🎉");
                // Atualizar dados locais
                setFooterData(response.data.footer);
                setLogoFile(null);
                // Limpar input de arquivo
                document.getElementById('logoInput').value = '';
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Erro ao salvar footer:", error);
            toast.error("Ocorreu um erro ao salvar o footer.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = async () => {
        if (window.confirm("Tem certeza que deseja resetar o footer para os valores padrão? Esta ação não pode ser desfeita.")) {
            try {
                const response = await axios.delete(
                    `${backend_url}/api/footer`,
                    { headers: { token } }
                );
                
                if (response.data.success) {
                    toast.success("Footer resetado com sucesso!");
                    setFooterData({
                        description: "",
                        copyright: "",
                        aboutLink: "",
                        productsLink: "",
                        servicesLink: "",
                        contactLink: "",
                        phone: "",
                        email: "",
                        address: "",
                        facebookUrl: "",
                        instagramUrl: "",
                        quickLinksTitle: "",
                        contactTitle: "",
                        socialTitle: ""
                    });
                    setLogoFile(null);
                    document.getElementById('logoInput').value = '';
                }
            } catch (error) {
                console.error("Erro ao resetar footer:", error);
                toast.error("Erro ao resetar footer.");
            }
        }
    };

    if (isFetching) {
        return (
            <div className="p-6 max-w-4xl mx-auto fade-in">
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 text-center">
                    <FaSpinner className="animate-spin text-3xl text-secondary mx-auto mb-4" />
                    <p className="text-gray-600">Carregando dados do footer...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto fade-in">
            {/* Header */}
            <div className="mb-8 slide-in-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <FaSave className="text-secondary" />
                    Editar Footer
                </h1>
                <p className="text-gray-600">
                    Personalize todas as informações do rodapé do site
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 scale-in">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* LOGO */}
                    <div className="bg-gray-200 p-6 rounded-lg border border-gray-200 card-hover">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FaImage className="text-blue-600" />
                            Logo do Footer
                        </h2>
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload da Logo
                                </label>
                                <input
                                    type="file"
                                    id="logoInput"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                />
                                <p className="text-sm text-gray-500 mt-2">
                                    Deixe em branco para manter a logo atual. Tamanho máximo: 9MB
                                </p>
                            </div>
                            {footerData.logoUrl && (
                                <div className="text-center">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Logo Atual:</p>
                                    <img 
                                        src={footerData.logoUrl} 
                                        alt="Logo atual" 
                                        className="w-24 h-24 object-contain mx-auto border rounded-lg"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* INFORMAÇÕES DA EMPRESA */}
                    <div className="bg-gray-200 p-6 rounded-lg border border-gray-200 card-hover">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FaInfoCircle className="text-purple-600" />
                            Informações da Empresa
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descrição
                                </label>
                                <textarea
                                    name="description"
                                    value={footerData.description || ""}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                    placeholder="Compromisso com a qualidade e sustentabilidade. Nossa madeira, sua confiança."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Texto de Copyright
                                </label>
                                <input
                                    type="text"
                                    name="copyright"
                                    value={footerData.copyright || ""}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                    placeholder="Copyright 2024 Madenobre. Todos os direitos reservados."
                                />
                            </div>
                        </div>
                    </div>

                    {/* LINKS RÁPIDOS */}
                    <div className="bg-gray-200 p-6 rounded-lg border border-gray-200 card-hover">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FaLink className="text-green-600" />
                            Links Rápidos
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Título da Seção
                                </label>
                                <input
                                    type="text"
                                    name="quickLinksTitle"
                                    value={footerData.quickLinksTitle || ""}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                    placeholder="Links Rápidos"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Link Sobre Nós
                                    </label>
                                    <input
                                        type="text"
                                        name="aboutLink"
                                        value={footerData.aboutLink || ""}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                        placeholder="/about"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Link Produtos
                                    </label>
                                    <input
                                        type="text"
                                        name="productsLink"
                                        value={footerData.productsLink || ""}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                        placeholder="/properties"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Link Serviços
                                    </label>
                                    <input
                                        type="text"
                                        name="servicesLink"
                                        value={footerData.servicesLink || ""}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                        placeholder="/services"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Link Contato
                                    </label>
                                    <input
                                        type="text"
                                        name="contactLink"
                                        value={footerData.contactLink || ""}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                        placeholder="/contact"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CONTATO */}
                    <div className="bg-gray-200 p-6 rounded-lg border border-gray-200 card-hover">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FaPhone className="text-blue-600" />
                            Informações de Contato
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Título da Seção
                                </label>
                                <input
                                    type="text"
                                    name="contactTitle"
                                    value={footerData.contactTitle || ""}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                    placeholder="Contate-nos"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaPhone className="inline mr-2 text-sm" />
                                        Telefone
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={footerData.phone || ""}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                        placeholder="+55 (82) 000-0000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaEnvelope className="inline mr-2 text-sm" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={footerData.email || ""}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                        placeholder="valderlanjosr15@gmail.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FaMapMarkerAlt className="inline mr-2 text-sm" />
                                    Endereço
                                </label>
                                <textarea
                                    name="address"
                                    value={footerData.address || ""}
                                    onChange={handleInputChange}
                                    rows="2"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                    placeholder="Av. Juca Sampaio 2817 - Jacintinho, Maceió - AL, 57040-600"
                                />
                            </div>
                        </div>
                    </div>

                    {/* REDES SOCIAIS */}
                    <div className="bg-gray-200 p-6 rounded-lg border border-gray-200 card-hover">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FaFacebook className="text-blue-500" />
                            Redes Sociais
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Título da Seção
                                </label>
                                <input
                                    type="text"
                                    name="socialTitle"
                                    value={footerData.socialTitle || ""}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                    placeholder="Nossas Redes Sociais"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <FaFacebook className="text-blue-500" />
                                        Facebook URL
                                    </label>
                                    <input
                                        type="url"
                                        name="facebookUrl"
                                        value={footerData.facebookUrl || ""}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                        placeholder="https://facebook.com/suaempresa"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <FaInstagram className="text-pink-500" />
                                        Instagram URL
                                    </label>
                                    <input
                                        type="url"
                                        name="instagramUrl"
                                        value={footerData.instagramUrl || ""}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                        placeholder="https://instagram.com/suaempresa"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BOTÕES */}
                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-hover-lift bg-secondary text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <FaSave />
                                    Salvar Alterações
                                </>
                            )}
                        </button>
                        
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={isLoading}
                            className="px-6 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors duration-300 font-medium btn-hover-lift flex items-center gap-2 disabled:opacity-50"
                        >
                            <FaUndo />
                            Resetar Footer
                        </button>
                    </div>
                </form>
            </div>

            {/* Preview Info */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 card-hover">
                <div className="flex items-start gap-3">
                    <FaInfoCircle className="text-blue-600 text-lg mt-0.5 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-blue-800 mb-2">Informações do Footer</h4>
                        <ul className="text-blue-700 text-sm space-y-1">
                            <li>• Todas as alterações são salvas imediatamente no banco de dados</li>
                            <li>• Campos vazios usarão os valores padrão do sistema</li>
                            <li>• A logo suporta formatos JPG, PNG, WebP (máx. 9MB)</li>
                            <li>• Use "Resetar Footer" para voltar aos valores iniciais</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminFooter;