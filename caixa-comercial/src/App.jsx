import { useEffect, useRef, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db, isFirebaseConfigured, salesCollection } from "./firebase";

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

  if (name === "download") {
    return (
      <svg {...common}>
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 21h14" />
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

  if (name === "sun") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
      </svg>
    );
  }

  if (name === "moon") {
    return (
      <svg {...common}>
        <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
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

function formatOperationDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function sortEntries(entries) {
  return [...entries].sort((first, second) => {
    const firstTime = first.createdAtMs || 0;
    const secondTime = second.createdAtMs || 0;
    return secondTime - firstTime;
  });
}

function PaymentBadge({ method }) {
  const className =
    method === "Dinheiro" ? "cash" : method === "PIX" ? "pix" : "card";

  return <span className={`payment-badge ${className}`}>{method}</span>;
}

function escapeCsvValue(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function getAuthErrorMessage(error) {
  if (error.code === "auth/invalid-credential" || error.code === "auth/invalid-login-credentials") {
    return "E-mail ou senha inválidos.";
  }
  if (error.code === "auth/too-many-requests") {
    return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
  }
  if (error.code === "auth/user-disabled") {
    return "Este usuário foi desativado.";
  }
  return "Não foi possível entrar. Verifique sua conexão e tente novamente.";
}

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    if (!auth) {
      setErrorMessage("Configure o Firebase antes de tentar entrar.");
      return;
    }

    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      console.error("Erro ao autenticar no Firebase:", error);
      setErrorMessage(getAuthErrorMessage(error));
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card" aria-labelledby="login-title">
        <div className="brand-mark auth-brand-mark">
          <Icon name="store" size={23} />
        </div>
        <div className="auth-heading">
          <h1 id="login-title">Entrar no Caixa PDV</h1>
          <p>Use uma conta autorizada para acessar o caixa.</p>
        </div>

        {!isFirebaseConfigured && (
          <p className="auth-message error" role="alert">
            Firebase não configurado. Preencha o arquivo .env.local com os dados
            do seu aplicativo Web do Firebase.
          </p>
        )}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">E-mail</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Senha</label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {errorMessage && (
            <p className="auth-message error" role="alert">{errorMessage}</p>
          )}
          <button type="submit" className="submit-button" disabled={isSubmitting || !isFirebaseConfigured}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default function App() {
  const [theme, setTheme] = useState(
    () => window.localStorage.getItem("caixa-pdv-theme") || "light",
  );
  const [entries, setEntries] = useState([]);
  const [amountInput, setAmountInput] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Dinheiro");
  const [description, setDescription] = useState("");
  const [clock, setClock] = useState(() => new Date());
  const [openedAt] = useState(() => formatTime(new Date()));
  const [feedback, setFeedback] = useState(() =>
    isFirebaseConfigured
      ? null
      : {
          type: "error",
          message: "Firebase não configurado. Defina as variáveis VITE_FIREBASE_*.",
        },
  );
  const [isSyncing, setIsSyncing] = useState(isFirebaseConfigured);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(isFirebaseConfigured);
  const [dailyClosing, setDailyClosing] = useState(null);
  const amountRef = useRef(null);
  const operationDate = formatOperationDate(clock);
  const operatorName = user?.displayName || user?.email || "Usuário autenticado";
  const isDayClosed = dailyClosing?.status === "closed";

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("caixa-pdv-theme", theme);
  }, [theme]);

  useEffect(() => {
    const intervalId = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!feedback) return undefined;
    const timeoutId = window.setTimeout(() => setFeedback(null), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  useEffect(() => {
    if (!auth) {
      return undefined;
    }

    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setIsAuthLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user || !salesCollection) {
      return undefined;
    }

    const salesQuery = query(
      salesCollection,
      where("operationDate", "==", operationDate),
    );
    const unsubscribe = onSnapshot(
      salesQuery,
      (snapshot) => {
        const nextEntries = snapshot.docs.map((sale) => {
          const data = sale.data();
          return {
            id: sale.id,
            description: data.description || "Venda no balcão",
            method: data.method || "Dinheiro",
            amount: Number(data.amountCents || 0) / 100,
            time: data.time || formatTime(new Date(data.createdAtMs || Date.now())),
            createdAtMs: Number(data.createdAtMs || 0),
            operator: data.operator || data.createdByEmail || "",
          };
        });
        setEntries(sortEntries(nextEntries));
        setIsSyncing(true);
        setLastSyncedAt(new Date());
      },
      (error) => {
        console.error("Erro ao sincronizar vendas com o Firestore:", error);
        setIsSyncing(false);
        setFeedback({
          type: "error",
          message: "Não foi possível sincronizar com o Firestore.",
        });
      },
    );

    return unsubscribe;
  }, [operationDate, user]);

  useEffect(() => {
    if (!user || !db) {
      return undefined;
    }

    return onSnapshot(
      doc(db, "dailyClosings", operationDate),
      (snapshot) => {
        setDailyClosing(snapshot.exists() ? snapshot.data() : null);
      },
      (error) => {
        console.error("Erro ao consultar fechamento diário:", error);
        setFeedback({
          type: "error",
          message: "Não foi possível consultar o fechamento do dia.",
        });
      },
    );
  }, [operationDate, user]);

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

  async function handleSubmit(event) {
    event.preventDefault();
    if (isDayClosed) {
      setFeedback({ type: "error", message: "O dia já foi fechado. Novos lançamentos estão bloqueados." });
      return;
    }
    if (amountInCents <= 0) {
      setFeedback({ type: "error", message: "Informe um valor maior que zero." });
      amountRef.current?.focus();
      return;
    }

    const now = new Date();
    if (!salesCollection) {
      setFeedback({
        type: "error",
        message: "Firebase não configurado. A venda não foi gravada.",
      });
      return;
    }

    try {
      await addDoc(salesCollection, {
        description: description.trim() || "Venda no balcão",
        method: paymentMethod,
        amountCents: amountInCents,
        time: formatTime(now),
        createdAtMs: now.getTime(),
        createdAt: serverTimestamp(),
        operationDate: formatOperationDate(now),
        operator: operatorName,
        createdBy: user.uid,
        createdByEmail: user.email,
      });
      setAmountInput("");
      setDescription("");
      setFeedback({ type: "success", message: "Lançamento sincronizado com sucesso." });
      amountRef.current?.focus();
    } catch (error) {
      console.error("Erro ao salvar venda no Firestore:", error);
      setFeedback({
        type: "error",
        message: "Não foi possível salvar a venda no Firestore.",
      });
    }
  }

  async function handleRefund(id) {
    if (isDayClosed) {
      setFeedback({ type: "error", message: "O dia já foi fechado. Não é possível estornar lançamentos." });
      return;
    }
    if (!window.confirm("Deseja realmente estornar este lançamento? Essa ação não pode ser desfeita.")) {
      return;
    }
    if (!db) {
      setFeedback({
        type: "error",
        message: "Firebase não configurado. O estorno não foi gravado.",
      });
      return;
    }

    try {
      await deleteDoc(doc(db, "sales", id));
      setFeedback({ type: "success", message: "Lançamento estornado e sincronizado." });
    } catch (error) {
      console.error("Erro ao estornar venda no Firestore:", error);
      setFeedback({
        type: "error",
        message: "Não foi possível estornar a venda no Firestore.",
      });
    }
  }

  async function handleSignOut() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao sair da conta:", error);
      setFeedback({
        type: "error",
        message: "Não foi possível sair da conta.",
      });
    }
  }

  async function handleCloseDay() {
    if (isDayClosed || !db) {
      return;
    }
    if (!window.confirm("Deseja fechar o caixa de hoje? Novos lançamentos e estornos serão bloqueados.")) {
      return;
    }

    try {
      await setDoc(doc(db, "dailyClosings", operationDate), {
        operationDate,
        status: "closed",
        totalCents: totalInCents,
        paymentTotals,
        closedAt: serverTimestamp(),
        closedAtMs: Date.now(),
        closedBy: user.uid,
        closedByEmail: user.email,
      });
      setFeedback({ type: "success", message: "Caixa do dia fechado com sucesso." });
    } catch (error) {
      console.error("Erro ao fechar o caixa do dia:", error);
      setFeedback({
        type: "error",
        message: "Não foi possível fechar o caixa do dia.",
      });
    }
  }

  function handleDownloadStatement() {
    const reportDate = new Date();
    const rows = [
      ["Extrato diário do Caixa PDV"],
      ["Data", reportDate.toLocaleDateString("pt-BR")],
      [],
      ["Resumo"],
      ["Total", currency.format(totalInCents / 100)],
      ...paymentMethods.map((method) => [
        method,
        currency.format(paymentTotals[method] / 100),
      ]),
      [],
      ["Descrição", "Horário", "Pagamento", "Valor", "Operador"],
      ...entries.map((entry) => [
        entry.description,
        entry.time,
        entry.method,
        currency.format(entry.amount),
        entry.operator,
      ]),
    ];
    const csv = `\uFEFF${rows
      .map((row) => row.map(escapeCsvValue).join(";"))
      .join("\r\n")}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `extrato-caixa-${operationDate}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setFeedback({ type: "success", message: "Extrato diário baixado com sucesso." });
  }

  const dateLabel = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(clock);

  if (isAuthLoading) {
    return <main className="auth-shell"><p className="auth-loading">Verificando autenticação...</p></main>;
  }

  if (!user) {
    return <LoginScreen />;
  }

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
            {isSyncing ? "Online" : "Offline"}
          </div>
          <div className="account-controls">
            <span className="account-email" title={user.email}>{user.email}</span>
            <button type="button" className="sign-out-button" onClick={handleSignOut}>
              Sair
            </button>
          </div>
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme((currentTheme) => currentTheme === "light" ? "dark" : "light")}
            aria-label={`Ativar tema ${theme === "light" ? "escuro" : "claro"}`}
            aria-pressed={theme === "dark"}
            title={`Ativar tema ${theme === "light" ? "escuro" : "claro"}`}
          >
            <Icon name={theme === "light" ? "moon" : "sun"} size={18} />
          </button>
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

            <button type="submit" className="submit-button" disabled={isDayClosed}>
              <span>Lançar no Caixa</span>
              <Icon name="arrow" size={20} />
            </button>
            {isDayClosed && (
              <p className="field-hint">O caixa de hoje está fechado.</p>
            )}
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
            <div className="history-actions">
              <span className="entry-count">{entries.length} {entries.length === 1 ? "registro" : "registros"}</span>
              <button
                type="button"
                className="statement-button"
                onClick={handleDownloadStatement}
                title="Baixar extrato do dia"
              >
                <Icon name="download" size={16} />
                Extrato CSV
              </button>
              <button
                type="button"
                className="statement-button"
                onClick={handleCloseDay}
                disabled={isDayClosed}
                title={isDayClosed ? "Caixa já fechado" : "Fechar caixa do dia"}
              >
                {isDayClosed ? "Dia fechado" : "Fechar dia"}
              </button>
            </div>
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
                            disabled={isDayClosed}
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
                        disabled={isDayClosed}
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
        <span className="operator-field">
          <span>Caixa aberto às {openedAt} por</span>
          <strong>{operatorName}</strong>
        </span>
        <span>
          <span className="sync-dot" />
          {lastSyncedAt
            ? `Última sincronização: ${formatTime(lastSyncedAt)}`
            : "Aguardando sincronização"}
        </span>
      </footer>
    </main>
  );
}
