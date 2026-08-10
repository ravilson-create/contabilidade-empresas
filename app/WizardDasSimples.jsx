"use client";
import { useMemo, useState } from "react";
import WizardShell, { WizardNav } from "./WizardShell";
import { ANEXOS, calcularDAS, fmtBRL, fmtPct, FATOR_R_MINIMO } from "@/lib/simplesNacional";

function parseNum(s) {
  const v = parseFloat(String(s || "").replace(/\./g, "").replace(",", "."));
  return Number.isFinite(v) ? v : 0;
}

export default function WizardDasSimples({ onSair }) {
  const [passo, setPasso] = useState(0);
  const [anexo, setAnexo] = useState("");
  const [rbt12, setRbt12] = useState("");
  const [receitaMes, setReceitaMes] = useState("");
  const [folha, setFolha] = useState("");

  const resultado = useMemo(() => {
    if (!anexo) return null;
    const rbt12N = parseNum(rbt12);
    const receitaMesN = parseNum(receitaMes);
    if (!rbt12N || !receitaMesN) return null;
    return calcularDAS({ anexo, rbt12: rbt12N, receitaMes: receitaMesN, folhaPagamento12m: parseNum(folha) });
  }, [anexo, rbt12, receitaMes, folha]);

  const passos = [
    <div key="0">
      <p style={{ fontSize: 13, color: "#3A423F", marginBottom: 14 }}>Qual é a atividade principal da empresa?</p>
      <div className="ctb-opcoes">
        {Object.entries(ANEXOS).map(([k, v]) => (
          <label key={k} className={"ctb-opcao" + (anexo === k ? " selecionada" : "")}>
            <input type="radio" name="anexo" checked={anexo === k} onChange={() => setAnexo(k)} />
            <span>
              <span className="titulo">{v.nome}</span>
              <div className="desc">{v.exemplos}</div>
            </span>
          </label>
        ))}
      </div>
    </div>,

    <div key="1">
      <div className="ctb-form-linha">
        <div className="ctb-campo">
          <label>Receita bruta acumulada nos últimos 12 meses (RBT12) — R$</label>
          <input inputMode="decimal" value={rbt12} onChange={(e) => setRbt12(e.target.value)} placeholder="Ex: 240000,00" autoFocus />
        </div>
        <div className="ctb-campo">
          <label>Receita bruta deste mês de apuração — R$</label>
          <input inputMode="decimal" value={receitaMes} onChange={(e) => setReceitaMes(e.target.value)} placeholder="Ex: 20000,00" />
        </div>
      </div>
      {anexo === "V" && (
        <div className="ctb-form-linha">
          <div className="ctb-campo">
            <label>Folha de pagamento + pró-labore dos últimos 12 meses — R$</label>
            <input inputMode="decimal" value={folha} onChange={(e) => setFolha(e.target.value)} placeholder="Necessário para o Fator R" />
          </div>
        </div>
      )}
      <div className="ctb-aviso">
        ℹ️ RBT12 = soma da receita bruta dos 12 meses anteriores ao de apuração. Você encontra
        esse valor no PGDAS-D (ele é pré-calculado lá) ou soma nas suas notas fiscais/relatórios.
      </div>
    </div>,

    <div key="2">
      {resultado?.erro && <div className="ctb-resultado erro">{resultado.erro}</div>}
      {resultado && !resultado.erro && (
        <>
          <div className="ctb-documento">
            <div className="ctb-documento-titulo">Resumo da apuração do mês</div>
            <div className="ctb-documento-linha">
              <span className="label">Anexo aplicado</span>
              <span className="valor">{ANEXOS[resultado.anexoUsado].nome}</span>
            </div>
            {resultado.fatorR !== null && (
              <div className="ctb-documento-linha">
                <span className="label">Fator R (folha ÷ RBT12)</span>
                <span className="valor">
                  {fmtPct(resultado.fatorR)} {resultado.fatorR >= FATOR_R_MINIMO ? "(≥28%)" : "(<28%)"}
                </span>
              </div>
            )}
            <div className="ctb-documento-linha">
              <span className="label">Alíquota nominal da faixa</span>
              <span className="valor">{fmtPct(resultado.aliquotaNominal)}</span>
            </div>
            <div className="ctb-documento-linha">
              <span className="label">Alíquota efetiva</span>
              <span className="valor">{fmtPct(resultado.aliquotaEfetiva, 3)}</span>
            </div>
            <div className="ctb-documento-linha">
              <span className="label" style={{ fontWeight: 800 }}>
                Valor estimado do DAS
              </span>
              <span className="valor" style={{ fontSize: 18, color: "#0D7A3E" }}>
                {fmtBRL(resultado.valorDAS)}
              </span>
            </div>
            {resultado.acimaDoSublimite && (
              <div className="ctb-documento-linha">
                <span className="label">⚠ Acima do sublimite (R$ 3,6 milhões)</span>
                <span className="valor">ICMS/ISS por fora do DAS</span>
              </div>
            )}
          </div>

          <div className="ctb-proximo-passo">
            <div className="titulo">Onde declarar e pagar</div>
            <p>
              Lance a receita do mês no PGDAS-D (Portal do Simples Nacional). O sistema confere
              este cálculo automaticamente e gera o DAS oficial para pagamento até o dia 20 do mês
              seguinte (ou o dia útil anterior, se cair em fim de semana/feriado).
            </p>
            <a className="ctb-btn-link" href="https://www8.receita.fazenda.gov.br/SimplesNacional/" target="_blank" rel="noopener noreferrer">
              Abrir o Portal do Simples Nacional →
            </a>
          </div>
        </>
      )}
    </div>,
  ];

  const podeAvancar = passo === 0 ? !!anexo : passo === 1 ? !!parseNum(rbt12) && !!parseNum(receitaMes) : true;

  return (
    <WizardShell titulo="Apurar o DAS do Simples Nacional" icone="🧮" totalPassos={passos.length} passoAtual={passo} onSair={onSair}>
      {passos[passo]}
      <WizardNav
        mostrarVoltar={passo > 0}
        onVoltar={() => setPasso((p) => p - 1)}
        onProximo={() => (passo === passos.length - 1 ? onSair() : setPasso((p) => p + 1))}
        podeAvancar={podeAvancar}
        textoProximo={passo === passos.length - 1 ? "Concluir" : passo === passos.length - 2 ? "Calcular" : "Próximo"}
      />
    </WizardShell>
  );
}
