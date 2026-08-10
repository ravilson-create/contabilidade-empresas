// ═══════════════════════════════════════════════════════════════════════════
//  CALENDÁRIO DE OBRIGAÇÕES RECORRENTES
//  Prazos gerais — quando o vencimento cai em dia sem expediente bancário,
//  antecipa-se para o dia útil anterior (regra do Simples Nacional).
// ═══════════════════════════════════════════════════════════════════════════

export const OBRIGACOES = [
  {
    regime: ["MEI"],
    nome: "DAS-MEI",
    periodicidade: "Mensal",
    prazo: "Até o dia 20 de cada mês",
    descricao: "Guia única com INSS + ICMS/ISS fixos. Gerada no Portal do Empreendedor (PGMEI).",
    base: "Resolução CGSN nº 140/2018",
  },
  {
    regime: ["MEI"],
    nome: "DASN-SIMEI (declaração anual)",
    periodicidade: "Anual",
    prazo: "Até 31 de maio",
    descricao: "Declaração do faturamento total do ano anterior. Obrigatória mesmo sem movimento (declaração 'sem movimento').",
    base: "Resolução CGSN nº 140/2018, art. 66",
  },
  {
    regime: ["ME", "EPP"],
    nome: "PGDAS-D (apuração) + DAS",
    periodicidade: "Mensal",
    prazo: "Apuração e pagamento até o dia 20 do mês seguinte",
    descricao: "Declaração do faturamento do mês no Portal do Simples Nacional, que calcula e gera o DAS a pagar.",
    base: "Resolução CGSN nº 140/2018",
  },
  {
    regime: ["ME", "EPP"],
    nome: "DEFIS (Declaração de Informações Socioeconômicas e Fiscais)",
    periodicidade: "Anual",
    prazo: "Até 31 de março",
    descricao: "Declaração anual consolidada de receitas, folha de pagamento e informações societárias das optantes pelo Simples Nacional.",
    base: "Resolução CGSN nº 140/2018, art. 68",
  },
  {
    regime: ["MEI", "ME", "EPP"],
    nome: "eSocial (se houver empregados)",
    periodicidade: "Mensal / por evento",
    prazo: "Eventos periódicos (folha) até dia 15 do mês seguinte; eventos não periódicos (admissão) antes do início do trabalho",
    descricao: "Admissões, afastamentos, férias e folha de pagamento de empregados CLT, inclusive o único empregado que o MEI pode ter.",
    base: "Decreto 8.373/2014",
  },
  {
    regime: ["MEI", "ME", "EPP"],
    nome: "FGTS Digital",
    periodicidade: "Mensal",
    prazo: "Até o dia 20",
    descricao: "Recolhimento do FGTS (8% da remuneração) de cada empregado.",
    base: "Lei 8.036/1990",
  },
  {
    regime: ["ME", "EPP"],
    nome: "Escrituração contábil (livro diário/razão)",
    periodicidade: "Contínua / anual",
    prazo: "Mantida ao longo do ano, com balanço de encerramento",
    descricao: "Obrigatória para toda ME/EPP (exceto MEI), feita por contador habilitado — mesmo optantes do Simples Nacional.",
    base: "Código Civil, art. 1.179; Resolução CFC nº 1.330/2011",
  },
  {
    regime: ["MEI"],
    nome: "Relatório Mensal de Receitas Brutas (livro caixa do MEI)",
    periodicidade: "Mensal",
    prazo: "Preenchido mês a mês, guardado com as notas fiscais",
    descricao: "Controle simplificado de receitas que substitui a contabilidade formal para o MEI.",
    base: "Resolução CGSN nº 140/2018, art. 65",
  },
  {
    regime: ["MEI", "ME", "EPP"],
    nome: "Renovação do Alvará de Funcionamento",
    periodicidade: "Anual (varia por município)",
    prazo: "Conforme calendário da Prefeitura local",
    descricao: "Muitos municípios exigem renovação ou taxa anual de funcionamento — confirme o prazo na sua Prefeitura.",
    base: "Legislação municipal",
  },
  {
    regime: ["ME", "EPP"],
    nome: "Nota Fiscal Eletrônica (NF-e/NFS-e/NFC-e)",
    periodicidade: "Contínua",
    prazo: "Emitida a cada venda ou serviço prestado",
    descricao: "Emissão obrigatória a cada operação, mesmo dentro do Simples Nacional.",
    base: "Legislação estadual/municipal",
  },
];

export function obrigacoesPorRegime(regime) {
  return OBRIGACOES.filter((o) => o.regime.includes(regime));
}
