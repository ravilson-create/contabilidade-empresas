# Contabilidade para Micro e Pequenas Empresas

Sistema de orientação contábil e fiscal para MEI, Microempresas (ME) e
Empresas de Pequeno Porte (EPP) no Brasil. Ajuda o empresário a entender e
cumprir as obrigações legais, calcular tributos e saber exatamente onde
acessar cada serviço oficial.

## O que o sistema oferece

- **📋 Guia de abertura e regularização** — roteiro passo a passo (Redesim)
  para abrir ou regularizar a empresa: enquadramento, Junta Comercial, CNPJ,
  inscrições estadual/municipal, alvará, licenças específicas, opção pelo
  Simples Nacional e obrigação de contabilidade.
- **🧮 Calculadora do DAS-MEI** — calcula o valor mensal do DAS (INSS + ICMS/ISS
  fixos) e avalia se o faturamento projetado está dentro do limite anual.
- **🧮 Calculadora do Simples Nacional (ME/EPP)** — calcula o DAS mensal pelos
  Anexos I a V, com alíquota efetiva, Fator R (Anexo V ⇄ III) e alerta de
  sublimite/teto.
- **📅 Calendário de obrigações** — prazos recorrentes (DAS, DASN-SIMEI,
  PGDAS-D, DEFIS, eSocial, FGTS, escrituração contábil), filtráveis por regime.
- **🔗 Diretório de sites oficiais** — links diretos para os portais do
  governo (Redesim, Portal do Empreendedor, e-CAC, Simples Nacional, Sefaz,
  Prefeitura, eSocial, FGTS Digital, INSS, Vigilância Sanitária, Bombeiros,
  conselhos de classe, Sebrae, CFC) explicando para que serve cada um.

## Base legal

Lei Complementar 123/2006 (Estatuto da ME/EPP e Simples Nacional), LC
128/2008 (institui o MEI), LC 155/2016 (tabelas vigentes desde 2018),
Resolução CGSN nº 140/2018, Lei 11.598/2007 (Redesim), Código Civil (art.
1.179 — obrigatoriedade de contabilidade), e a Reforma Tributária do consumo
(EC 132/2023 e LC 214/2025), cujo cronograma de transição começou em 2026.

Os valores numéricos (tabelas do Simples Nacional, DAS-MEI, salário mínimo,
limites de faturamento) refletem a legislação vigente em 2026 e devem ser
revisados a cada início de ano — os links oficiais para conferir os valores
atualizados estão na aba "Links oficiais".

⚠️ Esta é uma ferramenta de orientação geral e **não substitui a assessoria
de um contador ou advogado**. Toda ME/EPP (exceto o MEI) é legalmente
obrigada a manter escrituração contábil feita por um contador habilitado.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

Não há backend, banco de dados ou variáveis de ambiente — é um app Next.js
estático com todo o conteúdo e as calculadoras rodando no navegador.

## Deploy

Qualquer provedor compatível com Next.js (ex.: Vercel) funciona sem
configuração adicional:

```bash
npm run build
npm start
```
