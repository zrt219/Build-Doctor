import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zhane Grey AI Engineering Portfolio Mainframe",
  description: "Employer-facing AI engineering command center for Codex workflow evidence, public GitHub projects, Vercel demos, evals, diagnostics, and proof-safe hiring review.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
