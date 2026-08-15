import Product from "../models/Product.js";

// GET /produto - Apenas produtos APROVADOS na Home
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "aprovado" }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar produtos", error: error.message });
  }
};

// GET /produto/pendentes - Apenas para o ADMIN visualizar aprovações
export const getPendingProducts = async (req, res) => {
  try {
    const pendingProducts = await Product.find({ status: "pendente" })
      .populate("comercianteId", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(pendingProducts);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar produtos pendentes", error: error.message });
  }
};

// POST /produto - Cadastrar novo produto
export const createProduct = async (req, res) => {
  try {
    const { title, category, price, image, description, userRole, userId } = req.body;

    const status = userRole === "admin" ? "aprovado" : "pendente";

    const newProduct = new Product({
      title,
      category,
      price,
      image,
      description,
      status,
      comercianteId: userId || null,
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
    res.status(500).json({ message: "Erro interno ao cadastrar produto.", error: error.message });
  }
};

// PATCH /produto/:id/status - Aprovar ou Rejeitar produto
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
    res.status(500).json({ message: "Erro ao atualizar status do produto", error: error.message });
  }
};

// DELETE /produto/:id - Excluir produto
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Produto excluído com sucesso." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir produto", error: error.message });
  }
};