"use client";
import { useMemo, useState } from "react";
import WizardShell, { WizardNav } from "./WizardShell";
import GuiaPortal from "./GuiaPortal";
import { checklistPendencias } from "@/lib/guiaPendencias";

const LABEL_SITUACAO = {
  ainda_optante: "ainda optante do Simples Nacional",
  excluida: "já excluída do Simples Nacional",
  nao_sei: "situação a confirmar",
};

export default function WizardPendencias({ onSair, perfil }) {
  const [passo, setPasso] = useState(0);
  const [enquadramento, setEnquadramento] = useState(perfil?.enquadramento === "mei" || perfil?.enquadramento === "meepp" ? perfil.enquadramento : "");
  const [situacao, setSituacao] = useState("");

  const roteiro = useMemo(() => checklistPendencias({ enquadramento, situacao }), [enquadramento, situacao]);

  const passoEnquadramento = (
    <div key="enq">
      <p style={{ fontSize: 13, color: "#3A423F", marginBottom: 14 }}>A empresa é MEI ou ME/EPP?</p>
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
    </div>
  );

  const passoSituacao = (
    <div key="sit">
      <div className="ctb-alerta-forte">
        <div className="titulo">⚠ Antes de mais nada: isso é uma pendência, não só uma conta</div>
        <p>
          Se você não sabe ao certo a situação da empresa, o próprio Simples Nacional pode já ter
          excluído a empresa do regime por inadimplência — é mais comum do que parece depois de
          muito tempo sem declarar ou pagar. O passo a passo muda bastante dependendo disso.
        </p>
      </div>
      <p style={{ fontSize: 13, color: "#3A423F", marginBottom: 14 }}>Qual é a situação da empresa hoje?</p>
      <div className="ctb-opcoes">
        <label className={"ctb-opcao" + (situacao === "ainda_optante" ? " selecionada" : "")}>
          <input type="radio" name="sit" checked={situacao === "ainda_optante"} onChange={() => setSituacao("ainda_optante")} />
          <span>
            <span className="titulo">Ainda sou optante do Simples Nacional</span>
            <div className="desc">Só as declarações/pagamentos estão atrasados.</div>
          </span>
        </label>
        <label className={"ctb-opcao" + (situacao === "excluida" ? " selecionada" : "")}>
          <input type="radio" name="sit" checked={situacao === "excluida"} onChange={() => setSituacao("excluida")} />
          <span>
            <span className="titulo">Já fui excluído(a) do Simples Nacional</span>
            <div className="desc">Recebi (ou vi no sistema) um Termo de Exclusão.</div>
          </span>
        </label>
        <label className={"ctb-opcao" + (situacao === "nao_sei" ? " selecionada" : "")}>
          <input type="radio" name="sit" checked={situacao === "nao_sei"} onChange={() => setSituacao("nao_sei")} />
          <span>
            <span className="titulo">Não sei — preciso consultar primeiro</span>
          </span>
        </label>
      </div>
    </div>
  );

  const passoRoteiro = (
    <div key="rot">
      <div className="ctb-aviso">
        ✅ Roteiro para a situação: <strong>{LABEL_SITUACAO[situacao]}</strong>
        {enquadramento ? ` (${enquadramento === "mei" ? "MEI" : "ME/EPP"})` : ""}.
      </div>
      {roteiro.map((p) => (
        <div className="ctb-card" key={p.titulo}>
          <h3>{p.titulo}</h3>
          <p>{p.texto}</p>
          {p.base && <span className="ctb-base">{p.base}</span>}
        </div>
      ))}

      {situacao === "nao_sei" && (
        <GuiaPortal
          titulo="Onde consultar agora"
          texto="Comece pela Consulta Optantes — pública, gratuita, sem login. Anote o 'Detalhamento' de quem excluiu, se for o caso."
          chave="consultaOptantes"
        />
      )}

      {situacao === "ainda_optante" && (
        <GuiaPortal
          titulo="Onde regularizar"
          texto={`Entregue as declarações atrasadas no ${enquadramento === "mei" ? "PGMEI/DASN-SIMEI" : "PGDAS-D"}, mês a mês, do mais antigo para o mais recente.`}
          chave={enquadramento === "mei" ? "dasnSimei" : "pgdasD"}
        />
      )}

      {situacao === "excluida" && (
        <>
          <GuiaPortal titulo="Se a Consulta Optantes apontou a Receita Federal" chave="eCacCaixaPostal" />
          <div className="ctb-card" style={{ marginTop: 12 }}>
            <h3>Se a Consulta Optantes apontou um Estado ou Município</h3>
            <p>
              Não existe portal nacional único para isso — contate diretamente a Sefaz do estado
              ou a Secretaria de Fazenda da prefeitura indicada no 'Detalhamento', por telefone ou
              atendimento presencial se não houver sistema online. Peça o motivo exato e o valor
              em aberto.
            </p>
          </div>
          <GuiaPortal
            titulo="Depois de regularizado: pedir nova opção"
            texto="Todas as pendências apontadas precisam estar quitadas antes de solicitar."
            chave="opcaoSimplesNacional"
          />
        </>
      )}

      <div className="ctb-aviso" style={{ marginTop: 14 }}>
        ⚖️ Dado o valor em jogo (multas, juros e o risco de mudar de regime tributário sem
        perceber), vale muito a pena ter um contador acompanhando essa regularização — este app
        ajuda a organizar o passo a passo, não substitui o profissional.
      </div>
    </div>
  );

  const passos = [passoEnquadramento, passoSituacao, passoRoteiro];
  const ultimoIndice = passos.length - 1;
  const podeAvancar = passo === 0 ? !!enquadramento : passo === 1 ? !!situacao : true;

  return (
    <WizardShell titulo="Estou com pendências — o que fazer" icone="🚨" totalPassos={passos.length} passoAtual={passo} onSair={onSair}>
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
