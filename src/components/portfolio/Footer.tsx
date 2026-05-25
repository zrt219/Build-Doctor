import { ExternalLink, Github, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-line bg-black/25">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 text-sm text-slate-400 sm:px-5 lg:grid-cols-[1fr_auto] lg:px-8">
        <div>
          <p className="font-semibold text-white">© 2026 Zhane Grey. Public AI engineering portfolio.</p>
          <p className="mt-2">
            Built with Next.js, TypeScript, Vercel, Playwright, Vitest, and evidence-bound local workflow data.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
          <a href="https://github.com/zrt219" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition hover:text-white">
            <Github className="h-4 w-4" aria-hidden="true" />
            GitHub
          </a>
          <a href="mailto:zpeace11@gmail.com" className="inline-flex items-center gap-2 transition hover:text-white">
            <Mail className="h-4 w-4" aria-hidden="true" />
            zpeace11@gmail.com
          </a>
          <a href="#metrics" className="inline-flex items-center gap-2 transition hover:text-white">
            Proof stats <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
