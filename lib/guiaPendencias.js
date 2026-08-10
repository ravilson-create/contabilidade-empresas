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
          "No Portal do Simples Nacional, use 'Consulta Optantes' informando o CNPJ. É gratuito, não pede senha nem certificado digital, e mostra se a empresa ainda é optante ou já foi excluída, com a data e o histórico completo em 'Períodos Anteriores'.",
        base: "Resolução CGSN nº 140/2018",
      },
      {
        titulo: "2. Se estiver excluída, veja QUEM excluiu antes de procurar o motivo",
        texto:
          "Na linha do período que terminou em exclusão, a coluna 'Detalhamento' diz qual ente praticou o ato: 'Receita Federal do Brasil' (RFB), um Estado específico, ou um Município específico. Isso é o dado mais importante da consulta — o Simples Nacional é administrado em conjunto por União, Estados e Municípios, e cada um pode excluir a empresa por uma dívida própria (federal, ICMS estadual ou ISS municipal), mesmo que os outros dois estejam em dia.",
        base: null,
      },
      {
        titulo: "3. Procure o ente certo, não só o e-CAC",
        texto:
          "Se foi a Receita Federal: o Termo de Exclusão e o Relatório de Pendências ficam no e-CAC/DTE-SN. Se foi um Estado: procure a Sefaz daquele estado. Se foi um Município: procure a Secretaria de Fazenda daquela prefeitura — o e-CAC federal não mostra nada nesses dois últimos casos, então uma caixa postal vazia no e-CAC não significa que não há pendência.",
        base: null,
      },
      {
        titulo: "4. Volte a este serviço com o resultado",
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
      titulo: "1. Antes de tudo: descubra QUEM excluiu — não é sempre a Receita Federal",
      texto:
        "Na 'Consulta Optantes' (Portal do Simples Nacional), a linha do período excluído tem uma coluna 'Detalhamento' que diz o ente responsável: 'Receita Federal do Brasil', ou um Estado, ou um Município específico. O Simples Nacional é administrado junto por União, Estados e Municípios, e qualquer um dos três pode excluir a empresa por uma dívida própria (federal, ICMS estadual ou ISS municipal) — mesmo que os outros dois estejam em dia. Isso muda tudo sobre onde procurar a partir daqui.",
      base: "LC 123/2006, art. 33",
    },
    {
      titulo: "2a. Se foi a Receita Federal: confira a data de ciência no e-CAC",
      texto:
        "Abra o Termo de Exclusão no e-CAC (Caixa Postal/DTE) e veja a data de ciência que o sistema mostra — é esse número que conta, não a data de hoje. Se a caixa postal nunca tinha sido acessada, a ciência pode já ter acontecido sozinha: no DTE-SN, a intimação é considerada recebida automaticamente em até 45 dias corridos após ser disponibilizada. Só depois de confirmar essa data dá para saber se os 30 dias para reverter a exclusão quitando o Relatório de Pendências ainda estão correndo ou já passaram.",
      base: "Resolução CGSN nº 140/2018; Manual do DTE-SN",
    },
    {
      titulo: "2b. Se foi um Estado ou Município: contate o órgão diretamente",
      texto:
        "Não existe um portal nacional único para consultar pendências estaduais ou municipais do Simples Nacional — cada Sefaz e cada Prefeitura tem seu próprio sistema (às vezes nem tem sistema online). O caminho mais seguro é ligar ou ir presencialmente à Secretaria de Fazenda do estado, ou à Secretaria Municipal de Fazenda da cidade indicada no Detalhamento, e pedir o motivo exato da exclusão e o valor em aberto — geralmente ligado a ICMS (estado) ou ISS (município) não recolhido ou não declarado.",
      base: null,
    },
    {
      titulo: "3. Entenda que, enquanto excluída, o regime de tributação muda",
      texto:
        "Fora do Simples Nacional, a empresa passa a ser tributada normalmente (em geral Lucro Presumido) — isso muda completamente como os impostos do período são apurados, não é só o DAS. É um ponto de atenção para não deixar de recolher outros tributos nesse intervalo.",
      base: null,
    },
    {
      titulo: "4. Quite ou parcele as dívidas com o ente responsável",
      texto:
        "Avalie pagamento à vista, parcelamento ou transação tributária para os débitos pendentes — cada ente (Receita Federal, Estado ou Município) tem seu próprio programa de parcelamento; regularizar com um não resolve a pendência com outro.",
      base: null,
    },
    {
      titulo: "5. Solicite nova opção pelo Simples Nacional na janela do ano",
      texto:
        "Para voltar ao regime, TODAS as pendências apontadas — federais, estaduais e municipais — precisam estar regularizadas, não só a do ente que excluiu por último. Para empresas já existentes, a partir da Reforma Tributária a janela de opção passou de janeiro para setembro de cada ano, com efeito a partir de 1º de janeiro do ano seguinte. Como é mudança recente, confirme a janela exata do ano vigente no Portal do Simples Nacional antes de contar com uma data.",
      base: "LC 214/2025",
    },
    {
      titulo: "6. Contrate um contador para esse período de transição",
      texto:
        "Entre a exclusão e o reingresso, a apuração de impostos é mais complexa (fora do Simples) e envolve mais de um ente. Um contador evita erro de recolhimento nesse intervalo, que pode gerar autuação adicional.",
      base: "Código Civil, art. 1.179",
    },
  ];
}
