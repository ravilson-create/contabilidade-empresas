// ═══════════════════════════════════════════════════════════════════════════
//  SIMPLES NACIONAL — Anexos I a V (LC 123/2006, arts. 18 e 18-A; redação
//  dada pela LC 155/2016, vigente desde 01/01/2018). Valores em vigor em 2026
//  — a Reforma Tributária (EC 132/2023, LC 214/2025) mantém o Simples Nacional
//  como regime facultativo unificado; empresas optantes só passam a destacar
//  IBS/CBS a partir de 2027, permanecendo neste cálculo em 2026.
//
//  Fórmula oficial (LC 123/2006, art. 18, §1º-A):
//    alíquota efetiva = ((RBT12 × alíquota nominal) − parcela a deduzir) / RBT12
//    valor do DAS no mês = receita bruta do mês × alíquota efetiva
// ═══════════════════════════════════════════════════════════════════════════

export const TETO_SIMPLES = 4_800_000;
export const SUBLIMITE_ICMS_ISS = 3_600_000;
export const FATOR_R_MINIMO = 0.28; // 28% — LC 123/2006, art. 18, §5º-J e §5º-M

export const ANEXOS = {
  I: {
    nome: "Anexo I — Comércio",
    exemplos: "Lojas, mercados, papelarias, revenda de mercadorias em geral",
    faixas: [
      { ate: 180_000, aliquota: 0.04, deduzir: 0 },
      { ate: 360_000, aliquota: 0.073, deduzir: 5_940 },
      { ate: 720_000, aliquota: 0.095, deduzir: 13_860 },
      { ate: 1_800_000, aliquota: 0.107, deduzir: 22_500 },
      { ate: 3_600_000, aliquota: 0.143, deduzir: 87_300 },
      { ate: 4_800_000, aliquota: 0.19, deduzir: 378_000 },
    ],
  },
  II: {
    nome: "Anexo II — Indústria",
    exemplos: "Fabricação e transformação de produtos, pequenas manufaturas",
    faixas: [
      { ate: 180_000, aliquota: 0.045, deduzir: 0 },
      { ate: 360_000, aliquota: 0.078, deduzir: 5_940 },
      { ate: 720_000, aliquota: 0.10, deduzir: 13_860 },
      { ate: 1_800_000, aliquota: 0.112, deduzir: 22_500 },
      { ate: 3_600_000, aliquota: 0.147, deduzir: 85_500 },
      { ate: 4_800_000, aliquota: 0.30, deduzir: 720_000 },
    ],
  },
  III: {
    nome: "Anexo III — Serviços (regra geral)",
    exemplos: "Academias, salões, agências, locação de bens móveis, clínicas, instalação/manutenção",
    faixas: [
      { ate: 180_000, aliquota: 0.06, deduzir: 0 },
      { ate: 360_000, aliquota: 0.112, deduzir: 9_360 },
      { ate: 720_000, aliquota: 0.135, deduzir: 17_640 },
      { ate: 1_800_000, aliquota: 0.16, deduzir: 35_640 },
      { ate: 3_600_000, aliquota: 0.21, deduzir: 125_640 },
      { ate: 4_800_000, aliquota: 0.33, deduzir: 648_000 },
    ],
  },
  IV: {
    nome: "Anexo IV — Serviços (construção, limpeza, vigilância, advocacia)",
    exemplos: "Construção civil, vigilância/limpeza, advocacia, serviços ao poder público",
    faixas: [
      { ate: 180_000, aliquota: 0.045, deduzir: 0 },
      { ate: 360_000, aliquota: 0.09, deduzir: 8_100 },
      { ate: 720_000, aliquota: 0.102, deduzir: 12_420 },
      { ate: 1_800_000, aliquota: 0.14, deduzir: 39_780 },
      { ate: 3_600_000, aliquota: 0.22, deduzir: 183_780 },
      { ate: 4_800_000, aliquota: 0.33, deduzir: 828_000 },
    ],
  },
  V: {
    nome: "Anexo V — Serviços intelectuais/técnicos (sujeitos ao Fator R)",
    exemplos: "TI, engenharia, consultoria, publicidade, medicina, arquitetura, auditoria",
    faixas: [
      { ate: 180_000, aliquota: 0.155, deduzir: 0 },
      { ate: 360_000, aliquota: 0.18, deduzir: 4_500 },
      { ate: 720_000, aliquota: 0.195, deduzir: 9_900 },
      { ate: 1_800_000, aliquota: 0.205, deduzir: 17_100 },
      { ate: 3_600_000, aliquota: 0.23, deduzir: 62_100 },
      { ate: 4_800_000, aliquota: 0.305, deduzir: 540_000 },
    ],
  },
};

export function calcularFatorR(folhaPagamento12m, rbt12) {
  if (!rbt12) return 0;
  return folhaPagamento12m / rbt12;
}

// Atividades do Anexo V migram para o Anexo III quando o Fator R ≥ 28%.
export function anexoEfetivo(anexoEscolhido, fatorR) {
  if (anexoEscolhido === "V" && fatorR >= FATOR_R_MINIMO) return "III";
  return anexoEscolhido;
}

function encontrarFaixa(anexo, rbt12) {
  const faixas = ANEXOS[anexo].faixas;
  return faixas.find((f) => rbt12 <= f.ate) || faixas[faixas.length - 1];
}

export function calcularDAS({ anexo, rbt12, receitaMes, folhaPagamento12m = 0 }) {
  if (rbt12 <= 0) {
    return { erro: "Informe a receita bruta acumulada dos últimos 12 meses (RBT12)." };
  }
  if (rbt12 > TETO_SIMPLES) {
    return {
      erro: `RBT12 acima do teto do Simples Nacional (R$ ${TETO_SIMPLES.toLocaleString("pt-BR")}). A empresa deve ser desenquadrada e tributada por Lucro Presumido ou Lucro Real.`,
    };
  }

  const fatorR = anexo === "V" ? calcularFatorR(folhaPagamento12m, rbt12) : null;
  const anexoUsado = anexo === "V" ? anexoEfetivo(anexo, fatorR) : anexo;
  const faixa = encontrarFaixa(anexoUsado, rbt12);
  const aliquotaEfetiva = (rbt12 * faixa.aliquota - faixa.deduzir) / rbt12;
  const valorDAS = Math.max(0, receitaMes * aliquotaEfetiva);
  const acimaDoSublimite = rbt12 > SUBLIMITE_ICMS_ISS;

  return {
    anexoUsado,
    fatorR,
    faixa,
    aliquotaNominal: faixa.aliquota,
    aliquotaEfetiva,
    valorDAS,
    acimaDoSublimite,
  };
}

export function fmtBRL(v) {
  return Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function fmtPct(v, casas = 2) {
  return `${(Number(v || 0) * 100).toFixed(casas)}%`;
}
