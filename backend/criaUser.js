import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcrypt';
import { sequelize } from './config/postgres.js';
import User from './models/userModel.js';

const criarUsuario = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco de dados PostgreSQL.');

    const nome = 'Valderlan Admin';
    const email = 'admin@painel.com';
    const senha = 'admin123'; // você pode trocar por outra
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const [usuario, criado] = await User.findOrCreate({
      where: { email },
      defaults: {
        name: nome,
        password: senhaCriptografada,
        isAdmin: true
      }
    });

    if (criado) {
      console.log(`✅ Usuário criado com sucesso!`);
    } else {
      console.log(`⚠️ Usuário já existia. Dados mantidos.`);
    }

    console.log(`📧 Email: ${usuario.email}`);
    console.log(`🔑 Senha: ${senha}`);
    console.log(`👑 Admin: ${usuario.isAdmin ? 'Sim' : 'Não'}`);

    await sequelize.close();
    console.log('🔒 Conexão encerrada.');
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error);
  }
};

criarUsuario();
