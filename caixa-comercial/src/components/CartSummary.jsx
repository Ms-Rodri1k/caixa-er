import { useState } from "react";

export function CartSummary({ total, onCheckout, isProcessing }) {
  const [formaPagamento, setFormaPagamento] = useState("dinheiro");

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        background: "#f9f9f9",
      }}
    >
      <h2>Resumo da Venda</h2>
      <h1 style={{ color: "#2e7d32", fontSize: "36px" }}>
        R$ {total.toFixed(2)}
      </h1>

      <div style={{ margin: "20px 0" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>
          Forma de Pagamento:
        </label>
        <select
          value={formaPagamento}
          onChange={(e) => setFormaPagamento(e.target.value)}
          style={{ width: "100%", padding: "10px", fontSize: "16px" }}
        >
          <option value="dinheiro">Dinheiro</option>
          <option value="pix">PIX</option>
          <option value="cartao_debito">Cartão de Débito</option>
          <option value="cartao_credito">Cartão de Crédito</option>
        </select>
      </div>

      <button
        onClick={() => onCheckout(formaPagamento)}
        disabled={total === 0 || isProcessing}
        style={{
          width: "100%",
          padding: "15px",
          background: total === 0 ? "#ccc" : "#2e7d32",
          color: "#fff",
          fontSize: "18px",
          border: "none",
          borderRadius: "5px",
          cursor: total === 0 ? "not-allowed" : "pointer",
        }}
      >
        {isProcessing ? "Finalizando..." : "Finalizar Venda"}
      </button>
    </div>
  );
}
