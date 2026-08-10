"use client";
import { useMemo, useState } from "react";
import { ANEXOS, calcularDAS, fmtBRL, fmtPct, FATOR_R_MINIMO } from "@/lib/simplesNacional";

function parseNum(s) {
  if (s == null || s === "") return 0;
  return parseFloat(String(s).replace(/\./g, "").replace(",", ".")) || 0;
}

export default function AbaSimples() {
  const [anexo, setAnexo] = useState("I");
  const [rbt12, setRbt12] = useState("");
  const [receitaMes, setReceitaMes] = useState("");
  const [folha, setFolha] = useState("");

  const resultado = useMemo(() => {
    const rbt12N = parseNum(rbt12);
    const receitaMesN = parseNum(receitaMes);
    if (!rbt12N || !receitaMesN) return null;
    return calcularDAS({
      anexo,
      rbt12: rbt12N,
      receitaMes: receitaMesN,
      folhaPagamento12m: parseNum(folha),
    });
  }, [anexo, rbt12, receitaMes, folha]);

  return (
    <div>
      <div className="ctb-aviso">
        🧮 Calculadora do DAS do Simples Nacional (ME/EPP) conforme LC 123/2006, art. 18. Use a
        receita bruta acumulada dos últimos 12 meses (RBT12) e a receita do mês de apuração.
      </div>

      <div className="ctb-card">
        <div className="ctb-form-linha">
          <div className="ctb-campo">
            <label>Atividade (Anexo)</label>
            <select value={anexo} onChange={(e) => setAnexo(e.target.value)}>
              {Object.entries(ANEXOS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p style={{ fontSize: 12, color: "#5F6B67", marginBottom: 12 }}>
          {ANEXOS[anexo].exemplos}
        </p>

        <div className="ctb-form-linha">
          <div className="ctb-campo">
            <label>Receita bruta últimos 12 meses (RBT12) — R$</label>
            <input inputMode="decimal" value={rbt12} onChange={(e) => setRbt12(e.target.value)} placeholder="Ex: 240000,00" />
          </div>
          <div className="ctb-campo">
            <label>Receita bruta do mês de apuração — R$</label>
            <input inputMode="decimal" value={receitaMes} onChange={(e) => setReceitaMes(e.target.value)} placeholder="Ex: 20000,00" />
          </div>
        </div>

        {anexo === "V" && (
          <div className="ctb-form-linha">
            <div className="ctb-campo">
              <label>Folha de pagamento + pró-labore últimos 12 meses — R$</label>
              <input inputMode="decimal" value={folha} onChange={(e) => setFolha(e.target.value)} placeholder="Necessário para o Fator R" />
            </div>
          </div>
        )}
      </div>

      {resultado && resultado.erro && <div className="ctb-resultado erro">{resultado.erro}</div>}

      {resultado && !resultado.erro && (
        <div className="ctb-resultado">
          <div className="valor">{fmtBRL(resultado.valorDAS)}</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 10 }}>Valor estimado do DAS no mês</div>
          <div className="linha">
            <span>Anexo aplicado</span>
            <span>{ANEXOS[resultado.anexoUsado].nome}</span>
          </div>
          {resultado.fatorR !== null && (
            <div className="linha">
              <span>Fator R (folha ÷ RBT12)</span>
              <span>
                {fmtPct(resultado.fatorR)} {resultado.fatorR >= FATOR_R_MINIMO ? "(≥28% → tributado pelo Anexo III)" : "(<28% → mantém Anexo V)"}
              </span>
            </div>
          )}
          <div className="linha">
            <span>Alíquota nominal da faixa</span>
            <span>{fmtPct(resultado.aliquotaNominal)}</span>
          </div>
          <div className="linha">
            <span>Alíquota efetiva</span>
            <span>{fmtPct(resultado.aliquotaEfetiva, 3)}</span>
          </div>
          {resultado.acimaDoSublimite && (
            <div className="linha">
              <span>⚠ Acima do sublimite (R$ 3,6 milhões)</span>
              <span>ICMS/ISS recolhidos fora do DAS</span>
            </div>
          )}
        </div>
      )}

      <div className="ctb-categoria-titulo">Tabela — {ANEXOS[anexo].nome}</div>
      <table className="ctb-tabela">
        <thead>
          <tr>
            <th>Receita bruta em 12 meses (RBT12)</th>
            <th>Alíquota nominal</th>
            <th>Parcela a deduzir</th>
          </tr>
        </thead>
        <tbody>
          {ANEXOS[anexo].faixas.map((f, i, arr) => (
            <tr key={f.ate}>
              <td>
                {i === 0 ? "Até " : `De ${fmtBRL(arr[i - 1].ate + 0.01)} até `}
                {fmtBRL(f.ate)}
              </td>
              <td>{fmtPct(f.aliquota)}</td>
              <td>{fmtBRL(f.deduzir)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
