import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <section className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan">Route not found</p>
        <h1 className="mt-4 text-3xl font-semibold text-white">This page is not part of the Build Doctor demo.</h1>
        <p className="mt-4 text-sm leading-6 text-slate-300">
          Return to the suite overview or open Build Doctor to run the deterministic build-failure diagnosis workflow.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="rounded-full border border-cyan/50 bg-cyan/10 px-4 py-2 text-sm font-semibold text-cyan" href="/">
            Suite Overview
          </Link>
          <Link className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white" href="/build-doctor">
            Build Doctor
          </Link>
        </div>
      </section>
    </main>
  );
}
