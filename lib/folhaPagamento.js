// ═══════════════════════════════════════════════════════════════════════════
//  FOLHA DE PAGAMENTO — INSS (empregado) e IRRF, tabelas de 2026.
//  INSS: alíquotas progressivas sobre o salário de contribuição
//  (Portaria Interministerial MPS/MF, reajuste anual). Teto: R$ 8.475,55.
//  IRRF: tabela progressiva mensal, inalterada desde maio/2023, ACRESCIDA do
//  redutor de 2026 que zera o imposto até R$ 5.000 e reduz parcialmente até
//  R$ 7.350 (isenção do Imposto de Renda para quem ganha até R$ 5 mil).
// ═══════════════════════════════════════════════════════════════════════════

export const TETO_INSS_2026 = 8_475.55;

export const FAIXAS_INSS_2026 = [
  { ate: 1_621.00, aliquota: 0.075 },
  { ate: 2_902.84, aliquota: 0.09 },
  { ate: 4_354.27, aliquota: 0.12 },
  { ate: 8_475.55, aliquota: 0.14 },
];

// Tabela progressiva do IRRF — vigente desde maio/2023, mantida em 2026.
export const FAIXAS_IRRF = [
  { ate: 2_259.20, aliquota: 0, deduzir: 0 },
  { ate: 2_826.65, aliquota: 0.075, deduzir: 169.44 },
  { ate: 3_751.05, aliquota: 0.15, deduzir: 381.44 },
  { ate: 4_664.68, aliquota: 0.225, deduzir: 662.77 },
  { ate: Infinity, aliquota: 0.275, deduzir: 896.00 },
];

export const DEDUCAO_POR_DEPENDENTE = 189.59;

// Redutor do IRRF 2026 (isenção até R$ 5.000, redução parcial até R$ 7.350).
export const LIMITE_ISENCAO_REDUTOR = 5_000;
export const LIMITE_REDUCAO_PARCIAL = 7_350;

function round2(v) {
  return Math.round((v + Number.EPSILON) * 100) / 100;
}

export function calcularINSS(salarioBruto) {
  let inss = 0;
  let anterior = 0;
  for (const f of FAIXAS_INSS_2026) {
    if (salarioBruto <= anterior) break;
    const baseFaixa = Math.min(salarioBruto, f.ate) - anterior;
    inss += baseFaixa * f.aliquota;
    anterior = f.ate;
  }
  return round2(inss);
}

// Igual a calcularINSS, mas devolve a "memória de cálculo" faixa a faixa —
// para mostrar a conta completa, como um contador mostraria no papel.
export function detalharINSS(salarioBruto) {
  const linhas = [];
  let anterior = 0;
  for (const f of FAIXAS_INSS_2026) {
    if (salarioBruto <= anterior) break;
    const baseFaixa = Math.min(salarioBruto, f.ate) - anterior;
    linhas.push({ de: anterior, ate: Math.min(salarioBruto, f.ate), aliquota: f.aliquota, base: round2(baseFaixa), valor: round2(baseFaixa * f.aliquota) });
    anterior = f.ate;
  }
  return linhas;
}

// Cálculo estimado — o redutor legal de 2026 usa fórmula própria da Receita
// Federal; aqui aplicamos uma aproximação linear entre R$5.000 (imposto
// zero) e R$7.350 (imposto integral da tabela), sinalizada como estimativa.
export function calcularIRRF({ salarioBruto, inss, dependentes = 0 }) {
  const baseComDeducoes = Math.max(0, salarioBruto - inss - dependentes * DEDUCAO_POR_DEPENDENTE);
  const faixa = FAIXAS_IRRF.find((f) => baseComDeducoes <= f.ate);
  const impostoTabela = Math.max(0, baseComDeducoes * faixa.aliquota - faixa.deduzir);

  const rendimentoReferencia = salarioBruto - inss;
  let irrf;
  let aplicouRedutor = false;
  if (rendimentoReferencia <= LIMITE_ISENCAO_REDUTOR) {
    irrf = 0;
    aplicouRedutor = impostoTabela > 0;
  } else if (rendimentoReferencia <= LIMITE_REDUCAO_PARCIAL) {
    const fator = (rendimentoReferencia - LIMITE_ISENCAO_REDUTOR) / (LIMITE_REDUCAO_PARCIAL - LIMITE_ISENCAO_REDUTOR);
    irrf = impostoTabela * fator;
    aplicouRedutor = true;
  } else {
    irrf = impostoTabela;
  }
  return { baseCalculo: round2(baseComDeducoes), impostoTabela: round2(impostoTabela), irrf: round2(irrf), aplicouRedutor };
}

export function calcularFGTS(salarioBruto) {
  return round2(salarioBruto * 0.08);
}

export function calcularFolhaMensal({ salarioBruto, dependentes = 0, outrosDescontos = 0 }) {
  const inss = calcularINSS(salarioBruto);
  const { irrf, aplicouRedutor, baseCalculo } = calcularIRRF({ salarioBruto, inss, dependentes });
  const fgts = calcularFGTS(salarioBruto); // depositado pelo empregador, não desconta do líquido
  const salarioLiquido = round2(salarioBruto - inss - irrf - outrosDescontos);
  return { salarioBruto, inss, irrf, aplicouRedutor, baseCalculo, fgts, outrosDescontos, salarioLiquido };
}

// Encargos e provisões mensais de manter um empregado (para orçamento do empresário).
export function calcularEncargosAdmissao({ salarioBruto, anexoSimples }) {
  const fgtsMensal = calcularFGTS(salarioBruto);
  const provisao13 = round2(salarioBruto / 12);
  const provisaoFerias = round2((salarioBruto / 12) * (4 / 3)); // 1/12 do salário + 1/3
  const fgtsSobre13eFerias = round2((provisao13 + provisaoFerias) * 0.08);
  const multaFgtsRescisao = round2(salarioBruto * 0.08 * 0.4); // referência: só se demitir sem justa causa, por mês de FGTS acumulado

  // Anexo IV do Simples Nacional recolhe a CPP patronal (~20%) por fora do DAS;
  // os demais anexos já têm a CPP embutida na alíquota do DAS.
  const cppPatronalPorFora = anexoSimples === "IV" ? round2(salarioBruto * 0.20) : 0;

  const custoMensalEstimado = round2(salarioBruto + fgtsMensal + provisao13 + provisaoFerias + cppPatronalPorFora);

  return { fgtsMensal, provisao13, provisaoFerias, fgtsSobre13eFerias, multaFgtsRescisao, cppPatronalPorFora, custoMensalEstimado };
}
