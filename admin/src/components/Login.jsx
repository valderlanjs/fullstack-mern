import React, { useState } from "react";
import axios from "axios";
import { backend_url } from "../App";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaShieldAlt } from "react-icons/fa";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Preencha todos os campos!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${backend_url}/api/user/admin`, {
        email: email.trim().toLowerCase(),
        password,
      });

      if (response.data.success) {
        setToken(response.data.token);
        toast.success("Login realizado com sucesso!");
      } else {
        toast.error(response.data.message || "Erro no login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <section className="absolute top-0 left-0 h-full w-full z-50 bg-white">
      <div className="flex h-full w-full">
        {/* Lado do formulário */}
        <div className="flex w-full sm:w-1/2 items-center justify-center">
          <form
            onSubmit={onSubmitHandler}
            className="flex flex-col items-center w-[90%] sm:max-w-md m-auto gap-y-5 text-gray-800"
          >
            <div className="w-full mb-4 text-center">
              <FaShieldAlt className="text-4xl text-secondary mx-auto mb-3" />
              <h3 className="bold-32 mb-2">
                Painel Administrativo <br />
                <span className="text-[#4a491c]">Grupo Madenobre</span>
              </h3>
              <p className="text-sm text-gray-600">
                Acesso restrito a administradores autorizados
              </p>
            </div>

            <div className="w-full">
              <label htmlFor="email" className="medium-15">
                Email
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                required
                placeholder="Digite seu email administrativo"
                className="w-full px-3 py-2.5 ring-1 ring-slate-900/10 rounded-lg bg-white mt-1 focus:outline-none focus:ring-2 focus:ring-secondary"
                disabled={loading}
              />
            </div>

            <div className="w-full relative">
              <label htmlFor="password" className="medium-15">
                Senha
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                className="w-full px-3 py-2.5 ring-1 ring-slate-900/10 rounded-lg bg-white mt-1 focus:outline-none focus:ring-2 focus:ring-secondary pr-10"
                disabled={loading}
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 mt-7 flex items-center cursor-pointer text-gray-400 hover:text-gray-600"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-secondary w-full mt-5 !py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Entrando...
                </div>
              ) : (
                "Acessar Painel"
              )}
            </button>

            <div className="w-full mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-800 text-center">
              <p className="font-medium">⚠️ Cadastro de novos usuários</p>
              <p className="mt-1">
                O cadastro de novos usuários é realizado exclusivamente por
                administradores através do painel interno.
              </p>
            </div>

            <div className="text-xs text-gray-500 text-center mt-2">
              <p>
                Todo acesso é monitorado e registrado para fins de segurança.
              </p>
            </div>
          </form>
        </div>

        {/* Lado da imagem */}
        <div className="w-1/2 hidden sm:block bg-gradient-to-br from-gray-900 to-secondary">
          <div className="flex flex-col items-center justify-center h-full text-white p-8">
            <div className="text-center max-w-md">
              <FaShieldAlt className="text-6xl opacity-20 mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-4">
                Sistema Administrativo
              </h2>
              <p className="text-gray-300">
                Área restrita para administradores. Aqui você pode gerenciar
                produtos, usuários, banners e todas as configurações do site.
              </p>
              <div className="mt-6 space-y-2 text-sm text-gray-400">
                <p>• Gerencie usuários e permissões</p>
                <p>• Controle total do conteúdo</p>
                <p>• Acesso seguro e monitorado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
