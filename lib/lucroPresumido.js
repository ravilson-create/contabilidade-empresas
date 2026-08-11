// ═══════════════════════════════════════════════════════════════════════════
//  LUCRO PRESUMIDO — regime de quem está fora do Simples Nacional (por
//  opção ou por exclusão). Apuração trimestral para IRPJ/CSLL; PIS/COFINS
//  são mensais. Base: Lei 9.249/95, art. 15 e 20 (percentuais de
//  presunção); Lei 9.430/96, art. 3º (adicional de IRPJ).
//
//  Atenção — mudança em vigor a partir do 2º trimestre de 2026: uma
//  majoração de 10% passou a incidir sobre os percentuais de presunção do
//  IRPJ/CSLL, por conta da transição da Reforma Tributária. O 1º trimestre
//  de 2026 não tem essa majoração. Confirme com um contador o percentual
//  exato vigente no trimestre da sua apuração antes de fechar a guia.
// ═══════════════════════════════════════════════════════════════════════════

export const PRESUNCAO_IRPJ = {
  comercio_industria: 0.08,
  servico: 0.32,
  transporte_carga: 0.08,
  transporte_passageiros: 0.16,
};

export const PRESUNCAO_CSLL = {
  comercio_industria: 0.12,
  servico: 0.32,
  transporte_carga: 0.12,
  transporte_passageiros: 0.12,
};

export const ALIQUOTA_IRPJ = 0.15;
export const ADICIONAL_IRPJ = 0.1;
export const LIMITE_ADICIONAL_TRIMESTRAL = 60_000; // R$20.000/mês × 3
export const ALIQUOTA_CSLL = 0.09;
export const ALIQUOTA_PIS_CUMULATIVO = 0.0065;
export const ALIQUOTA_COFINS_CUMULATIVO = 0.03;
export const MAJORACAO_PRESUNCAO_2026 = 0.1; // +10% a partir do 2º trimestre/2026

function round2(v) {
  return Math.round((v + Number.EPSILON) * 100) / 100;
}

export function calcularLucroPresumidoTrimestral({ receitaTrimestral, atividade, aliquotaIss = 0, aplicarMajoracao2026 = true }) {
  const fator = aplicarMajoracao2026 ? 1 + MAJORACAO_PRESUNCAO_2026 : 1;
  const presuncaoIrpj = PRESUNCAO_IRPJ[atividade] * fator;
  const presuncaoCsll = PRESUNCAO_CSLL[atividade] * fator;

  const baseIrpj = receitaTrimestral * presuncaoIrpj;
  const baseCsll = receitaTrimestral * presuncaoCsll;

  const irpjNormal = baseIrpj * ALIQUOTA_IRPJ;
  const excedente = Math.max(0, baseIrpj - LIMITE_ADICIONAL_TRIMESTRAL);
  const irpjAdicional = excedente * ADICIONAL_IRPJ;
  const irpjTotal = round2(irpjNormal + irpjAdicional);

  const csll = round2(baseCsll * ALIQUOTA_CSLL);
  const pis = round2(receitaTrimestral * ALIQUOTA_PIS_CUMULATIVO);
  const cofins = round2(receitaTrimestral * ALIQUOTA_COFINS_CUMULATIVO);
  const iss = round2(receitaTrimestral * (aliquotaIss || 0));

  const totalTrimestre = round2(irpjTotal + csll + pis + cofins + iss);

  return {
    presuncaoIrpj,
    presuncaoCsll,
    baseIrpj: round2(baseIrpj),
    baseCsll: round2(baseCsll),
    irpjNormal: round2(irpjNormal),
    irpjAdicional: round2(irpjAdicional),
    irpjTotal,
    csll,
    pis,
    cofins,
    iss,
    totalTrimestre,
  };
}
