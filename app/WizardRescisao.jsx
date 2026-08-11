"use client";
import { useMemo, useState } from "react";
import WizardShell, { WizardNav } from "./WizardShell";
import GuiaPortal from "./GuiaPortal";
import { MOTIVOS_RESCISAO, calcularRescisao, calcularPrazoPagamento } from "@/lib/rescisao";
import { fmtBRL } from "@/lib/simplesNacional";

function parseNum(s) {
  const v = parseFloat(String(s || "").replace(/\./g, "").replace(",", "."));
  return Number.isFinite(v) ? v : 0;
}

function fmtData(d) {
  return new Date(d).toLocaleDateString("pt-BR");
}

const TIPOS = {
  clt: { label: "Empregado CLT (comum)" },
  aprendiz: { label: "Jovem Aprendiz" },
  domestico: { label: "Empregado doméstico" },
};

export default function WizardRescisao({ onSair }) {
  const [passo, setPasso] = useState(0);
  const [tipo, setTipo] = useState("");
  const [motivo, setMotivo] = useState("");
  const [salario, setSalario] = useState("");
  const [dataAdmissao, setDataAdmissao] = useState("");
  const [dataDesligamento, setDataDesligamento] = useState("");
  const [avisoPrevio, setAvisoPrevio] = useState("");
  const [mesesFerias, setMesesFerias] = useState("0");
  const [feriasVencidas, setFeriasVencidas] = useState(null);
  const [saldoFgts, setSaldoFgts] = useState("");

  const temAviso = motivo === "sem_justa_causa" || motivo === "acordo_mutuo" || motivo === "pedido_demissao";
  const opcoesAviso =
    motivo === "pedido_demissao"
      ? [
          ["trabalhado", "Vai cumprir, trabalhando os dias"],
          ["nao_cumprido", "Não vai cumprir (desconta 30 dias)"],
        ]
      : [
          ["indenizado", "Indenizado (dispensado de cumprir, empresa paga em dinheiro)"],
          ["trabalhado", "Trabalhado (cumpre os dias normalmente)"],
        ];

  const resultado = useMemo(() => {
    if (!motivo || !salario || !dataAdmissao || !dataDesligamento) return null;
    if (temAviso && !avisoPrevio) return null;
    if (feriasVencidas === null) return null;
    return calcularRescisao({
      motivo,
      salarioBruto: parseNum(salario),
      dataAdmissao,
      dataDesligamento,
      avisoPrevio: temAviso ? avisoPrevio : "nao_aplicavel",
      mesesFeriasEmCurso: parseInt(mesesFerias || "0", 10),
      temFeriasVencidas: feriasVencidas,
      saldoFgtsAcumulado: parseNum(saldoFgts),
    });
  }, [motivo, salario, dataAdmissao, dataDesligamento, avisoPrevio, temAviso, mesesFerias, feriasVencidas, saldoFgts]);

  const passoTipo = (
    <div key="tipo">
      <p style={{ fontSize: 13, color: "#3A423F", marginBottom: 14 }}>Qual é o tipo de vínculo do trabalhador?</p>
      <div className="ctb-opcoes">
        {Object.entries(TIPOS).map(([k, v]) => (
          <label key={k} className={"ctb-opcao" + (tipo === k ? " selecionada" : "")}>
            <input type="radio" name="tipovinculo" checked={tipo === k} onChange={() => setTipo(k)} />
            <span className="titulo">{v.label}</span>
          </label>
        ))}
      </div>
      {tipo === "aprendiz" && (
        <div className="ctb-alerta-forte" style={{ marginTop: 14 }}>
          <div className="titulo">⚠ Aprendiz não pode ser dispensado livremente</div>
          <p>
            O contrato de aprendizagem só pode ser rescindido antes do prazo em hipóteses
            específicas (Lei 10.097/2000, art. 15): desempenho insuficiente ou inadaptação,
            falta disciplinar grave, ausência que cause perda do ano letivo no curso, ou a pedido
            do próprio aprendiz. Fora esses casos, a rescisão antecipada pode gerar indenização
            adicional — confirme o motivo com um advogado trabalhista antes de desligar.
          </p>
        </div>
      )}
      {tipo === "domestico" && (
        <div className="ctb-aviso" style={{ marginTop: 14 }}>
          ℹ️ No emprego doméstico, o FGTS compulsório de 3,2% já recolhido mês a mês (LC
          150/2015) é justamente a antecipação da multa rescisória — a Caixa usa esse saldo
          acumulado para cobrir a indenização automaticamente, sem depósito extra do empregador.
        </div>
      )}
    </div>
  );

  const passoMotivo = (
    <div key="motivo">
      <p style={{ fontSize: 13, color: "#3A423F", marginBottom: 14 }}>Qual é o motivo do desligamento?</p>
      <div className="ctb-opcoes">
        {Object.entries(MOTIVOS_RESCISAO).map(([k, v]) => (
          <label key={k} className={"ctb-opcao" + (motivo === k ? " selecionada" : "")}>
            <input type="radio" name="motivo" checked={motivo === k} onChange={() => setMotivo(k)} />
            <span>
              <span className="titulo">{v.label}</span>
              <div className="desc">{v.desc}</div>
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  const passoDados = (
    <div key="dados">
      <div className="ctb-form-linha">
        <div className="ctb-campo">
          <label>Data de admissão</label>
          <input type="date" value={dataAdmissao} onChange={(e) => setDataAdmissao(e.target.value)} autoFocus />
        </div>
        <div className="ctb-campo">
          <label>Data do último dia trabalhado</label>
          <input type="date" value={dataDesligamento} onChange={(e) => setDataDesligamento(e.target.value)} />
        </div>
        <div className="ctb-campo">
          <label>Salário bruto — R$</label>
          <input inputMode="decimal" value={salario} onChange={(e) => setSalario(e.target.value)} placeholder="Ex: 2500,00" />
        </div>
      </div>

      {temAviso && (
        <div className="ctb-form-linha">
          <div className="ctb-campo" style={{ flex: "1 1 100%" }}>
            <label>Aviso prévio</label>
            <div className="ctb-opcoes">
              {opcoesAviso.map(([k, label]) => (
                <label key={k} className={"ctb-opcao" + (avisoPrevio === k ? " selecionada" : "")}>
                  <input type="radio" name="aviso" checked={avisoPrevio === k} onChange={() => setAvisoPrevio(k)} />
                  <span className="titulo">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {motivo !== "justa_causa" && (
        <div className="ctb-form-linha">
          <div className="ctb-campo">
            <label>Meses já completos no período aquisitivo de férias em curso (0–11)</label>
            <input inputMode="numeric" value={mesesFerias} onChange={(e) => setMesesFerias(e.target.value)} placeholder="0" />
          </div>
        </div>
      )}

      <p style={{ fontSize: 13, fontWeight: 700, color: "#1C2521", margin: "10px 0 8px" }}>
        Tem férias vencidas (período completo de 12 meses já fechado e não gozado)?
      </p>
      <div className="ctb-opcoes">
        <label className={"ctb-opcao" + (feriasVencidas === true ? " selecionada" : "")}>
          <input type="radio" name="feriasvenc" checked={feriasVencidas === true} onChange={() => setFeriasVencidas(true)} />
          <span className="titulo">Sim</span>
        </label>
        <label className={"ctb-opcao" + (feriasVencidas === false ? " selecionada" : "")}>
          <input type="radio" name="feriasvenc" checked={feriasVencidas === false} onChange={() => setFeriasVencidas(false)} />
          <span className="titulo">Não</span>
        </label>
      </div>

      {(motivo === "sem_justa_causa" || motivo === "acordo_mutuo") && (
        <div className="ctb-form-linha" style={{ marginTop: 12 }}>
          <div className="ctb-campo">
            <label>Saldo total na conta do FGTS vinculada a este contrato — R$</label>
            <input inputMode="decimal" value={saldoFgts} onChange={(e) => setSaldoFgts(e.target.value)} placeholder="Consulte no app FGTS ou extrato da Caixa" />
          </div>
        </div>
      )}

      <div className="ctb-aviso">
        ℹ️ Esta calculadora simplifica alguns pontos: não modela períodos aquisitivos de férias
        anteriores nem contratos por prazo determinado rescindidos antes do prazo. Trate o
        resultado como estimativa a conferir com um contador antes de pagar.
      </div>
    </div>
  );

  const passoResultado = (
    <div key="resultado">
      {resultado && (
        <>
          <div className="ctb-documento">
            <div className="ctb-documento-titulo">Verbas rescisórias estimadas</div>
            <div className="ctb-documento-linha">
              <span className="label">Saldo de salário ({new Date(dataDesligamento).getDate()} dias)</span>
              <span className="valor">{fmtBRL(resultado.saldoSalario)}</span>
            </div>
            {resultado.valorAvisoIndenizado > 0 && (
              <div className="ctb-documento-linha">
                <span className="label">Aviso prévio indenizado ({resultado.diasAviso} dias)</span>
                <span className="valor">{fmtBRL(resultado.valorAvisoIndenizado)}</span>
              </div>
            )}
            {resultado.descontoAvisoNaoCumprido > 0 && (
              <div className="ctb-documento-linha">
                <span className="label">(−) Aviso prévio não cumprido</span>
                <span className="valor">−{fmtBRL(resultado.descontoAvisoNaoCumprido)}</span>
              </div>
            )}
            <div className="ctb-documento-linha">
              <span className="label">13º salário proporcional ({resultado.meses13}/12)</span>
              <span className="valor">{fmtBRL(resultado.decimoTerceiroProporcional)}</span>
            </div>
            <div className="ctb-documento-linha">
              <span className="label">Férias proporcionais + 1/3 ({resultado.mesesFeriasTotal}/12)</span>
              <span className="valor">{fmtBRL(resultado.feriasProporcionais + resultado.tercoFeriasProporcionais)}</span>
            </div>
            {resultado.feriasVencidasValor > 0 && (
              <div className="ctb-documento-linha">
                <span className="label">Férias vencidas + 1/3</span>
                <span className="valor">{fmtBRL(resultado.feriasVencidasValor + resultado.tercoFeriasVencidas)}</span>
              </div>
            )}
            {resultado.multaFgts > 0 && (
              <div className="ctb-documento-linha">
                <span className="label">Multa do FGTS ({resultado.percentualMultaFgts * 100}% sobre {fmtBRL(parseNum(saldoFgts))})</span>
                <span className="valor">{fmtBRL(resultado.multaFgts)}</span>
              </div>
            )}
            <div className="ctb-documento-linha">
              <span className="label" style={{ fontWeight: 800 }}>
                Total bruto estimado
              </span>
              <span className="valor" style={{ fontSize: 18, color: "#0D7A3E" }}>
                {fmtBRL(resultado.totalBruto)}
              </span>
            </div>
          </div>

          <div className="ctb-memoria-calculo">
            <span className="linha">Projeção do tempo de serviço (para 13º e férias):</span>
            <span className="linha">Dias de casa até a saída informada: {resultado.diasCasa}</span>
            <span className="linha">Dias de aviso prévio (Lei 12.506/2011): {resultado.diasAviso}</span>
            <span className="linha">
              Data projetada de saída{resultado.valorAvisoIndenizado > 0 ? " (soma o aviso indenizado)" : ""}: {fmtData(resultado.dataProjetada)}
            </span>
          </div>

          <div className="ctb-documento" style={{ marginTop: 12 }}>
            <div className="ctb-documento-titulo">Prazo e direitos</div>
            <div className="ctb-documento-linha">
              <span className="label">Prazo legal para pagamento (CLT art. 477, §6º)</span>
              <span className="valor">até {fmtData(calcularPrazoPagamento(resultado.dataProjetada))}</span>
            </div>
            <div className="ctb-documento-linha">
              <span className="label">Saque do FGTS liberado?</span>
              <span className="valor">{resultado.temSaqueFgts ? "Sim" : "Não"}</span>
            </div>
            <div className="ctb-documento-linha">
              <span className="label">Direito a seguro-desemprego?</span>
              <span className="valor">{resultado.temSeguroDesemprego ? "Sim (se cumprir os demais requisitos)" : "Não"}</span>
            </div>
          </div>

          <div className="ctb-aviso" style={{ marginTop: 14 }}>
            ⚠️ Pagar fora do prazo de 10 dias corridos gera multa de 1 salário do empregado (CLT
            art. 477, §8º). Este cálculo é uma estimativa — confirme com um contador antes de
            fechar o TRCT, principalmente se houver médias de horas extras, comissões ou
            adicionais habituais, que também entram na base e não estão neste cálculo.
          </div>

          <GuiaPortal
            titulo="Onde registrar o desligamento"
            texto="Envie o evento de desligamento dentro do mesmo prazo de pagamento das verbas."
            chave="esocialDesligamento"
          />
        </>
      )}
    </div>
  );

  const passos = [passoTipo, passoMotivo, passoDados, passoResultado];
  const ultimoIndice = passos.length - 1;
  const podeAvancar =
    passo === 0
      ? !!tipo
      : passo === 1
        ? !!motivo
        : passo === 2
          ? !!salario && !!dataAdmissao && !!dataDesligamento && (!temAviso || !!avisoPrevio) && feriasVencidas !== null
          : true;

  return (
    <WizardShell titulo="Demitir um funcionário" icone="📤" totalPassos={passos.length} passoAtual={passo} onSair={onSair}>
      {passos[passo]}
      <WizardNav
        mostrarVoltar={passo > 0}
        onVoltar={() => setPasso((p) => p - 1)}
        onProximo={() => (passo === ultimoIndice ? onSair() : setPasso((p) => p + 1))}
        podeAvancar={podeAvancar}
        textoProximo={passo === ultimoIndice ? "Concluir" : passo === ultimoIndice - 1 ? "Calcular verbas" : "Próximo"}
      />
    </WizardShell>
  );
}
