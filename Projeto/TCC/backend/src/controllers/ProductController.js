import Product from "../models/Product.js";
import User from "../models/User.js";

// Filtro padrão de produtos visíveis na loja (aprovados e antigos sem status)
const approvedFilter = (excludeId) => ({
  ...(excludeId ? { _id: { $ne: excludeId } } : {}),
  $or: [
    { status: "aprovado" },
    { status: { $exists: false } }, // Exibe produtos cadastrados antes do sistema de aprovação
  ],
});

// GET /produto - Busca produtos APROVADOS (e antigos sem status) para exibir na Home
export const getProducts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 12, 1), 100);
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(approvedFilter())
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(approvedFilter()),
    ]);

    res.status(200).json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar produtos." });
  }
};

// GET /produto/:id - Buscar um produto específico pelo ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({
      _id: id,
      ...approvedFilter(),
    });

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar o produto." });
  }
};

// GET /produto/:id/recomendados - Produtos similares (4 itens)
// Prioridade: mesma categoria E mesma loja → mesma categoria → mesma loja → outros
export const getRecommendedProducts = async (req, res) => {
  try {
    const { id } = req.params;

    const current = await Product.findById(id).select("category comercianteId");
    if (!current) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    const excludeCurrent = approvedFilter(id);
    const hasStore = Boolean(current.comercianteId);

    const [sameCategoryAndStore, sameCategoryOther, sameStoreOther, fill] =
      await Promise.all([
        hasStore
          ? Product.find({
              ...excludeCurrent,
              category: current.category,
              comercianteId: current.comercianteId,
            })
              .sort({ createdAt: -1 })
              .limit(4)
          : [],
        Product.find({
          ...excludeCurrent,
          category: current.category,
          ...(hasStore ? { comercianteId: { $ne: current.comercianteId } } : {}),
        })
          .sort({ createdAt: -1 })
          .limit(4),
        hasStore
          ? Product.find({
              ...excludeCurrent,
              comercianteId: current.comercianteId,
              category: { $ne: current.category },
            })
              .sort({ createdAt: -1 })
              .limit(4)
          : [],
        Product.find({
          ...excludeCurrent,
          ...(hasStore ? { comercianteId: { $ne: current.comercianteId } } : {}),
          category: { $ne: current.category },
        })
          .sort({ createdAt: -1 })
          .limit(4),
      ]);

    const products = [
      ...sameCategoryAndStore,
      ...sameCategoryOther,
      ...sameStoreOther,
      ...fill,
    ].slice(0, 4);

    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar produtos recomendados." });
  }
};

// GET /produto/:id/loja - Perfil da loja e demais produtos do mesmo comerciante
export const getProductStore = async (req, res) => {
  try {
    const { id } = req.params;
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 12, 1), 50);

    const product = await Product.findById(id).select("comercianteId");
    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    // Produtos antigos podem não pertencer a nenhuma loja
    if (!product.comercianteId) {
      return res.status(200).json({ store: null, products: [] });
    }

    const store = await User.findById(product.comercianteId).select("name email");
    if (!store) {
      return res.status(200).json({ store: null, products: [] });
    }

    const products = await Product.find({
      comercianteId: product.comercianteId,
      _id: { $ne: id },
      $or: [
        { status: "aprovado" },
        { status: { $exists: false } },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      store: { _id: store._id, name: store.name, email: store.email },
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar produtos da loja." });
  }
};

// GET /produto/meus-produtos - Produtos do comerciante autenticado
export const getMyProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 50, 1), 100);
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find({ comercianteId: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments({ comercianteId: userId }),
    ]);

    res.status(200).json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar seus produtos." });
  }
};

// GET /produto/pendentes - Apenas para o ADMIN visualizar pendentes de aprovação
export const getPendingProducts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const [pendingProducts, total] = await Promise.all([
      Product.find({ status: "pendente" })
        .populate("comercianteId", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments({ status: "pendente" }),
    ]);

    res.status(200).json({
      products: pendingProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar produtos pendentes." });
  }
};

// POST /produto - Cadastrar novo produto
export const createProduct = async (req, res) => {
  try {
    const { title, category, price, images, description, stock } = req.body;

    // Identidade vem do JWT (req.user), não do corpo da requisição
    const userRole = req.user.role;
    const userId = req.user.id;

    // Se quem cadastrou for admin, já publica direto. Se for comerciante, entra como pendente.
    const status = userRole === "admin" ? "aprovado" : "pendente";

    const newProduct = new Product({
      title,
      category,
      price,
      images,
      description,
      stock: stock || 0,
      status,
      comercianteId: userId,
    });

    await newProduct.save();

    res.status(201).json({
      message:
        status === "aprovado"
          ? "Produto publicado com sucesso!"
          : "Produto enviado para aprovação do Administrador.",
      product: newProduct,
    });
  } catch (error) {
    // Trata erros de validação do Mongoose
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(" ") });
    }
    console.error(error);
    res.status(500).json({ message: "Erro ao cadastrar produto." });
  }
};

// PATCH /produto/:id/status - Aprovar ou Rejeitar produto (Painel Admin)
export const updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const statusFormatted = status?.trim()?.toLowerCase();

    if (!["aprovado", "rejeitado"].includes(statusFormatted)) {
      return res.status(400).json({ message: "Status inválido. Use 'aprovado' ou 'rejeitado'." });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { status: statusFormatted },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    res.status(200).json({ message: `Produto ${statusFormatted} com sucesso!`, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar status do produto." });
  }
};

// PATCH /produto/:id/estoque - Atualizar quantidade em estoque (dono da loja ou admin)
export const updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    const isOwner =
      product.comercianteId && product.comercianteId.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "Você não possui permissão para editar este produto.",
      });
    }

    product.stock = stock;
    await product.save();

    res.status(200).json({ message: "Estoque atualizado com sucesso!", product });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(" ") });
    }
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar estoque." });
  }
};

// DELETE /produto/:id - Excluir produto (dono da loja ou admin)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    const isOwner =
      product.comercianteId && product.comercianteId.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "Você não possui permissão para excluir este produto.",
      });
    }

    await product.deleteOne();

    res.status(200).json({ message: "Produto excluído com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao excluir produto." });
  }
};