"use client";
import { useMemo, useState } from "react";
import {
  TIPOS_ATIVIDADE_MEI,
  SALARIO_MINIMO_2026,
  LIMITE_MEI_ANUAL,
  LIMITE_MEI_CAMINHONEIRO_ANUAL,
  calcularDASMEI,
  avaliarLimiteMEI,
} from "@/lib/mei";
import { fmtBRL } from "@/lib/simplesNacional";

export default function AbaMei() {
  const [tipo, setTipo] = useState("servico");
  const [caminhoneiro, setCaminhoneiro] = useState(false);
  const [faturamentoAno, setFaturamentoAno] = useState("");

  const das = useMemo(() => calcularDASMEI(tipo, caminhoneiro), [tipo, caminhoneiro]);
  const limite = useMemo(() => {
    const v = parseFloat(String(faturamentoAno).replace(/\./g, "").replace(",", "."));
    if (!v) return null;
    return avaliarLimiteMEI(v, caminhoneiro);
  }, [faturamentoAno, caminhoneiro]);

  return (
    <div>
      <div className="ctb-aviso">
        🧮 Calculadora do DAS-MEI (LC 123/2006, art. 18-A). Valores de 2026, com base no salário
        mínimo de {fmtBRL(SALARIO_MINIMO_2026)}. Esses valores mudam todo início de ano —
        confirme sempre no Portal do Empreendedor antes de pagar.
      </div>

      <div className="ctb-card">
        <div className="ctb-form-linha">
          <div className="ctb-campo">
            <label>Tipo de atividade</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              {Object.entries(TIPOS_ATIVIDADE_MEI).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
          <div className="ctb-campo">
            <label style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 22 }}>
              <input type="checkbox" checked={caminhoneiro} onChange={(e) => setCaminhoneiro(e.target.checked)} style={{ width: "auto" }} />
              Sou MEI Caminhoneiro (transportador autônomo de cargas)
            </label>
          </div>
        </div>
      </div>

      {das && !das.erro && (
        <div className="ctb-resultado">
          <div className="valor">{fmtBRL(das.total)}</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 10 }}>Valor do DAS-MEI mensal</div>
          <div className="linha">
            <span>INSS (5% do salário mínimo{caminhoneiro ? " + adicional de transportador" : ""})</span>
            <span>{fmtBRL(caminhoneiro ? das.total - das.icms - das.iss : das.inss)}</span>
          </div>
          {das.icms > 0 && (
            <div className="linha">
              <span>ICMS fixo</span>
              <span>{fmtBRL(das.icms)}</span>
            </div>
          )}
          {das.iss > 0 && (
            <div className="linha">
              <span>ISS fixo</span>
              <span>{fmtBRL(das.iss)}</span>
            </div>
          )}
        </div>
      )}

      <div className="ctb-card" style={{ marginTop: 16 }}>
        <h3>Estou perto do limite? Confira o faturamento projetado no ano</h3>
        <div className="ctb-form-linha">
          <div className="ctb-campo">
            <label>Faturamento total previsto no ano — R$</label>
            <input
              inputMode="decimal"
              value={faturamentoAno}
              onChange={(e) => setFaturamentoAno(e.target.value)}
              placeholder={`Limite: ${fmtBRL(caminhoneiro ? LIMITE_MEI_CAMINHONEIRO_ANUAL : LIMITE_MEI_ANUAL)}/ano`}
            />
          </div>
        </div>
        {limite && (
          <div
            style={{
              marginTop: 8,
              padding: "10px 12px",
              borderRadius: 8,
              fontSize: 12.5,
              lineHeight: 1.6,
              background: limite.status === "ok" ? "#DCFCE7" : limite.status === "excesso_tolerado" ? "#FEF3C7" : "#FEE2E2",
              color: limite.status === "ok" ? "#0D7A3E" : limite.status === "excesso_tolerado" ? "#7A4A00" : "#991B1B",
            }}
          >
            {limite.mensagem}
          </div>
        )}
      </div>
    </div>
  );
}
