// Arquivo: createAdmin.js

import { sequelize } from './config/mysql.js'; // Ajuste o caminho se necessário
import User from './models/userModel.js'; // Ajuste o caminho se necessário
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const createAdminUser = async () => {
    try {
        console.log('Iniciando script para criar administrador...');

        // Conecta e sincroniza para garantir que a tabela 'users' exista
        await sequelize.sync();

        // --- DADOS DO ADMINISTRADOR ---
        const adminEmail = 'admin15@gmail.com';
        const adminPassword = 'admin123'; 
        // -----------------------------

        // 1. Verifica se o usuário já existe
        const existingAdmin = await User.findOne({ where: { email: adminEmail } });

        if (existingAdmin) {
            console.log(`✅ O usuário administrador com o email '${adminEmail}' já existe.`);
            return;
        }

        // 2. Criptografa a senha
        console.log('Criptografando a senha...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        // 3. Cria o novo usuário administrador
        console.log('Criando o novo administrador no banco de dados...');
        const newUser = await User.create({
            name: 'Administrador',
            email: adminEmail,
            password: hashedPassword,
            isAdmin: true, // A MÁGICA ACONTECE AQUI!
        });

        console.log('🎉 Usuário administrador criado com sucesso!');
        console.log(`   - Email: ${newUser.email}`);
        console.log(`   - isAdmin: ${newUser.isAdmin}`);

    } catch (error) {
        console.error('❌ Erro ao executar o script:', error);
    } finally {
        // 4. Fecha a conexão com o banco de dados
        console.log('Fechando conexão com o banco de dados.');
        await sequelize.close();
    }
};

// Executa a função
createAdminUser();