import User from "../models/User.js";
import bcrypt from "bcrypt";

// 🟢 Registrar Usuário
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Preencha todos os campos obrigatórios." });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "E-mail já cadastrado." });
    }

    // Criptografa a senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "cliente",
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

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "E-mail ou senha inválidos.",
      });
    }

    // Compara a senha digitada com a senha criptografada
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "E-mail ou senha inválidos.",
      });
    }

    // Não envia a senha para o frontend
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      message: "Login realizado com sucesso!",
      user: userResponse,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao realizar login.",
    });
  }
};

// 🔵 Listar Todos os Usuários
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar usuários.",
    });
  }
};

// 🟡 Atualizar Usuário
export const updateUser = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    const updateData = {
      name,
      email,
      role,
    };

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