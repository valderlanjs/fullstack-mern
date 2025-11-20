import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const createToken = (id, isAdmin = false) => {
  return jwt.sign(
    { id, isAdmin }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } // Padrão 1 hora
  );
};

// 🔐 Login comum
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ success: false, message: "Usuário não encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Credenciais inválidas" });

    const token = createToken(user.id, user.isAdmin);
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro no servidor." });
  }
};

// 🆕 Cadastro comum
const registerUser = async (req, res) => {
  try {
    const { name, email, password, isAdmin, permissions } = req.body;
    
    // Verifica se o usuário atual é admin para definir permissões
    const currentUserIsAdmin = req.user?.isAdmin || false;

    if (!validator.isEmail(email)) return res.status(400).json({ success: false, message: "Email inválido" });
    if (password.length < 8) return res.status(400).json({ success: false, message: "Senha fraca" });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ success: false, message: "Email já cadastrado" });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Define os valores padrão para permissões
    const userData = {
      name,
      email,
      password: hashedPassword,
      isAdmin: currentUserIsAdmin ? (isAdmin || false) : false,
      permissions: currentUserIsAdmin ? (permissions || {
        managePrivacyTerms: false,
        manageProducts: false,
        manageVendors: false
      }) : {
        managePrivacyTerms: false,
        manageProducts: false,
        manageVendors: false
      }
    };

    const user = await User.create(userData);
    const token = createToken(user.id, user.isAdmin);
    
    res.status(201).json({ 
      success: true, 
      token, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        permissions: user.permissions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro no servidor." });
  }
};

// 👑 Login de administrador
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email, isAdmin: true } });
    if (!user) return res.status(404).json({ success: false, message: "Administrador não encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Credenciais inválidas" });

    const token = createToken(user.id, true);
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro no servidor." });
  }
};

// 🛠️ Alterar credenciais do admin
const changeAdminCredentials = async (req, res) => {
  try {
    const { currentPassword, newPassword, newUsername } = req.body;
    const user = await User.findOne({ where: { isAdmin: true } });
    if (!user) return res.status(404).json({ success: false, message: "Administrador não encontrado" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Senha atual incorreta" });

    if (newPassword) user.password = await bcrypt.hash(newPassword, 10);
    if (newUsername) user.email = newUsername;

    await user.save();
    const newToken = createToken(user.id, true);
    res.json({ success: true, message: "Credenciais atualizadas", newToken });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro no servidor" });
  }
};

// 🆕 Cadastro de administrador
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Verifica se o usuário atual é admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: "Apenas administradores podem criar outros administradores." 
      });
    }

    if (!validator.isEmail(email)) return res.status(400).json({ success: false, message: "Email inválido" });
    if (password.length < 8) return res.status(400).json({ success: false, message: "Senha fraca" });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ success: false, message: "Email já cadastrado" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      isAdmin: true,
      permissions: {
        managePrivacyTerms: true,
        manageProducts: true,
        manageVendors: true
      }
    });

    res.status(201).json({ success: true, message: "Administrador cadastrado com sucesso!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao cadastrar administrador." });
  }
};

// 📋 Listar todos os usuários
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "isAdmin", "permissions"],
    });

    res.json({ success: true, users });
  } catch (error) {
    console.error("❌ Erro ao buscar usuários:", error.message);
    res.status(500).json({ success: false, message: "Erro ao buscar usuários." });
  }
};

// ✏️ Atualizar dados do usuário
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, isAdmin, permissions } = req.body;

    // Apenas administradores podem criar outros administradores
    if (isAdmin && !req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: "Apenas administradores podem criar outros administradores." 
      });
    }

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ success: false, message: "Usuário não encontrado." });

    user.name = name || user.name;
    user.email = email || user.email;
    
    // Só atualiza isAdmin se o usuário atual for admin
    if (req.user.isAdmin) {
      user.isAdmin = isAdmin ?? user.isAdmin;
    }

    // Atualiza permissões
    if (permissions && req.user.isAdmin) {
      user.permissions = { ...user.permissions, ...permissions };
    }

    await user.save();
    res.json({ success: true, message: "Usuário atualizado com sucesso!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao atualizar usuário." });
  }
};



// 🔑 Atualizar senha do usuário
const updateUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "Senha inválida." });
    }

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ success: false, message: "Usuário não encontrado." });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: "Senha atualizada com sucesso!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao atualizar senha." });
  }
};

// userController.js - adicione esta função
const getCurrentUser = async (req, res) => {
  try {
    // O middleware authenticate já coloca o usuário em req.user
    const user = req.user;
    
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        permissions: user.permissions // ← ADICIONE AS PERMISSÕES AQUI
      }
    });
  } catch (error) {
    console.error("Erro ao buscar usuário atual:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar informações do usuário."
    });
  }
};

// userController.js - Adicione esta função
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Impedir que o usuário exclua a si mesmo
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ 
        success: false, 
        message: "Você não pode excluir sua própria conta." 
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "Usuário não encontrado." 
      });
    }

    await user.destroy();
    res.json({ 
      success: true, 
      message: "Usuário excluído com sucesso!" 
    });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erro ao excluir usuário." 
    });
  }
};


export {
  loginUser,
  registerUser,
  adminLogin,
  changeAdminCredentials,
  registerAdmin,
  getAllUsers,
  updateUser,
  updateUserPassword,
  getCurrentUser,
  deleteUser
};
