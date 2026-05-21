const rules: Array<{ label: string; pattern: RegExp }> = [
  { label: "[REDACTED_DATABASE_URL]", pattern: /\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?):\/\/[^\s"'`]+/gi },
  { label: "[REDACTED_API_KEY]", pattern: /\b(?:sk-[A-Za-z0-9_-]{20,}|pk_live_[A-Za-z0-9_-]{16,}|sk_live_[A-Za-z0-9_-]{16,}|sbp_[A-Za-z0-9_-]{16,})\b/g },
  { label: "[REDACTED_TOKEN]", pattern: /\b(?:ghp|github_pat|vercel)_[A-Za-z0-9_:-]{16,}\b/gi },
  { label: "[REDACTED_TOKEN]", pattern: /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g },
  { label: "[REDACTED_SECRET]", pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g },
  { label: "[REDACTED_ENV_VALUE]", pattern: /\b([A-Z0-9_]*(?:API_KEY|TOKEN|SECRET|PASSWORD|PRIVATE_KEY|DATABASE_URL)[A-Z0-9_]*\s*=\s*)(["']?)[^\s"'`]+(\2)/gi },
  { label: "[REDACTED_SECRET]", pattern: /\bBearer\s+[A-Za-z0-9._~+/=-]{16,}/gi },
  { label: "[REDACTED_SECRET]", pattern: /https:\/\/[^:\s/@]+:[^@\s]+@[^\s"'`]+/gi },
];

export function redactSecrets(input: string) {
  const labels = new Set<string>();
  let redacted = input;

  for (const rule of rules) {
    redacted = redacted.replace(rule.pattern, (match, prefix: string | undefined) => {
      labels.add(rule.label);
      if (rule.label === "[REDACTED_ENV_VALUE]" && typeof prefix === "string") {
        if (/DATABASE_URL/i.test(prefix)) {
          labels.add("[REDACTED_DATABASE_URL]");
          return `${prefix}[REDACTED_DATABASE_URL]`;
        }
        return `${prefix}${rule.label}`;
      }
      if (rule.label === "[REDACTED_SECRET]" && match.startsWith("Bearer ")) {
        return `Bearer ${rule.label}`;
      }
      return rule.label;
    });
  }

  return {
    redacted,
    redactions: Array.from(labels),
  };
}
