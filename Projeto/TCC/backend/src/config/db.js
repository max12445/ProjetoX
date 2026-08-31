import mongoose from "mongoose";

// Workaround de DNS específico para conexões ao MongoDB Atlas
// (necessário em algumas redes cujo resolvedor padrão não resolve +srv):
// só é aplicado como fallback quando a conexão inicial falha,
// evitando afetar redes corporativas por padrão.
const applyAtlasDnsWorkaround = async () => {
  const dns = await import("node:dns");
  dns.setDefaultResultOrder("ipv4first");
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
};

export const connectDatabase = async () => {
  const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoURI) {
    throw new Error("Nenhuma string de conexão encontrada no .env!");
  }

  const connect = () =>
    mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
    });

  try {
    await connect();
    console.log("✅ Conectado ao MongoDB Atlas com sucesso!");
  } catch (error) {
    // Se falhou por problema de resolução de DNS, tenta com o workaround do Atlas
    console.warn("⚠️  Primeira tentativa de conexão falhou, aplicando workaround de DNS...");
    try {
      await applyAtlasDnsWorkaround();
      await mongoose.disconnect().catch(() => {});
      await connect();
      console.log("✅ Conectado ao MongoDB Atlas com sucesso (workaround de DNS)!");
    } catch (retryError) {
      console.error("❌ Erro ao conectar ao MongoDB:", retryError.message);
      throw retryError;
    }
  }
};
