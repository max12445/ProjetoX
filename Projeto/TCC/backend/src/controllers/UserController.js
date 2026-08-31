import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// 🟢 Registrar Usuário
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Preencha todos os campos obrigatórios." });
    }

    const emailNormalized = email.trim().toLowerCase();

    if (!emailRegex.test(emailNormalized)) {
      return res.status(400).json({ message: "E-mail inválido." });
    }

    const userExists = await User.findOne({ email: emailNormalized });

    if (userExists) {
      return res.status(400).json({ message: "E-mail já cadastrado." });
    }

    // Criptografa a senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email: emailNormalized,
      password: hashedPassword,
      role: "cliente",
    });

    // Não retorna a senha para o frontend
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      user: userResponse,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao cadastrar usuário.",
    });
  }
};

// 🔵 Login de Usuário
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validar se email e senha foram fornecidos
    if (!email || !password) {
      return res.status(400).json({
        message: "Email e senha são obrigatórios.",
      });
    }

    const emailNormalized = email.trim().toLowerCase();

    // ✅ Validar formato básico de email
    if (!emailRegex.test(emailNormalized)) {
      return res.status(400).json({
        message: "Email inválido.",
      });
    }

    const user = await User.findOne({ email: emailNormalized }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "E-mail ou senha inválidos."
      });
    }

    // Cria o token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    // Define o token em um cookie httpOnly (protegido contra XSS)
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 2 * 60 * 60 * 1000, // 2 horas
    });

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
    console.error(error);
    return res.status(500).json({
      message: "Erro ao realizar login."
    });
  }
};

// 🔵 Listar Todos os Usuários
export const getUsers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find()
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(),
    ]);

    return res.status(200).json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar usuários." });
  }
};

// 🟡 Atualizar Usuário
export const updateUser = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    const currentUserId = req.user.id;
    const targetUserId = req.params.id;
    const isAdmin = req.user.role === "admin";

    // Apenas o próprio usuário ou um admin podem editar o perfil
    if (currentUserId !== targetUserId && !isAdmin) {
      return res.status(403).json({ message: "Permissão negada." });
    }

    // ✅ Validar que pelo menos um campo foi enviado
    if (!name && !email && !role && !password) {
      return res.status(400).json({
        message: "Nenhum dado para atualizar.",
      });
    }

    const updateData = {};

    // ✅ Apenas incluir campos que foram fornecidos
    if (name) updateData.name = name;

    if (email) {
      const emailNormalized = email.trim().toLowerCase();
      if (!emailRegex.test(emailNormalized)) {
        return res.status(400).json({ message: "E-mail inválido." });
      }
      updateData.email = emailNormalized;
    }

    // Apenas admin pode alterar o papel (role) de um usuário
    if (role) {
      if (!isAdmin) {
        return res.status(403).json({ message: "Somente administradores podem alterar permissões." });
      }
      updateData.role = role;
    }
    
    // Só altera a senha se uma nova senha for enviada
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "Usuário não encontrado.",
      });
    }

    return res.status(200).json({
      message: "Usuário atualizado com sucesso!",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao atualizar usuário.",
    });
  }
};

// 🚪 Logout - Limpa o cookie httpOnly
export const logoutUser = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({ message: "Logout realizado com sucesso!" });
};

// 🔴 Deletar Usuário
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "Usuário não encontrado.",
      });
    }

    return res.status(200).json({
      message: "Usuário removido com sucesso!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao remover usuário.",
    });
  }
};
