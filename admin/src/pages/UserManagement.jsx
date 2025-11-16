// components/admin/UserManagement.jsx - Versão Completa com Permissões
import React, { useState, useEffect } from "react";
import axios from "axios";
import { backend_url } from "../App";
import { toast } from "react-toastify";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaUser,
  FaUserShield,
  FaExclamationTriangle,
  FaKey,
  FaEye,
  FaEyeSlash,
  FaUserPlus,
  FaLock,
  FaUnlock,
  FaBox,
  FaFileContract,
  FaStore
} from "react-icons/fa";

const UserManagement = ({ token, currentUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Estados para modais
  const [editingUser, setEditingUser] = useState(null);
  const [editingPassword, setEditingPassword] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);

  // Estados para formulários
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    isAdmin: false,
    permissions: {
      managePrivacyTerms: false,
      manageProducts: false,
      manageVendors: false
    }
  });

  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [addUserForm, setAddUserForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    isAdmin: false,
    permissions: {
      managePrivacyTerms: false,
      manageProducts: false,
      manageVendors: false
    }
  });

  const [showPassword, setShowPassword] = useState({
    add: false,
    edit: false,
  });

  // Lista de permissões disponíveis
  const permissionsList = [
    { 
      key: 'manageVendors', 
      label: 'Gerenciar Vendedores', 
      description: 'Pode cadastrar, editar e excluir vendedores',
      icon: FaStore,
      color: 'text-blue-600'
    },
    { 
      key: 'manageProducts', 
      label: 'Gerenciar Produtos', 
      description: 'Pode cadastrar, editar e excluir produtos',
      icon: FaBox,
      color: 'text-green-600'
    },
    { 
      key: 'managePrivacyTerms', 
      label: 'Gerenciar Termos e Privacidade', 
      description: 'Pode alterar políticas de privacidade e termos de uso',
      icon: FaFileContract,
      color: 'text-purple-600'
    }
  ];

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${backend_url}/api/user/admin/users`, {
        headers: { token },
      });

      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        setError(response.data.message || "Erro ao carregar usuários");
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      const errorMessage = error.response?.data?.message || "Erro de conexão com o servidor";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  // 🔧 Função para editar usuário
  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      permissions: user.permissions || {
        managePrivacyTerms: false,
        manageProducts: false,
        manageVendors: false
      }
    });
  };

  // 🗑️ Função para excluir usuário
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Tem certeza que deseja excluir o usuário "${userName}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      const response = await axios.delete(
        `${backend_url}/api/user/admin/users/${userId}`,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Usuário excluído com sucesso!");
        fetchUsers();
      }
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      toast.error(error.response?.data?.message || "Erro ao excluir usuário");
    }
  };

  // Add new user
  const handleAddUser = async (e) => {
    e.preventDefault();

    if (addUserForm.password !== addUserForm.confirmPassword) {
      toast.error("As senhas não coincidem!");
      return;
    }

    try {
      const response = await axios.post(
        `${backend_url}/api/user/register`,
        addUserForm,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Usuário cadastrado com sucesso!");
        setShowAddUser(false);
        setAddUserForm({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          isAdmin: false,
          permissions: {
            managePrivacyTerms: false,
            manageProducts: false,
            manageVendors: false
          }
        });
        fetchUsers();
      }
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      toast.error(error.response?.data?.message || "Erro ao cadastrar usuário");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${backend_url}/api/user/admin/users/${editingUser.id}`,
        editForm,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setEditingUser(null);
        fetchUsers();
      }
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      toast.error(error.response?.data?.message || "Erro ao atualizar usuário");
    }
  };

  // Edit password
  const handleEditPassword = (user) => {
    setEditingPassword(user);
    setPasswordForm({
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("As senhas não coincidem!");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("A senha deve ter pelo menos 8 caracteres!");
      return;
    }

    try {
      const response = await axios.put(
        `${backend_url}/api/user/admin/users/${editingPassword.id}/password`,
        { newPassword: passwordForm.newPassword },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setEditingPassword(null);
        setPasswordForm({ newPassword: "", confirmPassword: "" });
      }
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
      toast.error(error.response?.data?.message || "Erro ao atualizar senha");
    }
  };

  // Função para verificar se usuário tem alguma permissão
  const hasAnyPermission = (user) => {
    if (user.isAdmin) return true;
    if (!user.permissions) return false;
    return Object.values(user.permissions).some(perm => perm === true);
  };

  // Função para obter permissões ativas do usuário
  const getActivePermissions = (user) => {
    if (user.isAdmin) return ["Administrador"];
    
    const activePerms = [];
    if (user.permissions) {
      permissionsList.forEach(perm => {
        if (user.permissions[perm.key]) {
          activePerms.push(perm.label);
        }
      });
    }
    
    return activePerms.length > 0 ? activePerms : ["Nenhuma permissão"];
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Erro ao carregar usuários
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchUsers}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gerenciamento de Usuários</h2>
        <div className="text-sm text-gray-600">
          Total: {users.length} usuário(s)
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
        </div>

        {/* Add User Button - Só mostra se for admin */}
        {currentUser?.isAdmin && (
          <button
            onClick={() => setShowAddUser(true)}
            className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <FaUserPlus />
            Novo Usuário
          </button>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaUserPlus className="text-secondary" />
              Cadastrar Novo Usuário
            </h3>
            <form onSubmit={handleAddUser}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome *</label>
                    <input
                      type="text"
                      value={addUserForm.name}
                      onChange={(e) => setAddUserForm({ ...addUserForm, name: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <input
                      type="email"
                      value={addUserForm.email}
                      onChange={(e) => setAddUserForm({ ...addUserForm, email: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Senha *</label>
                    <div className="relative">
                      <input
                        type={showPassword.add ? "text" : "password"}
                        value={addUserForm.password}
                        onChange={(e) => setAddUserForm({ ...addUserForm, password: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded pr-10"
                        placeholder="Mínimo 8 caracteres"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword({ ...showPassword, add: !showPassword.add })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {showPassword.add ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Confirmar Senha *</label>
                    <input
                      type={showPassword.add ? "text" : "password"}
                      value={addUserForm.confirmPassword}
                      onChange={(e) => setAddUserForm({ ...addUserForm, confirmPassword: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Digite a senha novamente"
                      required
                    />
                  </div>
                </div>

                {/* Seção de Permissões */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3 text-gray-700">Permissões de Acesso</h4>
                  
                  {/* Checkbox Administrador */}
                  {currentUser?.isAdmin && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={addUserForm.isAdmin}
                          onChange={(e) => {
                            const isAdmin = e.target.checked;
                            setAddUserForm({
                              ...addUserForm,
                              isAdmin,
                              // Se for admin, desmarca todas as permissões específicas
                              permissions: isAdmin ? {
                                managePrivacyTerms: false,
                                manageProducts: false,
                                manageVendors: false
                              } : addUserForm.permissions
                            });
                          }}
                          className="mr-2"
                          id="isAdminNew"
                        />
                        <label htmlFor="isAdminNew" className="text-sm font-medium text-yellow-800">
                          Usuário Administrador (Acesso Total)
                        </label>
                      </div>
                      <p className="text-xs text-yellow-600 mt-1">
                        Administradores têm acesso a todas as funcionalidades do sistema.
                      </p>
                    </div>
                  )}

                  {/* Permissões Específicas */}
                  {!addUserForm.isAdmin && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 mb-3">
                        Selecione as permissões específicas para este usuário:
                      </p>
                      {permissionsList.map((permission) => {
                        const IconComponent = permission.icon;
                        return (
                          <div key={permission.key} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-200">
                            <input
                              type="checkbox"
                              checked={addUserForm.permissions[permission.key]}
                              onChange={(e) => setAddUserForm({
                                ...addUserForm,
                                permissions: {
                                  ...addUserForm.permissions,
                                  [permission.key]: e.target.checked
                                }
                              })}
                              className="mt-1"
                              id={`perm-${permission.key}`}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <IconComponent className={`${permission.color} text-sm`} />
                                <label htmlFor={`perm-${permission.key}`} className="font-medium text-gray-800">
                                  {permission.label}
                                </label>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{permission.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-600">* Campos obrigatórios</div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  type="submit"
                  className="bg-secondary text-white px-4 py-2 rounded hover:bg-green-700 flex-1"
                >
                  Cadastrar
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Editar Usuário</h3>
            <form onSubmit={handleUpdateUser}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                </div>

                {/* Seção de Permissões no Edit */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3 text-gray-700">Permissões de Acesso</h4>
                  
                  {/* Checkbox Administrador - Só admin pode editar */}
                  {currentUser?.isAdmin && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editForm.isAdmin}
                          onChange={(e) => {
                            const isAdmin = e.target.checked;
                            setEditForm({
                              ...editForm,
                              isAdmin,
                              permissions: isAdmin ? {
                                managePrivacyTerms: false,
                                manageProducts: false,
                                manageVendors: false
                              } : editForm.permissions
                            });
                          }}
                          className="mr-2"
                          id="isAdminEdit"
                        />
                        <label htmlFor="isAdminEdit" className="text-sm font-medium text-yellow-800">
                          Usuário Administrador (Acesso Total)
                        </label>
                      </div>
                      <p className="text-xs text-yellow-600 mt-1">
                        Administradores têm acesso a todas as funcionalidades do sistema.
                      </p>
                    </div>
                  )}

                  {/* Permissões Específicas */}
                  {!editForm.isAdmin && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 mb-3">
                        Selecione as permissões específicas para este usuário:
                      </p>
                      {permissionsList.map((permission) => {
                        const IconComponent = permission.icon;
                        return (
                          <div key={permission.key} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-green-200">
                            <input
                              type="checkbox"
                              checked={editForm.permissions[permission.key]}
                              onChange={(e) => setEditForm({
                                ...editForm,
                                permissions: {
                                  ...editForm.permissions,
                                  [permission.key]: e.target.checked
                                }
                              })}
                              className="mt-1"
                              id={`perm-edit-${permission.key}`}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <IconComponent className={`${permission.color} text-sm`} />
                                <label htmlFor={`perm-edit-${permission.key}`} className="font-medium text-gray-800">
                                  {permission.label}
                                </label>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{permission.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  type="submit"
                  className="bg-secondary text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Password Modal */}
      {editingPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Alterar Senha de {editingPassword.name}
            </h3>
            <form onSubmit={handleUpdatePassword}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nova Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.edit ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded pr-10"
                      placeholder="Digite a nova senha"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword({
                          ...showPassword,
                          edit: !showPassword.edit,
                        })
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword.edit ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Confirmar Senha
                  </label>
                  <input
                    type={showPassword.edit ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Confirme a nova senha"
                    required
                  />
                </div>
                <div className="text-sm text-gray-600">
                  A senha deve ter pelo menos 8 caracteres.
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  type="submit"
                  className="bg-secondary text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Alterar Senha
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPassword(null)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm
              ? "Nenhum usuário encontrado."
              : "Nenhum usuário cadastrado."}
            {!searchTerm && currentUser?.isAdmin && (
              <button
                onClick={() => setShowAddUser(true)}
                className="mt-2 text-secondary hover:underline block mx-auto"
              >
                Clique aqui para cadastrar o primeiro usuário
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permissões
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-secondary rounded-full flex items-center justify-center">
                          {user.isAdmin ? (
                            <FaUserShield className="text-white" />
                          ) : (
                            <FaUser className="text-white" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                            {user.id === currentUser?.id && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                Você
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isAdmin
                            ? "bg-purple-100 text-purple-800"
                            : hasAnyPermission(user)
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.isAdmin ? "Administrador" : 
                         hasAnyPermission(user) ? "Usuário com Permissões" : "Usuário Básico"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {getActivePermissions(user).map((perm, index) => (
                          <span
                            key={index}
                            className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1 mb-1"
                          >
                            {perm}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          title="Editar usuário"
                          disabled={!currentUser?.isAdmin && user.id !== currentUser?.id}
                        >
                          <FaEdit />
                          <span className="hidden sm:inline">Editar</span>
                        </button>
                        <button
                          onClick={() => handleEditPassword(user)}
                          className="text-green-600 hover:text-green-900 flex items-center gap-1"
                          title="Alterar senha"
                          disabled={!currentUser?.isAdmin && user.id !== currentUser?.id}
                        >
                          <FaKey />
                          <span className="hidden sm:inline">Senha</span>
                        </button>
                        {currentUser?.isAdmin && user.id !== currentUser?.id && (
                          <button
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="text-red-600 hover:text-red-900 flex items-center gap-1"
                            title="Excluir usuário"
                          >
                            <FaTrash />
                            <span className="hidden sm:inline">Excluir</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{users.length}</div>
          <div className="text-sm text-blue-800">Total de Usuários</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {users.filter((user) => user.isAdmin).length}
          </div>
          <div className="text-sm text-purple-800">Administradores</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {users.filter((user) => !user.isAdmin && hasAnyPermission(user)).length}
          </div>
          <div className="text-sm text-green-800">Com Permissões</div>
        </div>
        <div className="bg-gray-200 p-4 rounded-lg">
          <div className="text-2xl font-bold text-gray-600">
            {users.filter((user) => !user.isAdmin && !hasAnyPermission(user)).length}
          </div>
          <div className="text-sm text-gray-800">Básicos</div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;