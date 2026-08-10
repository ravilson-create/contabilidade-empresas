"use client";

export default function WizardShell({ titulo, icone, totalPassos, passoAtual, onSair, children }) {
  return (
    <div>
      <button className="ctb-voltar" onClick={onSair}>
        ← Central de serviços
      </button>
      <div className="ctb-wizard-header">
        <span className="ctb-wizard-icone">{icone}</span>
        <h2>{titulo}</h2>
      </div>
      {totalPassos > 1 && (
        <div className="ctb-progresso">
          {Array.from({ length: totalPassos }).map((_, i) => (
            <div key={i} className={"ctb-progresso-dot" + (i <= passoAtual ? " ativo" : "")} />
          ))}
        </div>
      )}
      {children}
    </div>
  );
}

export function WizardNav({ onVoltar, onProximo, podeAvancar = true, textoProximo = "Próximo", mostrarVoltar = true }) {
  return (
    <div className="ctb-wizard-nav">
      {mostrarVoltar ? (
        <button className="ctb-btn ctb-btn-secundario" onClick={onVoltar}>
          Voltar
        </button>
      ) : (
        <span />
      )}
      <button className="ctb-btn ctb-btn-primario" onClick={onProximo} disabled={!podeAvancar}>
        {textoProximo}
      </button>
    </div>
  );
}
