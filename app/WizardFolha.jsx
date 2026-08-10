"use client";
import { useMemo, useState } from "react";
import WizardShell, { WizardNav } from "./WizardShell";
import GuiaPortal from "./GuiaPortal";
import { calcularFolhaMensal, detalharINSS, TIPOS_VINCULO } from "@/lib/folhaPagamento";
import { fmtBRL, fmtPct } from "@/lib/simplesNacional";

function parseNum(s) {
  const v = parseFloat(String(s || "").replace(/\./g, "").replace(",", "."));
  return Number.isFinite(v) ? v : 0;
}

export default function WizardFolha({ onSair }) {
  const [passo, setPasso] = useState(0);
  const [tipo, setTipo] = useState("");
  const [salario, setSalario] = useState("");
  const [dependentes, setDependentes] = useState("0");
  const [outrosDescontos, setOutrosDescontos] = useState("");

  const folha = useMemo(() => {
    const s = parseNum(salario);
    if (!s || !tipo) return null;
    return calcularFolhaMensal({ salarioBruto: s, dependentes: parseInt(dependentes || "0", 10), outrosDescontos: parseNum(outrosDescontos), tipo });
  }, [tipo, salario, dependentes, outrosDescontos]);

  const inssDetalhado = useMemo(() => (parseNum(salario) && tipo !== "estagiario" ? detalharINSS(parseNum(salario)) : []), [salario, tipo]);

  const passoTipo = (
    <div key="tipo">
      <p style={{ fontSize: 13, color: "#3A423F", marginBottom: 14 }}>Qual é o tipo de vínculo? O desconto de INSS e a alíquota do FGTS mudam conforme o tipo.</p>
      <div className="ctb-opcoes">
        {Object.entries(TIPOS_VINCULO).map(([k, v]) => (
          <label key={k} className={"ctb-opcao" + (tipo === k ? " selecionada" : "")}>
            <input type="radio" name="tipovinculo" checked={tipo === k} onChange={() => setTipo(k)} />
            <span>
              <span className="titulo">{v.label}</span>
              <div className="desc">{v.desc}</div>
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  const passoDados = (
    <div key="dados">
      <div className="ctb-form-linha">
        <div className="ctb-campo">
          <label>{tipo === "estagiario" ? "Bolsa-auxílio do mês — R$" : "Salário bruto do mês — R$"}</label>
          <input inputMode="decimal" value={salario} onChange={(e) => setSalario(e.target.value)} placeholder="Ex: 3200,00" autoFocus />
        </div>
        {tipo !== "estagiario" && (
          <div className="ctb-campo">
            <label>Número de dependentes para o IRRF</label>
            <input inputMode="numeric" value={dependentes} onChange={(e) => setDependentes(e.target.value)} placeholder="0" />
          </div>
        )}
      </div>
      <div className="ctb-form-linha">
        <div className="ctb-campo">
          <label>Outros descontos do mês (vale-transporte, faltas etc.) — R$</label>
          <input inputMode="decimal" value={outrosDescontos} onChange={(e) => setOutrosDescontos(e.target.value)} placeholder="0,00" />
        </div>
      </div>
      {tipo === "estagiario" && (
        <div className="ctb-aviso">
          ℹ️ Estagiário não é segurado obrigatório do INSS — não há desconto de INSS na bolsa.
          Ainda assim pode incidir IRRF se o valor ultrapassar a faixa de isenção, calculado da
          mesma forma que num salário.
        </div>
      )}
      {tipo === "aprendiz" && (
        <div className="ctb-aviso">ℹ️ FGTS do aprendiz: 2% (em vez de 8%) — Lei 10.097/2000. INSS e IRRF seguem a tabela normal.</div>
      )}
      {tipo === "domestico" && (
        <div className="ctb-aviso">
          ℹ️ INSS e IRRF do empregado doméstico seguem as mesmas tabelas de qualquer CLT. Os
          encargos do empregador (FGTS 8% + 3,2% compulsório, INSS patronal 8%, SAT 0,8%) você
          calcula no serviço "Contratar um funcionário".
        </div>
      )}
    </div>
  );

  const passoResultado = (
    <div key="resultado">
      {folha && (
        <>
          <div className="ctb-documento">
            <div className="ctb-documento-titulo">{tipo === "estagiario" ? "Recibo estimado do mês" : "Contracheque estimado do mês"}</div>
            <div className="ctb-documento-linha">
              <span className="label">{tipo === "estagiario" ? "Bolsa-auxílio" : "Salário bruto"}</span>
              <span className="valor">{fmtBRL(folha.salarioBruto)}</span>
            </div>
            {!folha.semINSS && (
              <div className="ctb-documento-linha">
                <span className="label">(−) INSS do empregado</span>
                <span className="valor">{fmtBRL(folha.inss)}</span>
              </div>
            )}
            <div className="ctb-documento-linha">
              <span className="label">(−) IRRF{folha.aplicouRedutor ? " (com redutor 2026)" : ""}</span>
              <span className="valor">{fmtBRL(folha.irrf)}</span>
            </div>
            {folha.outrosDescontos > 0 && (
              <div className="ctb-documento-linha">
                <span className="label">(−) Outros descontos</span>
                <span className="valor">{fmtBRL(folha.outrosDescontos)}</span>
              </div>
            )}
            <div className="ctb-documento-linha">
              <span className="label" style={{ fontWeight: 800 }}>
                Valor líquido
              </span>
              <span className="valor" style={{ fontSize: 18, color: "#0D7A3E" }}>
                {fmtBRL(folha.salarioLiquido)}
              </span>
            </div>
            {!folha.semINSS && (
              <div className="ctb-documento-linha">
                <span className="label">FGTS do mês ({folha.aliquotaFgts * 100}%, depositado pela empresa, não desconta do líquido)</span>
                <span className="valor">{fmtBRL(folha.fgts)}</span>
              </div>
            )}
          </div>

          {!folha.semINSS && (
            <div className="ctb-memoria-calculo">
              <span className="linha">Memória de cálculo do INSS (tabela progressiva 2026):</span>
              {inssDetalhado.map((l, i) => (
                <span className="linha" key={i}>
                  Faixa {fmtBRL(l.de)} a {fmtBRL(l.ate)}: {fmtBRL(l.base)} × {fmtPct(l.aliquota)} = {fmtBRL(l.valor)}
                </span>
              ))}
              <span className="linha" style={{ marginTop: 6, display: "block" }}>
                INSS total = <span className="resultado">{fmtBRL(folha.inss)}</span>
              </span>
              <span className="linha" style={{ marginTop: 6, display: "block" }}>
                Base do IRRF = salário − INSS − (dependentes × R$189,59) = {fmtBRL(folha.baseCalculo)}
              </span>
            </div>
          )}

          <div className="ctb-aviso">
            ℹ️ O IRRF de 2026 usa a tabela progressiva normal, mas quem ganha até R$ 5.000/mês
            (bruto − INSS) fica isento pelo redutor da nova lei, com redução parcial até
            R$ 7.350. Este app aplica uma aproximação linear desse redutor — trate como
            estimativa e confirme o valor exato no sistema de folha oficial da empresa.
          </div>

          <GuiaPortal
            titulo="Onde registrar"
            texto="Lance esta folha dentro do prazo mensal (evento de folha de pagamento até o dia 15 do mês seguinte) e recolha o FGTS até o dia 20."
            chave={tipo === "domestico" ? "esocialDomestico" : "esocialFolha"}
          />
        </>
      )}
    </div>
  );

  const passos = [passoTipo, passoDados, passoResultado];
  const ultimoIndice = passos.length - 1;
  const podeAvancar = passo === 0 ? !!tipo : passo === 1 ? parseNum(salario) > 0 : true;

  return (
    <WizardShell titulo="Calcular a folha de pagamento do mês" icone="💰" totalPassos={passos.length} passoAtual={passo} onSair={onSair}>
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
