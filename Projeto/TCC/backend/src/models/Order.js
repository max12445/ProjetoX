import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // Relacionamento com quem comprou (Usuário)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Aponta para a Model de Usuário
      required: true,
    },
    // Lista dos produtos comprados no pedido
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Aponta para a Model de Produto
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: Number,
          required: true, // Guarda o preço do produto no momento da compra
        },
      },
    ],
    // Valor total da compra
    totalPrice: {
      type: Number,
      required: true,
    },
    // Status do pedido para o cliente e gerente acompanharem
    status: {
      type: String,
      enum: ["Pendente", "Pago", "Enviado", "Entregue", "Cancelado"],
      default: "Pendente",
    },
    // Endereço de entrega simples
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
  },
  {
    timestamps: true, // Salva automaticamente a data em que o pedido foi feito
  }
);

export default mongoose.model("Order", orderSchema);