import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/orderService";
import { getProductImages } from "../types/product";
import { PriceTag } from "../components/PriceTag";
import {
  BarcodeIcon,
  CartIcon,
  ChevronLeftIcon,
  CreditCardIcon,
  MapPinIcon,
  ZapIcon,
} from "../components/Icons";

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink outline-none transition-all placeholder:text-muted/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30";

export const Checkout: React.FC = () => {
  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cartao" | "pix" | "boleto">("cartao");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);

  const navigateTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (navigateTimeoutRef.current !== null) {
        window.clearTimeout(navigateTimeoutRef.current);
      }
    };
  }, []);

  if (items.length === 0) {
    return (
      <div className="px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <CartIcon className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold text-ink">Nada para finalizar</h1>
        <p className="mt-2 mb-8 text-sm text-muted">
          Seu carrinho está vazio. Adicione produtos antes de finalizar a
          compra.
        </p>
        <Link
          to="/"
          className="inline-block rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lift transition-colors hover:bg-brand-700"
        >
          Ver produtos
        </Link>
      </div>
    );
  }

  const shippingAddress = `${street}, ${number}${complement ? " - " + complement : ""} - ${city} - ${state}, CEP ${cep}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!street || !number || !city || !state || !cep) {
      setMessage({ text: "Preencha os campos de endereço obrigatórios.", type: "error" });
      return;
    }

    if (paymentMethod === "cartao" && (!cardNumber || !cardName || !cardExpiry || !cardCvv)) {
      setMessage({ text: "Preencha os dados do cartão.", type: "error" });
      return;
    }

    try {
      setLoading(true);

      await createOrder({
        items: items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        shippingAddress,
        paymentMethod,
      });

      clearCart();
      setMessage({ text: "Pedido confirmado! Vamos prepará-lo.", type: "success" });

      navigateTimeoutRef.current = window.setTimeout(() => {
        navigate(`/meus-pedidos`);
      }, 1500);
    } catch (error) {
      const errorMsg =
        error instanceof AxiosError ? error.response?.data?.message : undefined;
      setMessage({ text: errorMsg || "Não foi possível processar o pedido. Tente de novo.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { value: "cartao", label: "Cartão", icon: <CreditCardIcon className="h-4 w-4" /> },
    { value: "pix", label: "Pix", icon: <ZapIcon className="h-4 w-4" /> },
    { value: "boleto", label: "Boleto", icon: <BarcodeIcon className="h-4 w-4" /> },
  ] as const;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link
        to="/carrinho"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        Voltar ao carrinho
      </Link>

      <h1 className="mb-8 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        Finalizar compra
      </h1>

      {message && (
        <div
          className={`mb-6 rounded-xl border p-4 text-sm font-medium ${
            message.type === "success"
              ? "border-green-200 bg-success-soft text-green-700"
              : "border-red-200 bg-danger-soft text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Endereço */}
          <div className="rounded-2xl border border-line bg-white p-6 shadow-lift">
            <div className="mb-5 flex items-center gap-2">
              <MapPinIcon className="h-5 w-5 text-brand-600" />
              <h2 className="text-lg font-bold text-ink">Endereço de entrega</h2>
            </div>
            <p className="mb-5 text-xs text-muted">Para quem: {user?.name || "Você"}</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-ink">CEP *</label>
                <input
                  type="text"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  placeholder="00000-000"
                  className={inputClass}
                />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-sm font-semibold text-ink">Rua *</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Rua das Flores"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-ink">Número *</label>
                <input
                  type="text"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="123"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-ink">Complemento</label>
                <input
                  type="text"
                  value={complement}
                  onChange={(e) => setComplement(e.target.value)}
                  placeholder="Apto 12"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-ink">Cidade *</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="São Paulo"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-ink">Estado *</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="SP"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Pagamento */}
          <div className="rounded-2xl border border-line bg-white p-6 shadow-lift">
            <h2 className="mb-4 text-lg font-bold text-ink">Forma de pagamento</h2>

            <div className="mb-5 flex flex-wrap gap-2">
              {paymentMethods.map((method) => (
                <button
                  type="button"
                  key={method.value}
                  onClick={() => setPaymentMethod(method.value)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors border ${
                    paymentMethod === method.value
                      ? "border-brand-600 bg-brand-600 text-white shadow-lift"
                      : "border-line bg-surface text-muted hover:bg-brand-50 hover:text-brand-700"
                  }`}
                >
                  {method.icon}
                  {method.label}
                </button>
              ))}
            </div>

            {paymentMethod === "cartao" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-ink">Número do cartão</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    className={inputClass}
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-ink">Nome no cartão</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="MARIA SILVA"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-ink">Validade</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/AA"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-ink">CVV</label>
                  <input
                    type="text"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="123"
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            {paymentMethod === "pix" && (
              <p className="rounded-xl border border-green-200 bg-success-soft p-4 text-sm text-green-700">
                Após confirmar, será exibido um QR Code para pagamento.
                (Simulação)
              </p>
            )}

            {paymentMethod === "boleto" && (
              <p className="rounded-xl border border-brand-100 bg-brand-50 p-4 text-sm text-brand-700">
                O boleto será gerado após a confirmação e enviado por e-mail.
                (Simulação)
              </p>
            )}
          </div>
        </div>

        {/* Resumo */}
        <div className="h-fit rounded-2xl border border-line bg-white p-6 shadow-lift">
          <h2 className="mb-4 text-lg font-bold text-ink">Resumo do pedido</h2>

          <div className="mb-4 max-h-64 space-y-3 overflow-y-auto pr-1">
            {items.map((item) => {
              const images = getProductImages(item.product);
              return (
                <div key={item.product._id} className="flex items-center gap-3">
                  <img
                    src={images[0] ?? ""}
                    alt={item.product.title}
                    className="h-12 w-12 rounded-lg bg-surface object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">
                      {item.product.title}
                    </p>
                    <p className="text-xs text-muted">
                      {item.quantity}x <PriceTag value={item.product.price} size="sm" />
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-2 border-t border-line pt-4 text-sm text-muted">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <PriceTag value={totalPrice} size="sm" />
            </div>
            <div className="flex justify-between">
              <span>Frete</span>
              <span className="font-semibold text-green-700">Grátis</span>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-2">
              <span className="font-semibold text-ink">Total</span>
              <PriceTag value={totalPrice} size="lg" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-6 w-full rounded-xl bg-success py-3 text-sm font-semibold text-white shadow-lift transition-colors hover:bg-green-700 ${
              loading ? "cursor-not-allowed opacity-60" : ""
            }`}
          >
            {loading ? "Processando pagamento..." : "Finalizar pedido"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;