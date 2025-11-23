// components/admin/AdminHomeSection.jsx
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
  FaLink,
  FaPalette,
  FaEye,
  FaTimes,
  FaSearch
} from "react-icons/fa";

const AdminHomeSection = ({ token }) => {
    const [homeData, setHomeData] = useState({
        title: "",
        highlightedText: "",
        description: "",
        buttonText: "",
        buttonLink: "",
        backgroundColor: "#ffffff",
        textColor: "#000000",
        highlightColor: "#16a34a",
        buttonColor: "#16a34a",
        buttonTextColor: "#ffffff"
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [showPreview, setShowPreview] = useState(false);
    const [colorPickerOpen, setColorPickerOpen] = useState(null);
    const [colorSearch, setColorSearch] = useState("");
    
    // Ref para o input de busca
    const searchInputRef = useRef(null);

    // Gerar TODAS as cores HEX possíveis (uma seleção representativa)
    const generateAllColors = () => {
        const colors = [];
        const steps = 16; // Reduzido para performance, mas ainda mostra muitas cores
        
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
            '#f7fafc', '#edf2f7', '#e2e8f0'
        ],
        vermelhos: [
            '#ff0000', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d',
            '#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2'
        ],
        laranjas: [
            '#ffa500', '#ea580c', '#c2410c', '#9a3412', '#7c2d12',
            '#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'
        ],
        amarelos: [
            '#ffff00', '#eab308', '#ca8a04', '#a16207', '#854d0e',
            '#facc15', '#fde047', '#fef08a', '#fef9c3', '#fefce8'
        ],
        verdes: [
            '#008000', '#16a34a', '#15803d', '#166534', '#14532d',
            '#22c55e', '#4ade80', '#86efac', '#bbf7d0', '#dcfce7',
            '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'
        ],
        azuis: [
            '#0000ff', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a',
            '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe',
            '#0369a1', '#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd'
        ],
        roxos: [
            '#800080', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95',
            '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'
        ],
        rosas: [
            '#ff69b4', '#db2777', '#be185d', '#9d174d', '#831843',
            '#ec4899', '#f472b6', '#f9a8d4', '#fbcfe8', '#fce7f3'
        ]
    };

    useEffect(() => {
        fetchHomeData();
    }, []);

    const fetchHomeData = async () => {
        try {
            setIsFetching(true);
            const response = await api.get(`${backend_url}/api/home-section`);
            if (response.data.success && response.data.homeSection) {
                setHomeData(response.data.homeSection);
                toast.success("Dados da home section carregados com sucesso!");
            }
        } catch (error) {
            console.error("Erro ao carregar dados da home section:", error);
            toast.error("Erro ao carregar dados da home section.");
        } finally {
            setIsFetching(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setHomeData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleColorChange = (name, value) => {
        setHomeData(prev => ({
            ...prev,
            [name]: value
        }));
        // Não fecha o modal automaticamente
    };

    const openColorPicker = (type) => {
        setColorPickerOpen(type);
        setColorSearch(""); // Limpa busca ao abrir
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post(
                `${backend_url}/api/home-section`,
                homeData,
                { 
                    headers: { 
                        'Content-Type': 'application/json',
                        token 
                    } 
                }
            );

            if (response.data.success) {
                toast.success("Home section salva com sucesso! 🎉");
                setHomeData(response.data.homeSection);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Erro ao salvar home section:", error);
            toast.error("Ocorreu um erro ao salvar a home section.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = async () => {
        if (window.confirm("Tem certeza que deseja resetar a home section para os valores padrão? Esta ação não pode ser desfeita.")) {
            try {
                const response = await api.delete(
                    `${backend_url}/api/home-section`,
                    { headers: { token } }
                );
                
                if (response.data.success) {
                    toast.success("Home section resetada com sucesso!");
                    setHomeData({
                        title: "",
                        highlightedText: "",
                        description: "",
                        buttonText: "",
                        buttonLink: "",
                        backgroundColor: "#ffffff",
                        textColor: "#000000",
                        highlightColor: "#16a34a",
                        buttonColor: "#16a34a",
                        buttonTextColor: "#ffffff"
                    });
                }
            } catch (error) {
                console.error("Erro ao resetar home section:", error);
                toast.error("Erro ao resetar home section.");
            }
        }
    };

    // Estilos para o preview
    const previewStyles = {
        section: {
            backgroundColor: homeData.backgroundColor,
            padding: '2rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem'
        },
        title: {
            color: homeData.textColor,
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
        },
        highlight: {
            color: homeData.highlightColor
        },
        description: {
            color: homeData.textColor,
            marginBottom: '1rem'
        },
        button: {
            backgroundColor: homeData.buttonColor,
            color: homeData.buttonTextColor,
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: 'pointer'
        }
    };

    // Componente do Seletor de Cores Avançado
    const AdvancedColorPicker = ({ type, currentColor, onColorSelect }) => {
        const getTitle = () => {
            const titles = {
                background: "Cor de Fundo",
                text: "Cor do Texto",
                highlight: "Cor do Destaque",
                button: "Cor do Botão",
                buttonText: "Cor do Texto do Botão"
            };
            return titles[type] || "Selecionar Cor";
        };

        // Função para selecionar cor SEM fechar o modal
        const handleColorSelect = (color) => {
            onColorSelect(color);
            // Não fecha o modal, apenas atualiza a cor
            // Mantém o foco no input de busca
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
        };

        // Função para aplicar e fechar o modal
        const handleApplyAndClose = () => {
            setColorPickerOpen(null);
        };

        // Focar no input de busca quando o modal abrir
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
                            // Todas as cores filtradas
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
                            // Cores por categoria
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
                                
                                {/* Amostra de todas as cores */}
                                <div>
                                    <h4 className="font-semibold mb-3">
                                        Todas as Cores ({allColors.length} cores disponíveis)
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Use a busca acima para encontrar cores específicas
                                    </p>
                                    <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1">
                                        {allColors.slice(0, 96).map(color => (
                                            <button
                                                key={color}
                                                onClick={() => handleColorSelect(color)}
                                                className={`w-6 h-6 rounded border ${
                                                    currentColor === color ? 'border-blue-500 ring-1 ring-blue-200' : 'border-gray-200'
                                                } hover:scale-125 transition-transform`}
                                                style={{ backgroundColor: color }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2 text-center">
                                        Amostra de 96 cores. Use a busca para ver mais.
                                    </p>
                                </div>
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

    if (isFetching) {
        return (
            <div className="p-6 max-w-6xl mx-auto fade-in">
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 text-center">
                    <FaSpinner className="animate-spin text-3xl text-secondary mx-auto mb-4" />
                    <p className="text-gray-600">Carregando dados da home section...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto fade-in">
            {/* Header */}
            <div className="mb-8 slide-in-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <FaHeading className="text-secondary" />
                    Editar Home Section
                </h1>
                <p className="text-gray-600">
                    Personalize o conteúdo da seção principal da página inicial
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
                    <h3 className="text-lg font-semibold mb-4">Preview da Home Section</h3>
                    <div style={previewStyles.section}>
                        <h2 style={previewStyles.title}>
                            {homeData.title || "Bem-vindo ao Grupo Madenobre! No mercado"}
                            <span style={previewStyles.highlight}> {homeData.highlightedText || "desde 1998"}</span>
                        </h2>
                        <p style={previewStyles.description}>
                            {homeData.description || "Há mais de 25 anos, somos referência no mercado de madeiras de alta qualidade em Maceió, somos a solução para seus projetos..."}
                        </p>
                        <button style={previewStyles.button}>
                            {homeData.buttonText || "Sobre Nós"}
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 scale-in">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* TÍTULO E TEXTO DESTACADO */}
                    <div className="bg-gray-200 p-6 rounded-lg border border-gray-200 card-hover">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FaHeading className="text-blue-600" />
                            Título Principal
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Texto do Título
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={homeData.title || ""}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                    placeholder="Bem-vindo ao Grupo Madenobre! No mercado"
                                />
                            </div>
                           
                        </div>
                    </div>

                    {/* DESCRIÇÃO */}
                    <div className="bg-gray-200 p-6 rounded-lg border border-gray-200 card-hover">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FaParagraph className="text-green-600" />
                            Descrição
                        </h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Texto da Descrição
                            </label>
                            <textarea
                                name="description"
                                value={homeData.description || ""}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                placeholder="Há mais de 25 anos, somos referência no mercado de madeiras de alta qualidade em Maceió, somos a solução para seus projetos..."
                            />
                        </div>
                    </div>

                    {/* BOTÃO */}
                    <div className="bg-gray-200 p-6 rounded-lg border border-gray-200 card-hover">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FaLink className="text-purple-600" />
                            Botão de Ação
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Texto do Botão
                                </label>
                                <input
                                    type="text"
                                    name="buttonText"
                                    value={homeData.buttonText || ""}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                    placeholder="Sobre Nós"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Link do Botão
                                </label>
                                <input
                                    type="text"
                                    name="buttonLink"
                                    value={homeData.buttonLink || ""}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
                                    placeholder="/about"
                                />
                            </div>
                        </div>
                    </div>

                   

                

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
                    currentColor={homeData[
                        colorPickerOpen === 'background' ? 'backgroundColor' :
                        colorPickerOpen === 'text' ? 'textColor' :
                        colorPickerOpen === 'highlight' ? 'highlightColor' :
                        colorPickerOpen === 'button' ? 'buttonColor' :
                        'buttonTextColor'
                    ]}
                    onColorSelect={(color) => handleColorChange(
                        colorPickerOpen === 'background' ? 'backgroundColor' :
                        colorPickerOpen === 'text' ? 'textColor' :
                        colorPickerOpen === 'highlight' ? 'highlightColor' :
                        colorPickerOpen === 'button' ? 'buttonColor' :
                        'buttonTextColor',
                        color
                    )}
                />
            )}
        </div>
    );
};

export default AdminHomeSection;