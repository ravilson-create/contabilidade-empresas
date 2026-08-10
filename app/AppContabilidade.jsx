"use client";
import { useState } from "react";
import AbaGuia from "./AbaGuia";
import AbaMei from "./AbaMei";
import AbaSimples from "./AbaSimples";
import AbaCalendario from "./AbaCalendario";
import AbaLinks from "./AbaLinks";

const ABAS = [
  { id: "guia", label: "📋 Guia de abertura", Comp: AbaGuia },
  { id: "mei", label: "🧮 Calculadora MEI", Comp: AbaMei },
  { id: "simples", label: "🧮 Calculadora Simples", Comp: AbaSimples },
  { id: "calendario", label: "📅 Calendário", Comp: AbaCalendario },
  { id: "links", label: "🔗 Links oficiais", Comp: AbaLinks },
];

export default function AppContabilidade() {
  const [aba, setAba] = useState("guia");
  const AbaAtiva = ABAS.find((a) => a.id === aba).Comp;

  return (
    <>
      <div className="ctb-topo">
        <h1>Contabilidade para Micro e Pequenas Empresas</h1>
        <p>Guia de obrigações, calculadoras de DAS e canais oficiais para regularizar sua empresa</p>
      </div>

      <nav className="ctb-nav">
        {ABAS.map((a) => (
          <button
            key={a.id}
            className={"ctb-nav-item" + (aba === a.id ? " ativo" : "")}
            onClick={() => setAba(a.id)}
          >
            {a.label}
          </button>
        ))}
      </nav>

      <div className="ctb-conteudo">
        <div className="ctb-aviso" style={{ background: "#E0F2FE", color: "#0C4A6E" }}>
          ⚖️ Ferramenta de orientação geral, sem substituir a assessoria de um contador ou
          advogado. Valores e prazos têm como referência a legislação e as tabelas em vigor em
          2026 (Simples Nacional — LC 123/2006 e alterações; MEI — LC 128/2008; Reforma
          Tributária — EC 132/2023 e LC 214/2025) e podem mudar — confirme sempre nos sites
          oficiais indicados na aba "Links oficiais".
        </div>
        <AbaAtiva />
      </div>
    </>
  );
}
