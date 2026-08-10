"use client";
import { useMemo, useState } from "react";
import WizardShell, { WizardNav } from "./WizardShell";
import GuiaPortal from "./GuiaPortal";
import { LIMITE_MEI_ANUAL, LIMITE_MEI_CAMINHONEIRO_ANUAL, avaliarLimiteMEI } from "@/lib/mei";
import { fmtBRL } from "@/lib/simplesNacional";

function parseNum(s) {
  const v = parseFloat(String(s || "").replace(/\./g, "").replace(",", "."));
  return Number.isFinite(v) ? v : 0;
}

const anoAtual = new Date().getFullYear();

export default function WizardDasnSimei({ onSair }) {
  const [passo, setPasso] = useState(0);
  const [ano, setAno] = useState(String(anoAtual - 1));
  const [receitaComercio, setReceitaComercio] = useState("");
  const [receitaServico, setReceitaServico] = useState("");
  const [teveEmpregado, setTeveEmpregado] = useState(null);
  const [caminhoneiro, setCaminhoneiro] = useState(false);

  const receitaTotal = parseNum(receitaComercio) + parseNum(receitaServico);
  const limite = useMemo(() => (receitaTotal ? avaliarLimiteMEI(receitaTotal, caminhoneiro) : null), [receitaTotal, caminhoneiro]);

  const passos = [
    <div key="0">
      <div className="ctb-form-linha">
        <div className="ctb-campo">
          <label>Ano-calendário a declarar</label>
          <input value={ano} onChange={(e) => setAno(e.target.value)} placeholder={String(anoAtual - 1)} />
        </div>
      </div>
      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, marginTop: 8 }}>
        <input type="checkbox" checked={caminhoneiro} onChange={(e) => setCaminhoneiro(e.target.checked)} style={{ width: "auto" }} />
        Sou MEI Caminhoneiro
      </label>
      <p style={{ fontSize: 13, color: "#3A423F", margin: "18px 0 8px" }}>Teve empregado registrado em algum momento do ano?</p>
      <div className="ctb-opcoes">
        <label className={"ctb-opcao" + (teveEmpregado === true ? " selecionada" : "")}>
          <input type="radio" name="emp" checked={teveEmpregado === true} onChange={() => setTeveEmpregado(true)} />
          <span className="titulo">Sim</span>
        </label>
        <label className={"ctb-opcao" + (teveEmpregado === false ? " selecionada" : "")}>
          <input type="radio" name="emp" checked={teveEmpregado === false} onChange={() => setTeveEmpregado(false)} />
          <span className="titulo">Não</span>
        </label>
      </div>
    </div>,

    <div key="1">
      <p style={{ fontSize: 13, color: "#3A423F", marginBottom: 14 }}>
        Some as receitas recebidas no ano de {ano}, separadas por tipo (some todas as nota fiscais/recibos emitidos):
      </p>
      <div className="ctb-form-linha">
        <div className="ctb-campo">
          <label>Receita de comércio/indústria (revenda ou fabricação) — R$</label>
          <input inputMode="decimal" value={receitaComercio} onChange={(e) => setReceitaComercio(e.target.value)} placeholder="0,00" autoFocus />
        </div>
        <div className="ctb-campo">
          <label>Receita de prestação de serviço — R$</label>
          <input inputMode="decimal" value={receitaServico} onChange={(e) => setReceitaServico(e.target.value)} placeholder="0,00" />
        </div>
      </div>
      {limite && (
        <div
          style={{
            marginTop: 8,
            padding: "10px 12px",
            borderRadius: 8,
            fontSize: 12.5,
            lineHeight: 1.6,
            background: limite.status === "ok" ? "#DCFCE7" : limite.status === "excesso_tolerado" ? "#FEF3C7" : "#FEE2E2",
            color: limite.status === "ok" ? "#0D7A3E" : limite.status === "excesso_tolerado" ? "#7A4A00" : "#991B1B",
          }}
        >
          {limite.mensagem}
        </div>
      )}
    </div>,

    <div key="2">
      <div className="ctb-documento">
        <div className="ctb-documento-titulo">Resumo para preencher a DASN-SIMEI de {ano}</div>
        <div className="ctb-documento-linha">
          <span className="label">Receita de comércio/indústria</span>
          <span className="valor">{fmtBRL(parseNum(receitaComercio))}</span>
        </div>
        <div className="ctb-documento-linha">
          <span className="label">Receita de serviços</span>
          <span className="valor">{fmtBRL(parseNum(receitaServico))}</span>
        </div>
        <div className="ctb-documento-linha">
          <span className="label" style={{ fontWeight: 800 }}>
            Receita bruta total do ano
          </span>
          <span className="valor" style={{ fontSize: 18, color: "#0D7A3E" }}>
            {fmtBRL(receitaTotal)}
          </span>
        </div>
        <div className="ctb-documento-linha">
          <span className="label">Teve empregado no ano?</span>
          <span className="valor">{teveEmpregado ? "Sim" : "Não"}</span>
        </div>
        <div className="ctb-documento-linha">
          <span className="label">Limite anual do MEI</span>
          <span className="valor">{fmtBRL(caminhoneiro ? LIMITE_MEI_CAMINHONEIRO_ANUAL : LIMITE_MEI_ANUAL)}</span>
        </div>
      </div>

      <GuiaPortal
        titulo="Onde declarar"
        texto={`Use estes números na DASN-SIMEI. Prazo: até 31 de maio — mesmo sem movimento, marque "sem movimento". Antes, confira se todos os DAS de ${ano} estão pagos.`}
        chave="dasnSimei"
      />
    </div>,
  ];

  const podeAvancar = passo === 0 ? teveEmpregado !== null : passo === 1 ? receitaTotal > 0 : true;

  return (
    <WizardShell titulo="Declaração Anual do MEI (DASN-SIMEI)" icone="📄" totalPassos={passos.length} passoAtual={passo} onSair={onSair}>
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
