import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "O título do produto é obrigatório"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "A categoria é obrigatória"],
    },
    price: {
      type: Number,
      required: [true, "O preço é obrigatório"],
    },
    image: {
      type: String,
      required: [true, "A URL da imagem é obrigatória"],
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // Cria automaticamente as colunas createdAt e updatedAt
  }
);

export default mongoose.model("Product", productSchema);