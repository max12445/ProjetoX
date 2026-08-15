import Order from "../models/Order.js";

// 🟢 Criar Pedido
export const createOrder = async (req, res) => {
  try {
    const { user, items, totalPrice, shippingAddress } = req.body;

    if (!user || !items || items.length === 0 || !totalPrice || !shippingAddress) {
      return res.status(400).json({ message: "Dados do pedido incompletos." });
    }

    const newOrder = await Order.create({ user, items, totalPrice, shippingAddress });
    return res.status(201).json({ message: "Pedido criado!", order: newOrder });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao criar pedido." });
  }
};

// 🔵 Listar Todos os Pedidos
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "title price image");
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar pedidos." });
  }
};

// 🔵 Listar Pedidos de um Usuário
export const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate("items.product", "title price image");
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar histórico." });
  }
};

// 🟡 Atualizar Status do Pedido
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedOrder) return res.status(404).json({ message: "Pedido não encontrado." });

    return res.status(200).json({ message: "Status do pedido atualizado!", order: updatedOrder });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao atualizar pedido." });
  }
};

// 🔴 Deletar Pedido
export const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ message: "Pedido não encontrado." });

    return res.status(200).json({ message: "Pedido cancelado/removido com sucesso!" });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao remover pedido." });
  }
};