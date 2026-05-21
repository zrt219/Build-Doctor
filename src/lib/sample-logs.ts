import type { FailureType } from "./schemas";

export type SampleLog = {
  id: string;
  title: string;
  expected: FailureType;
  log: string;
  requiredFixSignals: string[];
};

const prismaDemoDatabaseUrl = ["postgresql://user", ":", "secret", "@db.example.com:5432/app"].join("");

export const sampleLogs: SampleLog[] = [
  {
    id: "missing-supabase-url",
    title: "Missing NEXT_PUBLIC_SUPABASE_URL",
    expected: "SUPABASE_CONFIG_ERROR",
    requiredFixSignals: ["Vercel", "Supabase", "env"],
    log: `[SIMULATED VERCEL LOG]
Running "npm run build"
Error: supabaseUrl is required.
Missing required environment variable NEXT_PUBLIC_SUPABASE_URL
at createBrowserClient (src/lib/supabase.ts:8:11)
Build failed because of webpack errors`,
  },
  {
    id: "typescript-property",
    title: "TypeScript property does not exist",
    expected: "TYPESCRIPT_ERROR",
    requiredFixSignals: ["type", "contract", "typecheck"],
    log: `[SIMULATED VERCEL LOG]
Running "next build"
Failed to compile.
Type error: Property 'deploymentUrl' does not exist on type 'BuildRecord'.
src/components/DeploymentCard.tsx:42:19`,
  },
  {
    id: "module-not-found",
    title: "Unresolved module import",
    expected: "MODULE_NOT_FOUND",
    requiredFixSignals: ["dependency", "import", "path"],
    log: `[SIMULATED VERCEL LOG]
Creating an optimized production build...
Module not found: Can't resolve '@/components/BuildPanel'
./src/app/page.tsx:4:1
https://nextjs.org/docs/messages/module-not-found`,
  },
  {
    id: "stripe-webhook-secret",
    title: "Stripe webhook secret missing",
    expected: "STRIPE_WEBHOOK_ERROR",
    requiredFixSignals: ["STRIPE_WEBHOOK_SECRET", "webhook", "Vercel"],
    log: `[SIMULATED VERCEL LOG]
Error: STRIPE_WEBHOOK_SECRET is not configured
No signatures found matching the expected signature for payload.
at POST (src/app/api/webhooks/stripe/route.ts:21:9)`,
  },
  {
    id: "prisma-database-url",
    title: "Prisma DATABASE_URL invalid",
    expected: "PRISMA_DATABASE_ERROR",
    requiredFixSignals: ["DATABASE_URL", "prisma", "build"],
    log: `[SIMULATED VERCEL LOG]
PrismaClientInitializationError: error: Environment variable not found: DATABASE_URL.
  --> schema.prisma:10
Please run prisma generate before deploying.
${prismaDemoDatabaseUrl}`,
  },
  {
    id: "next-dynamic-server",
    title: "Next.js dynamic server usage error",
    expected: "NEXT_BUILD_ERROR",
    requiredFixSignals: ["dynamic", "route", "build"],
    log: `[SIMULATED VERCEL LOG]
Error: Dynamic server usage: Route /dashboard couldn't be rendered statically because it used cookies.
Failed to collect page data for /dashboard
at src/app/dashboard/page.tsx:12:18`,
  },
  {
    id: "vercel-timeout-memory",
    title: "Vercel function timeout or memory issue",
    expected: "OUT_OF_MEMORY",
    requiredFixSignals: ["memory", "build", "limit"],
    log: `[SIMULATED VERCEL LOG]
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
Command "npm run build" exited with SIGKILL
Build exceeded memory limit after 45s`,
  },
  {
    id: "npm-dependency-conflict",
    title: "npm dependency conflict",
    expected: "PACKAGE_INSTALL_ERROR",
    requiredFixSignals: ["npm", "dependency", "lockfile"],
    log: `[SIMULATED VERCEL LOG]
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
npm ERR! peer dependency react@"^18" from legacy-widget@1.2.0
npm ERR! Fix the upstream dependency conflict, or retry this command with --legacy-peer-deps`,
  },
  {
    id: "package-json-parse",
    title: "Invalid package.json syntax",
    expected: "PACKAGE_JSON_PARSE",
    requiredFixSignals: ["package.json", "JSON", "manifest"],
    log: `[SIMULATED VERCEL LOG]
npm ERR! code EJSONPARSE
npm ERR! Failed to parse package.json
npm ERR! JSON.parse Unexpected token } in JSON at position 842 while parsing near "scripts"
package.json`,
  },
  {
    id: "spawn-permission",
    title: "Build script permission denied",
    expected: "SPAWN_PERMISSION",
    requiredFixSignals: ["script", "permission", "build"],
    log: `[SIMULATED VERCEL LOG]
Error: spawn ./scripts/generate-assets.sh EACCES
permission denied: ./scripts/generate-assets.sh
Command "npm run build" exited with 126`,
  },
  {
    id: "pnpm-lockfile-mismatch",
    title: "pnpm frozen lockfile mismatch",
    expected: "PNPM_LOCKFILE_MISMATCH",
    requiredFixSignals: ["pnpm", "lockfile", "package"],
    log: `[SIMULATED VERCEL LOG]
ERR_PNPM_OUTDATED_LOCKFILE Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with package.json
Command "pnpm install --frozen-lockfile" exited with 1`,
  },
  {
    id: "next-static-generation",
    title: "Next.js prerender failure",
    expected: "NEXT_STATIC_GENERATION_ERROR",
    requiredFixSignals: ["dynamic", "prerender", "build"],
    log: `[SIMULATED VERCEL LOG]
Error occurred prerendering page "/reports".
Export encountered errors on following paths: /reports
Generating static pages failed`,
  },
  {
    id: "app-route-handler",
    title: "App Router route handler failed",
    expected: "APP_ROUTER_ROUTE_HANDLER_ERROR",
    requiredFixSignals: ["route", "handler", "typecheck"],
    log: `[SIMULATED VERCEL LOG]
Route handler /api/report failed during build validation
src/app/api/report/route.ts
Failed to collect page data for /api/report`,
  },
  {
    id: "serverless-function-limit",
    title: "Serverless function limit exceeded",
    expected: "SERVERLESS_FUNCTION_LIMIT",
    requiredFixSignals: ["function", "limit", "Vercel"],
    log: `[SIMULATED VERCEL LOG]
Serverless Function has exceeded the maximum execution duration.
FUNCTION_INVOCATION_TIMEOUT at /api/diagnose
function size limit may be exceeded`,
  },
  {
    id: "eslint-build-error",
    title: "ESLint blocks build",
    expected: "ESLINT_BUILD_ERROR",
    requiredFixSignals: ["lint", "build", "rule"],
    log: `[SIMULATED VERCEL LOG]
Linting and checking validity of types ...
ESLint: React Hook useEffect has a missing dependency.
Failed to compile due to ESLint errors`,
  },
  {
    id: "vite-build-error",
    title: "Vite import resolution failed",
    expected: "VITE_BUILD_ERROR",
    requiredFixSignals: ["Vite", "import", "build"],
    log: `[SIMULATED VERCEL LOG]
vite build
Rollup failed to resolve import "@/widgets/MissingWidget" from "src/main.tsx"
Transform failed with 1 error`,
  },
];
