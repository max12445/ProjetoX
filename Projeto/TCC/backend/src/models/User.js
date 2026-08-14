import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "O nome é obrigatório"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "O e-mail é obrigatório"],
      unique: true, // Não permite dois usuários com o mesmo e-mail
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "A senha é obrigatória"],
    },
    role: {
      type: String,
      enum: ["cliente", "fornecedor", "gerente"],
      default: "cliente", // Se não informar, assume que é cliente
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);