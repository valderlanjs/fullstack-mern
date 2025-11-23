// components/admin/AdminFeatures.jsx
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import api from "../api/axios.js"
import { backend_url } from "../App";
import { toast } from "react-toastify";
import { 
  FaSpinner,
  FaSave,
  FaUndo,
  FaHeading,
  FaParagraph,
  FaPalette,
  FaEye,
  FaTimes,
  FaSearch,
  FaTree
} from "react-icons/fa";

const AdminFeatures = ({ token }) => {
    const [featuresData, setFeaturesData] = useState({
        title: "",
        subtitle: "",
        card1Title: "",
        card1Content: "",
        card2Title: "",
        card2Content: "",
        backgroundColor: "#f3f4f6",
        titleColor: "#000000",
        subtitleColor: "#6b7280",
        cardBackgroundColor: "#ffffff",
        cardTitleColor: "#16a34a",
        cardTextColor: "#000000",
        iconColor: "#16a34a"
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [showPreview, setShowPreview] = useState(false);
    const [colorPickerOpen, setColorPickerOpen] = useState(null);
    const [colorSearch, setColorSearch] = useState("");
    
    // Ref para o input de busca
    const searchInputRef = useRef(null);

    // Gerar TODAS as cores HEX possíveis
    const generateAllColors = () => {
        const colors = [];
        const steps = 16;
        
        for (let r = 0; r <= steps; r++) {
            for (let g = 0; g <= steps; g++) {
                for (let b = 0; b <= steps; b++) {
                    const red = Math.floor((r / steps) * 255);
                    const green = Math.floor((g / steps) * 255);
                    const blue = Math.floor((b / steps) * 255);
                    const hex = `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
                    colors.push(hex);
                }
            }
        }
        return colors;
    };

    const allColors = generateAllColors();

    // Filtrar cores baseado na busca
    const filteredColors = allColors.filter(color => 
        color.toLowerCase().includes(colorSearch.toLowerCase())
    );

    // Cores pré-definidas organizadas por categoria
    const colorCategories = {
        neutras: [
            '#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff',
            '#2d3748', '#4a5568', '#718096', '#a0aec0', '#cbd5e0', '#e2e8f0',
            '#f7fafc', '#edf2f7', '#e2e8f0', '#f3f4f6'
        ],
        verdes: [
            '#16a34a', '#15803d', '#166534', '#14532d', '#22c55e', '#4ade80',
            '#86efac', '#bbf7d0', '#dcfce7', '#10b981', '#34d399', '#6ee7b7'
        ],
        azuis: [
            '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a', '#3b82f6', '#60a5fa',
            '#93c5fd', '#bfdbfe', '#dbeafe', '#0369a1', '#0ea5e9', '#38bdf8'
        ],
        cinzas: [
            '#6b7280', '#4b5563', '#374151', '#1f2937', '#9ca3af', '#d1d5db',
            '#e5e7eb', '#f3f4f6', '#f9fafb'
        ]
    };

    useEffect(() => {
        fetchFeaturesData();
    }, []);

    const fetchFeaturesData = async () => {
        try {
            setIsFetching(true);
            const response = await api.get(`${backend_url}/api/features`);
            if (response.data.success && response.data.features) {
                setFeaturesData(response.data.features);
                toast.success("Dados da features carregados com sucesso!");
            }
        } catch (error) {
            console.error("Erro ao carregar dados da features:", error);
            toast.error("Erro ao carregar dados da features.");
        } finally {
            setIsFetching(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFeaturesData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleColorChange = (name, value) => {
        setFeaturesData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const openColorPicker = (type) => {
        setColorPickerOpen(type);
        setColorSearch("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post(
                `${backend_url}/api/features`,
                featuresData,
                { 
                    headers: { 
                        'Content-Type': 'application/json',
                        token 
                    } 
                }
            );

            if (response.data.success) {
                toast.success("Features salva com sucesso! 🎉");
                setFeaturesData(response.data.features);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Erro ao salvar features:", error);
            toast.error("Ocorreu um erro ao salvar a features.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = async () => {
        if (window.confirm("Tem certeza que deseja resetar a features para os valores padrão? Esta ação não pode ser desfeita.")) {
            try {
                const response = await api.delete(
                    `${backend_url}/api/features`,
                    { headers: { token } }
                );
                
                if (response.data.success) {
                    toast.success("Features resetada com sucesso!");
                    setFeaturesData({
                        title: "",
                        subtitle: "",
                        card1Title: "",
                        card1Content: "",
                        card2Title: "",
                        card2Content: "",
                        backgroundColor: "#f3f4f6",
                        titleColor: "#000000",
                        subtitleColor: "#6b7280",
                        cardBackgroundColor: "#ffffff",
                        cardTitleColor: "#16a34a",
                        cardTextColor: "#000000",
                        iconColor: "#16a34a"
                    });
                }
            } catch (error) {
                console.error("Erro ao resetar features:", error);
                toast.error("Erro ao resetar features.");
            }
        }
    };

    // Componente do Seletor de Cores Avançado (igual ao anterior)
    const AdvancedColorPicker = ({ type, currentColor, onColorSelect }) => {
        const getTitle = () => {
            const titles = {
                background: "Cor de Fundo",
                title: "Cor do Título",
                subtitle: "Cor do Subtítulo",
                cardBackground: "Cor de Fundo dos Cards",
                cardTitle: "Cor do Título dos Cards",
                cardText: "Cor do Texto dos Cards",
                icon: "Cor dos Ícones"
            };
            return titles[type] || "Selecionar Cor";
        };

        const handleColorSelect = (color) => {
            onColorSelect(color);
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
        };

        const handleApplyAndClose = () => {
            setColorPickerOpen(null);
        };

        useEffect(() => {
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
        }, []);

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 border-b">
                        <h3 className="text-xl font-semibold">{getTitle()}</h3>
                        <button
                            onClick={handleApplyAndClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FaTimes className="text-xl" />
                        </button>
                    </div>

                    {/* Cor Atual */}
                    <div className="p-4 border-b">
                        <div className="flex items-center gap-4">
                            <div 
                                className="w-16 h-16 rounded-lg border-2 border-gray-300"
                                style={{ backgroundColor: currentColor }}
                            />
                            <div>
                                <p className="font-semibold">Cor atual:</p>
                                <p className="text-gray-600">{currentColor}</p>
                            </div>
                        </div>
                    </div>

                    {/* Busca */}
                    <div className="p-4 border-b">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Buscar cor por código HEX (ex: #ff0000)"
                                value={colorSearch}
                                onChange={(e) => setColorSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="overflow-y-auto max-h-[60vh] p-4">
                        {colorSearch ? (
                            <div>
                                <h4 className="font-semibold mb-4">
                                    {filteredColors.length} cores encontradas
                                </h4>
                                <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-2">
                                    {filteredColors.slice(0, 200).map(color => (
                                        <button
                                            key={color}
                                            onClick={() => handleColorSelect(color)}
                                            className={`w-8 h-8 rounded border-2 ${
                                                currentColor === color ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
                                            } hover:scale-110 transition-transform`}
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                                {filteredColors.length > 200 && (
                                    <p className="text-sm text-gray-500 mt-4 text-center">
                                        Mostrando 200 de {filteredColors.length} cores. Refine sua busca.
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {Object.entries(colorCategories).map(([category, colors]) => (
                                    <div key={category}>
                                        <h4 className="font-semibold mb-3 capitalize">
                                            {category} ({colors.length} cores)
                                        </h4>
                                        <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-2 mb-4">
                                            {colors.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => handleColorSelect(color)}
                                                    className={`w-8 h-8 rounded border-2 ${
                                                        currentColor === color ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
                                                    } hover:scale-110 transition-transform`}
                                                    style={{ backgroundColor: color }}
                                                    title={color}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t bg-gray-200">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={currentColor}
                                    onChange={(e) => handleColorSelect(e.target.value)}
                                    className="w-10 h-10 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={currentColor}
                                    onChange={(e) => handleColorSelect(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded w-32"
                                    placeholder="#000000"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setColorSearch("");
                                        if (searchInputRef.current) {
                                            searchInputRef.current.focus();
                                        }
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Limpar Busca
                                </button>
                                <button
                                    onClick={handleApplyAndClose}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Aplicar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Estilos para o preview
    const previewStyles = {
        section: {
            backgroundColor: featuresData.backgroundColor,
            padding: '4rem 1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem'
        },
        title: {
            color: featuresData.titleColor,
            fontSize: '2.25rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '1rem'
        },
        subtitle: {
            color: featuresData.subtitleColor,
            fontSize: '1.5rem',
            textAlign: 'center',
            textTransform: 'capitalize',
            marginBottom: '2.5rem',
            maxWidth: '42rem',
            marginLeft: 'auto',
            marginRight: 'auto'
        },
        card: {
            backgroundColor: featuresData.cardBackgroundColor,
            padding: '1rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        },
        cardTitle: {
            color: featuresData.cardTitleColor,
            fontSize: '1.875rem',
            fontWeight: 'bold',
            textAlign: 'center',
            textTransform: 'capitalize',
            marginBottom: '0.75rem'
        },
        cardText: {
            color: featuresData.cardTextColor,
            fontSize: '1.25rem'
        },
        icon: {
            color: featuresData.iconColor,
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '0.75rem'
        }
    };

    if (isFetching) {
        return (
            <div className="p-6 max-w-6xl mx-auto fade-in">
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 text-center">
                    <FaSpinner className="animate-spin text-3xl text-secondary mx-auto mb-4" />
                    <p className="text-gray-600">Carregando dados da features...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto fade-in">
            {/* Header */}
            <div className="mb-8 slide-in-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <FaTree className="text-secondary" />
                    Editar Seção de Certificações
                </h1>
                <p className="text-gray-600">
                    Personalize a seção de certificações e sustentabilidade
                </p>
            </div>

            {/* Preview Toggle */}
            <div className="mb-6">
                <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                    <FaEye />
                    {showPreview ? 'Ocultar Preview' : 'Mostrar Preview'}
                </button>
            </div>

            {/* Preview */}
            {showPreview && (
                <div className="mb-8 bg-white rounded-xl shadow-md border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4">Preview da Seção</h3>
                    <div style={previewStyles.section}>
                        <h2 style={previewStyles.title}>
                            {featuresData.title || "Sustentabilidade e qualidade"}
                        </h2>
                        <p style={previewStyles.subtitle}>
                            {featuresData.subtitle || "Madeira sustentável, certificada pelo FSC garantindo qualidade, preservação ambiental e benefícios sociais para comunidades florestais."}
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-12 rounded-xl">
                            {/* Card 1 */}
                            <div style={previewStyles.card}>
                                <div style={previewStyles.icon}>🌲</div>
                                <h3 style={previewStyles.cardTitle}>
                                    {featuresData.card1Title || "FSC"}
                                </h3>
                                <p style={previewStyles.cardText}>
                                    {featuresData.card1Content?.split('\n\n')[0] || "Certificado internacional que assegura a procedência, qualidade e respeito ao meio ambiente."}
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div style={previewStyles.card}>
                                <div style={previewStyles.icon}>🌲</div>
                                <h3 style={previewStyles.cardTitle}>
                                    {featuresData.card2Title || "DOF"}
                                </h3>
                                <p style={previewStyles.cardText}>
                                    {featuresData.card2Content?.split('\n\n')[0] || "Comercializamos madeira nativa com o Documento de Origem Florestal (DOF) emitido pelo Ibama..."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 scale-in">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* TÍTULO E DESCRIÇÃO PRINCIPAL */}
                    <div className="bg-gray-200 p-6 rounded-lg border border-gray-200 card-hover">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FaHeading className="text-blue-600" />
                            Título e Descrição Principal
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Título Principal
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={featuresData.title || ""}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                    placeholder="Sustentabilidade e qualidade"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descrição/Subtítulo
                                </label>
                                <textarea
                                    name="subtitle"
                                    value={featuresData.subtitle || ""}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                    placeholder="Madeira sustentável, certificada pelo FSC garantindo qualidade, preservação ambiental e benefícios sociais para comunidades florestais."
                                />
                            </div>
                        </div>
                    </div>

                    {/* CARD 1 - FSC */}
                    <div className="bg-gray-200 p-6 rounded-lg border border-gray-200 card-hover">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FaTree className="text-green-600" />
                            Card 1 - Certificação FSC
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Título do Card
                                </label>
                                <input
                                    type="text"
                                    name="card1Title"
                                    value={featuresData.card1Title || ""}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                    placeholder="FSC"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Conteúdo do Card
                                </label>
                                <textarea
                                    name="card1Content"
                                    value={featuresData.card1Content || ""}
                                    onChange={handleInputChange}
                                    rows="6"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                    placeholder="Certificado internacional que assegura a procedência, qualidade e respeito ao meio ambiente.&#10;&#10;Com nossas práticas a exploração predatórias é eliminada e a biodiversidade e os recursos hídricos e do solo são preservados."
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Use duas quebras de linha (Enter) para separar parágrafos
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CARD 2 - DOF */}
                    <div className="bg-gray-200 p-6 rounded-lg border border-gray-200 card-hover">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FaTree className="text-green-600" />
                            Card 2 - Documentação DOF
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Título do Card
                                </label>
                                <input
                                    type="text"
                                    name="card2Title"
                                    value={featuresData.card2Title || ""}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                    placeholder="DOF"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Conteúdo do Card
                                </label>
                                <textarea
                                    name="card2Content"
                                    value={featuresData.card2Content || ""}
                                    onChange={handleInputChange}
                                    rows="6"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                    placeholder="Comercializamos madeira nativa com o Documento de Origem Florestal (DOF) emitido pelo Ibama, garantindo a rastreabilidade e a legalidade da madeira.&#10;&#10;Escolha nossos produtos e faça parte de um consumo consciente que promove o desenvolvimento social e econômico das comunidades florestais."
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Use duas quebras de linha (Enter) para separar parágrafos
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CORES - SEÇÃO PRINCIPAL */}
                    

                    {/* CORES DOS CARDS */}
                    

                    {/* BOTÕES DE AÇÃO */}
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
                            Resetar Seção
                        </button>
                    </div>
                </form>
            </div>

            {/* Seletor de Cores Avançado */}
            {colorPickerOpen && (
                <AdvancedColorPicker
                    type={colorPickerOpen}
                    currentColor={featuresData[
                        colorPickerOpen === 'background' ? 'backgroundColor' :
                        colorPickerOpen === 'title' ? 'titleColor' :
                        colorPickerOpen === 'subtitle' ? 'subtitleColor' :
                        colorPickerOpen === 'cardBackground' ? 'cardBackgroundColor' :
                        colorPickerOpen === 'cardTitle' ? 'cardTitleColor' :
                        colorPickerOpen === 'cardText' ? 'cardTextColor' :
                        'iconColor'
                    ]}
                    onColorSelect={(color) => handleColorChange(
                        colorPickerOpen === 'background' ? 'backgroundColor' :
                        colorPickerOpen === 'title' ? 'titleColor' :
                        colorPickerOpen === 'subtitle' ? 'subtitleColor' :
                        colorPickerOpen === 'cardBackground' ? 'cardBackgroundColor' :
                        colorPickerOpen === 'cardTitle' ? 'cardTitleColor' :
                        colorPickerOpen === 'cardText' ? 'cardTextColor' :
                        'iconColor',
                        color
                    )}
                />
            )}
        </div>
    );
};

export default AdminFeatures;