// scripts/createAdmin.js
import { sequelize } from "./config/postgres.js";
import User from "./models/userModel.js";
import bcrypt from "bcryptjs";
import validator from "validator";

const createAdminUser = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco de dados');

    const adminData = {
      name: "Administrador",
      email: "valderlanjosr15@gmail.com", // Altere para o email desejado
      password: "Val2110#", // Altere para uma senha forte
      isAdmin: true,
      permissions: {
        managePrivacyTerms: true,
        manageProducts: true,
        manageVendors: true
      }
    };

    // Verifica se o email é válido
    if (!validator.isEmail(adminData.email)) {
      throw new Error("Email inválido");
    }

    // Verifica se a senha é forte o suficiente
    if (adminData.password.length < 8) {
      throw new Error("A senha deve ter pelo menos 8 caracteres");
    }

    // Verifica se já existe um usuário com este email
    const existingUser = await User.findOne({ where: { email: adminData.email } });
    if (existingUser) {
      console.log('⚠️  Já existe um usuário com este email');
      return;
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Cria o usuário admin
    const adminUser = await User.create({
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword,
      isAdmin: true,
      permissions: adminData.permissions
    });

    console.log('✅ Administrador criado com sucesso!');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Senha:', adminData.password);
    console.log('👑 Tipo: Administrador Total');
    console.log('🔐 Permissões: Todas as permissões');

  } catch (error) {
    console.error('❌ Erro ao criar administrador:', error.message);
  } finally {
    await sequelize.close();
  }
};

// Executa o script
createAdminUser();
