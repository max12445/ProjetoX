import mongoose from "mongoose";
import dns from "node:dns";

export const connectDatabase = async () => {
  try {
    // Usando MONGO_URI (como está no seu .env)
    const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!mongoURI) {
      console.error("❌ Erro: Nenhuma string de conexão encontrada no .env!");
      process.exit(1);
    }

    dns.setDefaultResultOrder("ipv4first");
    dns.setServers(["8.8.8.8", "8.8.4.4"]);

    await mongoose.connect(mongoURI);
    console.log("✅ Conectado ao MongoDB Atlas com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao MongoDB:", error.message);
    process.exit(1);
  }
};