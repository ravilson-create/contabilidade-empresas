// ═══════════════════════════════════════════════════════════════════════════
//  PASSO A PASSO DENTRO DE CADA PORTAL — navegação de tela em tela.
//  Baseado na estrutura de menus documentada de cada sistema. Nomes exatos
//  de botões podem mudar em atualizações dos portais — se não encontrar
//  literalmente o texto indicado, procure a opção equivalente mais próxima
//  no mesmo menu.
// ═══════════════════════════════════════════════════════════════════════════

export const PASSOS_PORTAIS = {
  consultaOptantes: {
    url: "https://www8.receita.fazenda.gov.br/SimplesNacional/",
    textoLink: "Abrir Consulta Optantes →",
    passos: [
      "Acesse www8.receita.fazenda.gov.br/SimplesNacional",
      "No menu superior, clique em 'Simples Nacional'",
      "Clique em 'Consultas' e depois em 'Consulta Optantes'",
      "Digite o CNPJ (só números) e resolva o captcha — não precisa de senha",
      "Clique em 'Consultar' e depois em 'Mais informações' para ver o histórico completo em 'Períodos Anteriores'",
    ],
  },
  eCacCaixaPostal: {
    url: "https://cav.receita.fazenda.gov.br/",
    textoLink: "Abrir e-CAC →",
    passos: [
      "Acesse cav.receita.fazenda.gov.br",
      "Clique em 'Entrar com gov.br' e faça login com CPF e senha (conta nível Prata ou Ouro)",
      "Na tela inicial, clique em 'Caixa Postal' (ou 'Acesse sua Caixa Postal', geralmente no canto superior direito)",
      "Procure a mensagem com o assunto 'Termo de Exclusão do Simples Nacional'",
      "Abra a mensagem e clique nos links internos 'Acesso ao termo' e 'Relatório de Pendências'",
    ],
  },
  portalEmpreendedorAbertura: {
    url: "https://www.gov.br/empresas-e-negocios/pt-br/empreendedor",
    textoLink: "Abrir o Portal do Empreendedor →",
    passos: [
      "Acesse gov.br/empresas-e-negocios/pt-br/empreendedor",
      "Clique em 'Quero ser MEI' e depois em 'Formalize-se'",
      "Faça login com sua conta gov.br",
      "Preencha dados pessoais, endereço do negócio e a atividade principal (CNAE)",
      "Confirme as declarações obrigatórias exigidas na tela final",
      "Baixe o CCMEI (Certificado de Condição de MEI) — ele já traz o CNPJ",
    ],
  },
  pgmei: {
    url: "https://www.gov.br/empresas-e-negocios/pt-br/empreendedor",
    textoLink: "Abrir o PGMEI (Portal do Empreendedor) →",
    passos: [
      "Acesse gov.br/empresas-e-negocios/pt-br/empreendedor e faça login com gov.br",
      "Clique em 'Já sou MEI'",
      "Clique em 'Emitir Guia de Pagamento (DAS)' (PGMEI)",
      "Selecione o(s) mês(es) de competência que quer pagar",
      "Gere o boleto/Pix e pague até o dia 20 (ou o dia útil anterior, se cair em fim de semana/feriado)",
      "Se quiser, ative o débito automático em conta para não esquecer nos próximos meses",
    ],
  },
  portalEmpreendedorBaixa: {
    url: "https://www.gov.br/empresas-e-negocios/pt-br/empreendedor",
    textoLink: "Abrir o Portal do Empreendedor →",
    passos: [
      "Acesse gov.br/empresas-e-negocios/pt-br/empreendedor e faça login",
      "Clique em 'Já sou MEI'",
      "Clique em 'Quero encerrar meu CNPJ' (Comunicação de Encerramento)",
      "Confirme os dados e envie — a baixa é processada na Receita Federal em seguida",
    ],
  },
  redesimAbertura: {
    url: "https://www.gov.br/empresas-e-negocios/pt-br/redesim",
    textoLink: "Abrir o Portal Redesim →",
    passos: [
      "Acesse gov.br/empresas-e-negocios/pt-br/redesim",
      "Procure 'Consulta de Viabilidade' (às vezes dentro de 'Registrar Empresa')",
      "Informe o nome empresarial pretendido e o endereço — o sistema confere disponibilidade e zoneamento",
      "Com a viabilidade aprovada, o sistema direciona para o registro do contrato social na Junta Comercial do seu estado",
      "Depois do registro deferido, o CNPJ sai automaticamente pela integração com a Receita Federal",
    ],
  },
  darf: {
    url: "https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/pagamentos-e-parcelamentos/darf-calculo-e-impressao-programa-sicalc-1",
    textoLink: "Abrir a página do Sicalc Web (emissão de DARF) →",
    passos: [
      "Acesse o Sicalc Web (ou pelo e-CAC: 'Pagamentos e Parcelamentos' → 'Emitir DARF')",
      "Informe o CNPJ e o código de receita do tributo (IRPJ, CSLL, PIS ou COFINS têm códigos diferentes — confirme o código certo para Lucro Presumido)",
      "Informe o período de apuração e o valor calculado",
      "Gere o DARF e pague até o vencimento (IRPJ/CSLL trimestral: último dia útil do mês seguinte ao trimestre; PIS/COFINS: dia 25 do mês seguinte)",
    ],
  },
  opcaoSimplesNacional: {
    url: "https://www8.receita.fazenda.gov.br/SimplesNacional/",
    textoLink: "Abrir a Opção pelo Simples Nacional →",
    passos: [
      "Acesse www8.receita.fazenda.gov.br/SimplesNacional e faça login",
      "Menu 'Simples Nacional' → 'Opção' → 'Solicitação de Opção pelo Simples Nacional'",
      "O sistema mostra automaticamente se há pendências impeditivas (federais, estaduais ou municipais) — todas precisam estar zeradas",
      "Se não houver pendências, confirme a solicitação dentro do prazo da janela do ano (setembro, com efeito em 1º de janeiro seguinte, para empresas já existentes)",
      "Acompanhe o resultado do processamento em alguns dias na mesma tela",
    ],
  },
  pgdasD: {
    url: "https://www8.receita.fazenda.gov.br/SimplesNacional/",
    textoLink: "Abrir o PGDAS-D →",
    passos: [
      "Acesse www8.receita.fazenda.gov.br/SimplesNacional e faça login (gov.br, código de acesso ou certificado digital)",
      "Menu 'Simples Nacional' → 'Serviços' → 'Cálculo e Declaração' → 'PGDAS-D (2018 em diante)'",
      "Selecione o período de apuração (mês/ano)",
      "Informe a receita bruta do mês, separada por atividade/anexo (o sistema já traz o RBT12 pré-calculado com base nas declarações anteriores)",
      "Confira o resumo da apuração e clique em 'Transmitir'",
      "Gere o DAS na mesma tela ('Gerar DAS') para pagamento até o dia 20",
    ],
  },
  dasnSimei: {
    url: "https://www8.receita.fazenda.gov.br/SimplesNacional/",
    textoLink: "Abrir a DASN-SIMEI →",
    passos: [
      "Acesse www8.receita.fazenda.gov.br/SimplesNacional e faça login",
      "Menu 'Simples Nacional' → 'Declaração' → 'DASN-SIMEI'",
      "Selecione o ano-calendário a declarar",
      "Informe a receita bruta total, separada em comércio/indústria e serviço",
      "Confirme se teve empregado em algum momento do ano",
      "Revise e clique em 'Transmitir'",
    ],
  },
  defis: {
    url: "https://www8.receita.fazenda.gov.br/SimplesNacional/",
    textoLink: "Abrir a DEFIS →",
    passos: [
      "Acesse www8.receita.fazenda.gov.br/SimplesNacional e faça login",
      "Menu 'Simples Nacional' → 'Declaração' → 'DEFIS'",
      "Selecione o ano-calendário",
      "Preencha receita, folha de pagamento, quadro societário e demais campos socioeconômicos pedidos",
      "Revise e transmita",
    ],
  },
  esocialAdmissao: {
    url: "https://www.esocial.gov.br",
    textoLink: "Abrir o eSocial →",
    passos: [
      "Acesse www.esocial.gov.br e faça login com gov.br",
      "Se for o primeiro acesso, cadastre a empresa (dados já vêm do CNPJ)",
      "Menu 'Trabalhador' → 'Admissão/Ingresso'",
      "Preencha CPF, dados da CTPS Digital, cargo, salário e data de início do trabalhador",
      "Envie o evento antes do início efetivo do trabalho (o prazo legal é até 1 dia útil antes)",
    ],
  },
  esocialDomestico: {
    url: "https://www.esocial.gov.br",
    textoLink: "Abrir o eSocial Doméstico →",
    passos: [
      "Acesse www.esocial.gov.br e faça login com gov.br usando o CPF do empregador (pessoa física, não CNPJ)",
      "Selecione o módulo/perfil 'Empregador Doméstico' — é uma tela simplificada, separada do módulo de empresas",
      "Cadastre o empregado (CPF, CTPS Digital, data de admissão, salário, jornada)",
      "O próprio sistema calcula e reúne FGTS, FGTS compulsório, INSS do empregado, INSS patronal e SAT numa única guia (DAE)",
      "Envie o evento de admissão antes do início do trabalho",
    ],
  },
  esocialFolha: {
    url: "https://www.esocial.gov.br",
    textoLink: "Abrir o eSocial →",
    passos: [
      "Acesse www.esocial.gov.br e faça login",
      "Menu 'Folha de Pagamento' → 'Remuneração'",
      "Selecione o trabalhador e o período (mês/ano)",
      "Confira os valores de salário, INSS e IRRF pré-calculados pelo sistema",
      "Feche a folha do período — isso gera as guias de FGTS e a base para o DAS/GPS do encargo patronal",
    ],
  },
  esocialDesligamento: {
    url: "https://www.esocial.gov.br",
    textoLink: "Abrir o eSocial →",
    passos: [
      "Acesse www.esocial.gov.br e faça login",
      "Menu 'Trabalhador' → 'Desligamento'",
      "Selecione o trabalhador e informe a data do último dia trabalhado e o motivo do desligamento",
      "Preencha os valores das verbas rescisórias apuradas",
      "Envie o evento — o prazo acompanha o prazo de pagamento das verbas (até 10 dias corridos do término do contrato, CLT art. 477, §6º)",
      "O próprio eSocial gera o TRCT (Termo de Rescisão), usado para liberar o saque do FGTS pelo trabalhador",
    ],
  },
  fgtsSaqueRescisao: {
    url: "https://www.caixa.gov.br/atendimento/aplicativos/fgts/Paginas/default.aspx",
    textoLink: "Abrir o app FGTS (Caixa) →",
    passos: [
      "Aguarde a empresa enviar o evento de desligamento (S-2299) no eSocial — a liberação do saque costuma sair alguns dias úteis depois disso",
      "Baixe o app FGTS da Caixa Econômica Federal, só pela Google Play ou App Store — desconfie de sites/apps parecidos fora dessas lojas oficiais",
      "Faça login com CPF e senha cadastrados na Caixa (ou crie o acesso na hora, se for a primeira vez)",
      "Na tela inicial, toque em 'Meus Saques' → modalidade 'Saque-Rescisão'",
      "Confira o valor liberado (o motivo da rescisão já define o que pode ser sacado: sem justa causa libera o saldo todo + a multa de 40%; acordo mútuo libera até 80%)",
      "Indique uma conta — pode ser da Caixa ou de qualquer outro banco, sem custo — para receber o valor",
      "Acompanhe o status pelo próprio app: o valor cai em até 5 dias úteis após a solicitação",
    ],
  },
  fgtsDigital: {
    url: "https://fgtsdigital.sistema.gov.br/",
    textoLink: "Abrir o FGTS Digital →",
    passos: [
      "Acesse fgtsdigital.sistema.gov.br e faça login com gov.br",
      "As guias já aparecem calculadas a partir do que foi fechado no eSocial",
      "Confira o valor na aba de guias do período",
      "Pague por boleto, Pix ou débito automático até o dia 20",
    ],
  },
  nfseNacional: {
    url: "https://www.gov.br/nfse/pt-br",
    textoLink: "Abrir o Portal Nacional da NFS-e →",
    passos: [
      "Acesse gov.br/nfse e clique em 'Emissor Web' (ou 'Acessar o sistema')",
      "Faça login com gov.br",
      "Selecione o CNPJ da empresa (se tiver mais de um vinculado à sua conta)",
      "Clique em 'Emitir Nota' e preencha o tomador do serviço, o valor e o código de serviço/atividade",
      "Confira o ISS calculado pelo sistema e emita",
    ],
  },
  nfeNfce: {
    url: "https://www.nfe.fazenda.gov.br/portal/",
    textoLink: "Abrir o Portal Nacional da NF-e/NFC-e →",
    passos: [
      "No Portal Nacional da NF-e, procure o link 'Contribuintes' → estado onde a empresa está inscrita",
      "Isso leva ao site da Sefaz do seu estado, onde fica o emissor gratuito (geralmente chamado 'Emissor Gratuito de NF-e' ou 'NFC-e')",
      "Faça login com o certificado digital da empresa ou o acesso fornecido pela Sefaz na inscrição estadual",
      "Preencha os dados da operação (destinatário, produtos, valores) e emita",
    ],
  },
  juntaComercial: {
    url: "https://www.gov.br/empresas-e-negocios/pt-br/drei/juntas-comerciais",
    textoLink: "Abrir Juntas Comerciais (DREI) →",
    passos: [
      "Acesse gov.br/empresas-e-negocios/pt-br/drei/juntas-comerciais",
      "Localize e clique no link da Junta Comercial do seu estado",
      "No site da Junta, procure 'Registro Digital' ou 'Empresa Fácil' para enviar o contrato social/distrato",
      "Pague a taxa de registro (guia gerada no próprio sistema)",
      "Acompanhe o protocolo até o deferimento",
    ],
  },
};
