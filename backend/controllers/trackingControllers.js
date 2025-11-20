import TrackingCode from "../models/trackingModel.js";

const createTrackingCode = async (req, res) => {
  try {
    const { name, platform, codeType, code, position, description } = req.body;

    const trackingCode = await TrackingCode.create({
      name,
      platform,
      codeType,
      code,
      position: position || 'head',
      description,
      isActive: false // Por padrão cria inativo
    });

    res.status(201).json({
      success: true,
      message: "Código de tracking criado com sucesso!",
      data: trackingCode
    });
  } catch (error) {
    console.error("Erro ao criar código de tracking:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao criar código de tracking."
    });
  }
};

const getActiveTrackingCodes = async (req, res) => {
  try {
    const trackingCodes = await TrackingCode.findAll({
      where: { isActive: true }
    });

    res.json({
      success: true,
      data: trackingCodes
    });
  } catch (error) {
    console.error("Erro ao buscar códigos de tracking:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar códigos ativos."
    });
  }
};

const getAllTrackingCodes = async (req, res) => {
  try {
    const trackingCodes = await TrackingCode.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: trackingCodes
    });
  } catch (error) {
    console.error("Erro ao listar códigos de tracking:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao listar códigos."
    });
  }
};

const toggleTrackingCode = async (req, res) => {
  try {
    const { id, isActive } = req.body;

    const trackingCode = await TrackingCode.findByPk(id);
    
    if (!trackingCode) {
      return res.status(404).json({
        success: false,
        message: "Código de tracking não encontrado."
      });
    }

    await trackingCode.update({ isActive });

    res.json({
      success: true,
      message: `Código ${isActive ? 'ativado' : 'desativado'} com sucesso!`,
      data: trackingCode
    });
  } catch (error) {
    console.error("Erro ao alternar código:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao alternar status do código."
    });
  }
};

const updateTrackingCode = async (req, res) => {
  try {
    const { id, name, code, description } = req.body;

    const trackingCode = await TrackingCode.findByPk(id);
    
    if (!trackingCode) {
      return res.status(404).json({
        success: false,
        message: "Código de tracking não encontrado."
      });
    }

    await trackingCode.update({
      name,
      code,
      description
    });

    res.json({
      success: true,
      message: "Código atualizado com sucesso!",
      data: trackingCode
    });
  } catch (error) {
    console.error("Erro ao atualizar código:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar código."
    });
  }
};

const deleteTrackingCode = async (req, res) => {
  try {
    const { id } = req.body;

    const result = await TrackingCode.destroy({ where: { id } });

    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: "Código de tracking não encontrado."
      });
    }

    res.json({
      success: true,
      message: "Código removido com sucesso!"
    });
  } catch (error) {
    console.error("Erro ao remover código:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao remover código."
    });
  }
};

export { 
  createTrackingCode, 
  getActiveTrackingCodes, 
  getAllTrackingCodes, 
  toggleTrackingCode, 
  updateTrackingCode, 
  deleteTrackingCode 
};