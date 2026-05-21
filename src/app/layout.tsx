import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZRT Vercel AI Systems Suite",
  description: "Connected Vercel AI portfolio suite for build diagnosis, gateway failover, enterprise agent workflows, and evidence-grounded resume proof.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
