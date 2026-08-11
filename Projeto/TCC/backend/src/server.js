import dotenv from "dotenv";
// 1. O dotenv.config() DEVE ser a primeira linha executada no arquivo!
dotenv.config();

import express from "express";
import dns from "node:dns";
import Produtosroutes from "./routes/Productroutes.js"; // Caminho corrigido
import connectDatabase from "./database/conecction.js";

// Configurações de rede/DNS para conexão com MongoDB Atlas
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
const PORT = process.env.PORT || 3001;

// 2. Conecta ao banco (apenas UMA vez)
connectDatabase();

// Middlewares
app.use(express.json());

console.log("ESTE É O SERVER.JS DA TECHSTORE");

// Rotas
app.use("/produto", Produtosroutes);
console.log("Rotas de produtos carregadas");

app.get("/", (req, res) => {
  res.json({ message: "API está funcionando!" });
});

app.get("/teste", (req, res) => {
  res.send("Servidor de teste funcionando!");
});

// Inicialização do Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});