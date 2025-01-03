import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

// user login route
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await userModel.findOne({email});

        if (!user) {
            return res.json({success: false, message: "Usuário não encontrado"})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = createToken(user._id)
            res.json({success: true, token})
        } else {
            res.json({success: false, message: "Senha incorreta!"})
        }
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }

};

// user registre route
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // checagem se o email ja existe ou não
    const exists = await userModel.findOne({ email });

    if (exists) {
      return res.json({
        succes: false,
        message: "Já existe usuário com esse email",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({ succes: false, message: "Insira um email válido" });
    }
    // validação da senha e checagem se a senha é forte
    if (password.length < 8) {
      return res.json({
        sucess: false,
        message: "Por favor, insira pelo menos 8 caracteres!",
      });
    }

    // hash para a senha de usuário
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id)

    res.json({sucess: true, token})

  } catch (error) {
    console.log(error)
    res.json({success: false, message: error.message})
  }
};

// Admin login route
const adminLogin = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS){
          const token = jwt.sign(email+password, process.env.JWT_SECRET);

          return res.json({success: true, token})
        } else {
          res.json({success: false, message: "Email ou senha incorretos"})
        }

    } catch (error) {
        console.log(error)
    }
};

export { loginUser, registerUser, adminLogin };
