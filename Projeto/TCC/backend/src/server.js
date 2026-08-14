import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import dns from "node:dns";

// 📦 IMPORTS DAS ROTAS E BANCO
import Produtosroutes from "./routes/Productroutes.js";
import Userroutes from "./routes/Userroutes.js";
import Orderroutes from "./routes/Orderroutes.js"; // 👈 ADICIONE ESTA LINHA AQUI!
import connectDatabase from "./database/conecction.js";

// Configurações de DNS para o MongoDB Atlas
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com o Banco
connectDatabase();

console.log("ESTE É O SERVER.JS DA TECHSTORE");

// Rotas da API
app.use("/produto", Produtosroutes);
app.use("/usuario", Userroutes);
app.use("/pedido", Orderroutes); // Agora o Node.js vai reconhecer!

app.get("/", (req, res) => {
  res.json({ message: "API está funcionando!" });
});

// Inicialização do Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});