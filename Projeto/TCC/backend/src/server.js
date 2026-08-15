import express from "express";
import cors from "cors";

import { connectDatabase } from "./config/db.js";
import Produtosroutes from "./routes/Productroutes.js";
import Userroutes from "./routes/Userroutes.js";
import Orderroutes from "./routes/Orderroutes.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Conecta ao banco de dados
connectDatabase();

app.use("/produto", Produtosroutes);
app.use("/usuario", Userroutes);
app.use("/pedido", Orderroutes);

app.get("/", (req, res) => {
  res.json({ message: "API da TechStore está no ar!" });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});