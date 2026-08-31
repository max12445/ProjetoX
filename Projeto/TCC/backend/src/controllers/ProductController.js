import Product from "../models/Product.js";

// GET /produto - Busca produtos APROVADOS (e antigos sem status) para exibir na Home
export const getProducts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 12, 1), 100);
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find({
        $or: [
          { status: "aprovado" },
          { status: { $exists: false } } // Exibe produtos cadastrados antes do sistema de aprovação
        ]
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments({
        $or: [
          { status: "aprovado" },
          { status: { $exists: false } }
        ]
      }),
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
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar o produto." });
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
    const { title, category, price, image, description } = req.body;

    // Identidade vem do JWT (req.user), não do corpo da requisição
    const userRole = req.user.role;
    const userId = req.user.id;

    // Se quem cadastrou for admin, já publica direto. Se for comerciante, entra como pendente.
    const status = userRole === "admin" ? "aprovado" : "pendente";

    const newProduct = new Product({
      title,
      category,
      price,
      image,
      description,
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

// DELETE /produto/:id - Excluir produto
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    res.status(200).json({ message: "Produto excluído com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao excluir produto." });
  }
};
