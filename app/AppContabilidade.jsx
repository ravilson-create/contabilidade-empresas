"use client";
import { useState } from "react";
import CatalogoServicos from "./CatalogoServicos";
import WizardAbertura from "./WizardAbertura";
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

export default function AppContabilidade() {
  const [servicoAtivo, setServicoAtivo] = useState(null);
  const ComponenteServico = servicoAtivo ? COMPONENTES_SERVICO[servicoAtivo] : null;

  return (
    <>
      <div className="ctb-topo" onClick={() => setServicoAtivo(null)}>
        <h1>Contabilidade para Micro e Pequenas Empresas</h1>
        <p>Escolha um serviço e o sistema calcula, preenche e indica onde concluir</p>
      </div>

      <div className="ctb-conteudo">
        {!servicoAtivo && (
          <div className="ctb-aviso" style={{ background: "#E0F2FE", color: "#0C4A6E" }}>
            ⚖️ Ferramenta de orientação geral, sem substituir a assessoria de um contador ou
            advogado. Valores e prazos têm como referência a legislação e as tabelas em vigor em
            2026 (Simples Nacional — LC 123/2006 e alterações; MEI — LC 128/2008; INSS/IRRF —
            tabelas de 2026; Reforma Tributária — EC 132/2023 e LC 214/2025) e podem mudar —
            confirme sempre nos sites oficiais indicados ao final de cada serviço.
          </div>
        )}

        {ComponenteServico ? (
          <ComponenteServico onSair={() => setServicoAtivo(null)} />
        ) : (
          <CatalogoServicos onEscolher={setServicoAtivo} />
        )}
      </div>
    </>
  );
}
