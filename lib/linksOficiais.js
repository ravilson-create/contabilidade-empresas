// ═══════════════════════════════════════════════════════════════════════════
//  DIRETÓRIO DE SITES OFICIAIS — onde acessar e para quê.
//  Links revisados e checados individualmente (2026). Preferimos sempre o
//  portal nacional quando ele existe (evita links estaduais/municipais que
//  mudam de endereço com frequência); quando o serviço é necessariamente
//  local (Sefaz, Junta Comercial, Prefeitura, Bombeiros), indicamos o hub
//  oficial + como pesquisar a página exata do seu estado/cidade.
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
        nome: "Juntas Comerciais (DREI)",
        url: "https://www.gov.br/empresas-e-negocios/pt-br/drei/juntas-comerciais",
        paraQue:
          "Registro do ato constitutivo (contrato social) de EI/Sociedade Limitada, consulta de nome empresarial e emissão do NIRE. A partir daqui você encontra o link direto da Junta Comercial do seu estado.",
      },
    ],
  },
  {
    categoria: "Cadastros federais e fiscais",
    itens: [
      {
        nome: "e-CAC — Receita Federal",
        url: "https://cav.receita.fazenda.gov.br/",
        paraQue:
          "Área logada da Receita Federal (entre com sua conta gov.br nível Prata ou Ouro): consultar situação cadastral, DTE (caixa postal de intimações — é lá que chega o Termo de Exclusão do Simples Nacional), parcelamentos, DCTFWeb.",
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
    categoria: "Notas fiscais",
    itens: [
      {
        nome: "Portal Nacional da NFS-e",
        url: "https://www.gov.br/nfse/pt-br",
        paraQue:
          "Emissão nacional padronizada da Nota Fiscal de Serviço Eletrônica (NFS-e). Desde 1º/01/2026 é obrigatório para ME/EPP do Simples Nacional emitir a NFS-e pelo Emissor Nacional deste portal, substituindo os mais de 100 sistemas municipais diferentes.",
      },
      {
        nome: "Portal Nacional da NF-e / NFC-e",
        url: "https://www.nfe.fazenda.gov.br/portal/",
        paraQue:
          "Ambiente nacional da Nota Fiscal Eletrônica (NF-e, para revenda/indústria/B2B) e da Nota Fiscal de Consumidor Eletrônica (NFC-e, para venda presencial no varejo). A emissão em si usa o emissor gratuito da Sefaz do seu estado — este portal reúne a documentação e os links de cada estado.",
      },
    ],
  },
  {
    categoria: "Estado e Município",
    itens: [
      {
        nome: "Sefaz do seu estado (Inscrição Estadual e ICMS)",
        url: "https://www.google.com/search?q=Secretaria+da+Fazenda+Sefaz+do+meu+estado+site+oficial",
        buscaLocal: "Sefaz",
        paraQue:
          "Inscrição estadual, obrigatória para quem revende ou fabrica mercadorias (ICMS). Cada estado tem seu próprio site — não existe um único portal nacional fixo, por isso o link ao lado já busca 'Sefaz [seu estado]' para você.",
      },
      {
        nome: "Prefeitura do seu município (Alvará e Inscrição Municipal)",
        url: "https://www.google.com/search?q=alvará+de+funcionamento+prefeitura+da+minha+cidade",
        buscaLocal: "Prefeitura alvará de funcionamento",
        paraQue:
          "Alvará de funcionamento, inscrição municipal e recolhimento do ISS. Procedimento varia por cidade — pesquise 'prefeitura de [sua cidade] alvará de funcionamento' para achar o site certo.",
      },
    ],
  },
  {
    categoria: "Trabalhista e previdenciário (se tiver empregados)",
    itens: [
      {
        nome: "eSocial",
        url: "https://www.esocial.gov.br",
        paraQue:
          "Cadastro de empregados, admissões, afastamentos, folha de pagamento e demais eventos trabalhistas — obrigatório para quem contrata CLT, inclusive o MEI com 1 funcionário.",
      },
      {
        nome: "FGTS Digital",
        url: "https://fgtsdigital.sistema.gov.br/",
        paraQue:
          "Portal do empregador para o FGTS Digital: as guias são calculadas a partir do que você já declarou no eSocial, com pagamento até o dia 20.",
      },
      {
        nome: "Meu INSS",
        url: "https://meu.inss.gov.br/",
        paraQue: "Consultas previdenciárias, CNIS dos empregados e serviços relacionados à contribuição patronal.",
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
        url: "https://www.google.com/search?q=Corpo+de+Bombeiros+Militar+do+meu+estado+licenciamento+AVCB+site+oficial",
        buscaLocal: "Corpo de Bombeiros Militar licenciamento AVCB",
        paraQue: "Auto de Vistoria do Corpo de Bombeiros (AVCB) ou Certificado de Licenciamento (CLCB), exigido para a maioria dos estabelecimentos com público. Cada estado tem seu próprio Corpo de Bombeiros, sem portal nacional único.",
      },
      {
        nome: "Conselhos e órgãos de classe (CRC, CREA, OAB, CFM etc.)",
        url: "https://www.google.com/search?q=conselho+profissional+da+minha+atividade+registro+de+empresa",
        paraQue:
          "Registro obrigatório para atividades regulamentadas, além do registro da empresa em si. Exemplos de portais nacionais estáveis: contabilidade → cfc.org.br, engenharia/agronomia → confea.org.br, advocacia → oab.org.br, medicina → cfm.org.br.",
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

// Busca no Google sempre resolve — usado para os serviços que variam por
// estado/cidade e não têm um único portal nacional fixo (Sefaz, Junta
// Comercial, Prefeitura, Bombeiros), evitando indicar um link estadual que
// pode ter mudado de endereço.
export function linkBuscaLocal(servico, local) {
  const q = encodeURIComponent(`${servico} ${local} site oficial`);
  return `https://www.google.com/search?q=${q}`;
}
