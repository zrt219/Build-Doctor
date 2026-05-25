import { ExternalLink } from "lucide-react";
import { socialLinks } from "@/lib/social-links";

export function SocialLinks() {
  return (
    <nav aria-label="ZRT social links" className="flex flex-wrap gap-2">
      {socialLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-black/25 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200 transition hover:-translate-y-0.5 hover:border-cyan/70 hover:bg-cyan/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan active:translate-y-0"
        >
          {link.label}
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      ))}
    </nav>
  );
}
