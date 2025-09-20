/*import React, { useEffect, useState } from "react";
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
      
      {token ? (
        <div className="bg-tertiary/15 text-[#404040]">
          <Header />
          <div className="max-auto max-w-[1440px] flex flex-col sm:flex-row mt-8 sm:mt-4">
           
            <Sidebar token={token} setToken={setToken}/>
            <Routes>
             
              <Route path="/" element={<Add token={token}/>} />
              <Route path="/list" element={<List token={token}/>} />
              <Route path='/list-vendor' element={<ListVendor token={token}/>}/>
              <Route path='/add-vendor' element={<AddVendor token={token}/>}/>
              <Route path='/update-banner' element={<UpdateBanner token={token}/>} />
              <Route path='/update-hero' element={<UpdateHero token={token}/>} />
             
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

export default App;*/


import React, { useEffect, useState } from "react";
// Adicionado Navigate para redirecionamentos
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
// Adicionado o novo componente de Registro
import Register from "./components/Register"; 

import Add from "./pages/Add";
import List from "./pages/List";
import ListVendor from "./pages/ListVendor";
import AddVendor from "./pages/AddVendor";
import ChangeCredentials from "./pages/ChangeCredentials";
import UpdateBanner from "./pages/UpdateBanner";
import UpdateHero from "./pages/UpdateHero";
{/*import CreateCard from "./pages/createCard"*/}
import ManageCards from "./pages/manageCards"

export const backend_url = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : "");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <main>
      <ToastContainer />
      {token ? (
        // LÓGICA PARA USUÁRIO LOGADO (NÃO MUDA)
        <div className="bg-tertiary/15 text-[#404040]">
          <Header />
          <div className="max-auto max-w-[1440px] flex flex-col sm:flex-row mt-8 sm:mt-4">
            <Sidebar token={token} setToken={setToken} />
            <Routes>
              <Route path="/" element={<Add token={token} />} />
              <Route path="/list" element={<List token={token} />} />
              <Route path='/list-vendor' element={<ListVendor token={token} />} />
              <Route path='/add-vendor' element={<AddVendor token={token} />} />
              <Route path='/update-banner' element={<UpdateBanner token={token} />} />
              <Route path='/update-hero' element={<UpdateHero token={token} />} />
              {/*<Route path='/create-card' element={<CreateCard token={token} />} />*/}
              <Route path='/manage-cards' element={<ManageCards token={token} />} />
              <Route path="/change-credentials" element={<ChangeCredentials token={token} setToken={setToken} />} />
              {/* Redireciona qualquer outra rota para a home se o usuário estiver logado */}
              <Route path='*' element={<Navigate to='/' />} />
            </Routes>
          </div>
        </div>
      ) : (
        // NOVA LÓGICA PARA USUÁRIO NÃO LOGADO
        <Routes>
          <Route path='/login' element={<Login setToken={setToken} />} />
          <Route path='/register' element={<Register />} />
          {/* Redireciona qualquer outra rota para /login se não houver token */}
          <Route path='*' element={<Navigate to='/login' />} />
        </Routes>
      )}
    </main>
  );
}

export default App;
