// ═══════════════════════════════════════════════════════════════════════════
//  RBT12 — Receita Bruta Total dos últimos 12 meses (LC 123/2006, art. 18).
//  Soma da receita bruta dos 12 meses ANTERIORES ao mês de apuração (PA).
//  Empresas com menos de 12 meses de atividade usam a fórmula proporcional
//  do art. 18, §2º.
// ═══════════════════════════════════════════════════════════════════════════

const NOMES_MES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

// Gera os 12 meses imediatamente anteriores ao mês de apuração informado
// (mesRef 1-12, anoRef ex. 2026), do mais antigo para o mais recente.
export function meses12Anteriores(mesRef, anoRef) {
  const meses = [];
  for (let i = 12; i >= 1; i--) {
    let m = mesRef - i;
    let a = anoRef;
    while (m <= 0) {
      m += 12;
      a -= 1;
    }
    meses.push({ mes: m, ano: a, label: `${NOMES_MES[m - 1]}/${a}` });
  }
  return meses;
}

export function somarRBT12(valoresPorMes) {
  return valoresPorMes.reduce((soma, v) => soma + (Number(v) || 0), 0);
}

// LC 123/2006, art. 18, §2º — empresa com menos de 12 meses de atividade.
export function calcularRBT12Proporcional(receitaAcumulada, mesesAtividade) {
  if (!mesesAtividade || mesesAtividade <= 0) return 0;
  return (receitaAcumulada / mesesAtividade) * 12;
}

// Aceita colar uma lista de valores — um por linha (o jeito mais comum de
// colar uma coluna copiada de uma planilha ou de um extrato do PGDAS-D),
// ou separados por ponto e vírgula/tab — no formato brasileiro (1.234,56)
// ou simples (1234.56). Não separa por vírgula simples, pois ela é o
// separador decimal brasileiro dentro de cada valor.
export function parseListaValores(texto) {
  return String(texto || "")
    .split(/[\n;\t]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const limpo = s.replace(/[^\d,.-]/g, "");
      const normalizado = limpo.includes(",") ? limpo.replace(/\./g, "").replace(",", ".") : limpo;
      const v = parseFloat(normalizado);
      return Number.isFinite(v) ? v : null;
    });
}
