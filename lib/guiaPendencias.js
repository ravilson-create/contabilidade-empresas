// ═══════════════════════════════════════════════════════════════════════════
//  REGULARIZAÇÃO DE PENDÊNCIAS — empresa que ficou tempo sem declarar/pagar.
//  Base: LC 123/2006; Resolução CGSN nº 140/2018 (art. 94 — multa por atraso
//  na entrega do PGDAS-D/DASN-SIMEI); Resolução CGSN nº 183/2025 (novas
//  regras de multa vigentes a partir de 01/01/2026); LC 214/2025 (Reforma
//  Tributária — alterou a janela de opção pelo Simples para CNPJs já
//  constituídos, de janeiro para setembro, com efeito em 1º de janeiro do
//  ano seguinte).
// ═══════════════════════════════════════════════════════════════════════════

export const MULTA_ATRASO_DECLARACAO = {
  aliquotaMes: 0.02, // 2% ao mês-calendário ou fração sobre o imposto informado
  minimoPorDeclaracao: 50,
};

export function checklistPendencias({ enquadramento, situacao }) {
  const portalDeclaracao = enquadramento === "mei" ? "PGMEI/DASN-SIMEI" : "PGDAS-D";

  if (situacao === "nao_sei") {
    return [
      {
        titulo: "1. Descubra a situação atual — consulta pública, sem login",
        texto:
          "No Portal do Simples Nacional, use 'Consulta Optantes' informando o CNPJ. É gratuito, não pede senha nem certificado digital, e mostra se a empresa ainda é optante ou já foi excluída, com a data e o histórico.",
        base: "Resolução CGSN nº 140/2018",
      },
      {
        titulo: "2. Veja o detalhe das pendências no e-CAC",
        texto:
          "Com login gov.br (ou certificado digital), acesse o e-CAC e confira a Caixa Postal (DTE) — é lá que chegam o Relatório de Pendências e um eventual Termo de Exclusão, com os valores e prazos exatos.",
        base: "e-CAC — Receita Federal",
      },
      {
        titulo: "3. Volte a este serviço com o resultado",
        texto:
          "Depois de saber se a empresa ainda é optante ou já foi excluída, refaça este passo a passo escolhendo a opção certa — o roteiro muda bastante entre os dois casos.",
        base: null,
      },
    ];
  }

  if (situacao === "ainda_optante") {
    return [
      {
        titulo: "1. Levante as competências (meses) em atraso",
        texto: `No ${portalDeclaracao}, veja quais meses estão sem declaração entregue. Anote todos antes de começar a regularizar.`,
        base: "Resolução CGSN nº 140/2018",
      },
      {
        titulo: "2. Reconstitua a receita bruta de cada mês em atraso",
        texto:
          "Use as notas fiscais emitidas, extratos bancários ou o livro caixa do período — nunca estime de cabeça. Se faltarem notas, esse é o momento de organizar o histórico com calma.",
        base: null,
      },
      {
        titulo: "3. Transmita as declarações em ordem cronológica",
        texto: `O sistema normalmente exige que você entregue as declarações atrasadas do mais antigo para o mais recente antes de liberar a apuração do mês atual.`,
        base: null,
      },
      {
        titulo: "4. Pague o DAS de cada mês, com multa e juros",
        texto:
          "A multa por atraso na entrega da declaração é de 2% ao mês-calendário (ou fração) sobre o imposto informado, com mínimo de R$ 50,00 por declaração — sem contar a multa de mora e os juros Selic sobre o DAS pago em atraso. Quanto antes regularizar, menor a conta.",
        base: "Resolução CGSN nº 140/2018, art. 94 (regras atualizadas pela Resolução CGSN nº 183/2025, vigentes desde 01/01/2026)",
      },
      {
        titulo: "5. Avalie o parcelamento se o valor total for alto",
        texto:
          "O Simples Nacional permite parcelar débitos em atraso pelo próprio Portal do Simples Nacional ou e-CAC — pode ser a diferença entre conseguir regularizar ou não.",
        base: null,
      },
      {
        titulo: "6. Regularizar antes de ser notificado costuma sair mais barato",
        texto:
          "Se você regularizar por conta própria antes de qualquer notificação formal da Receita (denúncia espontânea), normalmente evita penalidades mais pesadas associadas a uma fiscalização iniciada.",
        base: "Código Tributário Nacional, art. 138",
      },
    ];
  }

  // situacao === "excluida"
  return [
    {
      titulo: "1. Confirme o motivo e o prazo no Termo de Exclusão",
      texto:
        "No e-CAC (Caixa Postal/DTE), veja o Termo de Exclusão e o Relatório de Pendências. Se a ciência do termo foi há menos de 30 dias, quitar TODAS as pendências listadas torna a exclusão automaticamente sem efeito.",
      base: "Resolução CGSN nº 140/2018",
    },
    {
      titulo: "2. Entenda que, enquanto excluída, o regime de tributação muda",
      texto:
        "Fora do Simples Nacional, a empresa passa a ser tributada normalmente (em geral Lucro Presumido) — isso muda completamente como os impostos do período são apurados, não é só o DAS. É um ponto de atenção para não deixar de recolher outros tributos nesse intervalo.",
      base: null,
    },
    {
      titulo: "3. Quite ou parcele as dívidas do Relatório de Pendências",
      texto:
        "Avalie pagamento à vista, parcelamento ou transação tributária para os débitos pendentes — todas as opções ficam disponíveis no Portal do Simples Nacional ou no e-CAC.",
      base: null,
    },
    {
      titulo: "4. Solicite nova opção pelo Simples Nacional na janela do ano",
      texto:
        "Para empresas já existentes (não é abertura nova), a partir da Reforma Tributária a janela de opção passou de janeiro para setembro de cada ano, com efeito a partir de 1º de janeiro do ano seguinte. Como é uma mudança recente, confirme a janela exata do ano vigente diretamente no Portal do Simples Nacional antes de contar com uma data.",
      base: "LC 214/2025",
    },
    {
      titulo: "5. Contrate um contador para esse período de transição",
      texto:
        "Entre a exclusão e o reingresso, a apuração de impostos é mais complexa (fora do Simples). Um contador evita erro de recolhimento nesse intervalo, que pode gerar autuação adicional.",
      base: "Código Civil, art. 1.179",
    },
  ];
}
