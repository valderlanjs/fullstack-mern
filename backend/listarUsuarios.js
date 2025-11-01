import dotenv from 'dotenv';
dotenv.config();

import { sequelize } from './config/postgres.js';
import User from './models/userModel.js';

const listarUsuarios = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco de dados PostgreSQL.');

    const usuarios = await User.findAll();

    if (usuarios.length === 0) {
      console.log('⚠️ Nenhum usuário encontrado.');
    } else {
      console.log(`📋 ${usuarios.length} usuário(s) encontrados:\n`);
      usuarios.forEach((usuario, index) => {
        console.log(`${index + 1}. Nome: ${usuario.name}`);
        console.log(`   Email: ${usuario.email}`);
        console.log(`   Senha: ${usuario.password}`);
        console.log(`   Admin: ${usuario.isAdmin ? 'Sim' : 'Não'}\n`);
      });
    }

    await sequelize.close();
    console.log('🔒 Conexão encerrada.');
  } catch (error) {
    console.error('❌ Erro ao listar usuários:', error);
  }
};

listarUsuarios();
