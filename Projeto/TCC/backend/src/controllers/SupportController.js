import SupportMessage from "../models/SupportMessage.js";

// 💬 Enviar mensagem de suporte (público; vincula ao usuário se autenticado)
export const createSupportMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const newMessage = await SupportMessage.create({
      name,
      email,
      subject,
      message,
      user: req.user?.id || null,
    });

    return res.status(201).json({
      message: "Mensagem enviada com sucesso! Entraremos em contato em breve.",
      supportMessage: newMessage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao enviar mensagem." });
  }
};

// 📋 Listar mensagens recebidas (apenas admin)
export const getSupportMessages = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      SupportMessage.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      SupportMessage.countDocuments(),
    ]);

    return res.status(200).json({
      messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar mensagens." });
  }
};

// 🔵 Atualizar status de uma mensagem (apenas admin)
export const updateSupportMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await SupportMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Mensagem não encontrada." });
    }

    return res.status(200).json({ message: "Status atualizado!", supportMessage: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao atualizar mensagem." });
  }
};