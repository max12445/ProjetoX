import dotenv from "dotenv";
// 1. O dotenv.config() DEVE ser a primeira linha executada no arquivo!
dotenv.config();

import express from "express";
import cors from "cors";
import dns from "node:dns";
import Produtosroutes from "./routes/Productroutes.js";
import connectDatabase from "./database/conecction.js";

// Configurações de rede/DNS para conexão com MongoDB Atlas
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors()); // Libera o acesso para o Frontend
app.use(express.json()); // Permite o servidor entender requisições em JSON

// Conecta ao banco de dados
connectDatabase();

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