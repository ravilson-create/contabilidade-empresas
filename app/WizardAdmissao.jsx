"use client";
import { useMemo, useState } from "react";
import WizardShell, { WizardNav } from "./WizardShell";
import GuiaPortal from "./GuiaPortal";
import { calcularEncargosAdmissao, TIPOS_VINCULO } from "@/lib/folhaPagamento";
import { TIPOS_JORNADA, CBO_SUGESTOES } from "@/lib/jornada";
import { fmtBRL, anexoSugeridoPorAtividade } from "@/lib/simplesNacional";

function parseNum(s) {
  const v = parseFloat(String(s || "").replace(/\./g, "").replace(",", "."));
  return Number.isFinite(v) ? v : 0;
}

const DOCUMENTOS_BASE = [
  "CPF e RG (ou CNH)",
  "Comprovante de endereço atualizado",
  "Comprovante de escolaridade",
  "PIS/PASEP ou NIS, se já tiver",
  "Dados bancários para pagamento (conta ou chave Pix)",
];

const DOCUMENTOS_POR_TIPO = {
  clt: [
    ...DOCUMENTOS_BASE,
    "CTPS Digital (número já vinculado ao CPF na Carteira de Trabalho Digital)",
    "Certidão de nascimento dos filhos, se for pedir salário-família ou dependentes no IRRF",
    "Exame médico admissional (ASO), obrigatório antes do início do trabalho",
  ],
  aprendiz: [
    ...DOCUMENTOS_BASE,
    "CTPS Digital",
    "Comprovante de matrícula em curso de aprendizagem (SENAI, SENAC ou entidade qualificada equivalente) — vínculo obrigatório",
    "Exame médico admissional (ASO)",
    "Confirmar idade entre 14 e 24 anos (sem limite para pessoa com deficiência)",
  ],
  domestico: [
    ...DOCUMENTOS_BASE,
    "CTPS Digital",
    "Exame médico admissional (ASO)",
    "Combinar por escrito a jornada e os dias de trabalho (referência para o contrato)",
  ],
  estagiario: [
    ...DOCUMENTOS_BASE,
    "Comprovante de matrícula ativa na instituição de ensino",
    "Termo de Compromisso de Estágio (TCE) assinado por empresa, instituição de ensino e estagiário",
    "Dados do agente de integração, se a instituição não fizer a intermediação diretamente",
    "Comprovante do seguro contra acidentes pessoais (obrigatório)",
  ],
};

