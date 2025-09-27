import { useState } from "react";
import axios from "axios";
import { backend_url } from "../App";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

const Login = ({setToken}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backend_url}/api/user/admin`, {
        email,
        password,
      });

      console.log("Resposta do backend no login:", response.data); 
      
      if (response.data.success) {
        setToken(response.data.token)
      } else {
        toast.error(response.data.message);
      }
      console.log("Token recebido no login:", response.data.token);

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Erro ao fazer login");
    }
  };

  const togglePaswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <section className="absolute top-0 left-0 h-full w-full z-50 bg-white">
      {/** CONTAINER */}
      <div className="flex h-full w-full">
        {/**lado do formulário */}
        <div className="flex w-full sm:w-1/2 items-center justify-center ">
          <form
            onSubmit={onSubmitHandler}
            className="flex flex-col items-center w-[90%] sm:max-w-md m-auto gap-y-5 text-gray-800"
          >
            <div className="w-full mb-4">
              <h3 className="bold-36">Login</h3>
    
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
                placeholder="Email"
                className="w-full px-3 py-1.5 ring-slate-900/5 rounded bg-primary mt-1"
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
              Login
            </button>
          
          </form>
        </div>
        {/** Lado da imagem */}
        <div className="w-1/2 hidden sm:block bg-black">
          <img
            src={"/logo.png"}
            alt=""
            className="object-contain h-full w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default Login;
