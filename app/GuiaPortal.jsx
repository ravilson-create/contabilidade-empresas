"use client";
import { PASSOS_PORTAIS } from "@/lib/passosPortais";

// Bloco padrão "onde e como fazer": link direto + passo a passo de cliques
// dentro do portal, no mesmo estilo em todos os serviços do app.
export default function GuiaPortal({ titulo, texto, chave, extra }) {
  const info = PASSOS_PORTAIS[chave];
  if (!info) return null;

  return (
    <div className="ctb-proximo-passo">
      <div className="titulo">{titulo}</div>
      {texto && <p>{texto}</p>}
      <ol className="ctb-passo-a-passo">
        {info.passos.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ol>
      {extra}
      <a className="ctb-btn-link" href={info.url} target="_blank" rel="noopener noreferrer">
        {info.textoLink}
      </a>
    </div>
  );
}
