import { ArrowLeft, CheckCircle2, ExternalLink, FileText, ShieldCheck, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/portfolio/Footer";
import { TopCommandNav } from "@/components/portfolio/TopCommandNav";
import { getSignatureProjectBySlug, signatureProjects } from "@/data/projects";
import { compactLinkClass, primaryLinkClass, proofStatusClass, proofStatusLabel, sectionShellClass } from "@/components/portfolio/shared";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return signatureProjects.map((project) => ({
    slug: project.proofBriefSlug!,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = getSignatureProjectBySlug(slug);

  if (!project?.signatureDetails) {
    return {
      title: "Project proof brief | Zhane Grey",
    };
  }

  return {
    title: `${project.title} proof brief | Zhane Grey`,
    description: project.signatureDetails.headline,
  };
}

export default async function SignatureProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getSignatureProjectBySlug(slug);

  if (!project?.signatureDetails) {
    notFound();
  }

  const details = project.signatureDetails;

  return (
    <>
      <TopCommandNav />
      <main className="relative mx-auto min-h-screen max-w-7xl px-4 py-8 text-[16px] sm:px-5 lg:px-8">
        <Link href="/#featured-projects" className={compactLinkClass}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to featured systems
        </Link>

        <section className="mt-6 rounded-lg border border-cyan/35 bg-[radial-gradient(circle_at_top_left,rgba(109,216,255,0.13),transparent_34rem),linear-gradient(180deg,rgba(16,23,32,0.96),rgba(8,11,16,0.96))] p-5 shadow-glow sm:p-6 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.38fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">Signature proof brief</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.04] text-white sm:text-5xl">{project.title}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200">{details.headline}</p>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">{details.purpose}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {project.demoUrl ? (
                  <a href={project.demoUrl} target="_blank" rel="noreferrer" className={primaryLinkClass}>
                    Open demo <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : null}
                {project.githubUrl ? (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className={compactLinkClass}>
                    GitHub repo <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : null}
                <Link href="/#evidence-ledger" className={compactLinkClass}>
                  Evidence ledger <FileText className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
            <aside className="rounded-md border border-line bg-black/35 p-4">
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${proofStatusClass(project.proofStatus)}`}>
                {proofStatusLabel(project.proofStatus)}
              </span>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-cyan">Technical signal</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">{project.technicalSignal}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((chip) => (
                  <span key={chip} className="rounded-full border border-line bg-panel/80 px-3 py-1 text-xs text-slate-300">
                    {chip}
                  </span>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className={sectionShellClass}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">What this proves</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">{details.proofSummary}</h2>
            <div className="mt-5 grid gap-3">
              {details.proofPoints.map((point) => (
                <article key={point.label} className="rounded-md border border-line bg-black/30 p-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-cyan/45 bg-cyan/10">
                      <CheckCircle2 className="h-4 w-4 text-cyan" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">{point.label}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{point.detail}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={sectionShellClass}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">QA status</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Current proof state.</h2>
            <div className="mt-5 grid gap-3">
              {details.qaStatus.map((item) => (
                <article key={item.label} className="rounded-md border border-cyan/25 bg-cyan/5 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan" aria-hidden="true" />
                    <div>
                      <h3 className="font-semibold text-white">{item.label}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{item.result}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className={sectionShellClass}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Safe limitations</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Boundaries stay visible.</h2>
            <div className="mt-5 grid gap-3">
              {details.limitations.map((limitation) => (
                <p key={limitation} className="flex items-start gap-3 rounded-md border border-dashed border-gold/55 bg-gold/10 p-4 text-sm leading-6 text-slate-200">
                  <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                  {limitation}
                </p>
              ))}
            </div>
          </section>

          <section className={sectionShellClass}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">Evidence links</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Open the proof trail.</h2>
            <div className="mt-5 grid gap-3">
              {details.evidenceSources.map((source) => (
                <article key={source.label} className="rounded-md border border-line bg-black/30 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-white">{source.label}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{source.detail}</p>
                    </div>
                    {source.href ? (
                      <a href={source.href} target="_blank" rel="noreferrer" className={compactLinkClass} aria-label={`Open ${source.label} for ${project.title}`}>
                        Open <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
