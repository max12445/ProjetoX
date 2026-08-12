import dotenv from 'dotenv';
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // Garante a leitura da variável de ambiente
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("A variável MONGO_URI não foi encontrada no process.env.");
    }

    await mongoose.connect(mongoURI);
    console.log('✅ Conectado ao MongoDB com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;