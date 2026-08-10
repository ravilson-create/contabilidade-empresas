"use client";
import { PASSOS_ABERTURA } from "@/lib/guiaAbertura";

export default function AbaGuia() {
  return (
    <div>
      <div className="ctb-aviso">
        ℹ️ Este roteiro segue o fluxo padrão da Redesim (Rede Nacional para a Simplificação do
        Registro e da Legalização de Empresas). A ordem exata de alguns passos pode variar
        conforme o seu estado e município.
      </div>
      {PASSOS_ABERTURA.map((p) => (
        <div className="ctb-card" key={p.titulo}>
          <h3>{p.titulo}</h3>
          <p>{p.texto}</p>
          <span className="ctb-base">{p.base}</span>
        </div>
      ))}
    </div>
  );
}
