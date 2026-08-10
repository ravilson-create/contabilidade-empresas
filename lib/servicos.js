// ═══════════════════════════════════════════════════════════════════════════
//  CATÁLOGO DE SERVIÇOS — a "central de atendimento contábil" do app.
// ═══════════════════════════════════════════════════════════════════════════

export const CATEGORIAS = [
  { id: "abrir", nome: "Abrir e regularizar" },
  { id: "impostos", nome: "Impostos e declarações" },
  { id: "funcionarios", nome: "Funcionários" },
  { id: "notas", nome: "Notas fiscais" },
  { id: "encerrar", nome: "Encerramento" },
  { id: "consulta", nome: "Consulta e referência" },
];

export const SERVICOS = [
  {
    id: "abertura",
    categoria: "abrir",
    icone: "🏁",
    titulo: "Abrir minha empresa",
    descricao: "Roteiro personalizado de formalização — MEI ou ME/EPP — com a ordem exata dos passos para o seu caso.",
    recomendadoSe: (p) => p.enquadramento === "ainda_nao_abri",
  },
  {
    id: "pendencias",
    categoria: "abrir",
    icone: "🚨",
    titulo: "Estou com pendências — o que fazer",
    descricao: "Descubra se a empresa ainda é optante do Simples, entenda as multas envolvidas e veja o passo a passo para regularizar declarações atrasadas.",
    recomendadoSe: (p) => p.declaracoesEmDia === "nao" || p.declaracoesEmDia === "nao_sei",
  },
  {
    id: "das-mei",
    categoria: "impostos",
    icone: "🧮",
    titulo: "Calcular e pagar o DAS do MEI",
    descricao: "Calcula o valor do mês, avalia o limite anual e mostra exatamente onde emitir e pagar a guia.",
    recomendadoSe: (p) => p.enquadramento === "mei",
  },
  {
    id: "das-simples",
    categoria: "impostos",
    icone: "🧮",
    titulo: "Apurar o DAS do Simples Nacional",
    descricao: "Para ME/EPP: calcula a alíquota efetiva pelo Anexo correto (com Fator R) e o valor do DAS do mês.",
    recomendadoSe: (p) => p.enquadramento === "meepp",
  },
  {
    id: "dasn-simei",
    categoria: "impostos",
    icone: "📄",
    titulo: "Declaração Anual do MEI (DASN-SIMEI)",
    descricao: "Organiza o faturamento do ano por atividade e gera o resumo pronto para declarar.",
    recomendadoSe: (p) => p.enquadramento === "mei",
  },
  {
    id: "defis",
    categoria: "impostos",
    icone: "📄",
    titulo: "DEFIS — Declaração anual da ME/EPP",
    descricao: "Reúne receita, folha de pagamento e dados societários do ano para a declaração no Simples Nacional.",
    recomendadoSe: (p) => p.enquadramento === "meepp",
  },
  {
    id: "admissao",
    categoria: "funcionarios",
    icone: "🧑‍💼",
    titulo: "Contratar um funcionário",
    descricao: "Calcula FGTS, provisões de 13º/férias e o custo mensal real, com a lista de documentos e o prazo no eSocial.",
    recomendadoSe: (p) => p.enquadramento !== "ainda_nao_abri" && !p.temFuncionarios,
  },
  {
    id: "folha",
    categoria: "funcionarios",
    icone: "💰",
    titulo: "Calcular a folha de pagamento do mês",
    descricao: "INSS, IRRF e salário líquido do empregado, com as tabelas oficiais de 2026.",
    recomendadoSe: (p) => p.temFuncionarios === true,
  },
  {
    id: "nota-fiscal",
    categoria: "notas",
    icone: "🧾",
    titulo: "Saber qual nota fiscal emitir",
    descricao: "Responda a operação e descubra se é NF-e, NFS-e ou NFC-e, e onde emitir.",
    recomendadoSe: (p) => p.enquadramento !== "ainda_nao_abri",
  },
  {
    id: "encerramento",
    categoria: "encerrar",
    icone: "🔒",
    titulo: "Encerrar ou dar baixa na empresa",
    descricao: "Checklist completo para fechar sem deixar pendências que geram dívida e restrição ao CPF.",
    recomendadoSe: () => false,
  },
  {
    id: "calendario",
    categoria: "consulta",
    icone: "📅",
    titulo: "Calendário completo de obrigações",
    descricao: "Todos os prazos recorrentes, filtráveis por MEI, ME ou EPP.",
    recomendadoSe: () => false,
  },
  {
    id: "links",
    categoria: "consulta",
    icone: "🔗",
    titulo: "Diretório de sites oficiais",
    descricao: "Todos os portais do governo usados neste app, organizados por finalidade.",
    recomendadoSe: () => false,
  },
];

export function servicosPorCategoria() {
  return CATEGORIAS.map((cat) => ({
    ...cat,
    servicos: SERVICOS.filter((s) => s.categoria === cat.id),
  })).filter((cat) => cat.servicos.length > 0);
}

export function servicosRecomendados(perfil) {
  if (!perfil) return [];
  return SERVICOS.filter((s) => s.recomendadoSe(perfil));
}
