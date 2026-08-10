"use client";
import { useState } from "react";
import WizardShell, { WizardNav } from "./WizardShell";
import { PASSOS_ENCERRAMENTO_MEI, PASSOS_ENCERRAMENTO_MEEPP } from "@/lib/guiaEncerramento";

export default function WizardEncerramento({ onSair }) {
  const [passo, setPasso] = useState(0);
  const [enquadramento, setEnquadramento] = useState("");

  const roteiro = enquadramento === "mei" ? PASSOS_ENCERRAMENTO_MEI : PASSOS_ENCERRAMENTO_MEEPP;

  const passos = [
    <div key="0">
      <p style={{ fontSize: 13, color: "#3A423F", marginBottom: 14 }}>Qual é o enquadramento da empresa a ser encerrada?</p>
      <div className="ctb-opcoes">
        <label className={"ctb-opcao" + (enquadramento === "mei" ? " selecionada" : "")}>
          <input type="radio" name="enq" checked={enquadramento === "mei"} onChange={() => setEnquadramento("mei")} />
          <span className="titulo">MEI</span>
        </label>
        <label className={"ctb-opcao" + (enquadramento === "meepp" ? " selecionada" : "")}>
          <input type="radio" name="enq" checked={enquadramento === "meepp"} onChange={() => setEnquadramento("meepp")} />
          <span className="titulo">ME ou EPP</span>
        </label>
      </div>
    </div>,

    <div key="1">
      <div className="ctb-aviso">
        ⚠️ Não deixe a empresa "esquecida" ativa: mesmo sem faturar, ela continua gerando DAS,
        declarações e multas em atraso, que viram dívida ligada ao seu CPF.
      </div>
      {roteiro.map((p) => (
        <div className="ctb-card" key={p.titulo}>
          <h3>{p.titulo}</h3>
          <p>{p.texto}</p>
          <span className="ctb-base">{p.base}</span>
        </div>
      ))}
      <div className="ctb-proximo-passo">
        <div className="titulo">Onde solicitar a baixa</div>
        <p>
          {enquadramento === "mei"
            ? "A baixa do MEI é feita diretamente no Portal do Empreendedor, na opção 'Quero encerrar o CNPJ'."
            : "Comece pelo registro do distrato social na Junta Comercial do seu estado — a baixa do CNPJ segue automaticamente pela integração Redesim."}
        </p>
        <a
          className="ctb-btn-link"
          href={
            enquadramento === "mei"
              ? "https://www.gov.br/empresas-e-negocios/pt-br/empreendedor"
              : "https://www.gov.br/empresas-e-negocios/pt-br/redesim"
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          {enquadramento === "mei" ? "Abrir o Portal do Empreendedor →" : "Abrir o Portal Redesim →"}
        </a>
      </div>
    </div>,
  ];

  const podeAvancar = passo === 0 ? !!enquadramento : true;

  return (
    <WizardShell titulo="Encerrar ou dar baixa na empresa" icone="🔒" totalPassos={passos.length} passoAtual={passo} onSair={onSair}>
      {passos[passo]}
      <WizardNav
        mostrarVoltar={passo > 0}
        onVoltar={() => setPasso((p) => p - 1)}
        onProximo={() => (passo === passos.length - 1 ? onSair() : setPasso((p) => p + 1))}
        podeAvancar={podeAvancar}
        textoProximo={passo === passos.length - 1 ? "Concluir" : "Gerar checklist"}
      />
    </WizardShell>
  );
}
