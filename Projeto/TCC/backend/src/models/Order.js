import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    shippingAddress: {
      type: String,
      required: true,
      trim: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cartao", "pix", "boleto"],
      default: "cartao",
    },

    status: {
      type: String,
      enum: [
        "pendente",
        "processando",
        "enviado",
        "entregue",
        "cancelado",
      ],
      default: "pendente",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);