import { useState } from "react";

export  function BarcodeScanner({ onAddProduct }) {
  const [codigo, setCodigo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!codigo.trim()) return;
    onAddProduct(codigo);
    setCodigo(""); 
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Bipe ou digite o código de barras..."
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        autoFocus
        style={{ padding: "12px", width: "300px", fontSize: "16px" }}
      />
      <button
        type="submit"
        style={{ padding: "12px 20px", marginLeft: "10px", fontSize: "16px" }}
      >
        Adicionar
      </button>
    </form>
  );
}
