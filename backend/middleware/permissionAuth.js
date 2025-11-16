// middleware/permissionAuth.js
import User from "../models/userModel.js";

// Middleware para verificar permissões específicas
const checkPermission = (permission) => {
  return async (req, res, next) => {
    try {
      // Se for admin, tem acesso total
      if (req.user.isAdmin) {
        return next();
      }

      // Busca o usuário atualizado com permissões
      const currentUser = await User.findByPk(req.user.id);
      
      if (!currentUser) {
        return res.status(404).json({ 
          success: false, 
          message: "Usuário não encontrado." 
        });
      }

      // Verifica se tem a permissão específica
      if (currentUser.permissions && currentUser.permissions[permission]) {
        return next();
      }

      return res.status(403).json({ 
        success: false, 
        message: `Acesso negado. Permissão necessária: ${permission}` 
      });
    } catch (error) {
      console.error("Erro ao verificar permissão:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Erro interno do servidor." 
      });
    }
  };
};

// Middleware para verificar se é admin OU tem alguma permissão
const checkAdminOrPermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (req.user.isAdmin) {
        return next();
      }

      const currentUser = await User.findByPk(req.user.id);
      
      if (!currentUser) {
        return res.status(404).json({ 
          success: false, 
          message: "Usuário não encontrado." 
        });
      }

      // Verifica se tem pelo menos uma das permissões necessárias
      const hasPermission = currentUser.permissions && 
        Object.values(currentUser.permissions).some(perm => perm === true);

      if (hasPermission) {
        return next();
      }

      return res.status(403).json({ 
        success: false, 
        message: "Acesso negado. Nenhuma permissão concedida." 
      });
    } catch (error) {
      console.error("Erro ao verificar permissões:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Erro interno do servidor." 
      });
    }
  };
};

export { checkPermission, checkAdminOrPermission };