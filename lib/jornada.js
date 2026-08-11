// ═══════════════════════════════════════════════════════════════════════════
//  JORNADA E CBO — dados de apoio para o evento de admissão do eSocial.
//  No eSocial, a jornada não entra solta no evento de admissão (S-2200):
//  ela é cadastrada antes, numa Tabela de Horários/Turnos de Trabalho
//  (S-1050), e a admissão só referencia o código dessa tabela já pronta.
// ═══════════════════════════════════════════════════════════════════════════

export const TIPOS_JORNADA = {
  padrao: {
    label: "Padrão (44h/semana)",
    horasSemanais: 44,
    desc: "8h/dia de segunda a sexta + 4h aos sábados, ou 8h48 de segunda a sexta — o mais comum.",
  },
  parcial_30: {
    label: "Parcial — até 30h/semana",
    horasSemanais: 30,
    desc: "CLT art. 58-A: até 30h semanais, sem possibilidade de horas extras.",
  },
  parcial_26: {
    label: "Parcial — até 26h/semana + até 6h extras",
    horasSemanais: 26,
    desc: "CLT art. 58-A, §3º: até 26h semanais, com até 6h extras permitidas por semana.",
  },
  escala_12x36: {
    label: "Escala 12x36",
    horasSemanais: 42,
    desc: "12h de trabalho por 36h de descanso — exige acordo individual escrito ou convenção coletiva.",
  },
  turno_revezamento: {
    label: "Turno de revezamento",
    horasSemanais: 36,
    desc: "Turnos alternados (manhã/tarde/noite) — limite de 6h/dia salvo acordo/convenção coletiva.",
  },
};

// Sugestões de CBO ligadas a instalação/manutenção e energia renovável —
// confirme sempre o código exato na busca do eSocial ou em cbo.mte.gov.br
// antes de preencher; usar o código errado distorce o PPP e o FAP/RAT.
export const CBO_SUGESTOES = [
  { codigo: "7156-10", titulo: "Eletricista de instalações (edifícios)" },
  { codigo: "7156-15", titulo: "Eletricista de instalações (geral)" },
  { codigo: "9511-05", titulo: "Eletricista de manutenção eletroeletrônica" },
  { codigo: "7321-40", titulo: "Instalador de sistemas fotovoltaicos" },
];

export const INTERVALO_MINIMO_MIN = { ate6h: 15, acima6h: 60 };
