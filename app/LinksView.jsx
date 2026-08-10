"use client";
import WizardShell from "./WizardShell";
import { LINKS_OFICIAIS, linkBuscaLocal } from "@/lib/linksOficiais";
import { nomeEstado } from "@/lib/estados";

export default function LinksView({ onSair, perfil }) {
  const local = perfil?.uf ? nomeEstado(perfil.uf) : null;

  return (
    <WizardShell titulo="Diretório de sites oficiais" icone="🔗" totalPassos={1} passoAtual={0} onSair={onSair}>
      <div className="ctb-aviso">
        🔗 Todos os endereços abaixo são domínios oficiais (gov.br ou equivalente). Desconfie de
        sites parecidos que cobram por serviços gratuitos, como a formalização do MEI.
      </div>
      {LINKS_OFICIAIS.map((grupo) => (
        <div key={grupo.categoria}>
          <div className="ctb-categoria-titulo">{grupo.categoria}</div>
          {grupo.itens.map((item) => (
            <div key={item.nome} className="ctb-link-item" style={{ cursor: "default" }}>
              <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
                <div className="nome">{item.nome}</div>
                <div className="url">{item.url}</div>
              </a>
              <div className="paraque">{item.paraQue}</div>
              {item.buscaLocal && local && (
                <a
                  href={linkBuscaLocal(item.buscaLocal, local)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-block", marginTop: 8, fontSize: 12, fontWeight: 700, color: "#0D7A3E" }}
                >
                  🔎 Buscar diretamente para {local} →
                </a>
              )}
            </div>
          ))}
        </div>
      ))}
    </WizardShell>
  );
}
