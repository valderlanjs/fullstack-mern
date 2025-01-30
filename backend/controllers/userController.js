import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// User login route
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.json({ success: false, message: "Usuário não encontrado" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = createToken(user.id); // Alterado para user.id
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

    // Verificar se o e-mail já existe
    const exists = await User.findOne({ where: { email } });

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

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = { name, email, password: hashedPassword };

    const user = await User.create(userData); // Sem o .save() aqui
    const token = createToken(user.id); // Alterado para user.id

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
    // Procurar o usuário administrador no banco de dados
    const user = await User.findOne({ where: { email, isAdmin: true } });

    if (!user) {
      return res.json({
        success: false,
        message: "Administrador não encontrado!",
      });
    }

    console.log("Usuário encontrato: ", user.email);
    console.log("Senha encontrato: ", user.password);

    // Verificar se a senha está correta
    if (password === user.password) {
      const token = jwt.sign(
        { id: user.id, isAdmin: true },
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

    // Encontrar o usuário administrador no banco de dados
    const user = await User.findOne({ where: { isAdmin: true } });

    if (!user) {
      return res.json({
        success: false,
        message: "Administrador não encontrado!",
      });
    }

    // Verifica se a senha atual está correta
    if (currentPassword !== user.password) {
        return res.json({ success: false, message: "Senha atual incorreta" });
    }  
    // Atualizar a senha se fornecida
    if (newPassword) {
        user.password = newPassword;
    }  
    // Atualizar o nome de usuário fornecido
    if (newUsername) {
        user.email = newUsername;
    }

    await user.save();
    console.log("Credenciais atualizadas: ", user.email, user.password);

    // Gerar um novo token
    const newToken = jwt.sign({ id: user.id, isAdmin: true }, process.env.JWT_SECRET);

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
