"use client";
import { useMemo, useState } from "react";
import WizardShell, { WizardNav } from "./WizardShell";
import GuiaPortal from "./GuiaPortal";
import { calcularLucroPresumidoTrimestral, LIMITE_ADICIONAL_TRIMESTRAL } from "@/lib/lucroPresumido";
import { fmtBRL, fmtPct } from "@/lib/simplesNacional";

function parseNum(s) {
  const v = parseFloat(String(s || "").replace(/\./g, "").replace(",", "."));
  return Number.isFinite(v) ? v : 0;
}

const ATIVIDADES = {
  servico: "Prestação de serviços em geral",
  comercio_industria: "Comércio ou indústria",
  transporte_carga: "Transporte de carga",
  transporte_passageiros: "Transporte de passageiros",
};

export default function WizardLucroPresumido({ onSair }) {
  const [passo, setPasso] = useState(0);
  const [atividade, setAtividade] = useState("");
  const [receita, setReceita] = useState("");
  const [aliquotaIss, setAliquotaIss] = useState("3");
  const [majoracao, setMajoracao] = useState(true);

  const resultado = useMemo(() => {
    const r = parseNum(receita);
    if (!atividade || !r) return null;
    return calcularLucroPresumidoTrimestral({
      receitaTrimestral: r,
      atividade,
      aliquotaIss: atividade === "servico" ? parseNum(aliquotaIss) / 100 : 0,
      aplicarMajoracao2026: majoracao,
    });
  }, [atividade, receita, aliquotaIss, majoracao]);

  const passoAtividade = (
    <div key="ativ">
      <p style={{ fontSize: 13, color: "#3A423F", marginBottom: 14 }}>
        Qual é a atividade principal? A presunção de lucro (base do imposto) muda conforme a atividade.
      </p>
      <div className="ctb-opcoes">
        {Object.entries(ATIVIDADES).map(([k, label]) => (
          <label key={k} className={"ctb-opcao" + (atividade === k ? " selecionada" : "")}>
            <input type="radio" name="atividade" checked={atividade === k} onChange={() => setAtividade(k)} />
            <span className="titulo">{label}</span>
          </label>
        ))}
      </div>
      <div className="ctb-aviso">
        ⚠️ A partir do 2º trimestre de 2026, os percentuais de presunção do IRPJ/CSLL sofrem uma
        majoração de 10% (transição da Reforma Tributária). Se sua apuração é do 1º trimestre de
        2026, desmarque a majoração no próximo passo.
      </div>
    </div>
  );

  const passoDados = (
    <div key="dados">
      <div className="ctb-form-linha">
        <div className="ctb-campo">
          <label>Receita bruta do trimestre — R$</label>
          <input inputMode="decimal" value={receita} onChange={(e) => setReceita(e.target.value)} placeholder="Ex: 90000,00" autoFocus />
        </div>
        {atividade === "servico" && (
          <div className="ctb-campo">
            <label>Alíquota de ISS do seu município (%)</label>
            <input inputMode="decimal" value={aliquotaIss} onChange={(e) => setAliquotaIss(e.target.value)} placeholder="Ex: 3 (varia de 2 a 5%)" />
          </div>
        )}
      </div>
      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, marginTop: 8 }}>
        <input type="checkbox" checked={majoracao} onChange={(e) => setMajoracao(e.target.checked)} style={{ width: "auto" }} />
        Aplicar a majoração de 10% na presunção (vigente a partir do 2º trimestre/2026)
      </label>
    </div>
  );

  const passoResultado = (
    <div key="resultado">
      {resultado && (
        <>
          <div className="ctb-documento">
            <div className="ctb-documento-titulo">Tributos federais do trimestre (Lucro Presumido)</div>
            <div className="ctb-documento-linha">
              <span className="label">Base do IRPJ (receita × {fmtPct(resultado.presuncaoIrpj)})</span>
              <span className="valor">{fmtBRL(resultado.baseIrpj)}</span>
            </div>
            <div className="ctb-documento-linha">
              <span className="label">IRPJ (15%)</span>
              <span className="valor">{fmtBRL(resultado.irpjNormal)}</span>
            </div>
            {resultado.irpjAdicional > 0 && (
              <div className="ctb-documento-linha">
                <span className="label">Adicional de IRPJ (10% sobre o excedente de {fmtBRL(LIMITE_ADICIONAL_TRIMESTRAL)})</span>
                <span className="valor">{fmtBRL(resultado.irpjAdicional)}</span>
              </div>
            )}
            <div className="ctb-documento-linha">
              <span className="label">Base da CSLL (receita × {fmtPct(resultado.presuncaoCsll)})</span>
              <span className="valor">{fmtBRL(resultado.baseCsll)}</span>
            </div>
            <div className="ctb-documento-linha">
              <span className="label">CSLL (9%)</span>
              <span className="valor">{fmtBRL(resultado.csll)}</span>
            </div>
            <div className="ctb-documento-linha">
              <span className="label">PIS (0,65% sobre a receita)</span>
              <span className="valor">{fmtBRL(resultado.pis)}</span>
            </div>
            <div className="ctb-documento-linha">
              <span className="label">COFINS (3% sobre a receita)</span>
              <span className="valor">{fmtBRL(resultado.cofins)}</span>
            </div>
            {resultado.iss > 0 && (
              <div className="ctb-documento-linha">
                <span className="label">ISS (por fora, prefeitura)</span>
                <span className="valor">{fmtBRL(resultado.iss)}</span>
              </div>
            )}
            <div className="ctb-documento-linha">
              <span className="label" style={{ fontWeight: 800 }}>
                Total do trimestre
              </span>
              <span className="valor" style={{ fontSize: 18, color: "#0D7A3E" }}>
                {fmtBRL(resultado.totalTrimestre)}
              </span>
            </div>
          </div>

          <div className="ctb-aviso">
            ℹ️ IRPJ e CSLL são apurados por trimestre-calendário (jan-mar, abr-jun, jul-set,
            out-dez), com DARF até o último dia útil do mês seguinte ao trimestre. PIS e COFINS
            são mensais, com vencimento no dia 25 do mês seguinte. Se algum cliente já reteve
            parte desses tributos na nota (veja o serviço "Saber o que será retido na nota
            fiscal"), abata o valor retido do total antes de pagar o DARF.
          </div>

          <GuiaPortal
            titulo="Onde pagar"
            texto="Gere um DARF para cada tributo (códigos de receita diferentes para IRPJ, CSLL, PIS e COFINS) e o ISS separadamente na prefeitura."
            chave="darf"
          />

          <div className="ctb-aviso" style={{ marginTop: 14 }}>
            ⚖️ Este cálculo assume a forma mais comum de apuração. Se houver receitas de mais de
            uma atividade, ganhos de capital, ou você tiver dúvida sobre o percentual de presunção
            certo para sua atividade específica, confirme com um contador antes de pagar — o
            enquadramento errado de atividade muda a base de cálculo.
          </div>
        </>
      )}
    </div>
  );

  const passos = [passoAtividade, passoDados, passoResultado];
  const ultimoIndice = passos.length - 1;
  const podeAvancar = passo === 0 ? !!atividade : passo === 1 ? !!parseNum(receita) : true;

  return (
    <WizardShell titulo="Tributos fora do Simples (Lucro Presumido)" icone="🧮" totalPassos={passos.length} passoAtual={passo} onSair={onSair}>
      {passos[passo]}
      <WizardNav
        mostrarVoltar={passo > 0}
        onVoltar={() => setPasso((p) => p - 1)}
        onProximo={() => (passo === ultimoIndice ? onSair() : setPasso((p) => p + 1))}
        podeAvancar={podeAvancar}
        textoProximo={passo === ultimoIndice ? "Concluir" : passo === ultimoIndice - 1 ? "Calcular" : "Próximo"}
      />
    </WizardShell>
  );
}
