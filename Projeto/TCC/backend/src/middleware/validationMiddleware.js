import Joi from "joi";

// ✅ Schemas de validação de entrada

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(6).max(72).required(),
}).unknown(false);

export const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().required(),
}).unknown(false);

export const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  email: Joi.string().trim().lowercase().email().optional(),
  role: Joi.string().valid("cliente", "comerciante", "admin").optional(),
  password: Joi.string().min(6).max(72).optional(),
  avatar: Joi.string().trim().allow("").max(500).optional(),
  currentPassword: Joi.string().min(6).max(72).optional(),
}).min(1).unknown(false);

export const createProductSchema = Joi.object({
  title: Joi.string().trim().min(3).max(120).required(),
  category: Joi.string().trim().lowercase().max(50).required(),
  price: Joi.number().positive().precision(2).required(),
  images: Joi.array().items(Joi.string().trim().uri()).min(1).max(10).required(),
  description: Joi.string().max(500).allow("").optional(),
  stock: Joi.number().integer().min(0).default(0).optional(),
}).unknown(false);

export const updateProductStatusSchema = Joi.object({
  status: Joi.string().valid("aprovado", "rejeitado").required(),
}).unknown(false);

export const updateProductSchema = Joi.object({
  title: Joi.string().trim().min(3).max(120).optional(),
  category: Joi.string().trim().lowercase().max(50).optional(),
  price: Joi.number().positive().precision(2).optional(),
  images: Joi.array().items(Joi.string().trim().uri()).min(1).max(10).optional(),
  description: Joi.string().max(500).allow("").optional(),
  stock: Joi.number().integer().min(0).optional(),
}).min(1).unknown(false);

export const updateProductStockSchema = Joi.object({
  stock: Joi.number().integer().min(0).required(),
}).unknown(false);

export const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().required(),
        quantity: Joi.number().integer().min(1).max(1000).required(),
      })
    )
    .min(1)
    .required(),
  shippingAddress: Joi.string().trim().min(5).max(500).required(),
  paymentMethod: Joi.string().valid("cartao", "pix", "boleto").optional(),
}).unknown(false);

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid("pendente", "processando", "enviado", "entregue", "cancelado")
    .required(),
}).unknown(false);

export const createSupportMessageSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().lowercase().email().required(),
  subject: Joi.string().trim().min(3).max(120).required(),
  message: Joi.string().trim().min(10).max(1000).required(),
}).unknown(false);

export const updateSupportStatusSchema = Joi.object({
  status: Joi.string().valid("aberto", "respondido", "resolvido").required(),
}).unknown(false);

// ✅ Middleware que valida o corpo da requisição contra um schema
export const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const messages = error.details.map((detail) => detail.message);
    return res.status(400).json({ message: messages.join(" ") });
  }

  req.body = value;
  next();
};