export default function WizardAdmissao({ onSair, perfil }) {
  const [passo, setPasso] = useState(0);
  const [tipo, setTipo] = useState("");
  const [salario, setSalario] = useState("");
  const [anexoSimples, setAnexoSimples] = useState(perfil?.enquadramento === "meepp" ? anexoSugeridoPorAtividade(perfil.atividade) || "nao_simples" : "nao_simples");
  const [cbo, setCbo] = useState("");
  const [tipoJornada, setTipoJornada] = useState("padrao");
  const [horarioEntrada, setHorarioEntrada] = useState("08:00");
  const [horarioSaida, setHorarioSaida] = useState("18:00");
  const [intervaloMin, setIntervaloMin] = useState("60");
  const [dias, setDias] = useState("Segunda a sexta");
  const [dsr, setDsr] = useState("Domingo");

  const ehMei = perfil?.enquadramento === "mei";
  const precisaAnexo = (tipo === "clt" || tipo === "aprendiz") && !ehMei;
  const temJornada = tipo === "clt" || tipo === "aprendiz" || tipo === "domestico";

  const encargos = useMemo(() => {
    const s = parseNum(salario);
    if (!s || !tipo) return null;
    return calcularEncargosAdmissao({ tipo, salarioBruto: s, anexoSimples, ehMei });
  }, [tipo, salario, anexoSimples, ehMei]);

  const passoTipo = (
    <div key="tipo">
      <p style={{ fontSize: 13, color: "#3A423F", marginBottom: 14 }}>
        Qual é o tipo de vínculo? Os encargos e as regras mudam bastante entre eles — tratar todo
        mundo como "CLT comum" dá conta errada.
      </p>
      <div className="ctb-opcoes">
        {Object.entries(TIPOS_VINCULO).map(([k, v]) => (
          <label key={k} className={"ctb-opcao" + (tipo === k ? " selecionada" : "")}>
            <input type="radio" name="tipovinculo" checked={tipo === k} onChange={() => setTipo(k)} />
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
          <label>{tipo === "estagiario" ? "Valor da bolsa-auxílio — R$" : "Salário bruto combinado — R$"}</label>
          <input inputMode="decimal" value={salario} onChange={(e) => setSalario(e.target.value)} placeholder="Ex: 2200,00" autoFocus />
        </div>
        {precisaAnexo && (
          <div className="ctb-campo">
            <label>Sua empresa é optante do Simples Nacional?</label>
            <select value={anexoSimples} onChange={(e) => setAnexoSimples(e.target.value)}>
              <option value="nao_simples">Não sei / não está no Simples</option>
              <option value="I">Sim — Anexo I (Comércio)</option>
              <option value="II">Sim — Anexo II (Indústria)</option>
              <option value="III">Sim — Anexo III (Serviços)</option>
              <option value="IV">Sim — Anexo IV (Construção, limpeza, vigilância, advocacia)</option>
              <option value="V">Sim — Anexo V (Serviços técnicos/intelectuais)</option>
            </select>
          </div>
        )}
      </div>

      {tipo === "clt" && precisaAnexo && (
        <div className="ctb-aviso">
          ℹ️ No Anexo IV do Simples Nacional, a contribuição previdenciária patronal (CPP) é paga
          por fora do DAS. Nos demais anexos, ela já está embutida na alíquota do DAS.
        </div>
      )}
      {tipo === "clt" && ehMei && (
        <div className="ctb-aviso">
          ℹ️ Como MEI, a CPP patronal do seu único empregado é reduzida a 3% (em vez dos 20% do
          regime geral) — LC 123/2006, art. 18-C, §1º.
        </div>
      )}
      {tipo === "aprendiz" && (
        <div className="ctb-aviso">
          ℹ️ O FGTS do aprendiz é reduzido a 2% (em vez de 8%) — Lei 10.097/2000. O contrato é por
          prazo determinado, de até 2 anos, e precisa estar vinculado a um curso de aprendizagem
          numa entidade qualificada (SENAI, SENAC etc.).
        </div>
      )}
      {tipo === "domestico" && (
        <div className="ctb-aviso">
          ℹ️ Empregado doméstico usa o Simples Doméstico (LC 150/2015) — um regime próprio, à
          parte do Simples Nacional da empresa. Reúne FGTS (8%), FGTS compulsório (3,2%, antecipação
          da multa rescisória), INSS patronal (8%) e seguro contra acidentes (0,8%) numa única guia.
        </div>
      )}
      {tipo === "estagiario" && (
        <div className="ctb-aviso">
          ℹ️ Estágio não gera vínculo empregatício (Lei 11.788/2008): sem FGTS e sem INSS
          patronal. É obrigatório apenas o seguro contra acidentes pessoais (contratado à parte,
          valor não incluso nesta conta) e o recesso remunerado de 30 dias/ano, proporcional.
        </div>
      )}
    </div>
  );

  const passoJornada = (
    <div key="jornada">
      <p style={{ fontSize: 13, color: "#3A423F", marginBottom: 14 }}>
        Esses dados alimentam o CBO e a Tabela de Horários/Turnos de Trabalho (S-1050) do eSocial
        — ela é cadastrada antes da admissão, e o evento de admissão só referencia o código dela.
      </p>

      <div className="ctb-form-linha">
        <div className="ctb-campo">
          <label>CBO — Classificação Brasileira de Ocupações</label>
          <input list="cbo-sugestoes" value={cbo} onChange={(e) => setCbo(e.target.value)} placeholder="Ex: 7156-10" autoFocus />
          <datalist id="cbo-sugestoes">
            {CBO_SUGESTOES.map((c) => (
              <option key={c.codigo} value={`${c.codigo} — ${c.titulo}`} />
            ))}
          </datalist>
        </div>
      </div>
      <div className="ctb-aviso" style={{ marginTop: -4 }}>
        ℹ️ As sugestões acima são exemplos ligados a instalação/manutenção e energia solar — não
        são um cadastro oficial. Confirme sempre o código exato na busca do próprio eSocial ou em
        cbo.mte.gov.br antes de preencher: um CBO errado distorce o PPP e o FAP/RAT da empresa.
      </div>

      <div className="ctb-form-linha" style={{ marginTop: 14 }}>
        <div className="ctb-campo">
          <label>Tipo de jornada</label>
          <select value={tipoJornada} onChange={(e) => setTipoJornada(e.target.value)}>
            {Object.entries(TIPOS_JORNADA).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p style={{ fontSize: 12, color: "#5F6B67", margin: "0 0 12px" }}>{TIPOS_JORNADA[tipoJornada].desc}</p>

      <div className="ctb-form-linha">
        <div className="ctb-campo">
          <label>Dias de trabalho</label>
          <input value={dias} onChange={(e) => setDias(e.target.value)} placeholder="Ex: Segunda a sexta" />
        </div>
        <div className="ctb-campo">
          <label>Descanso Semanal Remunerado (DSR)</label>
          <input value={dsr} onChange={(e) => setDsr(e.target.value)} placeholder="Ex: Domingo" />
        </div>
      </div>
      <div className="ctb-form-linha">
        <div className="ctb-campo">
          <label>Horário de entrada</label>
          <input type="time" value={horarioEntrada} onChange={(e) => setHorarioEntrada(e.target.value)} />
        </div>
        <div className="ctb-campo">
          <label>Horário de saída</label>
          <input type="time" value={horarioSaida} onChange={(e) => setHorarioSaida(e.target.value)} />
        </div>
        <div className="ctb-campo">
          <label>Intervalo intrajornada (minutos)</label>
          <input inputMode="numeric" value={intervaloMin} onChange={(e) => setIntervaloMin(e.target.value)} placeholder="60" />
        </div>
      </div>
      <div className="ctb-aviso">
        ℹ️ Intervalo mínimo obrigatório: 1h (60 min) para jornada acima de 6h/dia, ou 15 min para
        jornada entre 4h e 6h (CLT, art. 71).
      </div>
    </div>
  );

  const passoResultado = (
    <div key="resultado">
      {encargos && (
        <>
          <div className="ctb-documento">
            <div className="ctb-documento-titulo">
              Custo real de {tipo === "estagiario" ? "receber este estagiário" : "contratar este trabalhador"}
            </div>
            <div className="ctb-documento-linha">
              <span className="label">{tipo === "estagiario" ? "Bolsa-auxílio" : "Salário bruto"}</span>
              <span className="valor">{fmtBRL(parseNum(salario))}</span>
            </div>

            {!encargos.semVinculoEmpregaticio && (
              <>
                <div className="ctb-documento-linha">
                  <span className="label">FGTS mensal ({encargos.aliquotaFgts * 100}%)</span>
                  <span className="valor">{fmtBRL(encargos.fgtsMensal)}</span>
                </div>
                <div className="ctb-documento-linha">
                  <span className="label">Provisão de 13º salário (1/12)</span>
                  <span className="valor">{fmtBRL(encargos.provisao13)}</span>
                </div>
                <div className="ctb-documento-linha">
                  <span className="label">Provisão de férias + 1/3 (1/12)</span>
                  <span className="valor">{fmtBRL(encargos.provisaoFerias)}</span>
                </div>
              </>
            )}

            {encargos.semVinculoEmpregaticio && (
              <div className="ctb-documento-linha">
                <span className="label">Provisão de recesso remunerado (1/12, 30 dias/ano)</span>
                <span className="valor">{fmtBRL(encargos.provisaoRecesso)}</span>
              </div>
            )}

            {(encargos.itensPatronais || []).map((item) => (
              <div className="ctb-documento-linha" key={item.label}>
                <span className="label">{item.label}</span>
                <span className="valor">{fmtBRL(item.valor)}</span>
              </div>
            ))}

            <div className="ctb-documento-linha">
              <span className="label" style={{ fontWeight: 800 }}>
                Custo mensal estimado
              </span>
              <span className="valor" style={{ fontSize: 18, color: "#0D7A3E" }}>
                {fmtBRL(encargos.custoMensalEstimado)}
              </span>
            </div>
          </div>

          {temJornada && (
            <div className="ctb-documento" style={{ marginTop: 12 }}>
              <div className="ctb-documento-titulo">Resumo para o CBO e a Tabela de Horário (S-1050)</div>
              <div className="ctb-documento-linha">
                <span className="label">CBO</span>
                <span className="valor">{cbo || "—"}</span>
              </div>
              <div className="ctb-documento-linha">
                <span className="label">Tipo de jornada</span>
                <span className="valor">{TIPOS_JORNADA[tipoJornada].label}</span>
              </div>
              <div className="ctb-documento-linha">
                <span className="label">Dias de trabalho</span>
                <span className="valor">{dias}</span>
              </div>
              <div className="ctb-documento-linha">
                <span className="label">Horário</span>
                <span className="valor">
                  {horarioEntrada} às {horarioSaida} (intervalo de {intervaloMin} min)
                </span>
              </div>
              <div className="ctb-documento-linha">
                <span className="label">Descanso Semanal Remunerado</span>
                <span className="valor">{dsr}</span>
              </div>
            </div>
          )}

          <div className="ctb-card" style={{ marginTop: 12 }}>
            <h3>Documentos a pedir</h3>
            <ul className="ctb-checklist">
              {DOCUMENTOS_POR_TIPO[tipo].map((d, i) => (
                <li key={d}>
                  <span className="n">{i + 1}</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          {tipo === "estagiario" ? (
            <div className="ctb-proximo-passo">
              <div className="titulo">Onde formalizar</div>
              <p>
                O estágio não passa pelo evento de admissão do eSocial como um CLT — ele entra
                como Trabalhador Sem Vínculo de Emprego (categoria Estagiário). O registro formal
                é o Termo de Compromisso de Estágio, assinado com a instituição de ensino (e o
                agente de integração, se houver).
              </p>
            </div>
          ) : (
            <GuiaPortal
              titulo="Onde registrar a admissão"
              texto={
                temJornada
                  ? "Cadastre primeiro a Tabela de Horários (S-1050) com os dados de jornada acima, depois registre a admissão referenciando ela e o CBO informado — antes do início do trabalho (prazo legal: até 1 dia útil antes)."
                  : "Registre antes do início do trabalho (prazo legal: até 1 dia útil antes, nunca depois)."
              }
              chave={tipo === "domestico" ? "esocialDomestico" : "esocialAdmissao"}
            />
          )}
        </>
      )}
    </div>
  );

  const passos = temJornada ? [passoTipo, passoDados, passoJornada, passoResultado] : [passoTipo, passoDados, passoResultado];
  const ultimoIndice = passos.length - 1;
  const podeAvancar = passo === 0 ? !!tipo : passo === 1 ? parseNum(salario) > 0 : true;

  return (
    <WizardShell titulo="Contratar um funcionário" icone="🧑‍💼" totalPassos={passos.length} passoAtual={passo} onSair={onSair}>
      {passos[passo]}
      <WizardNav
        mostrarVoltar={passo > 0}
        onVoltar={() => setPasso((p) => p - 1)}
        onProximo={() => (passo === ultimoIndice ? onSair() : setPasso((p) => p + 1))}
        podeAvancar={podeAvancar}
        textoProximo={passo === ultimoIndice ? "Concluir" : passo === ultimoIndice - 1 ? "Calcular custo" : "Próximo"}
      />
    </WizardShell>
  );
}
