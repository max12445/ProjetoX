import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "O título do produto é obrigatório."],
      trim: true,
      minlength: [3, "O título deve ter pelo menos 3 caracteres."],
      maxlength: [120, "O título não pode exceder 120 caracteres."],
    },
    category: {
      type: String,
      required: [true, "A categoria é obrigatória."],
      trim: true,
      lowercase: true,
      maxlength: [50, "A categoria não pode exceder 50 caracteres."],
    },
    price: {
      type: Number,
      required: [true, "O preço é obrigatório."],
      min: [0.01, "O preço deve ser maior que zero."],
    },
    image: {
      type: String,
      required: [true, "A URL da imagem é obrigatória."],
      trim: true,
      validate: {
        validator: function (v) {
          return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
        },
        message: "Por favor, informe uma URL de imagem válida.",
      },
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "A descrição não pode exceder 500 caracteres."],
      default: "",
    },
    status: {
      type: String,
      enum: {
        values: ["aprovado", "pendente", "rejeitado"],
        message: "{VALUE} não é um status válido.",
      },
      default: "pendente",
      trim: true,
      lowercase: true,
    },
    comercianteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);