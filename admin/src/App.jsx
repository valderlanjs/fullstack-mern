import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

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

  useEffect(() => {
    if (token) {
      console.log("🔄 Atualizando token no localStorage:", token);
      localStorage.setItem("token", token);
    }
  }, [token])
  return (
    <main>
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken}/>
      ) : (
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
      )}
    </main>
  );
}

export default App;
