/*import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const createToken = (id) => {
  // Para Mongoose/MongoDB, o ID é _id
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// User login route
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // CORREÇÃO: Remova o 'where' para Mongoose/MongoDB
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Usuário não encontrado" });
    }

    // CORRETO: Comparação de hash com bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id); // CORREÇÃO: use user._id
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Senha incorreta!" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User register route
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // CORREÇÃO: Remova o 'where' para Mongoose/MongoDB
    const exists = await User.findOne({ email });

    if (exists) {
      return res.json({
        success: false,
        message: "Já existe usuário com esse email",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Insira um email válido" });
    }

    // Validação de senha
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Por favor, insira pelo menos 8 caracteres!",
      });
    }

    // Hash da senha (já estava correto aqui)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = { name, email, password: hashedPassword };

    const user = await User.create(userData);
    const token = createToken(user._id); // CORREÇÃO: use user._id

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Admin login route
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Tentativa de login: ", email, password);

    // CORRETO: Removido o 'where'
    const user = await User.findOne({ email, isAdmin: true });

    if (!user) {
      return res.json({
        success: false,
        message: "Administrador não encontrado!",
      });
    }

    console.log("Usuário encontrado: ", user.email);
    console.log("Senha armazenada (do DB): ", user.password); // Será um hash

    // CORREÇÃO CRÍTICA: Use bcrypt.compare() aqui!
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign(
        { _id: user._id, isAdmin: true }, // CORREÇÃO: use user._id
        process.env.JWT_SECRET
      );
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Senha incorreta!" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Alterar as credenciais do administrador
const changeAdminCredentials = async (req, res) => {
  try {
    const { currentPassword, newPassword, newUsername } = req.body;

    // CORREÇÃO: Remova o 'where' para Mongoose/MongoDB
    const user = await User.findOne({ isAdmin: true });

    if (!user) {
      return res.json({
        success: false,
        message: "Administrador não encontrado!",
      });
    }

    // CORREÇÃO CRÍTICA: Verifica a senha atual usando bcrypt.compare
    const isCurrentPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordCorrect) {
      return res.json({ success: false, message: "Senha atual incorreta" });
    }

    // Atualizar a senha se fornecida (fazer hash da nova senha)
    if (newPassword) {
      const salt = await bcrypt.genSalt(10); // Gere um novo salt para a nova senha
      const hashedNewPassword = await bcrypt.hash(newPassword, salt); // Faça o hash da nova senha
      user.password = hashedNewPassword;
    }
    // Atualizar o nome de usuário fornecido
    if (newUsername) {
      user.email = newUsername;
    }

    await user.save();
    console.log("Credenciais atualizadas: ", user.email, user.password);

    const newToken = jwt.sign(
      { _id: user._id, isAdmin: true }, // CORREÇÃO: use user._id
      process.env.JWT_SECRET
    );

    res.json({
      success: true,
      message: "Credenciais alteradas com sucesso!",
      newToken,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, adminLogin, changeAdminCredentials };*/

import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const createToken = (id, isAdmin = false) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET);
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
    const { name, email, password } = req.body;
    if (!validator.isEmail(email)) return res.status(400).json({ success: false, message: "Email inválido" });
    if (password.length < 8) return res.status(400).json({ success: false, message: "Senha fraca" });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ success: false, message: "Email já cadastrado" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = createToken(user.id, user.isAdmin);
    res.status(201).json({ success: true, token, user });
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
    if (!validator.isEmail(email)) return res.status(400).json({ success: false, message: "Email inválido" });
    if (password.length < 8) return res.status(400).json({ success: false, message: "Senha fraca" });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ success: false, message: "Email já cadastrado" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword, isAdmin: true });

    res.status(201).json({ success: true, message: "Administrador cadastrado com sucesso!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao cadastrar administrador." });
  }
};

// 📋 Listar todos os usuários
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "isAdmin"],
      // ❌ Remova a ordenação por createdAt
      // order: [["createdAt", "DESC"]],
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
    const { name, email, isAdmin } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ success: false, message: "Usuário não encontrado." });

    user.name = name || user.name;
    user.email = email || user.email;
    user.isAdmin = isAdmin ?? user.isAdmin;

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

export {
  loginUser,
  registerUser,
  adminLogin,
  changeAdminCredentials,
  registerAdmin,
  getAllUsers,
  updateUser,
  updateUserPassword,
};
