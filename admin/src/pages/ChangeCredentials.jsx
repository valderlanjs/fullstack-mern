import React, { useState } from "react";
import axios from "axios";
import api from "../api/axios.js"
import { backend_url } from "../App";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ChangeCredentials = ({ token, setToken }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    newUsername: "",
  });

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("As senhas não coincidem!");
      return;
    }

    try {
      const response = await api.post(
        `${backend_url}/api/user/change-credentials`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          newUsername: formData.newUsername,
        },
        {
          headers: {
            token,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Resposta do backend:", response.data);

      if (response.data.success) {
        toast.success("Credenciais atualizadas com sucesso!");
        // Atualiza o token se as credenciais foram alteradas com sucesso
        if (response.data.newToken) {
          setToken(response.data.newToken);
          console.log("Novo token atualizado:", response.data.newToken);
          localStorage.setItem("token", response.data.newToken);
        }
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
          newUsername: "",
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Erro ao atualizar credenciais"
      );
    }
  };

  return (
    <div className="pl-8">
      <h3 className="h3">Alterar Credenciais de Acesso</h3>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-y-4 mt-4 max-w-md"
      >
        <div>
          <h5 className="h5">Novo email de acesso</h5>
          <input
            type="email"
            name="newUsername"
            value={formData.newUsername}
            onChange={handleInputChange}
            placeholder="Digite o novo usuário..."
            className="px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white mt-1 w-full"
          />
        </div>

        <div className="relative">
          <h5 className="h5">Senha Atual</h5>
          <input
            type={showPassword.currentPassword ? "text" : "password"}
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            placeholder="Digite sua senha atual..."
            className="px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white mt-1 w-full"
            required
          />
          <div
            className="absolute inset-y-0 right-0 pr-3 mt-7 flex items-center cursor-pointer"
            onClick={() => toggleShowPassword("currentPassword")}
          >
            {showPassword.currentPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        <div className="relative">
          <h5 className="h5">Nova Senha</h5>
          <input
            type={showPassword.newPassword ? "text" : "password"}
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            placeholder="Digite a nova senha..."
            className="px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white mt-1 w-full"
          />
          <div
            className="absolute inset-y-0 right-0 pr-3 mt-7 flex items-center cursor-pointer"
            onClick={() => toggleShowPassword("newPassword")}
          >
            {showPassword.newPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        <div className="relative">
          <h5 className="h5">Confirmar Nova Senha</h5>
          <input
            type={showPassword.confirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirme a nova senha..."
            className="px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white mt-1 w-full"
          />
          <div
            className="absolute inset-y-0 right-0 pr-3 mt-7 flex items-center cursor-pointer"
            onClick={() => toggleShowPassword("confirmPassword")}
          >
            {showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        <button type="submit" className="btn-secondary mt-3">
          Atualizar Credenciais
        </button>
      </form>
    </div>
  );
};

export default ChangeCredentials;
