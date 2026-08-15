import User from "../models/User.js";

// 🟢 Registrar Usuário
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "E-mail já cadastrado." });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role: role || "cliente",
    });

    return res.status(201).json({ message: "Usuário cadastrado com sucesso!", user: newUser });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao cadastrar usuário." });
  }
};

// 🔵 Login de Usuário
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "E-mail ou senha inválidos." });
    }

    return res.status(200).json({ message: "Login realizado com sucesso!", user });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao realizar login." });
  }
};

// 🔵 Listar Todos os Usuários
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar usuários." });
  }
};

// 🟡 Atualizar Usuário
export const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    return res.status(200).json({ message: "Usuário atualizado com sucesso!", user: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao atualizar usuário." });
  }
};

// 🔴 Deletar Usuário
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    return res.status(200).json({ message: "Usuário removido com sucesso!" });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao remover usuário." });
  }
};