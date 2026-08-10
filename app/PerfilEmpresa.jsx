"use client";
import { useState } from "react";
import { ESTADOS } from "@/lib/estados";

export default function PerfilEmpresa({ perfilInicial, onConcluir }) {
  const [enquadramento, setEnquadramento] = useState(perfilInicial?.enquadramento || "");
  const [atividade, setAtividade] = useState(perfilInicial?.atividade || "");
  const [uf, setUf] = useState(perfilInicial?.uf || "");
  const [temFuncionarios, setTemFuncionarios] = useState(perfilInicial?.temFuncionarios ?? null);
  const [regulamentada, setRegulamentada] = useState(perfilInicial?.regulamentada ?? null);

  const podeConcluir = !!enquadramento && !!atividade && !!uf && temFuncionarios !== null && regulamentada !== null;

  return (
    <div>
      <div className="ctb-wizard-header">
        <span className="ctb-wizard-icone">🏢</span>
        <h2>Conte sobre a sua empresa</h2>
      </div>
      <p style={{ fontSize: 13, color: "#3A423F", marginBottom: 18, lineHeight: 1.6 }}>
        Essas respostas personalizam os serviços que vamos te mostrar — nada é enviado a lugar
        nenhum, fica salvo só no seu navegador. Você pode alterar depois a qualquer momento.
      </p>

      <p style={{ fontSize: 13, fontWeight: 700, color: "#1C2521", marginBottom: 8 }}>A empresa já está aberta?</p>
      <div className="ctb-opcoes">
        <label className={"ctb-opcao" + (enquadramento === "ainda_nao_abri" ? " selecionada" : "")}>
          <input type="radio" name="enq" checked={enquadramento === "ainda_nao_abri"} onChange={() => setEnquadramento("ainda_nao_abri")} />
          <span className="titulo">Ainda não abri — quero começar do zero</span>
        </label>
        <label className={"ctb-opcao" + (enquadramento === "mei" ? " selecionada" : "")}>
          <input type="radio" name="enq" checked={enquadramento === "mei"} onChange={() => setEnquadramento("mei")} />
          <span className="titulo">Já sou MEI</span>
        </label>
        <label className={"ctb-opcao" + (enquadramento === "meepp" ? " selecionada" : "")}>
          <input type="radio" name="enq" checked={enquadramento === "meepp"} onChange={() => setEnquadramento("meepp")} />
          <span className="titulo">Já tenho ME ou EPP</span>
        </label>
      </div>

      <p style={{ fontSize: 13, fontWeight: 700, color: "#1C2521", margin: "18px 0 8px" }}>Qual é (ou será) a atividade principal?</p>
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

      <div className="ctb-form-linha" style={{ marginTop: 18 }}>
        <div className="ctb-campo">
          <label>Em qual estado a empresa está (ou vai ser aberta)?</label>
          <select value={uf} onChange={(e) => setUf(e.target.value)}>
            <option value="">Selecione o estado</option>
            {ESTADOS.map((e) => (
              <option key={e.uf} value={e.uf}>
                {e.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p style={{ fontSize: 13, fontWeight: 700, color: "#1C2521", margin: "18px 0 8px" }}>Tem (ou já tem) empregados registrados (CLT)?</p>
      <div className="ctb-opcoes">
        <label className={"ctb-opcao" + (temFuncionarios === true ? " selecionada" : "")}>
          <input type="radio" name="func" checked={temFuncionarios === true} onChange={() => setTemFuncionarios(true)} />
          <span className="titulo">Sim</span>
        </label>
        <label className={"ctb-opcao" + (temFuncionarios === false ? " selecionada" : "")}>
          <input type="radio" name="func" checked={temFuncionarios === false} onChange={() => setTemFuncionarios(false)} />
          <span className="titulo">Não</span>
        </label>
      </div>

      <p style={{ fontSize: 13, fontWeight: 700, color: "#1C2521", margin: "18px 0 8px" }}>
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

      <div className="ctb-wizard-nav">
        <span />
        <button
          className="ctb-btn ctb-btn-primario"
          disabled={!podeConcluir}
          onClick={() => onConcluir({ enquadramento, atividade, uf, temFuncionarios, regulamentada })}
        >
          Ver serviços recomendados
        </button>
      </div>
    </div>
  );
}
