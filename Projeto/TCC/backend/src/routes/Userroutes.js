import express from "express";
import User from "../models/User.js";

const router = express.Router();

// 🟢 ROTA DE CADASTRO (POST /usuario/registro)
router.post("/registro", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Validar campos
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
    }

    // 2. Verificar se o e-mail já existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "E-mail já cadastrado." });
    }

    // 3. Criar usuário (por padrão, role será 'cliente' se não enviado)
    const newUser = await User.create({
      name,
      email,
      password, // Nota: Em produção para o TCC, recomenda-se usar 'bcrypt' para criptografar a senha!
      role: role || "cliente",
    });

    return res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Erro no cadastro:", error);
    return res.status(500).json({ message: "Erro ao cadastrar usuário." });
  }
});

// 🔵 ROTA DE LOGIN (POST /usuario/login)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "E-mail ou senha inválidos." });
    }

    return res.status(200).json({
      message: "Login realizado com sucesso!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao realizar login." });
  }
});

export default router;