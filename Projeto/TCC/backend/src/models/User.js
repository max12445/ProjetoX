import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "O nome é obrigatório."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "O e-mail é obrigatório."],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "A senha é obrigatória."],
      minlength: [6, "A senha deve ter pelo menos 6 caracteres."],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ["cliente", "comerciante", "admin"],
        message: "{VALUE} não é uma permissão válida.",
      },
      default: "cliente",
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);