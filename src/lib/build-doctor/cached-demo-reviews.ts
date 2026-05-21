import type { CachedProviderReview, FailureType } from "../schemas";

const cachedReviews: Record<"TYPESCRIPT_ERROR" | "SUPABASE_CONFIG_ERROR" | "MODULE_NOT_FOUND" | "PACKAGE_INSTALL_ERROR" | "NEXT_BUILD_ERROR" | "UNKNOWN", CachedProviderReview> = {
  TYPESCRIPT_ERROR: {
    label: "Cached DeepSeek demo review",
    cached: true,
    summary: "The deterministic diagnosis points to a TypeScript contract mismatch that should be fixed before retrying the build.",
    improvedExplanation: "The build is failing because TypeScript found code that does not match the declared type shape. The safe next step is to update the component, API contract, or type definition so the build-time compiler can prove the code is valid.",
    patchReview: "The patch draft is appropriate as a review aid because it targets the type boundary and asks for typecheck plus build verification instead of applying changes automatically.",
    cautions: ["Confirm the value is not intentionally optional before changing the type.", "Check upstream data producers before renaming or removing fields."],
    suggestedVerification: ["npm run typecheck", "npm run build"],
    confidence: "high",
  },
  SUPABASE_CONFIG_ERROR: {
    label: "Cached DeepSeek demo review",
    cached: true,
    summary: "The deterministic diagnosis indicates the Supabase client is missing required public environment configuration.",
    improvedExplanation: "The captured build log indicates the client setup could not read the public Supabase URL or anon key from that build environment. Configure the values in local or Vercel settings instead of hardcoding secrets.",
    patchReview: "The patch draft correctly focuses on environment validation and safe configuration checks. It should be reviewed with the target Vercel project settings before redeploying.",
    cautions: ["Do not expose service-role keys in client code.", "Verify both local `.env.local` and Vercel production environment values."],
    suggestedVerification: ["npm run build", "vercel env ls"],
    confidence: "high",
  },
  MODULE_NOT_FOUND: {
    label: "Cached DeepSeek demo review",
    cached: true,
    summary: "The deterministic diagnosis found an unresolved import or missing package at build time.",
    improvedExplanation: "The bundler cannot resolve a module referenced by the application. The fix should verify the import path, file casing, package installation, and lockfile state.",
    patchReview: "The patch draft is safe because it asks the developer to resolve the missing dependency or path mismatch, then rerun installation and build checks.",
    cautions: ["Check case-sensitive paths because Vercel Linux builds can fail when local Windows paths appear to work.", "Avoid adding unused packages just to silence the error."],
    suggestedVerification: ["npm install", "npm run build"],
    confidence: "medium",
  },
  PACKAGE_INSTALL_ERROR: {
    label: "Cached DeepSeek demo review",
    cached: true,
    summary: "The deterministic diagnosis points to dependency installation or package manager failure before the app build can run.",
    improvedExplanation: "The package install step failed, so the runtime code may not be the primary issue. The lockfile, package manager version, registry access, or dependency constraints should be checked first.",
    patchReview: "The patch draft is appropriate because it keeps the remediation at the package manager layer and requires a clean install before retrying the build.",
    cautions: ["Do not delete the lockfile unless the team intentionally regenerates it.", "Confirm the Vercel package manager matches the committed lockfile."],
    suggestedVerification: ["npm ci", "npm run build"],
    confidence: "medium",
  },
  NEXT_BUILD_ERROR: {
    label: "Cached DeepSeek demo review",
    cached: true,
    summary: "The deterministic diagnosis identified a Next.js build failure that needs focused review of the reported route or build phase.",
    improvedExplanation: "The build reached the framework compilation step and failed inside the Next.js pipeline. Review the evidence line, route, component, or config item identified by the local trace before changing unrelated files.",
    patchReview: "The patch draft is useful because it narrows the remediation to the framework failure evidence and keeps verification tied to the Next build command.",
    cautions: ["Do not treat this as a generic deployment issue until the local Next build passes.", "Check whether the failure is route-specific, config-specific, or caused by a dependency."],
    suggestedVerification: ["npm run build"],
    confidence: "medium",
  },
  UNKNOWN: {
    label: "Cached DeepSeek demo review",
    cached: true,
    summary: "The deterministic diagnosis could not confidently classify the failure from the available log excerpt.",
    improvedExplanation: "The evidence is too limited or does not match a supported failure class. The safest response is to collect more context, preserve the failing log lines, and avoid inventing a patch.",
    patchReview: "The patch draft is intentionally conservative. It recommends gathering more evidence instead of applying an unsupported code change.",
    cautions: ["Request the first fatal error line and nearby stack frames.", "Do not claim a root cause until the log contains stronger evidence."],
    suggestedVerification: ["npm run build", "Review the complete Vercel build log"],
    confidence: "low",
  },
};

const reviewTypeMap: Partial<Record<FailureType, keyof typeof cachedReviews>> = {
  TYPESCRIPT_ERROR: "TYPESCRIPT_ERROR",
  SUPABASE_CONFIG_ERROR: "SUPABASE_CONFIG_ERROR",
  MODULE_NOT_FOUND: "MODULE_NOT_FOUND",
  PACKAGE_INSTALL_ERROR: "PACKAGE_INSTALL_ERROR",
  PNPM_LOCKFILE_MISMATCH: "PACKAGE_INSTALL_ERROR",
  PACKAGE_JSON_PARSE: "PACKAGE_INSTALL_ERROR",
  NEXT_BUILD_ERROR: "NEXT_BUILD_ERROR",
  NEXT_STATIC_GENERATION_ERROR: "NEXT_BUILD_ERROR",
  APP_ROUTER_ROUTE_HANDLER_ERROR: "NEXT_BUILD_ERROR",
  ESLINT_BUILD_ERROR: "NEXT_BUILD_ERROR",
  VITE_BUILD_ERROR: "NEXT_BUILD_ERROR",
  UNKNOWN: "UNKNOWN",
};

export function getCachedDeepSeekDemoReview(failureType: FailureType): CachedProviderReview {
  return cachedReviews[reviewTypeMap[failureType] ?? "UNKNOWN"];
}

export function getAllCachedDeepSeekDemoReviews() {
  return cachedReviews;
}
