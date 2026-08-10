"use client";
import { LINKS_OFICIAIS } from "@/lib/linksOficiais";

export default function AbaLinks() {
  return (
    <div>
      <div className="ctb-aviso">
        🔗 Todos os endereços abaixo são domínios oficiais (gov.br ou equivalente). Desconfie de
        sites parecidos que cobram por serviços gratuitos, como a formalização do MEI.
      </div>
      {LINKS_OFICIAIS.map((grupo) => (
        <div key={grupo.categoria}>
          <div className="ctb-categoria-titulo">{grupo.categoria}</div>
          {grupo.itens.map((item) => (
            <a
              key={item.nome}
              className="ctb-link-item"
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="nome">{item.nome}</div>
              <div className="url">{item.url}</div>
              <div className="paraque">{item.paraQue}</div>
            </a>
          ))}
        </div>
      ))}
    </div>
  );
}
