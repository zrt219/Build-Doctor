import { ExternalLink, Github, Mail } from "lucide-react";

const artworkCreditHref =
  "https://commons.wikimedia.org/wiki/File:Arnold_B%C3%B6cklin_-_Die_Toteninsel_III_(Alte_Nationalgalerie,_Berlin).jpg";
const artworkCreditTitle =
  "Arnold Böcklin, Die Toteninsel / The Isle of the Dead, third version, 1883, oil on panel, Alte Nationalgalerie, Berlin.";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-black/40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-full min-h-44 bg-cover bg-center bg-no-repeat opacity-[0.16] mix-blend-screen brightness-110 saturate-[0.82]"
        style={{
          backgroundImage: "url('/artwork/isle-of-the-dead-footer.jpg')",
          maskImage: "linear-gradient(to top, black 0%, rgba(0, 0, 0, 0.62) 48%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, black 0%, rgba(0, 0, 0, 0.62) 48%, transparent 100%)",
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/78 via-[#07111f]/80 to-[#101720]/94" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 text-sm text-slate-400 sm:px-5 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="font-semibold text-white">&copy; 2026 Zhane Grey. Public AI engineering portfolio.</p>
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
        <div className="mt-6 border-t border-white/5 pt-4">
          <a
            href={artworkCreditHref}
            target="_blank"
            rel="noreferrer"
            title={artworkCreditTitle}
            aria-label={`Artwork credit: ${artworkCreditTitle} Public domain source.`}
            className="inline-flex max-w-full items-center gap-2 text-xs text-slate-500/80 transition hover:text-slate-300"
          >
            Artwork: Böcklin, The Isle of the Dead, 1883 · Public domain
            <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
