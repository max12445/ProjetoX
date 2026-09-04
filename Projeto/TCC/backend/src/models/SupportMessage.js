import mongoose from "mongoose";

const supportMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "O nome é obrigatório."],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "O e-mail é obrigatório."],
      trim: true,
      lowercase: true,
    },
    subject: {
      type: String,
      required: [true, "O assunto é obrigatório."],
      trim: true,
      maxlength: 120,
    },
    message: {
      type: String,
      required: [true, "A mensagem é obrigatória."],
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ["aberto", "respondido", "resolvido"],
      default: "aberto",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("SupportMessage", supportMessageSchema);