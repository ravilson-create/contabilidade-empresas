// ═══════════════════════════════════════════════════════════════════════════
//  RETENÇÕES EM NOTA FISCAL DE SERVIÇOS — o que o tomador desconta na hora
//  de pagar. Três regimes distintos, que podem se sobrepor:
//
//  1) INSS 11% (Lei 8.212/91, art. 31; IN RFB 971/2009) — cessão de mão de
//     obra ou empreitada: construção civil, instalação, montagem,
//     manutenção, limpeza, vigilância, entre outras atividades listadas.
//     Incide só sobre a mão de obra (se a nota discrimina materiais à
//     parte, eles ficam de fora da base).
//  2) IRRF 1,5% (RIR/2018, art. 714) — serviços profissionais específicos
//     entre PJ e PJ (inclui engenharia, exceto construção de estradas/
//     pontes/prédios/obras assemelhadas).
//  3) PIS/COFINS/CSLL 4,65% (Lei 10.833/2003, art. 30) — limpeza,
//     conservação, segurança, vigilância, transporte de valores e locação
//     de mão de obra, entre pessoas jurídicas de direito privado.
//
//  Regra geral: optante do Simples Nacional é isento das retenções 2 e 3,
//  e da 1 também — EXCETO quando enquadrado no Anexo IV, que já recolhe a
//  CPP patronal por fora do DAS (aí a retenção do INSS volta a valer,
//  tipicamente na alíquota cheia de 11%).
//
//  Isto é orientação, não um parecer definitivo — a classificação exata
//  (cessão de mão de obra x empreitada x serviço avulso) depende do
//  contrato. Confirme com um contador antes de aplicar.
// ═══════════════════════════════════════════════════════════════════════════

function round2(v) {
  return Math.round((v + Number.EPSILON) * 100) / 100;
}

export const CATEGORIAS_SERVICO = {
  cessao_mao_obra: {
    label: "Construção civil, instalação, montagem, manutenção ou limpeza contínua",
    desc: "Atividades sujeitas à retenção de INSS por cessão de mão de obra/empreitada (IN RFB 971/2009).",
  },
  profissional_especifico: {
    label: "Serviço profissional específico (engenharia, auditoria, consultoria, perícia etc.)",
    desc: "Sujeito à retenção de IRRF de 1,5% quando o tomador é PJ (RIR/2018, art. 714).",
  },
  limpeza_vigilancia: {
    label: "Limpeza, conservação, segurança, vigilância, transporte de valores ou locação de mão de obra",
    desc: "Sujeito à retenção conjunta de PIS/COFINS/CSLL de 4,65% quando o tomador é PJ privada (Lei 10.833/2003, art. 30).",
  },
  outro: {
    label: "Outro serviço, sem enquadramento nas hipóteses acima",
    desc: "Em geral não há retenção específica — confirme mesmo assim se o tomador for órgão público.",
  },
};

export const TOMADORES = {
  pf: { label: "Pessoa física" },
  pj_privada: { label: "Pessoa jurídica privada" },
  orgao_publico: { label: "Órgão público (federal, estadual ou municipal)" },
};

export function avaliarRetencoes({ categoriaServico, tomador, valorNota, valorMateriais = 0, simplesNacional, anexo }) {
  const baseServico = Math.max(0, valorNota - valorMateriais);
  const ehAnexoIV = simplesNacional && anexo === "IV";
  const isentoPorSimples = simplesNacional && !ehAnexoIV;

  const resultado = { baseServico, itens: [] };

  // 1) INSS — cessão de mão de obra/empreitada
  if (categoriaServico === "cessao_mao_obra" && tomador !== "pf") {
    if (!simplesNacional) {
      resultado.itens.push({
        tributo: "INSS (retenção previdenciária)",
        aliquota: 0.11,
        valor: round2(baseServico * 0.11),
        base: "Lei 8.212/91, art. 31",
      });
    } else if (ehAnexoIV) {
      resultado.itens.push({
        tributo: "INSS (retenção previdenciária) — empresa no Anexo IV do Simples",
        aliquota: 0.11,
        valor: round2(baseServico * 0.11),
        base: "LC 123/2006 c/c Lei 8.212/91, art. 31",
      });
    }
    // demais anexos do Simples: isento (CPP já embutida no DAS)
  }

  // 2) IRRF 1,5% — serviço profissional específico, PJ para PJ
  if (categoriaServico === "profissional_especifico" && tomador === "pj_privada" && !simplesNacional) {
    resultado.itens.push({
      tributo: "IRRF (retenção na fonte)",
      aliquota: 0.015,
      valor: round2(baseServico * 0.015),
      base: "RIR/2018 (Decreto 9.580/2018), art. 714",
    });
  }

  // 3) PIS/COFINS/CSLL 4,65% — limpeza/vigilância/locação de mão de obra, PJ para PJ
  if (categoriaServico === "limpeza_vigilancia" && tomador === "pj_privada" && !simplesNacional) {
    resultado.itens.push({
      tributo: "PIS/COFINS/CSLL (retenção conjunta)",
      aliquota: 0.0465,
      valor: round2(baseServico * 0.0465),
      base: "Lei 10.833/2003, art. 30",
    });
  }

  // Órgão público federal: retenção combinada de IRPJ+CSLL+PIS+COFINS (IN 1234/2012),
  // dispensada para optantes do Simples Nacional mediante declaração.
  if (tomador === "orgao_publico" && !simplesNacional && resultado.itens.length === 0) {
    resultado.itens.push({
      tributo: "IRPJ/CSLL/PIS/COFINS (retenção combinada — órgão público)",
      aliquota: null,
      valor: null,
      base: "IN RFB 1.234/2012 — alíquota varia pelo tipo de serviço (Anexo I da norma); confirme com o órgão contratante",
    });
  }

  resultado.isentoPorSimples = isentoPorSimples;
  resultado.totalRetido = round2(resultado.itens.reduce((s, i) => s + (i.valor || 0), 0));
  resultado.valorLiquido = round2(valorNota - resultado.totalRetido);
  return resultado;
}
