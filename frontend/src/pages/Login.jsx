import React, { useState } from "react";
import loginImg from "../assets/login.jpg"; 
const Login = () => {
  const [currState, setCurrState] = useState("Sign Up");
  return (
    <section className="absolute top-0 left-0 h-full w-full z-50 bg-white">
      {/** CONTAINER */}
      <div className="flex h-full w-full">
        {/**lado do formulário */}
        <div className="flex w-full sm:w-1/2 items-center justify-center ">
          <form className="flex flex-col items-center w-[90%] sm:max-w-md m-auto gap-y-5 text-gray-800">
            <div className="w-full mb-4">
              <h3 className="bold-36">{currState}</h3>
            </div>
            {currState === "Sign Up" && (
              <div className="w-full">
                <label htmlFor="name" className="medium-15">Nome</label>
                <input
                  type="text"
                  required
                  placeholder="Nome"
                  className="w-full px-3 py-1.5 ring-slate-900/5 rounded bg-primary mt-1"
                />
              </div>
            )}
            <div className="w-full">
              <label htmlFor="email" className="medium-15">Email</label>
              <input
                type="email"
                required
                placeholder="Email"
                className="w-full px-3 py-1.5 ring-slate-900/5 rounded bg-primary mt-1"
              />
            </div>
            <div className="w-full">
              <label htmlFor="password" className="midium-15">Senha</label>
              <input
                required
                type="password"
                placeholder="Senha"
                className="w-full px-3 py-1.5 ring-slate-900/5 rounded bg-primary mt-1"
              />
            </div>
            <button className="btn-secondary w-full mt-5 !py-[9px]">{currState === 'Sign Up' ? 'Sign Up' : 'Login'}</button>
            <div className="w-full flex flex-col gap-y-3">
                <div className="underline midium-15">
                    Esqueceu sua senha?
                </div>
                {currState === 'Login' ? (
                    <div className="underline midium-15">
                        Não tem uma conta?   
                        <span onClick={() => setCurrState('Sign Up')} className="cursor-pointer">
                           Criar conta
                        </span>
                    </div>
                ) : (
                    <div className="underline midium-15">
                        Já tem uma conta?
                        <span onClick={() => setCurrState('Login')} className="cursor-pointer"> Login</span>
                    </div>
                )}
            </div>
          </form>
        </div>
        {/** Lado da imagem */}
        <div className="w-1/2 hidden sm:block bg-black">
            <img src={loginImg} alt="" className="object-cover h-full w-full"/>
        </div>
      </div>
    </section>
  );
};

export default Login;
