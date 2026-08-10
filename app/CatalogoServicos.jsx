"use client";
import { servicosPorCategoria } from "@/lib/servicos";

export default function CatalogoServicos({ onEscolher }) {
  const grupos = servicosPorCategoria();

  return (
    <div>
      <p className="ctb-boas-vindas">
        👋 Escolha abaixo o que você precisa resolver agora. O sistema vai te fazer algumas
        perguntas, calcular os valores, montar o resumo pronto para usar e indicar exatamente
        onde acessar para concluir a obrigação.
      </p>

      {grupos.map((grupo) => (
        <div className="ctb-categoria-grupo" key={grupo.id}>
          <div className="ctb-categoria-titulo">{grupo.nome}</div>
          <div className="ctb-servicos-grid">
            {grupo.servicos.map((s) => (
              <button key={s.id} className="ctb-servico-card" onClick={() => onEscolher(s.id)}>
                <span className="ctb-servico-icone">{s.icone}</span>
                <span className="ctb-servico-titulo">{s.titulo}</span>
                <span className="ctb-servico-desc">{s.descricao}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
