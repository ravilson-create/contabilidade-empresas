# Contabilidade para Micro e Pequenas Empresas

Sistema de orientação contábil e fiscal para MEI, Microempresas (ME) e
Empresas de Pequeno Porte (EPP) no Brasil. Ajuda o empresário a entender e
cumprir as obrigações legais, calcular tributos e saber exatamente onde
acessar cada serviço oficial.

## Como funciona

A tela inicial é uma **central de serviços contábeis**: o empresário escolhe
o que precisa resolver, responde um formulário guiado passo a passo, e o
sistema calcula os valores, monta um resumo pronto para uso (como se fosse
o rascunho do que um contador entregaria) e indica o site oficial exato para
concluir a obrigação.

## Serviços disponíveis

- **🏁 Abrir minha empresa** — roteiro de formalização (Redesim) que se
  adapta às respostas: MEI ou ME/EPP, atividade regulamentada, vai
  contratar empregados. Pula passos que não se aplicam ao seu caso.
- **🧮 Calcular e pagar o DAS do MEI** — valor mensal (INSS + ICMS/ISS fixos)
  e alerta de limite anual, com o link para o Portal do Empreendedor.
- **🧮 Apurar o DAS do Simples Nacional** — alíquota efetiva pelos Anexos I a
  V (com Fator R), valor do mês e link para o PGDAS-D.
- **📄 Declaração Anual do MEI (DASN-SIMEI)** — organiza a receita do ano por
  atividade e monta o resumo pronto para declarar.
- **📄 DEFIS — Declaração anual da ME/EPP** — reúne receita, folha e dados
  societários do ano.
- **🧑‍💼 Contratar um funcionário** — calcula FGTS, provisões de 13º/férias,
  CPP patronal (quando aplicável) e o custo mensal real, com checklist de
  documentos e prazo no eSocial.
- **💰 Calcular a folha de pagamento do mês** — INSS e IRRF pelas tabelas de
  2026 (incluindo o redutor de isenção até R$ 5.000), com o salário líquido.
- **🧾 Saber qual nota fiscal emitir** — árvore de decisão (NF-e, NFS-e ou
  NFC-e) conforme a operação.
- **🔒 Encerrar ou dar baixa na empresa** — checklist para fechar sem deixar
  pendências que geram dívida e restrição ao CPF.
- **📅 Calendário completo de obrigações** e **🔗 Diretório de sites oficiais**
  — referência geral, filtrável por regime.

## Base legal

Lei Complementar 123/2006 (Estatuto da ME/EPP e Simples Nacional), LC
128/2008 (institui o MEI), LC 155/2016 (tabelas vigentes desde 2018),
Resolução CGSN nº 140/2018, Lei 11.598/2007 (Redesim), Código Civil (art.
1.179 — obrigatoriedade de contabilidade), a lei do redutor do IRRF que
isenta quem ganha até R$ 5.000/mês (com redução parcial até R$ 7.350,
vigente em 2026), e a Reforma Tributária do consumo (EC 132/2023 e LC
214/2025), cujo cronograma de transição começou em 2026.

Os valores numéricos (tabelas do Simples Nacional, DAS-MEI, INSS, IRRF,
salário mínimo, limites de faturamento) refletem a legislação vigente em
2026 e devem ser revisados a cada início de ano — os links oficiais para
conferir os valores atualizados estão no serviço "Diretório de sites
oficiais". O cálculo do redutor do IRRF usa uma aproximação linear
(sinalizada na tela) enquanto a fórmula oficial completa da Receita Federal
não é replicada — trate como estimativa.

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
