"use client";
import { useMemo, useState } from "react";
import WizardShell, { WizardNav } from "./WizardShell";
import {
  TIPOS_ATIVIDADE_MEI,
  SALARIO_MINIMO_2026,
  LIMITE_MEI_ANUAL,
  LIMITE_MEI_CAMINHONEIRO_ANUAL,
  calcularDASMEI,
  avaliarLimiteMEI,
} from "@/lib/mei";
import { fmtBRL } from "@/lib/simplesNacional";

function parseNum(s) {
  const v = parseFloat(String(s || "").replace(/\./g, "").replace(",", "."));
  return Number.isFinite(v) ? v : 0;
}

export default function WizardDasMei({ onSair }) {
  const [passo, setPasso] = useState(0);
  const [tipo, setTipo] = useState("");
  const [caminhoneiro, setCaminhoneiro] = useState(false);
  const [faturamentoAno, setFaturamentoAno] = useState("");

  const das = useMemo(() => (tipo ? calcularDASMEI(tipo, caminhoneiro) : null), [tipo, caminhoneiro]);
  const limite = useMemo(() => {
    const v = parseNum(faturamentoAno);
    if (!v) return null;
    return avaliarLimiteMEI(v, caminhoneiro);
  }, [faturamentoAno, caminhoneiro]);

  const passos = [
    // 0 — tipo de atividade
    <div key="0">
      <p style={{ fontSize: 13, color: "#3A423F", marginBottom: 14 }}>
        Qual é a atividade principal do seu MEI?
      </p>
      <div className="ctb-opcoes">
        {Object.entries(TIPOS_ATIVIDADE_MEI).map(([k, v]) => (
          <label key={k} className={"ctb-opcao" + (tipo === k ? " selecionada" : "")}>
            <input type="radio" name="tipo" checked={tipo === k} onChange={() => setTipo(k)} />
            <span>
              <span className="titulo">{v.label}</span>
            </span>
          </label>
        ))}
      </div>
      <div className="ctb-form-linha" style={{ marginTop: 14 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
          <input type="checkbox" checked={caminhoneiro} onChange={(e) => setCaminhoneiro(e.target.checked)} style={{ width: "auto" }} />
          Sou MEI Caminhoneiro (transportador autônomo de cargas)
        </label>
      </div>
    </div>,

    // 1 — faturamento do ano (opcional, para checar limite)
    <div key="1">
      <p style={{ fontSize: 13, color: "#3A423F", marginBottom: 14 }}>
        Quanto você espera faturar neste ano-calendário? (opcional — usamos só para avisar se você
        está perto do limite do MEI)
      </p>
      <div className="ctb-form-linha">
        <div className="ctb-campo">
          <label>Faturamento total previsto no ano — R$</label>
          <input
            inputMode="decimal"
            value={faturamentoAno}
            onChange={(e) => setFaturamentoAno(e.target.value)}
            placeholder={`Limite: ${fmtBRL(caminhoneiro ? LIMITE_MEI_CAMINHONEIRO_ANUAL : LIMITE_MEI_ANUAL)}/ano`}
          />
        </div>
      </div>
      {limite && (
        <div
          style={{
            marginTop: 8,
            padding: "10px 12px",
            borderRadius: 8,
            fontSize: 12.5,
            lineHeight: 1.6,
            background: limite.status === "ok" ? "#DCFCE7" : limite.status === "excesso_tolerado" ? "#FEF3C7" : "#FEE2E2",
            color: limite.status === "ok" ? "#0D7A3E" : limite.status === "excesso_tolerado" ? "#7A4A00" : "#991B1B",
          }}
        >
          {limite.mensagem}
        </div>
      )}
    </div>,

    // 2 — resultado
    <div key="2">
      <div className="ctb-documento">
        <div className="ctb-documento-titulo">Resumo do DAS-MEI deste mês</div>
        <div className="ctb-documento-linha">
          <span className="label">Atividade</span>
          <span className="valor">{TIPOS_ATIVIDADE_MEI[tipo]?.label}</span>
        </div>
        <div className="ctb-documento-linha">
          <span className="label">INSS (5% do salário mínimo{caminhoneiro ? " + adicional" : ""})</span>
          <span className="valor">{fmtBRL(caminhoneiro ? das.total - das.icms - das.iss : das.inss)}</span>
        </div>
        {das.icms > 0 && (
          <div className="ctb-documento-linha">
            <span className="label">ICMS fixo</span>
            <span className="valor">{fmtBRL(das.icms)}</span>
          </div>
        )}
        {das.iss > 0 && (
          <div className="ctb-documento-linha">
            <span className="label">ISS fixo</span>
            <span className="valor">{fmtBRL(das.iss)}</span>
          </div>
        )}
        <div className="ctb-documento-linha">
          <span className="label" style={{ fontWeight: 800 }}>
            Total do DAS-MEI
          </span>
          <span className="valor" style={{ fontSize: 18, color: "#0D7A3E" }}>
            {fmtBRL(das.total)}
          </span>
        </div>
      </div>

      <div className="ctb-proximo-passo">
        <div className="titulo">Onde pagar</div>
        <p>
          Emita a guia (PGMEI) com este valor no Portal do Empreendedor e pague até o dia 20 deste
          mês (ou o dia útil anterior, se cair em fim de semana/feriado). É possível gerar o DAS de
          vários meses de uma vez e ativar o débito automático.
        </p>
        <a className="ctb-btn-link" href="https://www.gov.br/empresas-e-negocios/pt-br/empreendedor" target="_blank" rel="noopener noreferrer">
          Abrir o Portal do Empreendedor →
        </a>
      </div>

      <div className="ctb-aviso" style={{ marginTop: 14 }}>
        ℹ️ Valores de 2026 (salário mínimo {fmtBRL(SALARIO_MINIMO_2026)}). Guarde este DAS pago
        junto com suas notas fiscais — ele compõe o Relatório Mensal de Receitas Brutas
        (livro caixa do MEI) e será usado na DASN-SIMEI no fim do ano.
      </div>
    </div>,
  ];

  const podeAvancar = passo === 0 ? !!tipo : true;

  return (
    <WizardShell titulo="Calcular e pagar o DAS do MEI" icone="🧮" totalPassos={passos.length} passoAtual={passo} onSair={onSair}>
      {passos[passo]}
      <WizardNav
        mostrarVoltar={passo > 0}
        onVoltar={() => setPasso((p) => p - 1)}
        onProximo={() => (passo === passos.length - 1 ? onSair() : setPasso((p) => p + 1))}
        podeAvancar={podeAvancar}
        textoProximo={passo === passos.length - 1 ? "Concluir" : passo === passos.length - 2 ? "Ver resumo" : "Próximo"}
      />
    </WizardShell>
  );
}
