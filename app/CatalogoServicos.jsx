"use client";
import { servicosPorCategoria, servicosRecomendados } from "@/lib/servicos";
import { nomeEstado } from "@/lib/estados";

const LABEL_ENQUADRAMENTO = {
  ainda_nao_abri: "empresa ainda não aberta",
  mei: "MEI",
  meepp: "ME/EPP",
};

export default function CatalogoServicos({ perfil, onEscolher, onEditarPerfil }) {
  const grupos = servicosPorCategoria();
  const recomendados = servicosRecomendados(perfil);

  return (
    <div>
      {perfil && (
        <div className="ctb-aviso" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span>
            📍 Perfil: <strong>{LABEL_ENQUADRAMENTO[perfil.enquadramento]}</strong>, {perfil.atividade}, {nomeEstado(perfil.uf)}
            {perfil.temFuncionarios ? ", com empregados" : ""}.
          </span>
          <button className="ctb-voltar" style={{ marginBottom: 0 }} onClick={onEditarPerfil}>
            ✏️ Editar perfil
          </button>
        </div>
      )}

      {recomendados.length > 0 && (
        <div className="ctb-categoria-grupo">
          <div className="ctb-categoria-titulo">Recomendado para você</div>
          <div className="ctb-servicos-grid">
            {recomendados.map((s) => (
              <button key={s.id} className="ctb-servico-card ctb-servico-card-recomendado" onClick={() => onEscolher(s.id)}>
                <span className="ctb-servico-icone">{s.icone}</span>
                <span className="ctb-servico-titulo">{s.titulo}</span>
                <span className="ctb-servico-desc">{s.descricao}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="ctb-categoria-titulo" style={{ marginTop: recomendados.length ? 30 : 0 }}>
        Todos os serviços
      </div>
      {grupos.map((grupo) => (
        <div className="ctb-categoria-grupo" key={grupo.id}>
          <div className="ctb-categoria-subtitulo">{grupo.nome}</div>
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
