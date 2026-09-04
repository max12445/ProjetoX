import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

// 🟢 Criar Pedido
export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { items, shippingAddress, paymentMethod } = req.body;

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

      // Produtos sem estoque definido são tratados como esgotados
      // (consistente com o default 0 do schema), evitando vendas sem controle.
      const availableStock = product.stock ?? 0;
      if (availableStock < quantity) {
        return res.status(400).json({
          message: `Estoque insuficiente para "${product.title}". Disponível: ${availableStock}.`,
        });
      }

      const unitPrice = product.price;
      totalPrice += unitPrice * quantity;

      validatedItems.push({
        product: product._id,
        quantity,
        price: unitPrice,
      });
    }

    // Transação: baixa o estoque E cria o pedido de forma atômica (evita race conditions)
    session.startTransaction();

    for (const { product, quantity } of validatedItems) {
      const updated = await Product.findOneAndUpdate(
        { _id: product, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { session }
      );

      if (!updated) {
        await session.abortTransaction();
        return res.status(400).json({
          message: "Estoque insuficiente. Verifique a disponibilidade dos produtos.",
        });
      }
    }

    // O usuário do pedido vem do token JWT, nunca do corpo da requisição
    const [newOrder] = await Order.create(
      [
        {
          user: req.user.id,
          items: validatedItems,
          totalPrice,
          shippingAddress,
          paymentMethod: paymentMethod || "cartao",
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return res.status(201).json({ message: "Pedido criado!", order: newOrder });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    console.error(error);
    return res.status(500).json({ message: "Erro ao criar pedido." });
  } finally {
    session.endSession();
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
        .populate("items.product", "title price images")
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
        .populate("items.product", "title price images")
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

// 🟠 Listar Pedidos do Comerciante (pedidos que contêm seus produtos)
export const getMerchantOrders = async (req, res) => {
  try {
    const merchantId = req.user.id;

    // Busca todos os IDs de produtos do comerciante
    const merchantProductIds = await Product.find({ comercianteId: merchantId }).distinct("_id");

    if (merchantProductIds.length === 0) {
      return res.status(200).json({
        orders: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      });
    }

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const filter = { "items.product": { $in: merchantProductIds } };

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("user", "name email")
        .populate("items.product", "title price images comercianteId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter),
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
    return res.status(500).json({ message: "Erro ao buscar pedidos da loja." });
  }
};

// 📊 Dashboard do Comerciante (visão geral de vendas da loja)
export const getMerchantDashboard = async (req, res) => {
  try {
    const merchantId = req.user.id;

    const merchantProductIds = await Product.find({ comercianteId: merchantId }).distinct("_id");

    const emptyDashboard = {
      totalVendas: 0,
      receitaTotal: 0,
      ticketMedio: 0,
      itensVendidos: 0,
      pedidosPorStatus: [],
      vendasPorDia: [],
      topProdutos: [],
    };

    if (merchantProductIds.length === 0) {
      return res.status(200).json(emptyDashboard);
    }

    // Agregação: filtra pedidos que contêm produtos da loja, quebra os itens em
    // linhas e agrupa por pedido (soma receita e quantidade apenas dos itens da loja)
    const rows = await Order.aggregate([
      { $match: { "items.product": { $in: merchantProductIds } } },
      { $unwind: "$items" },
      { $match: { "items.product": { $in: merchantProductIds } } },
      {
        $addFields: {
          lineRevenue: { $multiply: ["$items.price", "$items.quantity"] },
        },
      },
      {
        $group: {
          _id: "$_id",
          status: { $first: "$status" },
          createdAt: { $first: "$createdAt" },
          revenue: { $sum: "$lineRevenue" },
          qty: { $sum: "$items.quantity" },
          sells: { $push: { product: "$items.product", qty: "$items.quantity" } },
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 2000 },
    ]);

    // Pedidos que contam como venda (não cancelados)
    const activeRows = rows.filter((r) => r.status !== "cancelado");

    const totalVendas = activeRows.length;
    const receitaTotal = activeRows.reduce((sum, r) => sum + (r.revenue || 0), 0);
    const itensVendidos = activeRows.reduce((sum, r) => sum + (r.qty || 0), 0);
    const ticketMedio = totalVendas > 0 ? receitaTotal / totalVendas : 0;

    // Contagem de pedidos por status (inclui cancelados na distribuição)
    const statusCount = new Map();
    for (const r of rows) {
      statusCount.set(r.status, (statusCount.get(r.status) || 0) + 1);
    }
    const pedidosPorStatus = Array.from(statusCount.entries()).map(([status, count]) => ({
      status,
      count,
    }));

    // Vendas dos últimos 7 dias (buckets zerados para dias sem venda)
    const dayMap = new Map();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const isoDay = d.toISOString().split("T")[0];
      dayMap.set(isoDay, { date: isoDay, count: 0, revenue: 0 });
    }
    for (const r of activeRows) {
      if (!r.createdAt) continue;
      const isoDay = new Date(r.createdAt).toISOString().split("T")[0];
      const bucket = dayMap.get(isoDay);
      if (bucket) {
        bucket.count += 1;
        bucket.revenue += r.revenue || 0;
      }
    }
    const vendasPorDia = Array.from(dayMap.values());

    // Top 5 produtos mais vendidos da loja
    const qtyByProduct = new Map();
    for (const r of activeRows) {
      for (const s of r.sells || []) {
        const key = s.product.toString();
        qtyByProduct.set(key, (qtyByProduct.get(key) || 0) + s.qty);
      }
    }
    const topIds = Array.from(qtyByProduct.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id]) => id);
    const products = await Product.find({ _id: { $in: topIds } }).select("title");
    const titleMap = new Map(products.map((p) => [p._id.toString(), p.title]));
    const topProdutos = topIds.map((id) => ({
      productId: id,
      title: titleMap.get(id) || "Produto",
      qty: qtyByProduct.get(id),
    }));

    return res.status(200).json({
      totalVendas,
      receitaTotal,
      ticketMedio,
      itensVendidos,
      pedidosPorStatus,
      vendasPorDia,
      topProdutos,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar dados do dashboard." });
  }
};

// 📊 Dashboard Global do Administrador (resumo de todo o site)
export const getAdminDashboard = async (req, res) => {
  try {
    const rows = await Order.aggregate([
      { $unwind: "$items" },
      {
        $addFields: {
          lineRevenue: { $multiply: ["$items.price", "$items.quantity"] },
        },
      },
      {
        $group: {
          _id: "$_id",
          status: { $first: "$status" },
          createdAt: { $first: "$createdAt" },
          revenue: { $sum: "$lineRevenue" },
          qty: { $sum: "$items.quantity" },
          sells: { $push: { product: "$items.product", qty: "$items.quantity" } },
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 5000 },
    ]);

    const activeRows = rows.filter((r) => r.status !== "cancelado");

    const totalVendas = activeRows.length;
    const receitaTotal = activeRows.reduce((sum, r) => sum + (r.revenue || 0), 0);
    const itensVendidos = activeRows.reduce((sum, r) => sum + (r.qty || 0), 0);
    const ticketMedio = totalVendas > 0 ? receitaTotal / totalVendas : 0;

    const statusCount = new Map();
    for (const r of rows) {
      statusCount.set(r.status, (statusCount.get(r.status) || 0) + 1);
    }
    const pedidosPorStatus = Array.from(statusCount.entries()).map(([status, count]) => ({
      status,
      count,
    }));

    const dayMap = new Map();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const isoDay = d.toISOString().split("T")[0];
      dayMap.set(isoDay, { date: isoDay, count: 0, revenue: 0 });
    }
    for (const r of activeRows) {
      if (!r.createdAt) continue;
      const isoDay = new Date(r.createdAt).toISOString().split("T")[0];
      const bucket = dayMap.get(isoDay);
      if (bucket) {
        bucket.count += 1;
        bucket.revenue += r.revenue || 0;
      }
    }
    const vendasPorDia = Array.from(dayMap.values());

    const qtyByProduct = new Map();
    for (const r of activeRows) {
      for (const s of r.sells || []) {
        const key = s.product.toString();
        qtyByProduct.set(key, (qtyByProduct.get(key) || 0) + s.qty);
      }
    }
    const topIds = Array.from(qtyByProduct.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id]) => id);
    const products = await Product.find({ _id: { $in: topIds } }).select("title");
    const titleMap = new Map(products.map((p) => [p._id.toString(), p.title]));
    const topProdutos = topIds.map((id) => ({
      productId: id,
      title: titleMap.get(id) || "Produto",
      qty: qtyByProduct.get(id),
    }));

    const [totalUsuarios, totalProdutos, totalLojas] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments({ status: "aprovado" }),
      Product.distinct("comercianteId", { status: "aprovado" }).then(
        (ids) => ids.filter(Boolean).length
      ),
    ]);

    return res.status(200).json({
      totalVendas,
      receitaTotal,
      ticketMedio,
      itensVendidos,
      pedidosPorStatus,
      vendasPorDia,
      topProdutos,
      totalUsuarios,
      totalProdutos,
      totalLojas,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar dados do painel." });
  }
};

// ⛽ Helpers de estoque (usados em transações para atomicidade)
const restoreStock = async (session, items) => {
  for (const item of items) {
    await Product.updateOne(
      { _id: item.product },
      { $inc: { stock: item.quantity } },
      { session }
    );
  }
};

const decrementStock = async (session, items) => {
  for (const item of items) {
    const updated = await Product.findOneAndUpdate(
      { _id: item.product, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } },
      { session }
    );
    if (!updated) return false;
  }
  return true;
};

// 🟡 Atualizar Status do Pedido
export const updateOrderStatus = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id).session(session);

    if (!order) {
      return res.status(404).json({ message: "Pedido não encontrado." });
    }

    // Só mexe no estoque quando o status realmente muda
    if (order.status !== status) {
      session.startTransaction();

      if (status === "cancelado") {
        // Cancelando: devolve o estoque dos produtos
        await restoreStock(session, order.items);
      } else if (order.status === "cancelado") {
        // Reativando um pedido cancelado: baixa o estoque de novo com guarda
        const ok = await decrementStock(session, order.items);
        if (!ok) {
          await session.abortTransaction();
          return res.status(400).json({
            message: "Estoque insuficiente para reativar o pedido.",
          });
        }
      }

      order.status = status;
      await order.save({ session });

      await session.commitTransaction();
    }

    return res.status(200).json({ message: "Status do pedido atualizado!", order });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    console.error(error);
    return res.status(500).json({ message: "Erro ao atualizar pedido." });
  } finally {
    session.endSession();
  }
};

// 🔴 Deletar Pedido
export const deleteOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const order = await Order.findById(req.params.id).session(session);

    if (!order) {
      return res.status(404).json({ message: "Pedido não encontrado." });
    }

    session.startTransaction();

    // Devolve o estoque apenas se o pedido ainda não estava cancelado
    // (pedidos já cancelados já devolveram; evita dupla compensação)
    if (order.status !== "cancelado") {
      await restoreStock(session, order.items);
    }

    await order.deleteOne({ session });

    await session.commitTransaction();

    return res.status(200).json({ message: "Pedido removido com sucesso!" });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    console.error(error);
    return res.status(500).json({ message: "Erro ao remover pedido." });
  } finally {
    session.endSession();
  }
};