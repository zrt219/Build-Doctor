import { Github, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { CommandPalette } from "./CommandPalette";

const navItems = [
  { label: "Proof", href: "#metrics" },
  { label: "Workflow", href: "#workflow-tracker" },
  { label: "Projects", href: "#featured-projects" },
  { label: "Ralphplan", href: "#ralphplan-workflow" },
  { label: "Ledger", href: "#evidence-ledger" },
  { label: "Contact", href: "#contact" },
];

export function TopCommandNav() {
  return (
    <header className="sticky top-0 z-50 overflow-x-hidden border-b border-line/80 bg-[#06101b]/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 sm:px-5 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan" aria-label="Zhane Grey portfolio home">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-cyan/55 bg-cyan/10 font-mono text-sm font-semibold text-cyan">
            ZG
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold uppercase tracking-[0.12em] text-white">Zhane Grey</span>
            <span className="block truncate text-xs uppercase tracking-[0.16em] text-slate-400">AI Engineering Mainframe</span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Portfolio sections">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-cyan/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex min-w-0 items-center gap-2 lg:ml-3">
          <CommandPalette />
          <a
            href="https://github.com/zrt219"
            target="_blank"
            rel="noreferrer"
            className="hidden min-h-10 items-center justify-center gap-2 rounded-md border border-line bg-black/30 px-3 py-2 text-sm font-semibold text-white transition hover:border-cyan/65 hover:bg-cyan/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan sm:inline-flex"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            GitHub
          </a>
          <a
            href="mailto:zpeace11@gmail.com"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-cyan/60 bg-cyan/15 px-3 py-2 text-sm font-semibold text-white transition hover:border-cyan hover:bg-cyan/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Email
          </a>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-7xl gap-2 overflow-x-auto px-4 pb-3 sm:px-5 lg:hidden" aria-label="Mobile portfolio sections">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-full border border-line bg-black/25 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
          >
            {item.label}
          </a>
        ))}
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-cyan/40 bg-cyan/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-white">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Source-labeled
        </span>
      </div>
    </header>
  );
}
