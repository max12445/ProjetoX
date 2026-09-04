import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

import { connectDatabase } from "./config/db.js";
import ProdutosRoutes from "./routes/ProductRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";
import OrderRoutes from "./routes/OrderRoutes.js";
import SupportRoutes from "./routes/SupportRoutes.js";

// ✅ Valida variáveis de ambiente críticas antes de iniciar
const requiredEnv = ["MONGO_URI", "JWT_SECRET"];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  console.error(
    `❌ Erro: Variáveis de ambiente ausentes: ${missingEnv.join(", ")}. Configure o arquivo .env.`
  );
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3001;

// Security headers (helmet)
app.use(helmet());

// Logging de requisições
app.use(morgan("dev"));

// Lista de origens permitidas (frontends autorizados)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origem não permitida pelo CORS."));
    },
    credentials: true,
  })
);

// Limita o tamanho do corpo das requisições para evitar DoS
app.use(express.json({ limit: "1mb" }));

// Parse de cookies (para o token httpOnly)
app.use(cookieParser());

// Limita o número de tentativas de login/registro para evitar brute-force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20,
  message: { message: "Muitas tentativas. Tente novamente mais tarde." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Aplica o rate limit apenas nas rotas de autenticação
app.use("/usuario/login", authLimiter);
app.use("/usuario/register", authLimiter);

app.use("/produto", ProdutosRoutes);
app.use("/usuario", UserRoutes);
app.use("/pedido", OrderRoutes);
app.use("/suporte", SupportRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API da Maxibuy está no ar!" });
});

// ✅ Tratamento de rota não encontrada (404)
app.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada." });
});

// ✅ Middleware de erro global
app.use((err, req, res, next) => {
  console.error("Erro:", err.message);

  const statusCode = err.statusCode || 500;

  // Mensagens genéricas em produção para não vazar detalhes internos
  const message =
    process.env.NODE_ENV === "production"
      ? "Erro interno do servidor."
      : err.message || "Erro interno do servidor.";

  res.status(statusCode).json({ message });
});

// Conecta ao banco de dados e SÓ então inicia o servidor
connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(() => {
    process.exit(1);
  });
