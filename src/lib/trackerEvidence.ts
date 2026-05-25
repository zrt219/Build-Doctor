import type { EvidenceConfidence } from "@/types/liveWorkflowTracker";

export function confidenceClass(confidence: EvidenceConfidence) {
  switch (confidence) {
    case "high":
      return "border-cyan/60 bg-cyan/10 text-white";
    case "medium":
      return "border-gold/70 border-dashed bg-gold/10 text-white";
    case "low":
      return "border-white/45 border-dotted bg-white/5 text-slate-200";
    case "pending":
      return "border-white/60 border-2 bg-white/10 text-white";
  }
}

export function evidenceTypeLabel(sourceType: string) {
  return sourceType
    .split("-")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}
