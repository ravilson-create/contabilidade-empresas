"use client";
import { useMemo, useState } from "react";
import WizardShell, { WizardNav } from "./WizardShell";
import { passosPersonalizados } from "@/lib/guiaAbertura";

export default function WizardAbertura({ onSair }) {
  const [passo, setPasso] = useState(0);
  const [enquadramento, setEnquadramento] = useState("");
  const [atividade, setAtividade] = useState("");
  const [regulamentada, setRegulamentada] = useState(null);
  const [empregados, setEmpregados] = useState(null);

  const respostas = { enquadramento, atividade, regulamentada, empregados };
  const roteiro = useMemo(() => passosPersonalizados(respostas), [enquadramento, regulamentada, empregados]);

  const passos = [
    <div key="0">
      <p style={{ fontSize: 13, color: "#3A423F", marginBottom: 14 }}>
        Qual é o porte esperado da empresa?
      </p>
      <div className="ctb-opcoes">
        <label className={"ctb-opcao" + (enquadramento === "mei" ? " selecionada" : "")}>
          <input type="radio" name="enq" checked={enquadramento === "mei"} onChange={() => setEnquadramento("mei")} />
          <span>
            <span className="titulo">MEI — faturamento de até R$ 81.000/ano</span>
            <div className="desc">Sozinho, sem sócios, no máximo 1 empregado.</div>
          </span>
        </label>
        <label className={"ctb-opcao" + (enquadramento === "meepp" ? " selecionada" : "")}>
          <input type="radio" name="enq" checked={enquadramento === "meepp"} onChange={() => setEnquadramento("meepp")} />
          <span>
            <span className="titulo">Microempresa (ME) ou Empresa de Pequeno Porte (EPP)</span>
            <div className="desc">Faturamento de R$ 81.000 até R$ 4,8 milhões/ano, com ou sem sócios.</div>
          </span>
        </label>
      </div>
    </div>,

    <div key="1">
      <p style={{ fontSize: 13, color: "#3A423F", marginBottom: 14 }}>Qual é a atividade principal?</p>
      <div className="ctb-opcoes">
        {[
          ["comercio", "Comércio", "Venda de mercadorias/produtos"],
          ["industria", "Indústria", "Fabricação ou transformação de produtos"],
          ["servico", "Prestação de serviço", "Serviços em geral"],
        ].map(([k, titulo, desc]) => (
          <label key={k} className={"ctb-opcao" + (atividade === k ? " selecionada" : "")}>
            <input type="radio" name="ativ" checked={atividade === k} onChange={() => setAtividade(k)} />
            <span>
              <span className="titulo">{titulo}</span>
              <div className="desc">{desc}</div>
            </span>
          </label>
        ))}
      </div>

      <p style={{ fontSize: 13, color: "#3A423F", margin: "18px 0 8px" }}>
        A atividade exige registro em conselho profissional (CRC, CREA, OAB, CRM etc.)?
      </p>
      <div className="ctb-opcoes">
        <label className={"ctb-opcao" + (regulamentada === true ? " selecionada" : "")}>
          <input type="radio" name="reg" checked={regulamentada === true} onChange={() => setRegulamentada(true)} />
          <span className="titulo">Sim</span>
        </label>
        <label className={"ctb-opcao" + (regulamentada === false ? " selecionada" : "")}>
          <input type="radio" name="reg" checked={regulamentada === false} onChange={() => setRegulamentada(false)} />
          <span className="titulo">Não / não sei</span>
        </label>
      </div>

      <p style={{ fontSize: 13, color: "#3A423F", margin: "18px 0 8px" }}>
        Você já vai começar contratando empregados (CLT)?
      </p>
      <div className="ctb-opcoes">
        <label className={"ctb-opcao" + (empregados === true ? " selecionada" : "")}>
          <input type="radio" name="emp" checked={empregados === true} onChange={() => setEmpregados(true)} />
          <span className="titulo">Sim</span>
        </label>
        <label className={"ctb-opcao" + (empregados === false ? " selecionada" : "")}>
          <input type="radio" name="emp" checked={empregados === false} onChange={() => setEmpregados(false)} />
          <span className="titulo">Não, por enquanto</span>
        </label>
      </div>
    </div>,

    <div key="2">
      <div className="ctb-aviso">
        ✅ Roteiro personalizado com {roteiro.length} passos para{" "}
        {enquadramento === "mei" ? "abrir seu MEI" : "abrir sua ME/EPP"}, considerando as suas
        respostas. Siga a ordem abaixo.
      </div>
      {roteiro.map((p) => (
        <div className="ctb-card" key={p.titulo}>
          <h3>{p.titulo}</h3>
          <p>{p.texto}</p>
          <span className="ctb-base">{p.base}</span>
        </div>
      ))}
      <div className="ctb-proximo-passo">
        <div className="titulo">Por onde começar agora</div>
        <p>
          {enquadramento === "mei"
            ? "Vá direto ao Portal do Empreendedor — a formalização do MEI é gratuita e o CNPJ sai na hora."
            : "Comece pela consulta de viabilidade do nome no portal Redesim antes de ir à Junta Comercial."}
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

  const podeAvancar = passo === 0 ? !!enquadramento : passo === 1 ? !!atividade && regulamentada !== null && empregados !== null : true;

  return (
    <WizardShell titulo="Abrir minha empresa" icone="🏁" totalPassos={passos.length} passoAtual={passo} onSair={onSair}>
      {passos[passo]}
      <WizardNav
        mostrarVoltar={passo > 0}
        onVoltar={() => setPasso((p) => p - 1)}
        onProximo={() => (passo === passos.length - 1 ? onSair() : setPasso((p) => p + 1))}
        podeAvancar={podeAvancar}
        textoProximo={passo === passos.length - 1 ? "Concluir" : passo === passos.length - 2 ? "Gerar roteiro" : "Próximo"}
      />
    </WizardShell>
  );
}
