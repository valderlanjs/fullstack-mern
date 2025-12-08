import { useState, useEffect, useRef } from "react";
import api from "../api/axios.js"
import { toast } from "react-toastify";
import { 
  FaSpinner,
  FaImage,
  FaLink,
  FaPhone,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaClock,
  FaIdCard,
  FaBuilding,
  FaUpload,
  
} from "react-icons/fa6";

import { FaInfoCircle, FaMapMarkerAlt, FaSave, FaUndo, FaQuestionCircle, FaCheckCircle, FaExclamationTriangle, FaTimesCircle} from "react-icons/fa";

const AdminFooter = ({ token }) => {
    const [footerData, setFooterData] = useState({
        description: "",
        copyright: "",
        cnpj: "",
        aboutLink: "",
        productsLink: "",
        contactLink: "",
        faqLink: "",
        phone: "",
        email: "",
        address: "",
        whatsapp: "",
        businessHours: "",
        facebookUrl: "",
        instagramUrl: "",
        quickLinksTitle: "",
        contactTitle: "",
        socialTitle: ""
    });
    const [logoFile, setLogoFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [imageError, setImageError] = useState("");
    const [logoPreview, setLogoPreview] = useState("");
    const fileInputRef = useRef(null);

    // Função para calcular e formatar o tamanho
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    useEffect(() => {
        fetchFooterData();
    }, []);

    const fetchFooterData = async () => {
        try {
            setIsFetching(true);
            const response = await api.get(`/api/footer`);
            if (response.data.success && response.data.footer) {
                setFooterData(response.data.footer);
                setLogoPreview(response.data.footer.logoUrl || "");
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

    // NOVA FUNÇÃO: Validação de imagem melhorada
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setImageError("");
        
        if (selectedFile) {
            // Validação de tamanho (1MB)
            if (selectedFile.size > 1 * 1024 * 1024) {
                setImageError("A imagem deve ter no máximo 1MB");
                setLogoFile(null);
                setLogoPreview("");
                e.target.value = '';
                return;
            }

            // Validação do tipo de arquivo
            if (!selectedFile.type.startsWith('image/')) {
                setImageError("Por favor, selecione um arquivo de imagem válido");
                setLogoFile(null);
                setLogoPreview("");
                e.target.value = '';
                return;
            }

            setLogoFile(selectedFile);
            setLogoPreview(URL.createObjectURL(selectedFile));
            setImageError("");
            toast.info("Logo selecionada. Clique em salvar para aplicar as alterações.");
        }
    };

    const handleRemoveLogo = () => {
        setLogoFile(null);
        setLogoPreview("");
        setImageError("");
        setFooterData(prev => ({ ...prev, logoUrl: "" }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        toast.info("Logo removida. Clique em salvar para aplicar as alterações.");
    };

    const formatCNPJ = (value) => {
        // Remove tudo que não é número
        const numbers = value.replace(/\D/g, '');
        
        // Aplica a formatação do CNPJ
        if (numbers.length <= 2) {
            return numbers;
        } else if (numbers.length <= 5) {
            return numbers.replace(/(\d{2})(\d{0,3})/, '$1.$2');
        } else if (numbers.length <= 8) {
            return numbers.replace(/(\d{2})(\d{3})(\d{0,3})/, '$1.$2.$3');
        } else if (numbers.length <= 12) {
            return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{0,4})/, '$1.$2.$3/$4');
        } else {
            return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5');
        }
    };

    const handleCNPJChange = (e) => {
        const formattedCNPJ = formatCNPJ(e.target.value);
        setFooterData(prev => ({
            ...prev,
            cnpj: formattedCNPJ
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Verifica se há erro na imagem
        if (imageError) {
            toast.error("Por favor, corrija o erro na imagem antes de enviar.");
            return;
        }
        
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

            const response = await api.post(
                `/api/footer`,
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
                setImageError("");
                // Atualizar preview com URL definitiva
                if (response.data.footer.logoUrl) {
                    setLogoPreview(response.data.footer.logoUrl);
                }
                // Limpar input de arquivo
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Erro ao salvar footer:", error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Ocorreu um erro ao salvar o footer.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = async () => {
        if (window.confirm("Tem certeza que deseja resetar o footer para os valores padrão? Esta ação não pode ser desfeita.")) {
            try {
                const response = await api.delete(
                    `/api/footer`,
                    { headers: { token } }
                );
                
                if (response.data.success) {
                    toast.success("Footer resetado com sucesso!");
                    setFooterData({
                        description: "",
                        copyright: "",
                        cnpj: "",
                        aboutLink: "",
                        productsLink: "",
                        contactLink: "",
                        faqLink: "",
                        phone: "",
                        email: "",
                        address: "",
                        whatsapp: "",
                        businessHours: "",
                        facebookUrl: "",
                        instagramUrl: "",
                        quickLinksTitle: "",
                        contactTitle: "",
                        socialTitle: ""
                    });
                    setLogoFile(null);
                    setLogoPreview("");
                    setImageError("");
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                }
            } catch (error) {
                console.error("Erro ao resetar footer:", error);
                toast.error("Erro ao resetar footer.");
            }
        }
    };

    if (isFetching) {
        return (
            <div className="p-6 max-w-7xl mx-auto fade-in">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
                    <FaSpinner className="animate-spin text-3xl text-secondary mx-auto mb-4" />
                    <p className="text-gray-600">Carregando dados do footer...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto fade-in">
            {/* Header */}
            <div className="mb-8 slide-in-left">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                            <FaSave className="text-secondary" />
                            Configurações do Footer
                        </h1>
                        <p className="text-gray-600">
                            Personalize todas as informações do rodapé do site
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={isLoading}
                            className="px-6 py-3 border border-red-300 text-red-700 rounded-xl hover:bg-red-50 transition-all duration-300 font-medium btn-hover-lift flex items-center gap-2 disabled:opacity-50 shadow-sm"
                        >
                            <FaUndo />
                            Resetar Tudo
                        </button>
                    </div>
                </div>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">1MB</div>
                    <div className="text-sm text-blue-800">Tamanho Máximo</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600">1</div>
                    <div className="text-sm text-green-800">Logo</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">PNG</div>
                    <div className="text-sm text-purple-800">Formato Ideal</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div className="text-2xl font-bold text-orange-600">18</div>
                    <div className="text-sm text-orange-800">Campos</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coluna Principal */}
                <div className="lg:col-span-2 space-y-8">
                    {/* LOGO - SEÇÃO ATUALIZADA */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 card-hover">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FaImage className="text-blue-600 text-lg" />
                            </div>
                            Logo do Footer
                        </h2>
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            {/* Área de Upload Melhorada */}
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Upload da Logo
                                </label>
                                
                                <div className={`border-2 border-dashed rounded-xl overflow-hidden transition-colors duration-300 bg-gray-50 flex items-center justify-center aspect-video max-w-md ${
                                    imageError 
                                        ? 'border-red-300 bg-red-50' 
                                        : logoPreview 
                                            ? 'border-green-300 bg-green-50' 
                                            : 'border-gray-300 hover:border-blue-500'
                                }`}>
                                    {logoPreview ? (
                                        <div className="relative w-full h-full">
                                            <img
                                                src={logoPreview}
                                                alt="Preview logo"
                                                className="w-full h-full object-contain p-4"
                                            />
                                            {/* Indicador de sucesso */}
                                            <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                                                <FaCheckCircle size={16} />
                                            </div>
                                            {/* Botão de remover */}
                                            <button
                                                type="button"
                                                onClick={handleRemoveLogo}
                                                className="absolute top-2 left-2 bg-red-500 text-white p-2 rounded-full opacity-90 hover:opacity-100 transition-opacity"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ) : imageError ? (
                                        <div className="text-center p-6">
                                            <FaTimesCircle className="text-red-400 text-3xl mx-auto mb-3" />
                                            <p className="text-red-600 font-medium">Erro na Imagem</p>
                                            <p className="text-red-500 text-sm mt-1">{imageError}</p>
                                            <p className="text-red-400 text-xs mt-2">Clique para tentar novamente</p>
                                        </div>
                                    ) : (
                                        <div className="text-center p-6">
                                            <FaUpload className="text-gray-400 text-3xl mx-auto mb-3" />
                                            <p className="text-gray-600 font-medium">Logo do Footer</p>
                                            <p className="text-gray-400 text-sm mt-1">Clique para selecionar</p>
                                            <p className="text-gray-400 text-xs mt-2">PNG transparente recomendado</p>
                                        </div>
                                    )}
                                </div>

                                {/* Botão de Upload Melhorado */}
                                <label className="flex flex-col items-center justify-center w-full max-w-md p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors mt-3">
                                    <div className="flex flex-col items-center justify-center pt-3 pb-4">
                                        <FaImage className="w-6 h-6 mb-2 text-gray-400" />
                                        <p className="mb-1 text-sm text-gray-500">
                                            <span className="font-semibold">Clique para fazer upload</span>
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPG, WebP (MAX. 1MB)
                                        </p>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                                
                                {/* Informações da Imagem */}
                                {logoFile && !imageError && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3 max-w-md">
                                        <div className="flex items-start gap-3">
                                            <FaCheckCircle className="text-green-600 text-lg mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-semibold text-green-800 mb-2">
                                                    Imagem Válida ✓
                                                </h4>
                                                <div className="text-green-700 text-sm space-y-1">
                                                    <p><strong>Arquivo:</strong> {logoFile.name}</p>
                                                    <p><strong>Tamanho:</strong> {formatFileSize(logoFile.size)}</p>
                                                    <p><strong>Status:</strong> <span className="text-green-600">Pronta para upload</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Mensagem de Erro */}
                                {imageError && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3 max-w-md">
                                        <div className="flex items-start gap-3">
                                            <FaTimesCircle className="text-red-600 text-lg mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-semibold text-red-800 mb-2">
                                                    Problema na Imagem
                                                </h4>
                                                <div className="text-red-700 text-sm">
                                                    <p>{imageError}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <p className="text-xs text-gray-500 mt-2 max-w-md">
                                    <FaExclamationTriangle className="inline w-3 h-3 mr-1" />
                                    <strong>Tamanho máximo: 1MB</strong> • Formatos: PNG, JPG, WebP • Recomendado: Logo em PNG com fundo transparente
                                </p>
                            </div>

                            {/* Logo Atual (se existir) */}
                            {footerData.logoUrl && logoPreview === footerData.logoUrl && (
                                <div className="text-center">
                                    <p className="text-sm font-medium text-gray-700 mb-3">Logo Atual no Site:</p>
                                    <div className="relative group">
                                        <img 
                                            src={footerData.logoUrl} 
                                            alt="Logo atual" 
                                            className="w-32 h-32 object-contain mx-auto border-2 border-gray-200 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all duration-300"></div>
                                        <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                                            <FaCheckCircle size={12} />
                                        </div>
                                    </div>
                                    <p className="text-xs text-green-600 mt-2 font-medium">✓ Ativa no site</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* INFORMAÇÕES DA EMPRESA */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 card-hover">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <FaBuilding className="text-purple-600 text-lg" />
                            </div>
                            Informações da Empresa
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descrição da Empresa
                                </label>
                                <textarea
                                    name="description"
                                    value={footerData.description || ""}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200 resize-none"
                                    placeholder="Compromisso com a qualidade e sustentabilidade. Nossa madeira, sua confiança."
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        placeholder="© 2024 Madenobre. Todos os direitos reservados."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <FaIdCard className="text-gray-400" />
                                        CNPJ
                                    </label>
                                    <input
                                        type="text"
                                        name="cnpj"
                                        value={footerData.cnpj || ""}
                                        onChange={handleCNPJChange}
                                        maxLength={18}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                        placeholder="00.000.000/0000-00"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CONTATO */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 card-hover">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <FaPhone className="text-green-600 text-lg" />
                            </div>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <FaPhone className="text-gray-400" />
                                        Telefone
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={footerData.phone || ""}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                        placeholder="+55 (82) 0000-0000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <FaWhatsapp className="text-green-500" />
                                        WhatsApp
                                    </label>
                                    <input
                                        type="text"
                                        name="whatsapp"
                                        value={footerData.whatsapp || ""}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                        placeholder="+55829999999"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <FaEnvelope className="text-gray-400" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={footerData.email || ""}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                        placeholder="contato@madenobre.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <FaClock className="text-orange-500" />
                                        Horário de Atendimento
                                    </label>
                                    <input
                                        type="text"
                                        name="businessHours"
                                        value={footerData.businessHours || ""}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                        placeholder="Seg - Sex: 7:00 - 18:00 | Sáb: 7:00 - 12:00"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-red-500" />
                                    Endereço
                                </label>
                                <textarea
                                    name="address"
                                    value={footerData.address || ""}
                                    onChange={handleInputChange}
                                    rows="2"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200 resize-none"
                                    placeholder="Av. Juca Sampaio 2817 - Jacintinho, Maceió - AL, 57040-600"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coluna Lateral */}
                <div className="space-y-8">
                    {/* LINKS RÁPIDOS */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 card-hover">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <FaLink className="text-indigo-600 text-lg" />
                            </div>
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
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sobre Nós
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
                                        Produtos
                                    </label>
                                    <input
                                        type="text"
                                        name="productsLink"
                                        value={footerData.productsLink || ""}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                        placeholder="/products"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <FaQuestionCircle className="text-blue-500" />
                                        FAQ
                                    </label>
                                    <input
                                        type="text"
                                        name="faqLink"
                                        value={footerData.faqLink || ""}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                        placeholder="/faqs"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Contato
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

                    {/* REDES SOCIAIS */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 card-hover">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                            <div className="p-2 bg-pink-100 rounded-lg">
                                <FaFacebook className="text-pink-600 text-lg" />
                            </div>
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
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <FaFacebook className="text-blue-500" />
                                        Facebook
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
                                        Instagram
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

                    {/* BOTÃO SALVAR */}
                    <div className="bg-gradient-to-br from-secondary to-green-700 rounded-2xl shadow-lg p-6 card-hover">
                        <div className="text-center text-white">
                            <FaSave className="text-2xl mx-auto mb-3" />
                            <h3 className="font-semibold mb-2">Salvar Alterações</h3>
                            <p className="text-green-100 text-sm mb-4">
                                Todas as alterações serão refletidas no site
                            </p>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isLoading || imageError}
                                className="w-full bg-white text-secondary px-6 py-3 rounded-xl hover:bg-gray-100 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                {isLoading ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <FaSave />
                                        Salvar Tudo
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Info */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 card-hover">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                        <FaInfoCircle className="text-blue-600 text-xl" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-blue-800 mb-3 text-lg">Informações do Footer</h4>
                        <ul className="text-blue-700 text-sm space-y-2">
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                Todos os campos são opcionais - use apenas os que deseja personalizar
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                Campos vazios usarão os valores padrão do sistema
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <strong>Logo:</strong> PNG, JPG, WebP (máx. 1MB) - PNG transparente recomendado
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                O CNPJ será formatado automaticamente
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminFooter;