// ═══════════════════════════════════════════════════════════════════════════
//  MEI — Microempreendedor Individual (LC 123/2006, art. 18-A, incluído pela
//  LC 128/2008; Resolução CGSN nº 140/2018 e alterações).
//  Valores vigentes em 2026 (salário mínimo R$ 1.621,00 — Dec. do reajuste
//  anual). O DAS-MEI é fixo (não incide sobre o faturamento do mês) e reúne:
//    • INSS patronal simplificado: 5% do salário mínimo
//    • ICMS fixo: R$ 1,00/mês, se a atividade envolve comércio ou indústria
//    • ISS fixo: R$ 5,00/mês, se a atividade envolve prestação de serviço
//  Esses valores mudam todo ano com o salário mínimo — confira no site do
//  Simples Nacional antes de pagar (link na aba "Links oficiais").
// ═══════════════════════════════════════════════════════════════════════════

export const SALARIO_MINIMO_2026 = 1_621;
export const LIMITE_MEI_ANUAL = 81_000;
export const LIMITE_MEI_CAMINHONEIRO_ANUAL = 251_600;
export const TOLERANCIA_EXCESSO = 0.2; // até 20% acima do limite: continua no MEI até dez, com DAS complementar

export const TIPOS_ATIVIDADE_MEI = {
  comercio_industria: { label: "Comércio ou Indústria (ICMS)", icms: 1, iss: 0 },
  servico: { label: "Prestação de serviço (ISS)", icms: 0, iss: 5 },
  comercio_e_servico: { label: "Comércio/Indústria + Serviço", icms: 1, iss: 5 },
};

export function calcularDASMEI(tipoAtividade, caminhoneiro = false) {
  const cfg = TIPOS_ATIVIDADE_MEI[tipoAtividade];
  if (!cfg) return { erro: "Selecione o tipo de atividade." };
  const inss = Math.round(SALARIO_MINIMO_2026 * 0.05 * 100) / 100;
  const total = inss + cfg.icms + cfg.iss + (caminhoneiro ? SALARIO_MINIMO_2026 * 0.12 - inss : 0);
  return {
    inss,
    icms: cfg.icms,
    iss: cfg.iss,
    total: Math.round(total * 100) / 100,
  };
}

export function avaliarLimiteMEI(faturamentoAnualProjetado, caminhoneiro = false) {
  const limite = caminhoneiro ? LIMITE_MEI_CAMINHONEIRO_ANUAL : LIMITE_MEI_ANUAL;
  const limiteComTolerancia = limite * (1 + TOLERANCIA_EXCESSO);
  if (faturamentoAnualProjetado <= limite) {
    return { status: "ok", mensagem: "Dentro do limite anual do MEI." };
  }
  if (faturamentoAnualProjetado <= limiteComTolerancia) {
    return {
      status: "excesso_tolerado",
      mensagem:
        "Ultrapassou o limite, mas dentro da tolerância de 20%. Continua como MEI até 31/12, mas deve pagar um DAS complementar sobre o excedente (guia avulsa, sem multa) e migrar para ME no ano seguinte.",
    };
  }
  return {
    status: "desenquadramento",
    mensagem:
      "Ultrapassou o limite em mais de 20%. O desenquadramento é retroativo a 1º de janeiro do próprio ano-calendário: a empresa deve migrar para Microempresa (Simples Nacional) e pode haver diferença de tributos a recolher.",
  };
}
