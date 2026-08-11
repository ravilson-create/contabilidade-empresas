"use client";
import { useMemo, useState } from "react";
import WizardShell, { WizardNav } from "./WizardShell";
import { CATEGORIAS_SERVICO, TOMADORES, avaliarRetencoes } from "@/lib/retencoes";
import { anexoSugeridoPorAtividade, fmtBRL, fmtPct } from "@/lib/simplesNacional";

function parseNum(s) {
  const v = parseFloat(String(s || "").replace(/\./g, "").replace(",", "."));
  return Number.isFinite(v) ? v : 0;
}

export default function WizardRetencoes({ onSair, perfil }) {
  const [passo, setPasso] = useState(0);
  const [categoria, setCategoria] = useState("");
  const [tomador, setTomador] = useState("");
  const [ehSimples, setEhSimples] = useState(perfil?.enquadramento === "meepp" || perfil?.enquadramento === "mei" ? true : null);
  const [anexo, setAnexo] = useState(perfil?.enquadramento === "meepp" ? anexoSugeridoPorAtividade(perfil.atividade) || "III" : "III");
  const [valorNota, setValorNota] = useState("");
  const [valorMateriais, setValorMateriais] = useState("");

  const resultado = useMemo(() => {
    if (!categoria || !tomador || ehSimples === null || !valorNota) return null;
    return avaliarRetencoes({
      categoriaServico: categoria,
      tomador,
      valorNota: parseNum(valorNota),
      valorMateriais: parseNum(valorMateriais),
      simplesNacional: ehSimples,
      anexo,
    });
  }, [categoria, tomador, ehSimples, anexo, valorNota, valorMateriais]);

  const passoCategoria = (
    <div key="cat">
      <p style={{ fontSize: 13, color: "#3A423F", marginBottom: 14 }}>Qual é a natureza do serviço prestado nesta nota?</p>
      <div className="ctb-opcoes">
        {Object.entries(CATEGORIAS_SERVICO).map(([k, v]) => (
          <label key={k} className={"ctb-opcao" + (categoria === k ? " selecionada" : "")}>
            <input type="radio" name="categoria" checked={categoria === k} onChange={() => setCategoria(k)} />
            <span>
              <span className="titulo">{v.label}</span>
              <div className="desc">{v.desc}</div>
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  const passoTomador = (
    <div key="tomador">
      <p style={{ fontSize: 13, color: "#3A423F", marginBottom: 14 }}>Quem é o tomador do serviço (quem vai pagar a nota)?</p>
      <div className="ctb-opcoes">
        {Object.entries(TOMADORES).map(([k, v]) => (
          <label key={k} className={"ctb-opcao" + (tomador === k ? " selecionada" : "")}>
            <input type="radio" name="tomador" checked={tomador === k} onChange={() => setTomador(k)} />
            <span className="titulo">{v.label}</span>
          </label>
        ))}
      </div>

      <p style={{ fontSize: 13, fontWeight: 700, color: "#1C2521", margin: "18px 0 8px" }}>Sua empresa é optante do Simples Nacional?</p>
      <div className="ctb-opcoes">
        <label className={"ctb-opcao" + (ehSimples === true ? " selecionada" : "")}>
          <input type="radio" name="simples" checked={ehSimples === true} onChange={() => setEhSimples(true)} />
          <span className="titulo">Sim</span>
        </label>
        <label className={"ctb-opcao" + (ehSimples === false ? " selecionada" : "")}>
          <input type="radio" name="simples" checked={ehSimples === false} onChange={() => setEhSimples(false)} />
          <span className="titulo">Não (Lucro Presumido/Real, ou excluída no momento)</span>
        </label>
      </div>

      {ehSimples && (
        <div className="ctb-form-linha" style={{ marginTop: 12 }}>
          <div className="ctb-campo">
            <label>Qual Anexo do Simples Nacional?</label>
            <select value={anexo} onChange={(e) => setAnexo(e.target.value)}>
              <option value="I">Anexo I</option>
              <option value="II">Anexo II</option>
              <option value="III">Anexo III</option>
              <option value="IV">Anexo IV</option>
              <option value="V">Anexo V</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );

  const passoValor = (
    <div key="valor">
      <div className="ctb-form-linha">
        <div className="ctb-campo">
          <label>Valor total da nota — R$</label>
          <input inputMode="decimal" value={valorNota} onChange={(e) => setValorNota(e.target.value)} placeholder="Ex: 10000,00" autoFocus />
        </div>
        <div className="ctb-campo">
          <label>Valor de materiais discriminados à parte — R$ (se houver)</label>
          <input inputMode="decimal" value={valorMateriais} onChange={(e) => setValorMateriais(e.target.value)} placeholder="0,00" />
        </div>
      </div>
      <div className="ctb-aviso">
        ℹ️ Se a nota discrimina separadamente o valor de materiais/equipamentos, a retenção do
        INSS incide só sobre a mão de obra — informe o valor dos materiais para tirá-lo da base.
      </div>
    </div>
  );

  const passoResultado = (
    <div key="resultado">
      {resultado && (
        <>
          <div className="ctb-documento">
            <div className="ctb-documento-titulo">O que deve ser retido nesta nota</div>
            <div className="ctb-documento-linha">
              <span className="label">Base de cálculo (nota − materiais)</span>
              <span className="valor">{fmtBRL(resultado.baseServico)}</span>
            </div>
            {resultado.itens.length === 0 && (
              <div className="ctb-documento-linha">
                <span className="label" style={{ fontWeight: 800, color: "#0D7A3E" }}>
                  Nenhuma retenção identificada
                </span>
                <span className="valor">{resultado.isentoPorSimples ? "(isenção do Simples Nacional)" : ""}</span>
              </div>
            )}
            {resultado.itens.map((item) => (
              <div className="ctb-documento-linha" key={item.tributo}>
                <span className="label">
                  {item.tributo}
                  {item.aliquota != null ? ` (${fmtPct(item.aliquota)})` : ""}
                </span>
                <span className="valor">{item.valor != null ? fmtBRL(item.valor) : "confirmar com o tomador"}</span>
              </div>
            ))}
            <div className="ctb-documento-linha">
              <span className="label" style={{ fontWeight: 800 }}>
                Total retido
              </span>
              <span className="valor" style={{ fontSize: 16 }}>
                {fmtBRL(resultado.totalRetido)}
              </span>
            </div>
            <div className="ctb-documento-linha">
              <span className="label" style={{ fontWeight: 800 }}>
                Valor líquido a receber
              </span>
              <span className="valor" style={{ fontSize: 18, color: "#0D7A3E" }}>
                {fmtBRL(resultado.valorLiquido)}
              </span>
            </div>
          </div>

          <div className="ctb-aviso" style={{ marginTop: 14 }}>
            ⚖️ A classificação exata (cessão de mão de obra x empreitada com fornecimento total
            de material x serviço avulso) depende do contrato e pode mudar o resultado. Isto é uma
            orientação para você conferir com o tomador e com seu contador antes de emitir a nota
            — não é um parecer definitivo. Se algo for retido, guarde o comprovante: o valor
            retido é abatido do que sua empresa deve pagar por conta própria sobre essa mesma
            receita (DAS, DARF ou guia municipal, conforme o regime).
          </div>
        </>
      )}
    </div>
  );

  const passos = [passoCategoria, passoTomador, passoValor, passoResultado];
  const ultimoIndice = passos.length - 1;
  const podeAvancar = passo === 0 ? !!categoria : passo === 1 ? !!tomador && ehSimples !== null : passo === 2 ? !!parseNum(valorNota) : true;

  return (
    <WizardShell titulo="Saber o que será retido na nota fiscal" icone="🧾" totalPassos={passos.length} passoAtual={passo} onSair={onSair}>
      {passos[passo]}
      <WizardNav
        mostrarVoltar={passo > 0}
        onVoltar={() => setPasso((p) => p - 1)}
        onProximo={() => (passo === ultimoIndice ? onSair() : setPasso((p) => p + 1))}
        podeAvancar={podeAvancar}
        textoProximo={passo === ultimoIndice ? "Concluir" : passo === ultimoIndice - 1 ? "Calcular" : "Próximo"}
      />
    </WizardShell>
  );
}
