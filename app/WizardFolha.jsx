"use client";
import { useMemo, useState } from "react";
import WizardShell, { WizardNav } from "./WizardShell";
import { calcularFolhaMensal } from "@/lib/folhaPagamento";
import { fmtBRL } from "@/lib/simplesNacional";

function parseNum(s) {
  const v = parseFloat(String(s || "").replace(/\./g, "").replace(",", "."));
  return Number.isFinite(v) ? v : 0;
}

export default function WizardFolha({ onSair }) {
  const [passo, setPasso] = useState(0);
  const [salario, setSalario] = useState("");
  const [dependentes, setDependentes] = useState("0");
  const [outrosDescontos, setOutrosDescontos] = useState("");

  const folha = useMemo(() => {
    const s = parseNum(salario);
    if (!s) return null;
    return calcularFolhaMensal({ salarioBruto: s, dependentes: parseInt(dependentes || "0", 10), outrosDescontos: parseNum(outrosDescontos) });
  }, [salario, dependentes, outrosDescontos]);

  const passos = [
    <div key="0">
      <div className="ctb-form-linha">
        <div className="ctb-campo">
          <label>Salário bruto do mês — R$</label>
          <input inputMode="decimal" value={salario} onChange={(e) => setSalario(e.target.value)} placeholder="Ex: 3200,00" autoFocus />
        </div>
        <div className="ctb-campo">
          <label>Número de dependentes para o IRRF</label>
          <input inputMode="numeric" value={dependentes} onChange={(e) => setDependentes(e.target.value)} placeholder="0" />
        </div>
      </div>
      <div className="ctb-form-linha">
        <div className="ctb-campo">
          <label>Outros descontos do mês (vale-transporte, faltas etc.) — R$</label>
          <input inputMode="decimal" value={outrosDescontos} onChange={(e) => setOutrosDescontos(e.target.value)} placeholder="0,00" />
        </div>
      </div>
    </div>,

    <div key="1">
      {folha && (
        <>
          <div className="ctb-documento">
            <div className="ctb-documento-titulo">Contracheque estimado do mês</div>
            <div className="ctb-documento-linha">
              <span className="label">Salário bruto</span>
              <span className="valor">{fmtBRL(folha.salarioBruto)}</span>
            </div>
            <div className="ctb-documento-linha">
              <span className="label">(−) INSS do empregado</span>
              <span className="valor">{fmtBRL(folha.inss)}</span>
            </div>
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
                Salário líquido
              </span>
              <span className="valor" style={{ fontSize: 18, color: "#0D7A3E" }}>
                {fmtBRL(folha.salarioLiquido)}
              </span>
            </div>
            <div className="ctb-documento-linha">
              <span className="label">FGTS do mês (depositado pela empresa, não desconta do líquido)</span>
              <span className="valor">{fmtBRL(folha.fgts)}</span>
            </div>
          </div>

          <div className="ctb-aviso">
            ℹ️ O IRRF de 2026 usa a tabela progressiva normal, mas quem ganha até R$ 5.000/mês
            (salário − INSS) fica isento pelo redutor da nova lei, com redução parcial até
            R$ 7.350. Este app aplica uma aproximação linear desse redutor — trate como
            estimativa e confirme o valor exato no sistema de folha oficial da empresa.
          </div>

          <div className="ctb-proximo-passo">
            <div className="titulo">Onde registrar</div>
            <p>
              Lance esta folha no eSocial dentro do prazo mensal (evento de folha de pagamento até
              o dia 15 do mês seguinte) e recolha o FGTS até o dia 20.
            </p>
            <a className="ctb-btn-link" href="https://www.gov.br/esocial/pt-br" target="_blank" rel="noopener noreferrer">
              Abrir o eSocial →
            </a>
          </div>
        </>
      )}
    </div>,
  ];

  const podeAvancar = passo === 0 ? parseNum(salario) > 0 : true;

  return (
    <WizardShell titulo="Calcular a folha de pagamento do mês" icone="💰" totalPassos={passos.length} passoAtual={passo} onSair={onSair}>
      {passos[passo]}
      <WizardNav
        mostrarVoltar={passo > 0}
        onVoltar={() => setPasso((p) => p - 1)}
        onProximo={() => (passo === passos.length - 1 ? onSair() : setPasso((p) => p + 1))}
        podeAvancar={podeAvancar}
        textoProximo={passo === passos.length - 1 ? "Concluir" : "Calcular"}
      />
    </WizardShell>
  );
}
