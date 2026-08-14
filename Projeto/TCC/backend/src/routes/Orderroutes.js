import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// 🟢 ROTA 1: CRIAR UM NOVO PEDIDO (POST /pedido)
// O cliente finaliza a compra no carrinho do frontend e chama essa rota
router.post("/", async (req, res) => {
  try {
    const { user, items, totalPrice, shippingAddress } = req.body;

    // Validação dos dados do pedido
    if (!user || !items || items.length === 0 || !totalPrice || !shippingAddress) {
      return res.status(400).json({ 
        message: "Dados incompletos para registrar o pedido." 
      });
    }

    // Registra o pedido no MongoDB
    const newOrder = await Order.create({
      user,
      items,
      totalPrice,
      shippingAddress,
    });

    return res.status(201).json({
      message: "Pedido realizado com sucesso!",
      order: newOrder,
    });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return res.status(500).json({ 
      message: "Erro ao processar o pedido.",
      error: error.message 
    });
  }
});

// 🔵 ROTA 2: LISTAR TODOS OS PEDIDOS (GET /pedido)
// Útil para o GERENTE ver todas as vendas da loja
router.get("/", async (req, res) => {
  try {
    // .populate() serve para trazer o nome e e-mail do usuário e o nome dos produtos em vez de só o ID
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "title price image");

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return res.status(500).json({ message: "Erro ao buscar pedidos." });
  }
});

// 🟣 ROTA 3: BUSCAR PEDIDOS DE UM USUÁRIO ESPECÍFICO (GET /pedido/usuario/:userId)
// Útil para o CLIENTE ver o histórico de compras na conta dele
router.get("/usuario/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userOrders = await Order.find({ user: userId })
      .populate("items.product", "title price image");

    return res.status(200).json(userOrders);
  } catch (error) {
    console.error("Erro ao buscar pedidos do usuário:", error);
    return res.status(500).json({ message: "Erro ao buscar histórico do usuário." });
  }
});

// 🟡 ROTA 4: ATUALIZAR STATUS DO PEDIDO (PATCH /pedido/:id/status)
// O GERENTE pode mudar o status (ex: de "Pendente" para "Enviado")
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    return res.status(200).json({
      message: "Status do pedido atualizado com sucesso!",
      order: updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao atualizar status do pedido." });
  }
});

export default router;