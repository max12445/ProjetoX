import Order from "../models/Order.js";
import Product from "../models/Product.js";

// 🟢 Criar Pedido
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0 || !shippingAddress) {
      return res.status(400).json({ message: "Dados do pedido incompletos." });
    }

    if (!Array.isArray(items)) {
      return res.status(400).json({ message: "Itens do pedido inválidos." });
    }

    // Busca os preços reais dos produtos no banco e recalcula o total server-side
    const productIds = items.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds }, status: "aprovado" });

    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    const validatedItems = [];
    let totalPrice = 0;

    for (const item of items) {
      const product = productMap.get(item.product?.toString());

      if (!product) {
        return res
          .status(400)
          .json({ message: "Um dos produtos do pedido é inválido ou não está disponível." });
      }

      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 1000) {
        return res.status(400).json({ message: "Quantidade de produto inválida." });
      }

      const unitPrice = product.price;
      totalPrice += unitPrice * quantity;

      validatedItems.push({
        product: product._id,
        quantity,
        price: unitPrice,
      });
    }

    // O usuário do pedido vem do token JWT, nunca do corpo da requisição
    const newOrder = await Order.create({
      user: req.user.id,
      items: validatedItems,
      totalPrice,
      shippingAddress,
    });

    return res.status(201).json({ message: "Pedido criado!", order: newOrder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao criar pedido." });
  }
};

// 🔵 Listar Todos os Pedidos
export const getOrders = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find()
        .populate("user", "name email")
        .populate("items.product", "title price image")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(),
    ]);

    return res.status(200).json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar pedidos." });
  }
};

// 🔵 Listar Pedidos de um Usuário
export const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Apenas o próprio usuário ou um admin podem ver o histórico
    if (req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Permissão negada." });
    }

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ user: userId })
        .populate("items.product", "title price image")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments({ user: userId }),
    ]);

    return res.status(200).json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
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