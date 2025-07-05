import React, { useState } from "react";
import axios from "axios";
import { backend_url } from "../App";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      // ATENÇÃO: A rota será /api/user/register-admin, que criaremos no backend
      const response = await axios.post(`${backend_url}/api/user/register-admin`, {
        name,
        email,
        password,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login"); // Redireciona para o login após o sucesso
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Erro ao fazer cadastro");
    }
  };

  const togglePaswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <section className="absolute top-0 left-0 h-full w-full z-50 bg-white">
      <div className="flex h-full w-full">
        <div className="flex w-full sm:w-1/2 items-center justify-center ">
          <form
            onSubmit={onSubmitHandler}
            className="flex flex-col items-center w-[90%] sm:max-w-md m-auto gap-y-5 text-gray-800"
          >
            <div className="w-full mb-4">
              <h3 className="bold-36">Cadastre-se</h3>
              
            </div>

            <div className="w-full">
              <label className="medium-15">Nome</label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                required
                placeholder="Seu Nome"
                className="w-full px-3 py-1.5 ring-slate-900/5 rounded bg-primary mt-1"
              />
            </div>
            <div className="w-full">
              <label className="medium-15">Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                required
                placeholder="Email"
                className="w-full px-3 py-1.5 ring-slate-900/5 rounded bg-primary mt-1"
              />
            </div>
            <div className="w-full relative">
              <label className="medium-15">Senha</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                className="w-full px-3 py-1.5 ring-slate-900/5 rounded bg-primary mt-1"
              />
              <div className="absolute inset-y-0 right-0 pr-3 mt-7 flex items-center cursor-pointer" onClick={togglePaswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            <button
              type="submit"
              className="btn-secondary w-full mt-5 !py-[9px]"
            >
              Cadastrar
            </button>
            <p className="text-sm mt-2">Já tem uma conta? <Link to="/login" className="text-secondary underline font-semibold">Faça o login</Link></p>
          </form>
        </div>
        <div className="w-1/2 hidden sm:block bg-black">
          <img src={"/logo.png"} alt="" className="object-contain h-full w-full" />
        </div>
      </div>
    </section>
  );
};

export default Register;