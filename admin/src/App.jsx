import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from 'react-toastify';

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";

import Add from "./pages/Add";
import List from "./pages/List";
import ListVendor from "./pages/ListVendor";
import AddVendor from "./pages/AddVendor";
import ChangeCredentials from "./pages/ChangeCredentials";
import UpdateBanner from "./pages/UpdateBanner";
import UpdateHero from "./pages/UpdateHero";


export const backend_url = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : "");
  const navigate = useNavigate();

  useEffect(() => {
    // Se não há token no estado e não há token no localStorage,
    // significa que o usuário não está logado, então redireciona para o login.
    // Isso evita que o usuário acesse as rotas protegidas sem autenticação.
    if (!token && !localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    // Apenas atualiza o localStorage se o token mudou e não está vazio
    if (token) {
      console.log("🔄 Atualizando token no localStorage:", token);
      localStorage.setItem("token", token);
    } else {
      // Se o token estiver vazio (ex: após logout), remova-o do localStorage
      console.log("🗑️ Removendo token do localStorage");
      localStorage.removeItem("token");
    }
  }, [token]);
   return (
    <main>
      <ToastContainer />
      {/*
        Lógica para exibir o componente Login APENAS SE o token não existe.
        Caso contrário, exibe o conteúdo principal do aplicativo.
      */}
      {token ? (
        <div className="bg-tertiary/15 text-[#404040]">
          <Header />
          <div className="max-auto max-w-[1440px] flex flex-col sm:flex-row mt-8 sm:mt-4">
            {/* Sidebar sempre recebe token e setToken, para logout por exemplo */}
            <Sidebar token={token} setToken={setToken}/>
            <Routes>
              {/* Todas as rotas protegidas que só devem ser acessadas com token */}
              <Route path="/" element={<Add token={token}/>} />
              <Route path="/list" element={<List token={token}/>} />
              <Route path='/list-vendor' element={<ListVendor token={token}/>}/>
              <Route path='/add-vendor' element={<AddVendor token={token}/>}/>
              <Route path='/update-banner' element={<UpdateBanner token={token}/>} />
              <Route path='/update-hero' element={<UpdateHero token={token}/>} />
              {/* change-credentials precisa de setToken para logout ou atualização de token */}
              <Route path="/change-credentials" element={<ChangeCredentials token={token} setToken={setToken}/>} />
            </Routes>
          </div>
        </div>
      ) : (
        // Se não há token, exiba o componente Login
        <Login setToken={setToken} /> 
      )}
    </main>
  );
}

export default App;
