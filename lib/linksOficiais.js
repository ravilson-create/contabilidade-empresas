// ═══════════════════════════════════════════════════════════════════════════
//  DIRETÓRIO DE SITES OFICIAIS — onde acessar e para quê.
//  Todos os links são domínios .gov.br / caixa.gov.br oficiais.
// ═══════════════════════════════════════════════════════════════════════════

export const LINKS_OFICIAIS = [
  {
    categoria: "Abertura e viabilidade",
    itens: [
      {
        nome: "Portal Redesim / Empresas e Negócios",
        url: "https://www.gov.br/empresas-e-negocios/pt-br/redesim",
        paraQue:
          "Ponto de entrada único para abrir, alterar ou baixar empresas: consulta de viabilidade do nome, integração automática com Junta Comercial, Receita Federal, Estado e Município.",
      },
      {
        nome: "Portal do Empreendedor (MEI)",
        url: "https://www.gov.br/empresas-e-negocios/pt-br/empreendedor",
        paraQue:
          "Formalização do MEI (CNPJ em minutos, sem custo), emissão do Certificado de Condição de MEI (CCMEI), alteração cadastral e baixa do MEI.",
      },
      {
        nome: "Junta Comercial do seu estado",
        url: "https://www.gov.br/empresas-e-negocios/pt-br/redesim/juntas-comerciais",
        paraQue:
          "Registro do ato constitutivo (contrato social) de EI/Sociedade Limitada, consulta de nome empresarial e emissão do NIRE. Cada estado tem a sua Junta — pesquise 'Junta Comercial de [seu estado]'.",
      },
    ],
  },
  {
    categoria: "Cadastros federais e fiscais",
    itens: [
      {
        nome: "e-CAC — Receita Federal",
        url: "https://www.gov.br/receitafederal/pt-br/assuntos/e-cac",
        paraQue:
          "Área logada da Receita Federal: emitir CNPJ (comprovante de inscrição), consultar situação cadastral, DTE (caixa postal de intimações), parcelamentos, DCTFWeb.",
      },
      {
        nome: "Portal do Simples Nacional",
        url: "https://www8.receita.fazenda.gov.br/SimplesNacional/",
        paraQue:
          "Opção pelo Simples Nacional, PGDAS-D (apuração mensal e emissão do DAS), DEFIS (declaração anual), DASN-SIMEI (declaração anual do MEI), consulta de optantes.",
      },
      {
        nome: "Consulta de CNPJ (Receita Federal)",
        url: "https://solucoes.receita.fazenda.gov.br/Servicos/cnpjreva/Cnpjreva_Solicitacao.asp",
        paraQue: "Emitir o cartão CNPJ / comprovante de inscrição e situação cadastral a qualquer momento.",
      },
    ],
  },
  {
    categoria: "Estado e Município",
    itens: [
      {
        nome: "Sefaz do seu estado (Inscrição Estadual)",
        url: "https://www.gov.br/pt-br/orgaos-do-governo/secretarias-estaduais-de-fazenda",
        paraQue:
          "Inscrição estadual e emissão de Nota Fiscal Eletrônica (NF-e), obrigatória para quem revende ou fabrica mercadorias (ICMS). Pesquise 'Sefaz [seu estado]'.",
      },
      {
        nome: "Prefeitura do seu município (Alvará e ISS)",
        url: "https://www.gov.br/pt-br/servicos/emitir-alvara-de-funcionamento",
        paraQue:
          "Alvará de funcionamento, inscrição municipal, Nota Fiscal de Serviço Eletrônica (NFS-e) e recolhimento do ISS para prestadores de serviço. Procedimento varia por cidade — pesquise 'prefeitura de [sua cidade] alvará'.",
      },
    ],
  },
  {
    categoria: "Trabalhista e previdenciário (se tiver empregados)",
    itens: [
      {
        nome: "eSocial",
        url: "https://www.gov.br/esocial/pt-br",
        paraQue:
          "Cadastro de empregados, admissões, afastamentos, folha de pagamento e demais eventos trabalhistas — obrigatório para quem contrata CLT, inclusive o MEI com 1 funcionário.",
      },
      {
        nome: "FGTS Digital",
        url: "https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/fgts",
        paraQue: "Recolhimento mensal do FGTS dos empregados (até o dia 20).",
      },
      {
        nome: "Meu INSS / INSS Empresa",
        url: "https://www.gov.br/inss/pt-br",
        paraQue: "Consultas previdenciárias, CNIS dos empregados e informações sobre a contribuição patronal.",
      },
    ],
  },
  {
    categoria: "Licenças específicas por atividade",
    itens: [
      {
        nome: "Vigilância Sanitária (municipal/estadual)",
        url: "https://www.gov.br/anvisa/pt-br",
        paraQue:
          "Obrigatória para alimentação, saúde, estética e correlatos. O cadastro é feito na Vigilância Sanitária do seu município — a Anvisa define as normas nacionais.",
      },
      {
        nome: "Corpo de Bombeiros Militar do seu estado",
        url: "https://www.gov.br/pt-br/orgaos-do-governo/corpos-de-bombeiros-militares-estaduais",
        paraQue: "Auto de Vistoria do Corpo de Bombeiros (AVCB) ou Certificado de Licenciamento (CLCB), exigido para a maioria dos estabelecimentos com público.",
      },
      {
        nome: "Conselhos e órgãos de classe (CRC, CREA, OAB, CRM etc.)",
        url: "https://www.gov.br/pt-br/orgaos-do-governo/conselhos-e-ordens",
        paraQue: "Registro obrigatório para atividades regulamentadas (contabilidade, engenharia, advocacia, saúde etc.), além do registro da empresa em si.",
      },
    ],
  },
  {
    categoria: "Apoio à gestão",
    itens: [
      {
        nome: "Sebrae",
        url: "https://www.sebrae.com.br/",
        paraQue: "Consultoria gratuita/subsidiada, cursos, modelos de plano de negócio e orientação sobre formalização para micro e pequenas empresas.",
      },
      {
        nome: "Portal da Contabilidade / CFC (Conselho Federal de Contabilidade)",
        url: "https://cfc.org.br/",
        paraQue:
          "Consulta de contadores registrados (CRC ativo) — toda ME/EPP (fora o MEI) é obrigada por lei a manter escrituração contábil feita por um contador habilitado (Código Civil, art. 1.179; Resolução CFC).",
      },
    ],
  },
];
