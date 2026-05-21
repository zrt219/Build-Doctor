import { getFixRecipe } from "./fix-recipes";
import type { EvidenceLine, FailureType } from "./schemas";

type PatternRule = {
  type: FailureType;
  subsystem: string;
  rootCause: string;
  confidence: number;
  patterns: RegExp[];
};

const rules: PatternRule[] = [
  {
    type: "STRIPE_WEBHOOK_ERROR",
    subsystem: "Payments / Webhooks",
    rootCause: "Stripe webhook verification is missing a signing secret or route-level webhook setup.",
    confidence: 0.93,
    patterns: [/STRIPE_WEBHOOK_SECRET/i, /webhook secret/i, /No signatures found/i],
  },
  {
    type: "PRISMA_DATABASE_ERROR",
    subsystem: "Database / Prisma",
    rootCause: "Prisma cannot initialize because DATABASE_URL or client generation is invalid for the deployment.",
    confidence: 0.92,
    patterns: [/PrismaClientInitializationError/i, /prisma generate/i, /DATABASE_URL/i],
  },
  {
    type: "SUPABASE_CONFIG_ERROR",
    subsystem: "Supabase",
    rootCause: "Supabase client configuration is missing a required public URL or key in the active Vercel environment.",
    confidence: 0.91,
    patterns: [/NEXT_PUBLIC_SUPABASE_URL/i, /supabaseUrl is required/i, /SUPABASE_ANON_KEY/i],
  },
  {
    type: "MISSING_ENV_VAR",
    subsystem: "Environment",
    rootCause: "A required environment variable is not configured for the build or runtime scope.",
    confidence: 0.88,
    patterns: [/Missing required environment variable/i, /process\.env\.[A-Z0-9_]+/i, /env validation/i],
  },
  {
    type: "VERCEL_ENV_VAR_MISSING",
    subsystem: "Vercel Environment",
    rootCause: "A required environment variable is missing from the active Vercel deployment scope.",
    confidence: 0.9,
    patterns: [/Environment Variable .* is not set/i, /vercel env/i, /No Environment Variable found/i],
  },
  {
    type: "TYPESCRIPT_ERROR",
    subsystem: "TypeScript",
    rootCause: "The production build failed on a static type contract mismatch.",
    confidence: 0.9,
    patterns: [/Type error:/i, /TS\d{4}/i, /Property ['"`].+['"`] does not exist/i, /not assignable to type/i],
  },
  {
    type: "MODULE_NOT_FOUND",
    subsystem: "Bundler / Module Resolution",
    rootCause: "An import path or dependency cannot be resolved in the Vercel build environment.",
    confidence: 0.9,
    patterns: [/Module not found/i, /Can't resolve/i, /Cannot find module/i],
  },
  {
    type: "PACKAGE_JSON_PARSE",
    subsystem: "Package Manifest",
    rootCause: "The package manifest cannot be parsed as valid JSON, so dependency installation or build startup cannot continue.",
    confidence: 0.9,
    patterns: [/EJSONPARSE/i, /Failed to parse package\.json/i, /Unexpected token .*package\.json/i, /JSON\.parse/i],
  },
  {
    type: "PACKAGE_INSTALL_ERROR",
    subsystem: "Package Installation",
    rootCause: "The package manager failed before the app build could start, usually from dependency conflicts or lockfile drift.",
    confidence: 0.87,
    patterns: [/ERESOLVE/i, /npm ERR!/i, /peer dependency/i, /package-lock/i],
  },
  {
    type: "PNPM_LOCKFILE_MISMATCH",
    subsystem: "Package Installation",
    rootCause: "pnpm refused to install because the lockfile does not match package.json.",
    confidence: 0.9,
    patterns: [/ERR_PNPM_OUTDATED_LOCKFILE/i, /frozen-lockfile/i, /pnpm-lock\.yaml/i],
  },
  {
    type: "SPAWN_PERMISSION",
    subsystem: "Build Scripts / Permissions",
    rootCause: "The build cannot spawn a required process or execute a script because of permissions or missing executable access.",
    confidence: 0.86,
    patterns: [/\bEACCES\b/i, /\bEPERM\b/i, /spawn .* (EACCES|EPERM|ENOENT)/i, /permission denied/i, /not executable/i],
  },
  {
    type: "VERCEL_RUNTIME_ERROR",
    subsystem: "Vercel Runtime",
    rootCause: "A function or route is configured for a runtime that does not support the APIs it imports.",
    confidence: 0.86,
    patterns: [/Edge Runtime/i, /Node\.js APIs are not available/i, /Function Runtimes/i],
  },
  {
    type: "SERVERLESS_FUNCTION_LIMIT",
    subsystem: "Vercel Functions",
    rootCause: "The serverless function exceeded a Vercel size, duration, memory, or invocation limit.",
    confidence: 0.88,
    patterns: [/Serverless Function .* exceeded/i, /FUNCTION_INVOCATION_TIMEOUT/i, /function size limit/i, /maximum execution duration/i],
  },
  {
    type: "ESLINT_BUILD_ERROR",
    subsystem: "Lint / Build Gate",
    rootCause: "The production build is blocked by an ESLint error.",
    confidence: 0.87,
    patterns: [/ESLint/i, /Failed to compile.*eslint/i, /Linting and checking validity of types/i],
  },
  {
    type: "VITE_BUILD_ERROR",
    subsystem: "Vite Build",
    rootCause: "The Vite/Rollup production build failed on import resolution or transform errors.",
    confidence: 0.86,
    patterns: [/vite build/i, /Rollup failed to resolve import/i, /Transform failed/i],
  },
  {
    type: "OUT_OF_MEMORY",
    subsystem: "Build Resources",
    rootCause: "The build or function exceeded memory or execution time limits.",
    confidence: 0.86,
    patterns: [/heap out of memory/i, /exceeded memory/i, /timed out/i, /SIGKILL/i],
  },
  {
    type: "NEXT_BUILD_ERROR",
    subsystem: "Next.js Build",
    rootCause: "Next.js failed while compiling, prerendering, or validating route behavior.",
    confidence: 0.78,
    patterns: [/Dynamic server usage/i, /Failed to collect page data for \/(?!api)/i, /next build/i],
  },
  {
    type: "NEXT_STATIC_GENERATION_ERROR",
    subsystem: "Next.js Static Generation",
    rootCause: "Next.js failed while prerendering a page during static generation.",
    confidence: 0.86,
    patterns: [/Error occurred prerendering page/i, /Export encountered errors/i, /Generating static pages .* failed/i],
  },
  {
    type: "APP_ROUTER_ROUTE_HANDLER_ERROR",
    subsystem: "Next.js App Router",
    rootCause: "An App Router route handler failed because of request handling, runtime, or response-shape issues.",
    confidence: 0.84,
    patterns: [/Route handler .* failed/i, /app\/api\/.+route\.(ts|js)/i, /Failed to collect page data for \/api/i],
  },
];

function linesFor(log: string) {
  return log.replace(/\r\n/g, "\n").split("\n");
}

function extractEvidence(log: string): EvidenceLine[] {
  const lines = linesFor(log);
  const evidence: EvidenceLine[] = [];
  const seen = new Set<string>();
  const evidencePatterns: Array<{ kind: EvidenceLine["kind"]; pattern: RegExp }> = [
    { kind: "error", pattern: /\b(error|failed|fatal|exception)\b/i },
    { kind: "warning", pattern: /\b(warn|warning)\b/i },
    { kind: "stack", pattern: /^\s*at\s+.+\(.+\)/i },
    { kind: "file", pattern: /(?:\.\/)?(?:(?:src|app|pages|components|lib|prisma)\/[^\s:)]+|package\.json|next\.config\.[cm]?[jt]s|tsconfig\.json|\.env\.example|vercel\.json)/i },
  ];

  lines.forEach((content, index) => {
    const trimmed = content.trim();
    if (!trimmed) return;
    const match = evidencePatterns.find((item) => item.pattern.test(trimmed));
    if (!match) return;
    const key = `${match.kind}:${trimmed}`;
    if (seen.has(key)) return;
    seen.add(key);
    evidence.push({ lineNumber: index + 1, kind: match.kind, content: trimmed.slice(0, 260) });
  });

  return evidence.slice(0, 14);
}

function extractFiles(log: string) {
  const matches = log.match(/(?:\.\/)?(?:(?:src|app|pages|components|lib|prisma)\/[A-Za-z0-9_./-]+\.(?:tsx|ts|jsx|js|mjs|cjs|prisma)|package\.json|next\.config\.[cm]?[jt]s|tsconfig\.json|\.env\.example|vercel\.json)/g) ?? [];
  return Array.from(new Set(matches.map((file) => file.replace(/^\.\//, "")))).slice(0, 8);
}

export function parseBuildLog(redactedLog: string) {
  let best = rules.find((rule) => rule.patterns.some((pattern) => pattern.test(redactedLog)));
  if (!best) {
    best = {
      type: "UNKNOWN",
      subsystem: "Unknown",
      rootCause: "The log does not include enough known deterministic signals to classify the failure.",
      confidence: 0.35,
      patterns: [],
    };
  }

  const recipe = getFixRecipe(best.type);
  const evidence = extractEvidence(redactedLog);

  return {
    failureType: best.type,
    label: recipe.label,
    confidence: evidence.length > 0 ? best.confidence : Math.max(0.25, best.confidence - 0.15),
    affectedSubsystem: best.subsystem,
    probableRootCause: best.rootCause,
    evidence,
    affectedFiles: extractFiles(redactedLog),
    warnings: evidence.filter((line) => line.kind === "warning").map((line) => line.content),
  };
}
