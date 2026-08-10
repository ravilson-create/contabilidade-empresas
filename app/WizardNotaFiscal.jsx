"use client";
import { useState } from "react";
import WizardShell, { WizardNav } from "./WizardShell";

const RESULTADOS = {
  servico: {
    nota: "NFS-e — Nota Fiscal de Serviço Eletrônica",
    tributo: "ISS (municipal)",
    onde: "Sistema de emissão de NFS-e da Prefeitura do seu município",
    url: "https://www.gov.br/pt-br/servicos/emitir-alvara-de-funcionamento",
    texto: "Toda prestação de serviço exige NFS-e, mesmo para o MEI. O layout e o sistema variam por cidade — pesquise 'NFS-e prefeitura de [sua cidade]'.",
  },
  consumidor_final: {
    nota: "NFC-e — Nota Fiscal de Consumidor Eletrônica (ou cupom fiscal)",
    tributo: "ICMS (estadual)",
    onde: "Sistema de emissão de NFC-e da Sefaz do seu estado",
    url: "https://www.gov.br/pt-br/orgaos-do-governo/secretarias-estaduais-de-fazenda",
    texto: "Usada em vendas presenciais de mercadoria a consumidor final (varejo, balcão). É a nota que normalmente sai impressa ou por QR Code no PDV.",
  },
  b2b: {
    nota: "NF-e — Nota Fiscal Eletrônica (modelo 55)",
    tributo: "ICMS (estadual)",
    onde: "Sistema de emissão de NF-e da Sefaz do seu estado",
    url: "https://www.gov.br/pt-br/orgaos-do-governo/secretarias-estaduais-de-fazenda",
    texto: "Obrigatória para vendas a outra empresa, revenda, indústria ou operações interestaduais — precisa acompanhar o transporte da mercadoria.",
  },
};

export default function WizardNotaFiscal({ onSair }) {
  const [passo, setPasso] = useState(0);
  const [tipoOperacao, setTipoOperacao] = useState("");
  const [destino, setDestino] = useState("");

  const chaveResultado = tipoOperacao === "servico" ? "servico" : destino === "consumidor" ? "consumidor_final" : "b2b";
  const resultado = RESULTADOS[chaveResultado];

  const passo0 = (
    <div>
      <p style={{ fontSize: 13, color: "#3A423F", marginBottom: 14 }}>A operação é uma venda de mercadoria/produto ou uma prestação de serviço?</p>
      <div className="ctb-opcoes">
        <label className={"ctb-opcao" + (tipoOperacao === "mercadoria" ? " selecionada" : "")}>
          <input type="radio" name="tipoop" checked={tipoOperacao === "mercadoria"} onChange={() => setTipoOperacao("mercadoria")} />
          <span className="titulo">Venda de mercadoria/produto</span>
        </label>
        <label className={"ctb-opcao" + (tipoOperacao === "servico" ? " selecionada" : "")}>
          <input type="radio" name="tipoop" checked={tipoOperacao === "servico"} onChange={() => setTipoOperacao("servico")} />
          <span className="titulo">Prestação de serviço</span>
        </label>
      </div>
    </div>
  );

  const passo1 = (
    <div>
      <p style={{ fontSize: 13, color: "#3A423F", marginBottom: 14 }}>Para quem é a venda?</p>
      <div className="ctb-opcoes">
        <label className={"ctb-opcao" + (destino === "consumidor" ? " selecionada" : "")}>
          <input type="radio" name="dest" checked={destino === "consumidor"} onChange={() => setDestino("consumidor")} />
          <span>
            <span className="titulo">Consumidor final, venda presencial (balcão/loja)</span>
          </span>
        </label>
        <label className={"ctb-opcao" + (destino === "empresa" ? " selecionada" : "")}>
          <input type="radio" name="dest" checked={destino === "empresa"} onChange={() => setDestino("empresa")} />
          <span>
            <span className="titulo">Outra empresa, revenda, indústria ou envio para outro estado</span>
          </span>
        </label>
      </div>
    </div>
  );

  const passo2 = (
    <div>
      <div className="ctb-documento">
        <div className="ctb-documento-titulo">Nota fiscal indicada para esta operação</div>
        <div className="ctb-documento-linha">
          <span className="label">Documento</span>
          <span className="valor">{resultado.nota}</span>
        </div>
        <div className="ctb-documento-linha">
          <span className="label">Tributo envolvido</span>
          <span className="valor">{resultado.tributo}</span>
        </div>
      </div>
      <div className="ctb-proximo-passo">
        <div className="titulo">Onde emitir</div>
        <p>{resultado.texto}</p>
        <a className="ctb-btn-link" href={resultado.url} target="_blank" rel="noopener noreferrer">
          {resultado.onde} →
        </a>
      </div>
    </div>
  );

  const listaPassos = tipoOperacao === "servico" ? [passo0, passo2] : [passo0, passo1, passo2];
  const ultimoIndice = listaPassos.length - 1;
  const podeAvancar = passo === 0 ? !!tipoOperacao : passo === 1 && tipoOperacao !== "servico" ? !!destino : true;

  return (
    <WizardShell titulo="Saber qual nota fiscal emitir" icone="🧾" totalPassos={listaPassos.length} passoAtual={passo} onSair={onSair}>
      {listaPassos[passo]}
      <WizardNav
        mostrarVoltar={passo > 0}
        onVoltar={() => setPasso((p) => p - 1)}
        onProximo={() => (passo === ultimoIndice ? onSair() : setPasso((p) => p + 1))}
        podeAvancar={podeAvancar}
        textoProximo={passo === ultimoIndice ? "Concluir" : passo === ultimoIndice - 1 ? "Ver resultado" : "Próximo"}
      />
    </WizardShell>
  );
}
