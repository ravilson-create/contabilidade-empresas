import "./globals.css";

export const metadata = {
  title: "Contabilidade para Micro e Pequenas Empresas",
  description:
    "Guia de abertura, calculadoras de DAS (MEI e Simples Nacional), calendário de obrigações e links oficiais para regularizar sua empresa.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="ctb-wrap">{children}</body>
    </html>
  );
}
