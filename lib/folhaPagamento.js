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

// tipo controla duas coisas que mudam por vínculo: a alíquota do FGTS
// (2% para aprendiz, 8% para os demais) e se há desconto de INSS — o
// estagiário não é segurado obrigatório, então não há INSS a descontar.
export function calcularFolhaMensal({ salarioBruto, dependentes = 0, outrosDescontos = 0, tipo = "clt" }) {
  const semINSS = tipo === "estagiario";
  const aliquotaFgts = tipo === "aprendiz" ? 0.02 : 0.08;
  const inss = semINSS ? 0 : calcularINSS(salarioBruto);
  const { irrf, aplicouRedutor, baseCalculo } = calcularIRRF({ salarioBruto, inss, dependentes });
  const fgts = semINSS ? 0 : round2(salarioBruto * aliquotaFgts); // depositado pelo empregador, não desconta do líquido
  const salarioLiquido = round2(salarioBruto - inss - irrf - outrosDescontos);
  return { salarioBruto, inss, irrf, aplicouRedutor, baseCalculo, fgts, aliquotaFgts, semINSS, outrosDescontos, salarioLiquido };
}

// ═══════════════════════════════════════════════════════════════════════════
//  TIPOS DE VÍNCULO — os encargos mudam de verdade conforme o tipo de
//  trabalhador. Tratar tudo como "CLT comum" é a simplificação que gera
//  conta errada; cada tipo tem sua própria base legal e alíquotas.
// ═══════════════════════════════════════════════════════════════════════════

export const TIPOS_VINCULO = {
  clt: {
    label: "Empregado CLT (comum)",
    desc: "Vínculo empregatício padrão, por prazo indeterminado ou determinado.",
  },
  aprendiz: {
    label: "Jovem Aprendiz",
    desc: "14 a 24 anos (sem limite para PCD), contrato de até 2 anos, vinculado a um curso de aprendizagem.",
  },
  domestico: {
    label: "Empregado doméstico",
    desc: "Trabalha na residência da família — regime próprio (Simples Doméstico, LC 150/2015), não passa pelo Simples Nacional da empresa.",
  },
  estagiario: {
    label: "Estagiário",
    desc: "Não gera vínculo empregatício (Lei 11.788/2008) — é bolsa-auxílio, não salário.",
  },
};

// Encargos e provisões mensais de manter um trabalhador (para orçamento do
// empresário) — varia por tipo de vínculo:
//  • Aprendiz: FGTS reduzido a 2% (Lei 10.097/2000), CPP patronal normal.
//  • Doméstico: FGTS 8% + 3,2% compulsório (antecipação da multa rescisória),
//    INSS patronal 8% + SAT 0,8% — regime próprio, fora do Simples Nacional.
//  • MEI com empregado: CPP patronal reduzida a 3% (LC 123/2006, art. 18-C, §1º).
//  • Estagiário: sem FGTS e sem INSS patronal — não é empregado.
export function calcularEncargosAdmissao({ tipo = "clt", salarioBruto, anexoSimples, ehMei = false }) {
  if (tipo === "estagiario") {
    const provisaoRecesso = round2(salarioBruto / 12); // 30 dias de recesso remunerado/ano, proporcional
    return {
      tipo,
      semVinculoEmpregaticio: true,
      provisaoRecesso,
      itensPatronais: [],
      custoMensalEstimado: round2(salarioBruto + provisaoRecesso),
    };
  }

  const aliquotaFgts = tipo === "aprendiz" ? 0.02 : 0.08;
  const fgtsMensal = round2(salarioBruto * aliquotaFgts);
  const provisao13 = round2(salarioBruto / 12);
  const provisaoFerias = round2((salarioBruto / 12) * (4 / 3)); // 1/12 do salário + 1/3
  const fgtsSobre13eFerias = round2((provisao13 + provisaoFerias) * aliquotaFgts);
  const multaFgtsRescisao = round2(salarioBruto * aliquotaFgts * 0.4); // referência: só se demitir sem justa causa

  let itensPatronais = [];
  if (tipo === "domestico") {
    itensPatronais = [
      { label: "FGTS compulsório (antecipação da multa rescisória, 3,2%)", valor: round2(salarioBruto * 0.032) },
      { label: "INSS patronal doméstico (8%)", valor: round2(salarioBruto * 0.08) },
      { label: "Seguro contra acidentes de trabalho — SAT (0,8%)", valor: round2(salarioBruto * 0.008) },
    ];
  } else if (ehMei) {
    itensPatronais = [{ label: "CPP patronal do MEI (3%, reduzida — LC 123/2006, art. 18-C)", valor: round2(salarioBruto * 0.03) }];
  } else if (anexoSimples === "IV") {
    itensPatronais = [{ label: "CPP patronal (20%, recolhida fora do DAS — Anexo IV)", valor: round2(salarioBruto * 0.2) }];
  }

  const totalPatronal = round2(itensPatronais.reduce((s, i) => s + i.valor, 0));
  const custoMensalEstimado = round2(salarioBruto + fgtsMensal + provisao13 + provisaoFerias + totalPatronal);

  return { tipo, aliquotaFgts, fgtsMensal, provisao13, provisaoFerias, fgtsSobre13eFerias, multaFgtsRescisao, itensPatronais, custoMensalEstimado };
}
