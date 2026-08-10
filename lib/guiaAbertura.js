// ═══════════════════════════════════════════════════════════════════════════
//  ROTEIRO DE ABERTURA E REGULARIZAÇÃO — baseado no fluxo Redesim
//  (Lei Complementar 123/2006, art. 4º-A e seguintes; Lei 11.598/2007).
// ═══════════════════════════════════════════════════════════════════════════

export const PASSOS_ABERTURA = [
  {
    titulo: "1. Escolha o enquadramento e a natureza jurídica",
    texto:
      "Defina se você será MEI (faturamento até R$ 81.000/ano, sem sócios, até 1 empregado), Microempresa (ME, até R$ 360.000/ano) ou Empresa de Pequeno Porte (EPP, até R$ 4,8 milhões/ano). Depois escolha a natureza jurídica: Empresário Individual, Sociedade Limitada Unipessoal (um só dono) ou Sociedade Limitada (dois ou mais sócios, com contrato social).",
    base: "LC 123/2006, arts. 3º e 18-A",
  },
  {
    titulo: "2. Consulte a viabilidade do nome e do endereço",
    texto:
      "Antes de registrar, consulte se o nome empresarial está disponível e se a atividade pode funcionar no endereço escolhido (zoneamento urbano). Essa consulta é feita no portal Redesim ou diretamente na Junta Comercial do seu estado — é gratuita e evita retrabalho.",
    base: "Lei 11.598/2007",
  },
  {
    titulo: "3. Registre o ato constitutivo",
    texto:
      "MEI: a formalização já gera automaticamente o CNPJ pelo Portal do Empreendedor, sem custo. ME/EPP: registre o contrato social (ou requerimento de empresário individual) na Junta Comercial do seu estado, pagando a taxa correspondente.",
    base: "LC 123/2006, art. 4º",
  },
  {
    titulo: "4. Obtenha o CNPJ",
    texto:
      "Com o registro na Junta Comercial concluído (ou a formalização do MEI), o CNPJ é emitido automaticamente pela Receita Federal via integração Redesim. Emita o cartão CNPJ no e-CAC para comprovar a inscrição.",
    base: "Instrução Normativa RFB nº 2.119/2022",
  },
  {
    titulo: "5. Inscrições estadual e municipal",
    texto:
      "Se vender ou fabricar mercadorias, peça a Inscrição Estadual na Sefaz do seu estado (habilita a emissão de NF-e/ICMS). Se prestar serviços, peça a Inscrição Municipal na Prefeitura (habilita a emissão de NFS-e/ISS). O MEI costuma ter isso automatizado no próprio Portal do Empreendedor.",
    base: "Legislação estadual/municipal (varia por localidade)",
  },
  {
    titulo: "6. Alvará de funcionamento e licenças específicas",
    texto:
      "Solicite o alvará de funcionamento na Prefeitura. Dependendo da atividade, também são exigidas: licença da Vigilância Sanitária (alimentação, saúde, estética), Auto de Vistoria do Corpo de Bombeiros — AVCB/CLCB (estabelecimentos com público) e licença ambiental (atividades poluidoras). Muitos municípios emitem um 'Alvará de Funcionamento Provisório' já na abertura, válido por prazo determinado.",
    base: "Lei 11.598/2007, art. 6º",
  },
  {
    titulo: "7. Registro em conselho de classe (se a atividade for regulamentada)",
    texto:
      "Profissões regulamentadas (contabilidade, engenharia, advocacia, saúde, corretagem etc.) exigem registro da empresa no respectivo conselho (CRC, CREA, OAB, CRM...), além do responsável técnico ser habilitado.",
    base: "Legislação de cada profissão regulamentada",
    somenteSe: (r) => r.regulamentada,
  },
  {
    titulo: "8. Opte pelo regime tributário",
    texto:
      "Formalize a opção pelo Simples Nacional no Portal do Simples Nacional em até 30 dias corridos do último deferimento de inscrição (CNPJ + estadual/municipal), com efeitos retroativos à data de abertura. Empresas já em atividade só podem optar em janeiro, com efeitos a partir de 1º de janeiro.",
    base: "LC 123/2006, art. 16 e Resolução CGSN nº 140/2018",
  },
  {
    titulo: "9. Contrate um contador (obrigatório para ME/EPP)",
    texto:
      "Toda ME/EPP que não seja MEI é obrigada por lei a manter escrituração contábil regular feita por um contador com registro ativo no CRC. O MEI é dispensado de contabilidade formal, mas deve manter o Relatório Mensal de Receitas Brutas (livro caixa simplificado).",
    base: "Código Civil, art. 1.179; Resolução CFC nº 1.330/2011",
    somenteSe: (r) => r.enquadramento === "meepp",
  },
  {
    titulo: "10. Providencie o cadastro para emissão de notas fiscais",
    texto:
      "Cadastre-se no sistema de emissão de NF-e (Sefaz), NFS-e (Prefeitura) ou NFC-e conforme a atividade. A emissão de nota fiscal é obrigatória em toda venda ou prestação de serviço, mesmo para MEI.",
    base: "Legislação estadual/municipal de cada tributo",
  },
  {
    titulo: "11. Se for contratar empregados",
    texto:
      "Cadastre a empresa no eSocial antes da admissão, registre o empregado, gere a folha de pagamento mensal, recolha FGTS (até dia 20) e a contribuição previdenciária patronal via DCTFWeb/DAS (Simples) ou GPS (fora do Simples).",
    base: "LC 123/2006, art. 18-A, §5º; eSocial (Decreto 8.373/2014)",
    somenteSe: (r) => r.empregados,
  },
];

export function passosPersonalizados(respostas) {
  return PASSOS_ABERTURA.filter((p) => !p.somenteSe || p.somenteSe(respostas));
}
