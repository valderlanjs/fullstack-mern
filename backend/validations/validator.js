import { z } from 'zod';

export const validate = (schema) => {
  return (req, res, next) => {
    try {
      // Combina body, params e query para validação
      const dataToValidate = {
        ...req.body,
        ...req.params,
        ...req.query
      };

      
      const result = schema.parse(dataToValidate);
      
      // Substitui req.body pelos dados validados e transformados
      req.validatedData = result;
      
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Dados de entrada inválidos',
          errors
        });
      }
      
      // Outros erros
      console.error('Erro na validação:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno na validação'
      });
    }
  };
};

// Validador para parâmetros de ID
export const validateId = (req, res, next) => {
  try {
    const idSchema = z.object({
      id: z.string().or(z.number()).transform(val => parseInt(val))
    });
    
    const result = idSchema.parse({ id: req.params.id });
    req.validatedData = { ...req.validatedData, ...result };
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'ID inválido'
    });
  }
};