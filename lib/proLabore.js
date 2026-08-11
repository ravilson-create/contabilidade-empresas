// ═══════════════════════════════════════════════════════════════════════════
//  PRÓ-LABORE DO SÓCIO — diferente do salário de empregado: o sócio
//  contribui como "contribuinte individual", numa alíquota fixa de 11%
//  (não a tabela progressiva do empregado), com teto próprio de
//  contribuição. A parte patronal (CPP) só é cobrada por fora quando a
//  empresa não tem a CPP embutida no DAS.
//  Base: Lei 8.212/91, art. 21 e 22, III; Lei 10.666/2003, art. 4º.
// ═══════════════════════════════════════════════════════════════════════════

import { TETO_INSS_2026, calcularIRRF } from "./folhaPagamento.js";

export const ALIQUOTA_INSS_PROLABORE = 0.11;
export const ALIQUOTA_CPP_PATRONAL_PROLABORE = 0.2;

function round2(v) {
  return Math.round((v + Number.EPSILON) * 100) / 100;
}

export function calcularINSSProLabore(valorBruto) {
  const base = Math.min(valorBruto, TETO_INSS_2026);
  return round2(base * ALIQUOTA_INSS_PROLABORE);
}

// CPP patronal sobre o pró-labore: já embutida no DAS para quem está nos
// Anexos I, II, III e V do Simples Nacional. Recolhida por fora, sem teto,
// para o Anexo IV e para quem está fora do Simples (Lucro Presumido/Real).
export function calcularCPPPatronalProLabore(valorBruto, { simplesNacional, anexo }) {
  const embutidaNoDas = simplesNacional && anexo !== "IV";
  if (embutidaNoDas) return { valor: 0, embutidaNoDas: true };
  return { valor: round2(valorBruto * ALIQUOTA_CPP_PATRONAL_PROLABORE), embutidaNoDas: false };
}

export function calcularProLabore({ valorBruto, dependentes = 0, simplesNacional, anexo }) {
  const inss = calcularINSSProLabore(valorBruto);
  const { irrf, aplicouRedutor, baseCalculo } = calcularIRRF({ salarioBruto: valorBruto, inss, dependentes });
  const cpp = calcularCPPPatronalProLabore(valorBruto, { simplesNacional, anexo });
  const liquido = round2(valorBruto - inss - irrf);
  return { valorBruto, inss, irrf, aplicouRedutor, baseCalculo, cppPatronal: cpp.valor, cppEmbutidaNoDas: cpp.embutidaNoDas, liquido };
}
