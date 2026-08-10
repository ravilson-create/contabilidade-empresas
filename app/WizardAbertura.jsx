"use client";
import { useMemo, useState } from "react";
import WizardShell, { WizardNav } from "./WizardShell";
import GuiaPortal from "./GuiaPortal";
import { passosPersonalizados } from "@/lib/guiaAbertura";

export default function WizardAbertura({ onSair, perfil }) {
  const [passo, setPasso] = useState(0);
  const [enquadramento, setEnquadramento] = useState(perfil?.enquadramento === "mei" || perfil?.enquadramento === "meepp" ? perfil.enquadramento : "");
  const [atividade, setAtividade] = useState(perfil?.atividade || "");
  const [regulamentada, setRegulamentada] = useState(perfil?.regulamentada ?? null);
  const [empregados, setEmpregados] = useState(perfil?.temFuncionarios ?? null);

  const respostas = { enquadramento, atividade, regulamentada, empregados };
  const roteiro = useMemo(() => passosPersonalizados(respostas), [enquadramento, regulamentada, empregados]);

  const passoEnquadramento = (
    <div key="enq">
      <p style={{ fontSize: 13, color: "#3A423F", marginBottom: 14 }}>Qual é o porte esperado da empresa?</p>
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
    </div>
  );

  const passoDetalhes = (
    <div key="detalhes">
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

      <p style={{ fontSize: 13, color: "#3A423F", margin: "18px 0 8px" }}>Você já vai começar contratando empregados (CLT)?</p>
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
    </div>
  );

  const passoRoteiro = (
    <div key="roteiro">
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
      <GuiaPortal
        titulo="Por onde começar agora"
        texto={
          enquadramento === "mei"
            ? "A formalização do MEI é gratuita e o CNPJ sai na hora."
            : "Comece pela consulta de viabilidade do nome antes de ir à Junta Comercial."
        }
        chave={enquadramento === "mei" ? "portalEmpreendedorAbertura" : "redesimAbertura"}
      />
    </div>
  );

  // Se o perfil da empresa já respondeu atividade/regulamentação/empregados,
  // pulamos essa pergunta e vamos direto do enquadramento para o roteiro.
  const temDetalhesDoPerfil = !!perfil?.atividade && perfil?.regulamentada !== null && perfil?.regulamentada !== undefined && perfil?.temFuncionarios !== null && perfil?.temFuncionarios !== undefined;
  const passos = temDetalhesDoPerfil ? [passoEnquadramento, passoRoteiro] : [passoEnquadramento, passoDetalhes, passoRoteiro];

  const ultimoIndice = passos.length - 1;
  const podeAvancar =
    passo === 0
      ? !!enquadramento
      : !temDetalhesDoPerfil && passo === 1
        ? !!atividade && regulamentada !== null && empregados !== null
        : true;

  return (
    <WizardShell titulo="Abrir minha empresa" icone="🏁" totalPassos={passos.length} passoAtual={passo} onSair={onSair}>
      {passos[passo]}
      <WizardNav
        mostrarVoltar={passo > 0}
        onVoltar={() => setPasso((p) => p - 1)}
        onProximo={() => (passo === ultimoIndice ? onSair() : setPasso((p) => p + 1))}
        podeAvancar={podeAvancar}
        textoProximo={passo === ultimoIndice ? "Concluir" : passo === ultimoIndice - 1 ? "Gerar roteiro" : "Próximo"}
      />
    </WizardShell>
  );
}
