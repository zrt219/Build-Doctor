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
    title: "Module not found cannot resolve",
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
];
