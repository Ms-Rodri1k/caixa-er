import { useEffect, useRef, useState } from "react";

const paymentMethods = ["Dinheiro", "PIX", "Cartão"];
const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function Icon({ name, size = 20 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (name === "store") {
    return (
      <svg {...common}>
        <path d="M3 10h18" />
        <path d="m5 10 1.2-6h11.6l1.2 6" />
        <path d="M4 10v10h16V10" />
        <path d="M9 20v-6h6v6" />
        <path d="M3 10a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 2 0" />
      </svg>
    );
  }

  if (name === "wallet") {
    return (
      <svg {...common}>
        <path d="M20 8V5a2 2 0 0 0-2-2H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h13a2 2 0 0 0 2-2v-3" />
        <path d="M2 7h15a3 3 0 0 1 3 3v6h-5a3 3 0 0 1 0-6h5" />
        <path d="M15 13h.01" />
      </svg>
    );
  }

  if (name === "arrow") {
    return (
      <svg {...common}>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    );
  }

  if (name === "trash") {
    return (
      <svg {...common}>
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="m19 6-1 14H6L5 6" />
        <path d="M10 11v5M14 11v5" />
      </svg>
    );
  }

  if (name === "receipt") {
    return (
      <svg {...common}>
        <path d="M4 3v18l3-2 3 2 3-2 3 2 4-2V3l-4 2-3-2-3 2-3-2-3 2Z" />
        <path d="M8 9h8M8 13h8" />
      </svg>
    );
  }

  return null;
}

function formatTime(date) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function PaymentBadge({ method }) {
  const className =
    method === "Dinheiro" ? "cash" : method === "PIX" ? "pix" : "card";

  return <span className={`payment-badge ${className}`}>{method}</span>;
}

export default function App() {
  const [entries, setEntries] = useState([]);
  const [amountInput, setAmountInput] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Dinheiro");
  const [description, setDescription] = useState("");
  const [operator, setOperator] = useState("");
  const [clock, setClock] = useState(() => new Date());
  const [openedAt] = useState(() => formatTime(new Date()));
  const [feedback, setFeedback] = useState(null);
  const amountRef = useRef(null);

  useEffect(() => {
    const intervalId = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!feedback) return undefined;
    const timeoutId = window.setTimeout(() => setFeedback(null), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  const amountInCents = Number(amountInput.replace(/\D/g, ""));
  const entryTotalInCents = entries.reduce(
    (total, entry) => total + Math.round(entry.amount * 100),
    0,
  );
  const totalInCents = entryTotalInCents;
  const paymentTotals = {
    Dinheiro: entries
      .filter((entry) => entry.method === "Dinheiro")
      .reduce((total, entry) => total + Math.round(entry.amount * 100), 0),
    PIX: entries
      .filter((entry) => entry.method === "PIX")
      .reduce((total, entry) => total + Math.round(entry.amount * 100), 0),
    Cartão: entries
      .filter((entry) => entry.method === "Cartão")
      .reduce((total, entry) => total + Math.round(entry.amount * 100), 0),
  };
  function handleAmountChange(event) {
    const digits = event.target.value.replace(/\D/g, "");
    setAmountInput(digits ? String(Number(digits)) : "");
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (amountInCents <= 0) {
      setFeedback({ type: "error", message: "Informe um valor maior que zero." });
      amountRef.current?.focus();
      return;
    }

    const now = new Date();
    setEntries((currentEntries) => [
      {
        id: crypto.randomUUID(),
        description: description.trim() || "Venda no balcão",
        method: paymentMethod,
        amount: amountInCents / 100,
        time: formatTime(now),
      },
      ...currentEntries,
    ]);
    setAmountInput("");
    setDescription("");
    setFeedback({ type: "success", message: "Lançamento adicionado com sucesso." });
    amountRef.current?.focus();
  }

  function handleRefund(id) {
    setEntries((currentEntries) =>
      currentEntries.filter((entry) => entry.id !== id),
    );
    setFeedback({ type: "success", message: "Lançamento estornado." });
  }

  const dateLabel = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(clock);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <Icon name="store" size={23} />
          </div>
          <div className="brand-copy">
            <h1>Caixa PDV</h1>
            <p>comercial ER</p>
          </div>
        </div>

        <div className="header-meta">
          <div className="date-time">
            <span className="current-date">{dateLabel}</span>
            <time className="current-time">
              {new Intl.DateTimeFormat("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }).format(clock)}
            </time>
          </div>
          <div className="online-badge">
            <span className="online-dot" />
            Online
          </div>
        </div>
      </header>

      <section className="total-card" aria-labelledby="total-title">
        <div className="total-main">
          <div className="total-heading">
            <span className="wallet-icon"><Icon name="wallet" size={21} /></span>
            <span id="total-title">Total no Caixa</span>
          </div>
          <p className="total-amount">{currency.format(totalInCents / 100)}</p>
          <p className="total-caption">Saldo consolidado de hoje</p>
        </div>

        <div className="payment-breakdown" aria-label="Totais por forma de pagamento">
          {paymentMethods.map((method) => (
            <div className={`breakdown-card ${method === "Dinheiro" ? "cash" : method === "PIX" ? "pix" : "card"}`} key={method}>
              <span className="breakdown-indicator" />
              <span className="breakdown-label">{method}</span>
              <strong>{currency.format(paymentTotals[method] / 100)}</strong>
            </div>
          ))}
        </div>
      </section>

      {feedback && (
        <div className={`feedback-message ${feedback.type}`} role={feedback.type === "error" ? "alert" : "status"} aria-live="polite">
          {feedback.message}
        </div>
      )}

      <div className="workspace-grid">
        <section className="panel form-panel" aria-labelledby="form-title">
          <div className="panel-heading">
            <div>
              <h2 id="form-title">Novo lançamento</h2>
              <p>Registre uma entrada no caixa</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="amount">Valor (R$)</label>
              <div className="amount-field">
                <span className="currency-prefix">R$</span>
                <input
                  ref={amountRef}
                  id="amount"
                  name="amount"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="0,00"
                  value={amountInput ? (amountInCents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ""}
                  onChange={handleAmountChange}
                  aria-describedby="amount-help"
                  aria-required="true"
                />
              </div>
              <span className="field-hint" id="amount-help">Digite o valor da venda</span>
            </div>

            <div className="form-group">
              <label htmlFor="payment-method">Forma de pagamento</label>
              <select
                id="payment-method"
                name="payment-method"
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
              >
                {paymentMethods.map((method) => (
                  <option value={method} key={method}>{method}</option>
                ))}
              </select>
            </div>

            <div className="form-group description-group">
              <label htmlFor="description">Descrição <span>(opcional)</span></label>
              <input
                id="description"
                name="description"
                type="text"
                placeholder="Ex: Compra do dia"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <button type="submit" className="submit-button">
              <span>Lançar no Caixa</span>
              <Icon name="arrow" size={20} />
            </button>
          </form>
        </section>

        <section className="panel history-panel" aria-labelledby="history-title">
          <div className="history-heading">
            <div className="panel-heading">
              <span className="history-icon"><Icon name="receipt" size={20} /></span>
              <div>
                <h2 id="history-title">Lançamentos recentes</h2>
                <p>Movimentações de hoje</p>
              </div>
            </div>
            <span className="entry-count">{entries.length} {entries.length === 1 ? "registro" : "registros"}</span>
          </div>

          {entries.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon"><Icon name="receipt" size={24} /></span>
              <strong>Nenhum lançamento hoje.</strong>
              <p>Use o formulário para começar.</p>
            </div>
          ) : (
            <>
              <div className="table-scroll">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th scope="col">Descrição</th>
                      <th scope="col">Pagamento</th>
                      <th scope="col" className="amount-column">Valor</th>
                      <th scope="col"><span className="visually-hidden">Ações</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => (
                      <tr key={entry.id}>
                        <td>
                          <span className="entry-description">{entry.description}</span>
                          <span className="entry-time">Hoje, {entry.time}</span>
                        </td>
                        <td><PaymentBadge method={entry.method} /></td>
                        <td className="entry-amount">{currency.format(entry.amount)}</td>
                        <td className="action-cell">
                          <button
                            type="button"
                            className="refund-icon-button"
                            onClick={() => handleRefund(entry.id)}
                            title="Estornar lançamento"
                            aria-label={`Estornar lançamento: ${entry.description}`}
                          >
                            <Icon name="trash" size={17} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mobile-entry-list">
                {entries.map((entry) => (
                  <article className="mobile-entry" key={entry.id}>
                    <div className="mobile-entry-copy">
                      <strong>{entry.description}</strong>
                      <span>Hoje, {entry.time}</span>
                      <PaymentBadge method={entry.method} />
                    </div>
                    <div className="mobile-entry-action">
                      <strong className="entry-amount">{currency.format(entry.amount)}</strong>
                      <button
                        type="button"
                        className="refund-text-button"
                        onClick={() => handleRefund(entry.id)}
                        aria-label={`Estornar lançamento: ${entry.description}`}
                      >
                        <Icon name="trash" size={15} />
                        Estornar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      <footer className="app-footer">
        <label className="operator-field" htmlFor="operator">
          <span>Caixa aberto às {openedAt} por</span>
          <input
            id="operator"
            type="text"
            value={operator}
            onChange={(event) => setOperator(event.target.value)}
            placeholder="Nome do operador"
            aria-label="Nome do operador do caixa"
          />
        </label>
        <span><span className="sync-dot" />Última sincronização: agora</span>
      </footer>
    </main>
  );
}
