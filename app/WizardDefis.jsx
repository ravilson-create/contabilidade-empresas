"use client";
import { useState } from "react";
import WizardShell, { WizardNav } from "./WizardShell";
import GuiaPortal from "./GuiaPortal";
import { fmtBRL } from "@/lib/simplesNacional";

function parseNum(s) {
  const v = parseFloat(String(s || "").replace(/\./g, "").replace(",", "."));
  return Number.isFinite(v) ? v : 0;
}

const anoAtual = new Date().getFullYear();

export default function WizardDefis({ onSair }) {
  const [passo, setPasso] = useState(0);
  const [ano, setAno] = useState(String(anoAtual - 1));
  const [receitaAno, setReceitaAno] = useState("");
  const [folhaAno, setFolhaAno] = useState("");
  const [numFuncionarios, setNumFuncionarios] = useState("");
  const [distribuiuLucros, setDistribuiuLucros] = useState(null);

  const passos = [
    <div key="0">
      <div className="ctb-form-linha">
        <div className="ctb-campo">
          <label>Ano-calendário a declarar</label>
          <input value={ano} onChange={(e) => setAno(e.target.value)} placeholder={String(anoAtual - 1)} autoFocus />
        </div>
      </div>
      <div className="ctb-form-linha">
        <div className="ctb-campo">
          <label>Receita bruta total do ano — R$</label>
          <input inputMode="decimal" value={receitaAno} onChange={(e) => setReceitaAno(e.target.value)} placeholder="0,00" />
        </div>
        <div className="ctb-campo">
          <label>Total pago em folha de pagamento no ano — R$</label>
          <input inputMode="decimal" value={folhaAno} onChange={(e) => setFolhaAno(e.target.value)} placeholder="0,00 (deixe em branco se não teve)" />
        </div>
      </div>
    </div>,

    <div key="1">
      <div className="ctb-form-linha">
        <div className="ctb-campo">
          <label>Número médio de empregados no ano</label>
          <input inputMode="numeric" value={numFuncionarios} onChange={(e) => setNumFuncionarios(e.target.value)} placeholder="0" />
        </div>
      </div>
      <p style={{ fontSize: 13, color: "#3A423F", margin: "10px 0 8px" }}>Houve distribuição de lucros aos sócios no ano?</p>
      <div className="ctb-opcoes">
        <label className={"ctb-opcao" + (distribuiuLucros === true ? " selecionada" : "")}>
          <input type="radio" name="lucro" checked={distribuiuLucros === true} onChange={() => setDistribuiuLucros(true)} />
          <span className="titulo">Sim</span>
        </label>
        <label className={"ctb-opcao" + (distribuiuLucros === false ? " selecionada" : "")}>
          <input type="radio" name="lucro" checked={distribuiuLucros === false} onChange={() => setDistribuiuLucros(false)} />
          <span className="titulo">Não</span>
        </label>
      </div>
      <div className="ctb-aviso">
        ℹ️ A DEFIS pede também detalhes ano a ano de composição societária e eventuais afastamentos —
        essas informações completas normalmente já estão organizadas pelo seu contador na
        escrituração contábil obrigatória da ME/EPP.
      </div>
    </div>,

    <div key="2">
      <div className="ctb-documento">
        <div className="ctb-documento-titulo">Resumo para a DEFIS de {ano}</div>
        <div className="ctb-documento-linha">
          <span className="label">Receita bruta total do ano</span>
          <span className="valor">{fmtBRL(parseNum(receitaAno))}</span>
        </div>
        <div className="ctb-documento-linha">
          <span className="label">Total pago em folha de pagamento</span>
          <span className="valor">{fmtBRL(parseNum(folhaAno))}</span>
        </div>
        <div className="ctb-documento-linha">
          <span className="label">Número médio de empregados</span>
          <span className="valor">{numFuncionarios || 0}</span>
        </div>
        <div className="ctb-documento-linha">
          <span className="label">Distribuiu lucros aos sócios?</span>
          <span className="valor">{distribuiuLucros ? "Sim" : "Não"}</span>
        </div>
      </div>

      <GuiaPortal
        titulo="Onde declarar"
        texto="Leve estes números — conferidos com a escrituração contábil do seu contador — para a DEFIS. Prazo: até 31 de março. Sem isso, a empresa fica impedida de emitir certidão negativa de débitos."
        chave="defis"
      />
    </div>,
  ];

  const podeAvancar = passo === 0 ? parseNum(receitaAno) > 0 : passo === 1 ? distribuiuLucros !== null : true;

  return (
    <WizardShell titulo="DEFIS — Declaração anual da ME/EPP" icone="📄" totalPassos={passos.length} passoAtual={passo} onSair={onSair}>
      {passos[passo]}
      <WizardNav
        mostrarVoltar={passo > 0}
        onVoltar={() => setPasso((p) => p - 1)}
        onProximo={() => (passo === passos.length - 1 ? onSair() : setPasso((p) => p + 1))}
        podeAvancar={podeAvancar}
        textoProximo={passo === passos.length - 1 ? "Concluir" : passo === passos.length - 2 ? "Gerar resumo" : "Próximo"}
      />
    </WizardShell>
  );
}
