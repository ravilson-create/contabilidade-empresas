"use client";
import { useMemo, useState } from "react";
import { meses12Anteriores, somarRBT12, calcularRBT12Proporcional, parseListaValores } from "@/lib/rbt12";
import { fmtBRL } from "@/lib/simplesNacional";

function parseNum(s) {
  const v = parseFloat(String(s || "").replace(/\./g, "").replace(",", "."));
  return Number.isFinite(v) ? v : 0;
}

const hoje = new Date();

export default function CalculadoraRBT12({ onUsar, onFechar }) {
  const [modo, setModo] = useState(null);

  return (
    <div className="ctb-subpainel">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <strong style={{ fontSize: 13, color: "#0D3B2E" }}>Calculadora de RBT12</strong>
        <button className="ctb-voltar" style={{ marginBottom: 0 }} onClick={onFechar}>
          Fechar ✕
        </button>
      </div>

      {!modo && (
        <div className="ctb-opcoes">
          <label className="ctb-opcao" onClick={() => setModo("mensal")}>
            <span>
              <span className="titulo">Tenho a receita bruta dos últimos 12 meses</span>
              <div className="desc">Preencha mês a mês, ou cole os 12 valores de uma vez.</div>
            </span>
          </label>
          <label className="ctb-opcao" onClick={() => setModo("proporcional")}>
            <span>
              <span className="titulo">A empresa tem menos de 12 meses de atividade</span>
              <div className="desc">Calcula o RBT12 proporcional (LC 123/2006, art. 18, §2º).</div>
            </span>
          </label>
          <label className="ctb-opcao" onClick={() => setModo("atrasada")}>
            <span>
              <span className="titulo">Estou com declarações do PGDAS-D atrasadas</span>
              <div className="desc">Isso é uma pendência a resolver antes — veja o que fazer.</div>
            </span>
          </label>
        </div>
      )}

      {modo === "mensal" && <ModoMensal onUsar={onUsar} onVoltar={() => setModo(null)} />}
      {modo === "proporcional" && <ModoProporcional onUsar={onUsar} onVoltar={() => setModo(null)} />}
      {modo === "atrasada" && <ModoAtrasada onVoltar={() => setModo(null)} onEstimarMesmoAssim={() => setModo("mensal")} />}
    </div>
  );
}

