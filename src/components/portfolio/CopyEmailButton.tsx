"use client";

import { Check, Copy, Mail } from "lucide-react";
import { useState } from "react";

const emailAddress = "zpeace11@gmail.com";

export function CopyEmailButton() {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(emailAddress);
      setState("copied");
      window.setTimeout(() => setState("idle"), 2200);
    } catch {
      setState("failed");
      window.setTimeout(() => setState("idle"), 2600);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={`mailto:${emailAddress}`}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-cyan/65 bg-cyan/15 px-4 py-3 text-sm font-semibold text-white transition hover:border-cyan hover:bg-cyan/25"
      >
        <Mail className="h-4 w-4" aria-hidden="true" />
        {emailAddress}
      </a>
      <button
        type="button"
        onClick={copyEmail}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line bg-black/35 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan/60 hover:bg-cyan/10"
        aria-label="Copy Zhane email address"
      >
        {state === "copied" ? <Check className="h-4 w-4 text-cyan" aria-hidden="true" /> : <Copy className="h-4 w-4 text-cyan" aria-hidden="true" />}
        {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "Copy email"}
      </button>
      <span aria-live="polite" className="sr-only">
        {state === "copied" ? "Email address copied" : state === "failed" ? "Email copy failed" : ""}
      </span>
    </div>
  );
}
