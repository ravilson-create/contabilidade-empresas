"use client";
import { useMemo, useState } from "react";
import WizardShell, { WizardNav } from "./WizardShell";
import { calcularEncargosAdmissao } from "@/lib/folhaPagamento";
import { fmtBRL } from "@/lib/simplesNacional";

function parseNum(s) {
  const v = parseFloat(String(s || "").replace(/\./g, "").replace(",", "."));
  return Number.isFinite(v) ? v : 0;
}

const DOCUMENTOS = [
  "CPF e RG (ou CNH)",
  "CTPS Digital (número já vinculado ao CPF na Carteira de Trabalho Digital)",
  "Comprovante de endereço atualizado",
  "Comprovante de escolaridade",
  "PIS/PASEP ou NIS, se já tiver",
  "Certidão de nascimento dos filhos, se for pedir salário-família ou dependentes no IRRF",
  "Dados bancários para pagamento (conta ou chave Pix)",
  "Exame médico admissional (ASO), obrigatório antes do início do trabalho",
];

export default function WizardAdmissao({ onSair }) {
  const [passo, setPasso] = useState(0);
  const [salario, setSalario] = useState("");
  const [anexoSimples, setAnexoSimples] = useState("nao_simples");

  const encargos = useMemo(() => {
    const s = parseNum(salario);
    if (!s) return null;
    return calcularEncargosAdmissao({ salarioBruto: s, anexoSimples });
  }, [salario, anexoSimples]);

  const passos = [
    <div key="0">
      <div className="ctb-form-linha">
        <div className="ctb-campo">
          <label>Salário bruto combinado — R$</label>
          <input inputMode="decimal" value={salario} onChange={(e) => setSalario(e.target.value)} placeholder="Ex: 2200,00" autoFocus />
        </div>
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
      </div>
      <div className="ctb-aviso">
        ℹ️ No Anexo IV do Simples Nacional, a contribuição previdenciária patronal (CPP) é paga
        por fora do DAS. Nos demais anexos, ela já está embutida na alíquota do DAS.
      </div>
    </div>,

    <div key="1">
      {encargos && (
        <>
          <div className="ctb-documento">
            <div className="ctb-documento-titulo">Custo real de contratar este empregado</div>
            <div className="ctb-documento-linha">
              <span className="label">Salário bruto</span>
              <span className="valor">{fmtBRL(parseNum(salario))}</span>
            </div>
            <div className="ctb-documento-linha">
              <span className="label">FGTS mensal (8%)</span>
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
            {encargos.cppPatronalPorFora > 0 && (
              <div className="ctb-documento-linha">
                <span className="label">CPP patronal por fora do DAS (Anexo IV, 20%)</span>
                <span className="valor">{fmtBRL(encargos.cppPatronalPorFora)}</span>
              </div>
            )}
            <div className="ctb-documento-linha">
              <span className="label" style={{ fontWeight: 800 }}>
                Custo mensal estimado
              </span>
              <span className="valor" style={{ fontSize: 18, color: "#0D7A3E" }}>
                {fmtBRL(encargos.custoMensalEstimado)}
              </span>
            </div>
          </div>

          <div className="ctb-card" style={{ marginTop: 12 }}>
            <h3>Documentos a pedir do futuro empregado</h3>
            <ul className="ctb-checklist">
              {DOCUMENTOS.map((d, i) => (
                <li key={d}>
                  <span className="n">{i + 1}</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="ctb-proximo-passo">
            <div className="titulo">Onde registrar a admissão</div>
            <p>
              Registre a admissão no eSocial <strong>antes do início do trabalho</strong> (o
              prazo legal é até 1 dia útil antes, e nunca depois do começo das atividades). O
              sistema gera automaticamente as guias de FGTS (dia 20) e a folha de pagamento
              mensal.
            </p>
            <a className="ctb-btn-link" href="https://www.gov.br/esocial/pt-br" target="_blank" rel="noopener noreferrer">
              Abrir o eSocial →
            </a>
          </div>
        </>
      )}
    </div>,
  ];

  const podeAvancar = passo === 0 ? parseNum(salario) > 0 : true;

  return (
    <WizardShell titulo="Contratar um funcionário" icone="🧑‍💼" totalPassos={passos.length} passoAtual={passo} onSair={onSair}>
      {passos[passo]}
      <WizardNav
        mostrarVoltar={passo > 0}
        onVoltar={() => setPasso((p) => p - 1)}
        onProximo={() => (passo === passos.length - 1 ? onSair() : setPasso((p) => p + 1))}
        podeAvancar={podeAvancar}
        textoProximo={passo === passos.length - 1 ? "Concluir" : "Calcular custo"}
      />
    </WizardShell>
  );
}
