export type SupabaseTable = "suite_events" | "demo_runs" | "eval_runs" | "exported_reports";

type FetchLike = typeof fetch;

export type IntegrationHealth = {
  app: string;
  status: "READY" | "FALLBACK";
  generatedAt: string;
  supabase: {
    configured: boolean;
    mode: "SUPABASE_REST" | "DETERMINISTIC_FALLBACK";
    urlHost: string | null;
    writableTables: SupabaseTable[];
    missingEnv: string[];
  };
  openRouter?: {
    configured: boolean;
    mode: "OPENROUTER_LIVE" | "MOCK_FALLBACK";
    model: string;
    missingEnv: string[];
  };
};

export type DemoEventInput = {
  app: string;
  eventType: string;
  summary: string;
  payload?: Record<string, unknown>;
};

function safeHost(rawUrl: string | undefined) {
  if (!rawUrl) return null;
  try {
    return new URL(rawUrl).host;
  } catch {
    return null;
  }
}

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const key = serviceKey ?? anonKey;
  const missingEnv = [
    url ? "" : "NEXT_PUBLIC_SUPABASE_URL",
    key ? "" : "NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY",
  ].filter(Boolean);

  return {
    url,
    key,
    configured: Boolean(url && key),
    urlHost: safeHost(url),
    missingEnv,
  };
}

export function getOpenRouterConfig() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini";
  return {
    apiKey,
    model,
    configured: Boolean(apiKey),
    missingEnv: apiKey ? [] : ["OPENROUTER_API_KEY"],
  };
}

export function getIntegrationHealth(app: string, options: { includeOpenRouter?: boolean } = {}): IntegrationHealth {
  const supabase = getSupabaseConfig();
  const openRouter = getOpenRouterConfig();
  const openRouterHealth = options.includeOpenRouter
    ? {
        configured: openRouter.configured,
        mode: openRouter.configured ? "OPENROUTER_LIVE" as const : "MOCK_FALLBACK" as const,
        model: openRouter.model,
        missingEnv: openRouter.missingEnv,
      }
    : undefined;

  return {
    app,
    status: supabase.configured && (!options.includeOpenRouter || openRouter.configured) ? "READY" : "FALLBACK",
    generatedAt: new Date().toISOString(),
    supabase: {
      configured: supabase.configured,
      mode: supabase.configured ? "SUPABASE_REST" : "DETERMINISTIC_FALLBACK",
      urlHost: supabase.urlHost,
      writableTables: ["suite_events", "demo_runs", "eval_runs", "exported_reports"],
      missingEnv: supabase.missingEnv,
    },
    openRouter: openRouterHealth,
  };
}

export async function recordSuiteEvent(input: DemoEventInput, fetchImpl: FetchLike = fetch) {
  const supabase = getSupabaseConfig();
  if (!supabase.configured || !supabase.url || !supabase.key) {
    return {
      stored: false,
      mode: "DETERMINISTIC_FALLBACK" as const,
      reason: "Supabase env vars are not configured.",
      event: input,
    };
  }

  const response = await fetchImpl(`${supabase.url.replace(/\/$/, "")}/rest/v1/suite_events`, {
    method: "POST",
    headers: {
      apikey: supabase.key,
      authorization: `Bearer ${supabase.key}`,
      "content-type": "application/json",
      prefer: "return=representation",
    },
    body: JSON.stringify({
      app: input.app,
      event_type: input.eventType,
      summary: input.summary,
      payload: input.payload ?? {},
    }),
  });

  const body = await response.json().catch(() => null);
  return {
    stored: response.ok,
    mode: "SUPABASE_REST" as const,
    status: response.status,
    id: Array.isArray(body) ? body[0]?.id : undefined,
    reason: response.ok ? undefined : "Supabase REST insert failed.",
  };
}
