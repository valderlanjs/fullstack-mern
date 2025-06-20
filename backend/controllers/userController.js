import validator from "validator";
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

export { loginUser, registerUser, adminLogin, changeAdminCredentials };