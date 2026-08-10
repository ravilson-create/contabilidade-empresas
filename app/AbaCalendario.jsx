"use client";
import { useState } from "react";
import { OBRIGACOES } from "@/lib/obrigacoes";

const FILTROS = ["Todos", "MEI", "ME", "EPP"];

export default function AbaCalendario() {
  const [filtro, setFiltro] = useState("Todos");
  const lista =
    filtro === "Todos" ? OBRIGACOES : OBRIGACOES.filter((o) => o.regime.includes(filtro));

  return (
    <div>
      <div className="ctb-form-linha">
        {FILTROS.map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            style={{
              border: "1px solid " + (filtro === f ? "#0D7A3E" : "#CBD5D1"),
              background: filtro === f ? "#0D7A3E" : "#fff",
              color: filtro === f ? "#fff" : "#3A423F",
              borderRadius: 999,
              padding: "6px 14px",
              fontSize: 12.5,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {lista.map((o) => (
        <div className="ctb-card" key={o.nome}>
          <div style={{ marginBottom: 4 }}>
            {o.regime.map((r) => (
              <span className="ctb-badge-regime" key={r}>
                {r}
              </span>
            ))}
          </div>
          <h3>{o.nome}</h3>
          <p>
            <strong>{o.periodicidade}</strong> — {o.prazo}
          </p>
          <p style={{ marginTop: 6 }}>{o.descricao}</p>
          <span className="ctb-base">{o.base}</span>
        </div>
      ))}
    </div>
  );
}
