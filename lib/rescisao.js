// ═══════════════════════════════════════════════════════════════════════════
//  RESCISÃO / DEMISSÃO — verbas rescisórias por motivo do desligamento.
//  Base: CLT arts. 477, 478, 480, 482, 484-A, 487; Lei 12.506/2011 (aviso
//  prévio proporcional); Lei 4.749/1965 e Súmula 253/261 TST (avos por
//  fração ≥15 dias); LC 150/2015 (doméstico); Lei 10.097/2000 (aprendiz).
//
//  Simplificações assumidas (sinalizadas na tela): não modela períodos
//  aquisitivos de férias anteriores, nem verbas de contrato por prazo
//  determinado rescindido antes do prazo. Trate como estimativa a conferir.
// ═══════════════════════════════════════════════════════════════════════════

const DIA_MS = 24 * 60 * 60 * 1000;

export const MOTIVOS_RESCISAO = {
  sem_justa_causa: {
    label: "Dispensa sem justa causa (pela empresa)",
    desc: "Direito a todas as verbas + aviso prévio + multa de 40% do FGTS + saque total + seguro-desemprego.",
  },
  pedido_demissao: {
    label: "Pedido de demissão (pelo empregado)",
    desc: "Sem multa do FGTS, sem saque do FGTS, sem seguro-desemprego. Se não cumprir aviso, desconta 30 dias.",
  },
  acordo_mutuo: {
    label: "Acordo entre as partes (CLT art. 484-A)",
    desc: "Meio-termo: aviso prévio pela metade se indenizado, multa do FGTS de 20%, saque de até 80% do saldo, sem seguro-desemprego.",
  },
  justa_causa: {
    label: "Dispensa por justa causa",
    desc: "Só saldo de salário e férias vencidas (se houver). Sem aviso prévio, sem 13º proporcional, sem multa nem saque do FGTS.",
  },
};

function round2(v) {
  return Math.round((v + Number.EPSILON) * 100) / 100;
}

function addDias(data, dias) {
  return new Date(data.getTime() + dias * DIA_MS);
}

function diasEntre(d1, d2) {
  return Math.round((d2 - d1) / DIA_MS);
}

// Meses completos entre duas datas, contando fração ≥15 dias como mês
// cheio (Lei 4.749/1965, art. 1º, §único; Súmula 253/261 TST).
function mesesComFracao(inicio, fim) {
  if (fim <= inicio) return 0;
  let meses = 0;
  let cursor = new Date(inicio);
  while (true) {
    const proximo = new Date(cursor);
    proximo.setMonth(proximo.getMonth() + 1);
    if (proximo <= fim) {
      meses += 1;
      cursor = proximo;
    } else {
      const restante = diasEntre(cursor, fim);
      if (restante >= 15) meses += 1;
      break;
    }
  }
  return Math.min(meses, 12);
}

// Lei 12.506/2011: 30 dias + 3 dias por ano completo de casa, até 90 dias.
export function calcularDiasAvisoPrevio(diasCasa) {
  const anosCompletos = Math.floor(diasCasa / 365);
  return Math.min(30 + anosCompletos * 3, 90);
}

export function calcularRescisao({
  motivo,
  salarioBruto,
  dataAdmissao,
  dataDesligamento,
  avisoPrevio, // "indenizado" | "trabalhado" | "nao_cumprido" | "nao_aplicavel"
  mesesFeriasEmCurso = 0,
  temFeriasVencidas = false,
  saldoFgtsAcumulado = 0,
}) {
  const admissao = new Date(dataAdmissao);
  const saida = new Date(dataDesligamento);
  const diasCasa = diasEntre(admissao, saida);
  const diasAviso = calcularDiasAvisoPrevio(diasCasa);
  const diasAvisoEfetivo = motivo === "acordo_mutuo" ? Math.round(diasAviso / 2) : diasAviso;

  const projetaAviso = avisoPrevio === "indenizado";
  const dataProjetada = projetaAviso ? addDias(saida, diasAvisoEfetivo) : saida;

  const salarioDia = salarioBruto / 30;

  const saldoSalario = round2(salarioDia * saida.getDate());

  const valorAvisoIndenizado = projetaAviso ? round2(salarioDia * diasAvisoEfetivo) : 0;
  const descontoAvisoNaoCumprido = avisoPrevio === "nao_cumprido" ? round2(salarioBruto) : 0;

  const anoRef = dataProjetada.getFullYear();
  const inicio13 = admissao.getFullYear() === anoRef ? admissao : new Date(anoRef, 0, 1);
  const meses13 = motivo === "justa_causa" ? 0 : mesesComFracao(inicio13, dataProjetada);
  const decimoTerceiroProporcional = round2((salarioBruto / 12) * meses13);

  const mesesFeriasAdicional = projetaAviso ? mesesComFracao(saida, dataProjetada) : 0;
  const mesesFeriasTotal = motivo === "justa_causa" ? 0 : Math.min(12, mesesFeriasEmCurso + mesesFeriasAdicional);
  const feriasProporcionais = round2((salarioBruto / 12) * mesesFeriasTotal);
  const tercoFeriasProporcionais = round2(feriasProporcionais / 3);

  const feriasVencidasValor = temFeriasVencidas ? round2(salarioBruto) : 0;
  const tercoFeriasVencidas = temFeriasVencidas ? round2(salarioBruto / 3) : 0;

  let percentualMultaFgts = 0;
  if (motivo === "sem_justa_causa") percentualMultaFgts = 0.4;
  else if (motivo === "acordo_mutuo") percentualMultaFgts = 0.2;
  const multaFgts = round2(saldoFgtsAcumulado * percentualMultaFgts);

  const temSeguroDesemprego = motivo === "sem_justa_causa";
  const temSaqueFgts = motivo === "sem_justa_causa" || motivo === "acordo_mutuo";

  const totalBruto = round2(
    saldoSalario +
      valorAvisoIndenizado +
      decimoTerceiroProporcional +
      feriasProporcionais +
      tercoFeriasProporcionais +
      feriasVencidasValor +
      tercoFeriasVencidas +
      multaFgts -
      descontoAvisoNaoCumprido
  );

  return {
    diasCasa,
    diasAviso: diasAvisoEfetivo,
    dataProjetada,
    saldoSalario,
    valorAvisoIndenizado,
    descontoAvisoNaoCumprido,
    meses13,
    decimoTerceiroProporcional,
    mesesFeriasTotal,
    feriasProporcionais,
    tercoFeriasProporcionais,
    feriasVencidasValor,
    tercoFeriasVencidas,
    percentualMultaFgts,
    multaFgts,
    temSeguroDesemprego,
    temSaqueFgts,
    totalBruto,
  };
}

// CLT art. 477, §6º: até 10 dias corridos contados do término do contrato.
export function calcularPrazoPagamento(dataDesligamentoOuProjetada) {
  return addDias(new Date(dataDesligamentoOuProjetada), 10);
}
