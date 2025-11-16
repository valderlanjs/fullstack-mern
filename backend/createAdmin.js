// createAdmin.js
import { sequelize } from './config/postgres.js';
import User from './models/userModel.js';
import bcrypt from 'bcryptjs';

const createAdminUser = async () => {
  try {
    // Conectar ao banco de dados
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco de dados PostgreSQL');

    // Sincronizar modelos (caso necessário)
    await sequelize.sync();
    console.log('✅ Modelos sincronizados');

    // Verificar se já existe um usuário admin
    const existingAdmin = await User.findOne({ 
      where: { email: 'admin@dev-valderlan.com.br' } 
    });
    
    if (existingAdmin) {
      console.log('⚠️  Usuário admin já existe:');
      console.log(`   📧 Email: ${existingAdmin.email}`);
      console.log(`   👤 Nome: ${existingAdmin.name}`);
      console.log(`   🔑 Admin: ${existingAdmin.isAdmin ? 'Sim' : 'Não'}`);
      return;
    }

    // Criar hash da senha
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Criar usuário admin
    const adminUser = await User.create({
      name: 'Administrador Principal',
      email: 'admin@gmail.com',
      password: hashedPassword,
      isAdmin: true
    });

    console.log('✅ USUÁRIO ADMIN CRIADO COM SUCESSO!');
    console.log('=====================================');
    console.log(`📧 Email: ${adminUser.email}`);
    console.log('🔑 Senha: admin123');
    console.log(`👤 Nome: ${adminUser.name}`);
    console.log(`🎯 Tipo: Administrador`);
    console.log('=====================================');
    console.log('⚠️  IMPORTANTE: Altere esta senha após o primeiro login!');
    console.log('🔗 Acesse: https://dev-valderlan.com.br/admin');

  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:', error.message);
    console.error('Detalhes:', error);
  } finally {
    // Fechar conexão
    await sequelize.close();
    console.log('🔌 Conexão com o banco fechada');
  }
};

// Executar o script
createAdminUser();