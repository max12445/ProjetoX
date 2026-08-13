import express from "express";
import Product from "../models/Product.js"; // Importa o Model

const router = express.Router();

// 🟢 ROTA 1: CADASTRAR UM NOVO PRODUTO (POST /produto)
router.post("/", async (req, res) => {
  try {
    const { title, category, price, image, description } = req.body;

    // Validação básica dos campos obrigatórios
    if (!title || !category || !price || !image) {
      return res.status(400).json({ 
        message: "Por favor, preencha todos os campos obrigatórios (title, category, price, image)." 
      });
    }

    // Cria o novo produto no banco de dados
    const newProduct = await Product.create({
      title,
      category,
      price,
      image,
      description,
    });

    // Retorna o produto criado com status 201 (Created)
    return res.status(201).json({
      message: "Produto cadastrado com sucesso!",
      product: newProduct,
    });

  } catch (error) {
    console.error("Erro ao cadastrar produto:", error);
    return res.status(500).json({ 
      message: "Erro interno no servidor ao cadastrar produto.",
      error: error.message 
    });
  }
});

// 🔵 ROTA 2: LISTAR TODOS OS PRODUTOS (GET /produto)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find(); // Busca todos os registros
    return res.status(200).json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return res.status(500).json({ message: "Erro ao buscar produtos." });
  }
});

export default router;