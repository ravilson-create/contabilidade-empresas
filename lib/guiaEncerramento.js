// ═══════════════════════════════════════════════════════════════════════════
//  ENCERRAMENTO / BAIXA DA EMPRESA — evita a "empresa fantasma" que continua
//  gerando dívidas e restrições ao CPF do sócio mesmo sem funcionar mais.
// ═══════════════════════════════════════════════════════════════════════════

const ALERTA_RESPONSABILIDADE = {
  titulo: "0. Antes de tudo: a baixa não apaga dívidas, só evita novas",
  texto:
    "Dar baixa no CNPJ não elimina débitos existentes. Pela LC 123/2006, art. 9º, §5º (redação da LC 147/2014), a baixa gera responsabilidade solidária do titular, sócios e administradores pelos tributos e multas do período em que a empresa funcionou — inclusive os que forem apurados depois de já fechada. Se a empresa é Empresário Individual ou MEI, o titular já responde pessoalmente por essas dívidas desde sempre, com ou sem baixa (não há separação de patrimônio nesse formato). O que a baixa realmente evita é o acúmulo de novas obrigações e multas futuras — declarações e DAS que ainda venceriam. Se já existem pendências (ex.: exclusão do Simples Nacional), vale usar primeiro o serviço 'Estou com pendências' para entender o valor devido antes de decidir a ordem dos próximos passos.",
  base: "LC 123/2006, art. 9º, §5º (redação dada pela LC 147/2014)",
};

export const PASSOS_ENCERRAMENTO_MEI = [
  ALERTA_RESPONSABILIDADE,
  {
    titulo: "1. Regularize o que der para regularizar antes de fechar",
    texto:
      "Entregue as DASN-SIMEI em atraso e quite os DAS pendentes que conseguir. Desde a LC 147/2014, a baixa pode ser feita mesmo com pendências — mas regularizar antes evita que a dívida cresça com mais multas de atraso enquanto isso não é resolvido.",
    base: "Resolução CGSN nº 140/2018",
  },
  {
    titulo: "2. Solicite a baixa no Portal do Empreendedor",
    texto: "No Portal do Empreendedor, use a opção 'Quero encerrar o CNPJ' (Comunicação de Encerramento). É gratuito e o CNPJ é baixado automaticamente na Receita Federal.",
    base: "Portal do Empreendedor",
  },
  {
    titulo: "3. Declare o encerramento no ano seguinte",
    texto: "No ano seguinte à baixa, ainda é preciso entregar a última DASN-SIMEI, referente ao período em que a empresa esteve ativa.",
    base: "Resolução CGSN nº 140/2018, art. 66",
  },
  {
    titulo: "4. Encerre inscrições estadual/municipal, se houver",
    texto: "Se tinha inscrição estadual (Sefaz) ou municipal (Prefeitura), solicite o cancelamento nesses órgãos — muitas vezes já é feito automaticamente pela integração Redesim, mas vale confirmar.",
    base: "Legislação estadual/municipal",
  },
];

export const PASSOS_ENCERRAMENTO_MEEPP = [
  ALERTA_RESPONSABILIDADE,
  {
    titulo: "1. Delibere o encerramento (distrato social)",
    texto: "Se houver sócios, formalize a decisão de encerrar em um distrato social. Empresário individual não precisa de distrato, apenas do requerimento de baixa.",
    base: "Código Civil, arts. 1.033 a 1.038",
  },
  {
    titulo: "2. Regularize o que der para regularizar antes de fechar",
    texto:
      "Quite DAS em aberto, entregue a última DEFIS, encerre a folha de pagamento (rescisão de todos os empregados, se houver) e recolha os encargos finais. A baixa é permitida mesmo com débitos pendentes, mas regularizar o que for possível evita mais multas se acumulando.",
    base: "Resolução CGSN nº 140/2018",
  },
  {
    titulo: "3. Registre o distrato na Junta Comercial",
    texto: "Leve o distrato social para registro na Junta Comercial do seu estado, gerando a baixa do NIRE.",
    base: "Lei 11.598/2007",
  },
  {
    titulo: "4. Baixa automática do CNPJ pela Redesim",
    texto: "Com o registro na Junta Comercial concluído, a Receita Federal baixa o CNPJ automaticamente pela integração Redesim — confirme no e-CAC.",
    base: "Instrução Normativa RFB nº 2.119/2022",
  },
  {
    titulo: "5. Cancele inscrições estadual, municipal e alvará",
    texto: "Solicite o cancelamento da inscrição estadual (Sefaz), municipal (Prefeitura) e do alvará de funcionamento.",
    base: "Legislação estadual/municipal",
  },
  {
    titulo: "6. Guarde os documentos contábeis e fiscais",
    texto: "Mantenha notas fiscais, livros contábeis e guias pagas por pelo menos 5 anos após o encerramento — é o prazo de decadência para fiscalização.",
    base: "Código Tributário Nacional, art. 173",
  },
];
