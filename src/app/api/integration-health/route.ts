import { jsonResponse } from "../_utils";
import { getIntegrationHealth } from "@/lib/integrations";

const app = "vercel-build-doctor-agent";

export async function GET() {
  const health = getIntegrationHealth(app);
  return jsonResponse({ ok: true, data: health, ...health });
}
