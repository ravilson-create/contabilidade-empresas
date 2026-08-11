"use client";
import { useMemo, useState } from "react";
import WizardShell, { WizardNav } from "./WizardShell";
import GuiaPortal from "./GuiaPortal";
import { calcularProLabore, ALIQUOTA_CPP_PATRONAL_PROLABORE } from "@/lib/proLabore";
import { anexoSugeridoPorAtividade, fmtBRL } from "@/lib/simplesNacional";
import { TETO_INSS_2026 } from "@/lib/folhaPagamento";

function parseNum(s) {
  const v = parseFloat(String(s || "").replace(/\./g, "").replace(",", "."));
  return Number.isFinite(v) ? v : 0;
}

export default function WizardProLabore({ onSair, perfil }) {
  const [passo, setPasso] = useState(0);
  const [valor, setValor] = useState("");
  const [dependentes, setDependentes] = useState("0");
  const [ehSimples, setEhSimples] = useState(perfil?.enquadramento === "meepp" || perfil?.enquadramento === "mei" ? true : null);
  const [anexo, setAnexo] = useState(perfil?.enquadramento === "meepp" ? anexoSugeridoPorAtividade(perfil.atividade) || "III" : "III");

  const resultado = useMemo(() => {
    const v = parseNum(valor);
    if (!v || ehSimples === null) return null;
    return calcularProLabore({ valorBruto: v, dependentes: parseInt(dependentes || "0", 10), simplesNacional: ehSimples, anexo });
  }, [valor, dependentes, ehSimples, anexo]);

  const passoDados = (
    <div key="dados">
      <div className="ctb-form-linha">
        <div className="ctb-campo">
          <label>Valor do pró-labore do mês — R$</label>
          <input inputMode="decimal" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Ex: 3000,00" autoFocus />
        </div>
        <div className="ctb-campo">
          <label>Número de dependentes para o IRRF</label>
          <input inputMode="numeric" value={dependentes} onChange={(e) => setDependentes(e.target.value)} placeholder="0" />
        </div>
      </div>

      <p style={{ fontSize: 13, fontWeight: 700, color: "#1C2521", margin: "12px 0 8px" }}>A empresa é optante do Simples Nacional?</p>
      <div className="ctb-opcoes">
        <label className={"ctb-opcao" + (ehSimples === true ? " selecionada" : "")}>
          <input type="radio" name="simples" checked={ehSimples === true} onChange={() => setEhSimples(true)} />
          <span className="titulo">Sim</span>
        </label>
        <label className={"ctb-opcao" + (ehSimples === false ? " selecionada" : "")}>
          <input type="radio" name="simples" checked={ehSimples === false} onChange={() => setEhSimples(false)} />
          <span className="titulo">Não (Lucro Presumido/Real, ou excluída no momento)</span>
        </label>
      </div>

      {ehSimples && (
        <div className="ctb-form-linha" style={{ marginTop: 12 }}>
          <div className="ctb-campo">
            <label>Qual Anexo?</label>
            <select value={anexo} onChange={(e) => setAnexo(e.target.value)}>
              <option value="I">Anexo I</option>
              <option value="II">Anexo II</option>
              <option value="III">Anexo III</option>
              <option value="IV">Anexo IV</option>
              <option value="V">Anexo V</option>
            </select>
          </div>
        </div>
      )}

      <div className="ctb-aviso">
        ℹ️ O sócio que recebe pró-labore contribui como "contribuinte individual" — alíquota fixa
        de 11% (não a tabela progressiva do empregado), respeitando o teto de {fmtBRL(TETO_INSS_2026)}.
      </div>
    </div>
  );

  const passoResultado = (
    <div key="resultado">
      {resultado && (
        <>
          <div className="ctb-documento">
            <div className="ctb-documento-titulo">Pró-labore líquido do mês</div>
            <div className="ctb-documento-linha">
              <span className="label">Valor bruto</span>
              <span className="valor">{fmtBRL(resultado.valorBruto)}</span>
            </div>
            <div className="ctb-documento-linha">
              <span className="label">(−) INSS do sócio (11%, com teto)</span>
              <span className="valor">{fmtBRL(resultado.inss)}</span>
            </div>
            <div className="ctb-documento-linha">
              <span className="label">(−) IRRF{resultado.aplicouRedutor ? " (com redutor 2026)" : ""}</span>
              <span className="valor">{fmtBRL(resultado.irrf)}</span>
            </div>
            <div className="ctb-documento-linha">
              <span className="label" style={{ fontWeight: 800 }}>
                Valor líquido
              </span>
              <span className="valor" style={{ fontSize: 18, color: "#0D7A3E" }}>
                {fmtBRL(resultado.liquido)}
              </span>
            </div>
            <div className="ctb-documento-linha">
              <span className="label">
                CPP patronal ({ALIQUOTA_CPP_PATRONAL_PROLABORE * 100}%, sem teto){resultado.cppEmbutidaNoDas ? " — já embutida no DAS" : ""}
              </span>
              <span className="valor">{resultado.cppEmbutidaNoDas ? "R$ 0,00" : fmtBRL(resultado.cppPatronal)}</span>
            </div>
          </div>

          <div className="ctb-memoria-calculo">
            <span className="linha">INSS = min(pró-labore, teto {fmtBRL(TETO_INSS_2026)}) × 11% = {fmtBRL(resultado.inss)}</span>
            <span className="linha">Base do IRRF = pró-labore − INSS − (dependentes × R$189,59) = {fmtBRL(resultado.baseCalculo)}</span>
          </div>

          {!resultado.cppEmbutidaNoDas && (
            <div className="ctb-aviso" style={{ marginTop: 14 }}>
              ⚠️ Como a empresa não tem a CPP patronal embutida no DAS (Lucro Presumido/Real, ou
              Simples Anexo IV), a CPP de 20% sobre o pró-labore é recolhida por fora, via GPS ou
              DARF, sem limite de teto — diferente do INSS do sócio, que tem teto.
            </div>
          )}

          <GuiaPortal
            titulo="Onde recolher"
            texto={
              resultado.cppEmbutidaNoDas
                ? "O INSS e o IRRF do pró-labore entram na apuração normal — o INSS do sócio integra o DAS mensal."
                : "Gere o DARF (IRRF sobre pró-labore) e a GPS/DARF da CPP patronal separadamente."
            }
            chave="darf"
          />
        </>
      )}
    </div>
  );

  const passos = [passoDados, passoResultado];
  const ultimoIndice = passos.length - 1;
  const podeAvancar = passo === 0 ? !!parseNum(valor) && ehSimples !== null : true;

  return (
    <WizardShell titulo="Calcular o pró-labore do sócio" icone="🧑‍💼" totalPassos={passos.length} passoAtual={passo} onSair={onSair}>
      {passos[passo]}
      <WizardNav
        mostrarVoltar={passo > 0}
        onVoltar={() => setPasso((p) => p - 1)}
        onProximo={() => (passo === ultimoIndice ? onSair() : setPasso((p) => p + 1))}
        podeAvancar={podeAvancar}
        textoProximo={passo === ultimoIndice ? "Concluir" : "Calcular"}
      />
    </WizardShell>
  );
}
