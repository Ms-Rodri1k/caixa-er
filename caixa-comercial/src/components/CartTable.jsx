import { UseState } from "react";

export function CartTable({ items, onRemoveItem }) {
  return (
    <table
      style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}
    >
      <thead>
        <tr style={{ borderBottom: "2px solid #ccc" }}>
          <th style={{ padding: "8px" }}>Item</th>
          <th style={{ padding: "8px" }}>Produto</th>
          <th style={{ padding: "8px" }}>Qtd</th>
          <th style={{ padding: "8px" }}>Preço Unit.</th>
          <th style={{ padding: "8px" }}>Subtotal</th>
          <th style={{ padding: "8px" }}>Ações</th>
        </tr>
      </thead>
      <tbody>
        {items.length === 0 ? (
          <tr>
            <td
              colSpan="6"
              style={{ padding: "20px", textAlign: "center", color: "#666" }}
            >
              Nenhum produto adicionado à venda.
            </td>
          </tr>
        ) : (
          items.map((item, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "8px" }}>{index + 1}</td>
              <td style={{ padding: "8px" }}>{item.nome}</td>
              <td style={{ padding: "8px" }}>{item.quantidade}</td>
              <td style={{ padding: "8px" }}>R$ {item.preco.toFixed(2)}</td>
              <td style={{ padding: "8px" }}>
                R$ {(item.preco * item.quantidade).toFixed(2)}
              </td>
              <td style={{ padding: "8px" }}>
                <button
                  onClick={() => onRemoveItem(index)}
                  style={{ color: "red" }}
                >
                  Remover
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}