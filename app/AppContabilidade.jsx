"use client";
import { useEffect, useState } from "react";
import PerfilEmpresa from "./PerfilEmpresa";
import CatalogoServicos from "./CatalogoServicos";
import WizardAbertura from "./WizardAbertura";
import WizardPendencias from "./WizardPendencias";
import WizardDasMei from "./WizardDasMei";
import WizardDasSimples from "./WizardDasSimples";
import WizardDasnSimei from "./WizardDasnSimei";
import WizardDefis from "./WizardDefis";
import WizardAdmissao from "./WizardAdmissao";
import WizardFolha from "./WizardFolha";
import WizardNotaFiscal from "./WizardNotaFiscal";
import WizardEncerramento from "./WizardEncerramento";
import CalendarioView from "./CalendarioView";
import LinksView from "./LinksView";

const COMPONENTES_SERVICO = {
  abertura: WizardAbertura,
  pendencias: WizardPendencias,
  "das-mei": WizardDasMei,
  "das-simples": WizardDasSimples,
  "dasn-simei": WizardDasnSimei,
  defis: WizardDefis,
  admissao: WizardAdmissao,
  folha: WizardFolha,
  "nota-fiscal": WizardNotaFiscal,
  encerramento: WizardEncerramento,
  calendario: CalendarioView,
  links: LinksView,
};

const CHAVE_PERFIL = "ctb_perfil_empresa";

export default function AppContabilidade() {
  const [perfil, setPerfil] = useState(null);
  const [perfilCarregado, setPerfilCarregado] = useState(false);
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [servicoAtivo, setServicoAtivo] = useState(null);

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(CHAVE_PERFIL);
      if (salvo) setPerfil(JSON.parse(salvo));
    } catch {}
    setPerfilCarregado(true);
  }, []);

  const salvarPerfil = (novoPerfil) => {
    setPerfil(novoPerfil);
    setEditandoPerfil(false);
    try {
      localStorage.setItem(CHAVE_PERFIL, JSON.stringify(novoPerfil));
    } catch {}
  };

  const ComponenteServico = servicoAtivo ? COMPONENTES_SERVICO[servicoAtivo] : null;
  const mostrarPerfil = perfilCarregado && (!perfil || editandoPerfil);

  return (
    <>
      <div
        className="ctb-topo"
        onClick={() => {
          setServicoAtivo(null);
          setEditandoPerfil(false);
        }}
      >
        <h1>Contabilidade para Micro e Pequenas Empresas</h1>
        <p>Conte sobre a sua empresa e o sistema calcula, preenche e indica onde concluir cada obrigação</p>
      </div>

      <div className="ctb-conteudo">
        {!servicoAtivo && !mostrarPerfil && (
          <div className="ctb-aviso" style={{ background: "#E0F2FE", color: "#0C4A6E" }}>
            ⚖️ Ferramenta de orientação geral, sem substituir a assessoria de um contador ou
            advogado. Valores e prazos têm como referência a legislação e as tabelas em vigor em
            2026 (Simples Nacional — LC 123/2006 e alterações; MEI — LC 128/2008; INSS/IRRF —
            tabelas de 2026; Reforma Tributária — EC 132/2023 e LC 214/2025) e podem mudar —
            confirme sempre nos sites oficiais indicados ao final de cada serviço.
          </div>
        )}

        {!perfilCarregado ? null : mostrarPerfil ? (
          <PerfilEmpresa perfilInicial={perfil} onConcluir={salvarPerfil} />
        ) : ComponenteServico ? (
          <ComponenteServico onSair={() => setServicoAtivo(null)} perfil={perfil} />
        ) : (
          <CatalogoServicos perfil={perfil} onEscolher={setServicoAtivo} onEditarPerfil={() => setEditandoPerfil(true)} />
        )}
      </div>
    </>
  );
}
