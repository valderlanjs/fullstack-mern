import { z } from 'zod';


export const commonValidations = {
  id: z.string().or(z.number()).transform(val => parseInt(val)),
  email: z.string().email('E-mail inválido'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  url: z.string().url('URL inválida').optional().or(z.literal('')),
  text: z.string().max(500).optional().or(z.literal('')),
  longText: z.string().max(2000).optional().or(z.literal('')),
  phone: z.string().regex(/^[\d\s\(\)\-\+]+$/, 'Telefone inválido').optional().or(z.literal('')),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Cor deve ser em formato hexadecimal').optional(),
  boolean: z.string().transform(val => val === 'true' || val === true).or(z.boolean()),
  array: (schema) => z.array(schema).optional().default([])
};

// Schemas específicos
export const userSchemas = {
  login: z.object({
    email: commonValidations.email,
    password: z.string().min(1, 'Senha é obrigatória')
  }),
  
  register: z.object({
    name: commonValidations.name,
    email: commonValidations.email,
    password: commonValidations.password
  }),
  
  adminCredentials: z.object({
    currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
    newPassword: commonValidations.password.optional(),
    newUsername: commonValidations.email.optional()
  }).refine(data => data.newPassword || data.newUsername, {
    message: 'Pelo menos um campo deve ser preenchido para atualização'
  }),
  
  updateUser: z.object({
    name: commonValidations.name.optional(),
    email: commonValidations.email.optional(),
    isAdmin: commonValidations.boolean.optional()
  })
};

export const productSchemas = {
  create: z.object({
    name: commonValidations.name,
    category: z.string().min(1, 'Categoria é obrigatória'),
    subCategory: z.string().min(1, 'Subcategoria é obrigatória'),
    popular: commonValidations.boolean.default(false)
  }),
  
  update: z.object({
    name: commonValidations.name.optional(),
    category: z.string().min(1, 'Categoria é obrigatória').optional(),
    subCategory: z.string().min(1, 'Subcategoria é obrigatória').optional(),
    popular: commonValidations.boolean.optional()
  })
};

export const vendorSchemas = {
  create: z.object({
    name: commonValidations.name,
    email: commonValidations.email,
    whatsapp: commonValidations.phone.optional().or(z.literal(''))
  }),
  
  update: z.object({
    name: commonValidations.name.optional(),
    email: commonValidations.email.optional(),
    whatsapp: commonValidations.phone.optional().or(z.literal(''))
  })
};

export const bannerSchemas = {
  update: z.object({
    // Para upload de imagem, validamos apenas se houver arquivo
  })
};

export const heroSchemas = {
  create: z.object({
    // Apenas arquivo de imagem
  }),
  
  updateTexts: z.object({
    badgeText: z.string().max(50).optional(),
    title: z.string().max(200).optional(),
    description: z.string().max(500).optional(),
    button1Text: z.string().max(30).optional(),
    button2Text: z.string().max(30).optional()
  })
};

export const cardSchemas = {
  createGroup: z.object({
    sectionTitle: z.string().min(1, 'Título da seção é obrigatório'),
    title1: z.string().min(1, 'Título do card 1 é obrigatório'),
    subtitle1: z.string().optional(),
    link1: commonValidations.url.optional().or(z.literal('')),
    title2: z.string().min(1, 'Título do card 2 é obrigatório'),
    subtitle2: z.string().optional(),
    link2: commonValidations.url.optional().or(z.literal('')),
    title3: z.string().min(1, 'Título do card 3 é obrigatório'),
    subtitle3: z.string().optional(),
    link3: commonValidations.url.optional().or(z.literal(''))
  }),
  
  updateTitle: z.object({
    title: z.string().min(1, 'Título é obrigatório')
  })
};

export const aboutSchemas = {
  createOrUpdate: z.object({
    title: z.string().min(1, 'Título é obrigatório'),
    content: z.string().min(1, 'Conteúdo é obrigatório'),
    imageAlt: z.string().optional(),
    button1Text: z.string().optional(),
    button1Link: commonValidations.url.optional().or(z.literal('')),
    button2Text: z.string().optional(),
    button2Link: commonValidations.url.optional().or(z.literal('')),
    stat1Number: z.string().optional(),
    stat1Label: z.string().optional(),
    stat2Number: z.string().optional(),
    stat2Label: z.string().optional(),
    stat3Number: z.string().optional(),
    stat3Label: z.string().optional()
  })
};

export const sectionSchemas = {
  create: z.object({
    title: z.string().min(1, 'Título é obrigatório'),
    content: z.string().min(1, 'Conteúdo é obrigatório'),
    buttonText: z.string().optional(),
    buttonLink: commonValidations.url.optional().or(z.literal('')),
    imagePosition: z.enum(['left', 'right']).default('left'),
    imageAlt: z.string().optional(),
    order: z.number().int().min(0).default(0)
  }),
  
  update: z.object({
    title: z.string().min(1, 'Título é obrigatório').optional(),
    content: z.string().min(1, 'Conteúdo é obrigatório').optional(),
    buttonText: z.string().optional(),
    buttonLink: commonValidations.url.optional().or(z.literal('')),
    imagePosition: z.enum(['left', 'right']).optional(),
    imageAlt: z.string().optional(),
    order: z.number().int().min(0).optional(),
    isActive: commonValidations.boolean.optional()
  }),
  
  reorder: z.object({
    sectionsOrder: z.array(commonValidations.id).min(1, 'Array de ordenação é obrigatório')
  })
};