function ModoMensal({ onUsar, onVoltar }) {
  const [mesRef, setMesRef] = useState(hoje.getMonth() + 1);
  const [anoRef, setAnoRef] = useState(hoje.getFullYear());
  const meses = useMemo(() => meses12Anteriores(Number(mesRef), Number(anoRef)), [mesRef, anoRef]);
  const [valores, setValores] = useState(Array(12).fill(""));
  const [colar, setColar] = useState("");
  const [avisoColar, setAvisoColar] = useState("");

  const soma = useMemo(() => somarRBT12(valores.map(parseNum)), [valores]);
  const preenchidos = valores.filter((v) => parseNum(v) > 0).length;

  const aplicarColados = () => {
    const nums = parseListaValores(colar);
    if (nums.length !== 12 || nums.some((n) => n === null)) {
      setAvisoColar(`Encontrei ${nums.length} valor(es) reconhecível(is), mas preciso de exatamente 12 (um por mês, um por linha). Confira o texto colado.`);
      return;
    }
    setValores(nums.map((n) => String(n).replace(".", ",")));
    setAvisoColar("");
  };

  return (
    <div>
      <button className="ctb-voltar" onClick={onVoltar}>
        ← Voltar
      </button>
      <div className="ctb-form-linha">
        <div className="ctb-campo">
          <label>Mês de apuração (referência)</label>
          <select value={mesRef} onChange={(e) => setMesRef(e.target.value)}>
            {["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"].map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="ctb-campo">
          <label>Ano</label>
          <input inputMode="numeric" value={anoRef} onChange={(e) => setAnoRef(e.target.value)} />
        </div>
      </div>

      <div className="ctb-aviso" style={{ marginTop: 4 }}>
        Não existe importação automática do PGDAS-D — a Receita Federal não libera essa
        integração para sistemas de terceiros. Mas você pode <strong>colar de uma vez</strong> os
        12 valores copiados do seu extrato do PGDAS-D ou de uma planilha (um valor por linha, na
        ordem de {meses[0]?.label} até {meses[11]?.label}):
      </div>
      <textarea
        value={colar}
        onChange={(e) => setColar(e.target.value)}
        placeholder={"Cole aqui, um valor por linha...\nEx:\n12000,00\n15300,50\n..."}
        rows={4}
        style={{ width: "100%", border: "1px solid #CBD5D1", borderRadius: 6, padding: "8px 10px", fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" }}
      />
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
        <button className="ctb-btn ctb-btn-secundario" onClick={aplicarColados}>
          Preencher os 12 meses com este texto
        </button>
      </div>
      {avisoColar && (
        <div style={{ color: "#991B1B", fontSize: 12, marginTop: 6 }}>{avisoColar}</div>
      )}

      <div className="ctb-rbt12-grid">
        {meses.map((m, i) => (
          <div className="ctb-campo" key={m.label}>
            <label>{m.label}</label>
            <input
              inputMode="decimal"
              value={valores[i]}
              onChange={(e) => {
                const novos = [...valores];
                novos[i] = e.target.value;
                setValores(novos);
              }}
              placeholder="0,00"
            />
          </div>
        ))}
      </div>

      <div className="ctb-documento" style={{ marginTop: 12 }}>
        <div className="ctb-documento-linha">
          <span className="label">Meses preenchidos</span>
          <span className="valor">{preenchidos} de 12</span>
        </div>
        <div className="ctb-documento-linha">
          <span className="label" style={{ fontWeight: 800 }}>
            RBT12 calculado
          </span>
          <span className="valor" style={{ fontSize: 16, color: "#0D7A3E" }}>
            {fmtBRL(soma)}
          </span>
        </div>
      </div>
      {preenchidos < 12 && (
        <div className="ctb-aviso" style={{ marginTop: 8 }}>
          ⚠ Faltam {12 - preenchidos} mês(es). O valor acima está subestimado até completar os 12
          meses.
        </div>
      )}

      <div className="ctb-wizard-nav">
        <span />
        <button className="ctb-btn ctb-btn-primario" disabled={soma <= 0} onClick={() => onUsar(soma)}>
          Usar este RBT12
        </button>
      </div>
    </div>
  );
}

function ModoProporcional({ onUsar, onVoltar }) {
  const [receita, setReceita] = useState("");
  const [meses, setMeses] = useState("");
  const rbt12 = useMemo(() => calcularRBT12Proporcional(parseNum(receita), parseInt(meses || "0", 10)), [receita, meses]);

  return (
    <div>
      <button className="ctb-voltar" onClick={onVoltar}>
        ← Voltar
      </button>
      <div className="ctb-form-linha">
        <div className="ctb-campo">
          <label>Receita bruta acumulada desde a abertura — R$</label>
          <input inputMode="decimal" value={receita} onChange={(e) => setReceita(e.target.value)} placeholder="Ex: 40000,00" autoFocus />
        </div>
        <div className="ctb-campo">
          <label>Número de meses em atividade</label>
          <input inputMode="numeric" value={meses} onChange={(e) => setMeses(e.target.value)} placeholder="Ex: 4" />
        </div>
      </div>

      {rbt12 > 0 && (
        <div className="ctb-documento">
          <div className="ctb-documento-linha">
            <span className="label">Fórmula</span>
            <span className="valor">
              ({fmtBRL(parseNum(receita))} ÷ {meses || 0}) × 12
            </span>
          </div>
          <div className="ctb-documento-linha">
            <span className="label" style={{ fontWeight: 800 }}>
              RBT12 proporcional
            </span>
            <span className="valor" style={{ fontSize: 16, color: "#0D7A3E" }}>
              {fmtBRL(rbt12)}
            </span>
          </div>
        </div>
      )}

      <div className="ctb-wizard-nav">
        <span />
        <button className="ctb-btn ctb-btn-primario" disabled={rbt12 <= 0} onClick={() => onUsar(rbt12)}>
          Usar este RBT12
        </button>
      </div>
    </div>
  );
}

function ModoAtrasada({ onVoltar, onEstimarMesmoAssim }) {
  return (
    <div>
      <button className="ctb-voltar" onClick={onVoltar}>
        ← Voltar
      </button>
      <div className="ctb-alerta-forte">
        <div className="titulo">⚠ Isso é uma pendência, não só uma conta</div>
        <p>
          Se a empresa não vem entregando o PGDAS-D há vários meses, o problema não é calcular o
          RBT12 — é que essas declarações em atraso precisam ser regularizadas primeiro. Sem
          isso, o valor de RBT12 mostrado no sistema pode estar zerado ou desatualizado, e a
          apuração atual não é confiável. Para um roteiro completo (inclusive se a empresa já
          pode ter sido excluída do Simples), veja o serviço{" "}
          <strong>"Estou com pendências — o que fazer"</strong> na Central de Serviços.
        </p>
        <p>
          <strong>Riscos de deixar acumular:</strong> multa por atraso na entrega de cada
          declaração (mínimo de R$ 50 por competência), juros e multa sobre o DAS não pago, e
          risco de <strong>exclusão de ofício do Simples Nacional</strong> — a Receita Federal
          notifica a empresa com prazo (normalmente 90 dias) para regularizar antes de excluir o
          regime a partir de janeiro do ano seguinte.
        </p>
      </div>

      <div className="ctb-card">
        <h3>Como regularizar</h3>
        <ul className="ctb-checklist">
          <li>
            <span className="n">1</span>
            <span>Entre no PGDAS-D (Portal do Simples Nacional) e veja quais competências (meses) estão em aberto.</span>
          </li>
          <li>
            <span className="n">2</span>
            <span>
              Reconstitua a receita bruta de cada mês em atraso a partir das notas fiscais
              emitidas, extratos bancários ou livro caixa do período — não estime de cabeça.
            </span>
          </li>
          <li>
            <span className="n">3</span>
            <span>Transmita cada declaração em atraso, mês a mês, na ordem cronológica (o sistema normalmente exige isso).</span>
          </li>
          <li>
            <span className="n">4</span>
            <span>Pague o DAS de cada mês em atraso — o próprio sistema calcula a multa e os juros.</span>
          </li>
          <li>
            <span className="n">5</span>
            <span>Só depois de regularizado o RBT12 calculado pelo PGDAS-D volta a ser confiável para a apuração do mês atual.</span>
          </li>
        </ul>
        <p style={{ fontSize: 12.5, color: "#5F6B67", marginTop: 10 }}>
          Se são muitos meses ou os valores não estão claros, vale a pena contratar um contador
          para essa reconstituição — um erro aqui pode gerar autuação.
        </p>
      </div>

      <div className="ctb-proximo-passo">
        <div className="titulo">Onde regularizar</div>
        <p>Acesse o PGDAS-D para ver as competências em aberto e transmitir as declarações atrasadas.</p>
        <a className="ctb-btn-link" href="https://www8.receita.fazenda.gov.br/SimplesNacional/" target="_blank" rel="noopener noreferrer">
          Abrir o Portal do Simples Nacional →
        </a>
      </div>

      <button className="ctb-voltar" style={{ marginTop: 14 }} onClick={onEstimarMesmoAssim}>
        Mesmo assim, quero fazer uma estimativa aproximada com os meses que eu tenho →
      </button>
    </div>
  );
}
