import { ExternalLink, Mail } from "lucide-react";
import Link from "next/link";
import { compactLinkClass, sectionShellClass } from "./shared";

const steps = [
  {
    time: "0:00",
    title: "Open Evidence Dashboard",
    detail: "Start with the signature proof surface and public evidence engine repo.",
    href: "https://zhane-grey-evidence-dashboard.vercel.app",
    external: true,
    action: "Open dashboard",
  },
  {
    time: "0:20",
    title: "Review proof metrics",
    detail: "Check the May 24 counts, source labels, and dated workflow-event snapshot.",
    href: "#metrics",
    action: "View metrics",
  },
  {
    time: "0:40",
    title: "Test Build Doctor",
    detail: "Run the deterministic Vercel build diagnostic workflow.",
    href: "/build-doctor",
    action: "Run demo",
  },
  {
    time: "1:00",
    title: "Inspect eval and health endpoints",
    detail: "Use the ledger to verify public status and fallback routes.",
    href: "#evidence-ledger",
    action: "Open ledger",
  },
  {
    time: "1:20",
    title: "Open GitHub source",
    detail: "Inspect the public repo profile and strongest source-backed projects.",
    href: "https://github.com/zrt219",
    external: true,
    action: "Open GitHub",
  },
  {
    time: "1:30",
    title: "Email Zhane",
    detail: "Start a technical conversation after reviewing the proof path.",
    href: "mailto:zpeace11@gmail.com",
    action: "Email",
  },
];

export function RecruiterPath() {
  return (
    <section id="recruiter-path" className={sectionShellClass}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Guided proof path</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">A fast route through the strongest technical evidence.</h2>
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {steps.map((step) => {
          const content = (
            <>
              {step.action}
              {step.external ? <ExternalLink className="h-4 w-4" aria-hidden="true" /> : step.href.startsWith("mailto:") ? <Mail className="h-4 w-4" aria-hidden="true" /> : null}
            </>
          );
          return (
            <article key={step.title} className="rounded-md border border-line bg-black/30 p-4">
              <p className="font-mono text-sm text-cyan">{step.time}</p>
              <h3 className="mt-2 font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{step.detail}</p>
              <div className="mt-4">
                {step.external || step.href.startsWith("mailto:") ? (
                  <a href={step.href} target={step.external ? "_blank" : undefined} rel={step.external ? "noreferrer" : undefined} className={compactLinkClass}>
                    {content}
                  </a>
                ) : (
                  <Link href={step.href} className={compactLinkClass}>
                    {content}
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
