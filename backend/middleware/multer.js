import multer from "multer";

const storage = multer.memoryStorage();

// Configuração do multer com validação de tamanho
const upload = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB em bytes
  },
  fileFilter: (req, file, cb) => {
    // Verifica se é uma imagem
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
    }
  }
});

// Middleware de tratamento de erros do multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'A imagem deve ter no máximo 1MB'
      });
    }
  } else if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  next();
};

export { upload, handleMulterError };