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
            const token = createToken(user.id);  // Alterado para user.id
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

        const user = await User.create(userData);  // Sem o .save() aqui
        const token = createToken(user.id);  // Alterado para user.id

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
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            return res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Email ou senha incorretos" });
        }
    } catch (error) {
        console.log(error);
    }
};

export { loginUser, registerUser, adminLogin };
